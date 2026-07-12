import { APIPromise } from "../../core/api-promise.mjs";
import { AnthropicError } from "../../core/error.mjs";
import { addResponseIDs } from "../../internal/parse.mjs";
import { loggerFor } from "../../internal/utils/log.mjs";
import { parseBetaMessage, } from "../beta-parser.mjs";
import { BetaMessageStream } from "../BetaMessageStream.mjs";
import { BetaToolRunner, } from "../tools/BetaToolRunner.mjs";
import { assertOneOutputFormat } from "../internal/beta-messages-request.mjs";
import { ThreadState, rejectThreadField, toMessageList } from "../internal/threads/ThreadState.mjs";
/**
 * A conversation the server holds between turns, so each request sends only the new messages.
 *
 * Create one with `client.beta.messages.thread(...)`. A thread runs one turn at a time.
 */
export class BetaMessageThread {
    /** Start a thread on `client` with the params of `client.beta.messages.thread()`. Sends nothing. */
    constructor(client, params, options) {
        if (!client._supportsMessageThreads) {
            throw new AnthropicError('Message threads are not available on this client; use `client.beta.messages.create()` with the full `messages` instead');
        }
        assertOneOutputFormat(params);
        this._client = client;
        this._state = new ThreadState({
            params,
            options: options ?? {},
            threading: true,
            logger: loggerFor(client),
        });
    }
    /** @internal A thread over an existing state. */
    static _fromState(client, state) {
        const thread = Object.create(BetaMessageThread.prototype);
        return Object.assign(thread, { _client: client, _state: state });
    }
    /** The full conversation, in a new array: every message the server holds plus those staged for the next turn. */
    get messages() {
        return this._state.messages;
    }
    /** The response `id` the next turn continues from, or `null` when the next turn starts a new thread. */
    get previousMessageId() {
        return this._state.previousMessageId;
    }
    /** The params of a `client.beta.messages.thread()` call for the whole conversation, in a new object. */
    get params() {
        return { ...this._state.params, unsupportedRequestBehavior: this._state.unsupportedRequestBehavior };
    }
    /** Stage messages for the next turn without sending anything. */
    append(...messages) {
        this._state.push(messages);
    }
    /**
     * Send the staged messages and `messages` as one turn and resolve to the reply. `params` and `options` apply to this
     * turn only. Throws while another `send()` / `parse()` / `stream()` on this thread is in progress.
     */
    send(messages, params = {}, options = {}) {
        return this._send(messages, params, options, (reply) => reply);
    }
    /**
     * Like `send()`, and parses the reply into `parsed_output` against the `output_config.format` (or `output_format`)
     * the thread was created with.
     */
    parse(messages, params = {}, options = {}) {
        return this._send(messages, params, options, (reply) => parseBetaMessage(reply, this._state.params, {
            logger: loggerFor(this._client),
        }));
    }
    /** @internal */
    _send(messages, params, options, parseReply) {
        const turn = this._state.startTurn(toMessageList(messages), params);
        // The reply is parsed and recorded as soon as it arrives, whether or not the caller awaits it.
        const received = (async () => {
            try {
                const { request, props } = await this._createWithRecovery(turn, options, { stream: false });
                // Parsed by the request itself, so a reply gets all that `create()` does with one.
                const reply = (await request);
                this._state.recordReply(turn, reply);
                return { props, reply };
            }
            finally {
                this._state.endTurn(turn);
            }
        })();
        return new APIPromise(this._client, received.then(({ props }) => props), async () => {
            const { props, reply } = await received;
            return addResponseIDs(parseReply(reply), props.response);
        });
    }
    /** Like `send()`, and returns the reply's stream. The turn is in progress until the stream ends or is aborted. */
    stream(messages, params = {}, options = {}) {
        const stream = new BetaMessageStream(this._state.params, {
            logger: loggerFor(this._client),
            client: this._client,
        });
        this._stream(stream, messages, params, options);
        return stream;
    }
    /**
     * @internal `stream()` on a stream the caller made: the thread records the reply once `stream` reaches `message_stop`,
     * and is free for the next turn when the request ends or `stream` is aborted, before the final events fire.
     */
    _stream(stream, messages, turnParams, turnOptions) {
        const turn = this._state.startTurn(toMessageList(messages), turnParams);
        // Recorded from the raw snapshot, because the server also stores a reply whose structured output fails to parse.
        // The snapshot is kept here because the stream clears its own once the body has ended.
        let received;
        let completedBlocks = 0;
        let stopped = false;
        stream.on('streamEvent', (event, snapshot) => {
            if (stopped)
                return;
            received = snapshot;
            if (event.type === 'content_block_stop')
                completedBlocks += 1;
            if (event.type === 'message_stop') {
                stopped = true;
                this._state.recordReply(turn, snapshot);
                this._state.endTurn(turn);
            }
        });
        const endEarly = () => {
            if (stopped)
                return;
            stopped = true;
            if (received)
                this._state.recordPartialReply(received, completedBlocks);
            this._state.endTurn(turn);
        };
        // Abort listeners run inside `abort()`, so the thread is free as soon as the caller has aborted the stream.
        stream.controller.signal.addEventListener('abort', endEarly, { once: true });
        const createTurn = (_body, options) => new APIPromise(this._client, this._createWithRecovery(turn, { ...turnOptions, signal: options?.signal }, { stream: true }).then(({ props }) => props));
        stream._start(createTurn, this._state.params, { signal: turnOptions.signal ?? this._state.options.signal }, endEarly);
    }
    /**
     * Change the request fields and request options of all later turns without sending anything. `system` and `tools`
     * cannot change once a turn has created the thread.
     */
    update(params = {}, options = {}) {
        this._state.update(params, options);
    }
    toolRunner(params = {}, options = {}) {
        rejectThreadField(params);
        return new BetaToolRunner(this, params, options);
    }
    /**
     * Return a new, independent thread with a copy of this one's history, request fields and request options, and no
     * `previousMessageId`. Sends nothing.
     */
    fork() {
        return BetaMessageThread._fromState(this._client, this._state.fork());
    }
    /**
     * @internal One `create()` call for `turn` and the response to it, re-sent as long as the state can recover from
     * the rejection.
     */
    async _createWithRecovery(turn, turnOptions, { stream }) {
        for (;;) {
            const { params, options } = this._state.buildCreateArguments(turn, turnOptions, { stream });
            const request = this._client.beta.messages.create({ ...params, stream }, options);
            try {
                return { request, props: await request._responseProps() };
            }
            catch (error) {
                if (!this._state.recoversFrom(error))
                    throw error;
            }
        }
    }
}
//# sourceMappingURL=BetaMessageThread.mjs.map