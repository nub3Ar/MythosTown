var _ThreadState_instances, _ThreadState_fields, _ThreadState_stored, _ThreadState_staged, _ThreadState_anchor, _ThreadState_turn, _ThreadState_logger, _ThreadState_lastReply_get, _ThreadState_repeatsLastReply, _ThreadState_startNewThread, _ThreadState_retryPartialTurn, _ThreadState_dropsRefusedTurn, _ThreadState_storeTurn, _ThreadState_adoptContainer, _ThreadState_checkCreateOnly, _ThreadState_requestOptions;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "../../../internal/tslib.mjs";
import { AnthropicError, APIError } from "../../../core/error.mjs";
import { appendHeaderValue, buildHeaders } from "../../../internal/headers.mjs";
import { STAINLESS_HELPER_METHOD_HEADER, helperHeader } from "../../../internal/stainless-helper-header.mjs";
import { isObj, isReadonlyArray } from "../../../internal/utils/values.mjs";
/**
 * A turn in flight: the request fields it sends, the messages its call staged, the create-only fields its call gave,
 * and the history edits to apply once it ends.
 */
class Turn {
    constructor(fields, ownMessages, 
    // Less the ones set on the thread since the call, because the later value stands.
    ownCreateOnly) {
        this.fields = fields;
        this.ownMessages = ownMessages;
        this.ownCreateOnly = ownCreateOnly;
        this.deferredMessages = [];
        this.replacementHistory = null;
        this.createOnly = createOnlyJSON(fields);
    }
}
/**
 * A thread's local view of the conversation: the full history, which part of it the server holds and which
 * reply the next turn continues from, the request fields for the next turn, and the turn in flight, if any.
 *
 * Sends nothing itself: it assembles each turn's `create()` arguments and records what the reply changes.
 */
export var ThreadState = /* @__PURE__ */ (() => {
    /**
     * A thread's local view of the conversation: the full history, which part of it the server holds and which
     * reply the next turn continues from, the request fields for the next turn, and the turn in flight, if any.
     *
     * Sends nothing itself: it assembles each turn's `create()` arguments and records what the reply changes.
     */
    class ThreadState {
        constructor({ params, options, threading, logger, }) {
            _ThreadState_instances.add(this);
            _ThreadState_fields.set(this, void 0);
            _ThreadState_stored.set(this, []);
            _ThreadState_staged.set(this, []);
            _ThreadState_anchor.set(this, void 0);
            _ThreadState_turn.set(this, null);
            _ThreadState_logger.set(this, void 0);
            const { messages, unsupportedRequestBehavior, ...fields } = params;
            rejectThreadField(fields);
            this.options = options;
            this.unsupportedRequestBehavior = unsupportedRequestBehavior ?? 'error';
            __classPrivateFieldSet(this, _ThreadState_fields, fields, "f");
            __classPrivateFieldSet(this, _ThreadState_anchor, threading ? { type: 'create', replacesLostThread: false } : { type: 'never_threaded' }, "f");
            __classPrivateFieldSet(this, _ThreadState_logger, logger, "f");
            this.push(messages ?? []);
        }
        /** Whether turns send a `thread` field at all. */
        get threading() {
            return __classPrivateFieldGet(this, _ThreadState_anchor, "f").type === 'create' || __classPrivateFieldGet(this, _ThreadState_anchor, "f").type === 'continue';
        }
        /** The `id` of the stored reply the next turn continues from, or `null` when it starts a new thread. */
        get previousMessageId() {
            return __classPrivateFieldGet(this, _ThreadState_anchor, "f").type === 'continue' ? __classPrivateFieldGet(this, _ThreadState_anchor, "f").previousMessageId : null;
        }
        /**
         * Every message the server holds plus those staged for the next turn, with any edits deferred by a turn in flight
         * already applied.
         */
        get messages() {
            const messages = __classPrivateFieldGet(this, _ThreadState_turn, "f")?.replacementHistory?.slice() ??
                [...__classPrivateFieldGet(this, _ThreadState_stored, "f"), ...__classPrivateFieldGet(this, _ThreadState_staged, "f")].map((entry) => entry.param);
            if (__classPrivateFieldGet(this, _ThreadState_turn, "f"))
                messages.push(...__classPrivateFieldGet(this, _ThreadState_turn, "f").deferredMessages.map(toMessageParam));
            return messages;
        }
        /**
         * The thread as the params of one call for the whole conversation: its request fields and full history. A new
         * object on each access. While a turn that creates the thread is in flight, it shows that turn's create-only fields.
         */
        get params() {
            const ownCreateOnly = __classPrivateFieldGet(this, _ThreadState_anchor, "f").type === 'create' ? __classPrivateFieldGet(this, _ThreadState_turn, "f")?.ownCreateOnly : undefined;
            return { ...__classPrivateFieldGet(this, _ThreadState_fields, "f"), ...ownCreateOnly, messages: this.messages };
        }
        /** Stage messages for the next turn, skipping the reply just recorded and deferring while a turn is in flight. */
        push(messages) {
            if (__classPrivateFieldGet(this, _ThreadState_turn, "f")) {
                __classPrivateFieldGet(this, _ThreadState_turn, "f").deferredMessages.push(...messages);
                return;
            }
            for (const message of messages) {
                if (__classPrivateFieldGet(this, _ThreadState_instances, "m", _ThreadState_repeatsLastReply).call(this, message))
                    continue;
                __classPrivateFieldGet(this, _ThreadState_staged, "f").push({ param: toMessageParam(message), reply: null });
            }
        }
        /** Apply the given request fields and request options to all later turns. */
        update(fields = {}, options = {}) {
            rejectThreadField(fields);
            __classPrivateFieldSet(this, _ThreadState_fields, { ...__classPrivateFieldGet(this, _ThreadState_fields, "f"), ...definedEntries(fields) }, "f");
            this.options = { ...this.options, ...definedEntries(options) };
            for (const field of CREATE_ONLY_FIELDS) {
                if (fields[field] !== undefined)
                    delete __classPrivateFieldGet(this, _ThreadState_turn, "f")?.ownCreateOnly[field];
            }
        }
        /**
         * A copy with the same history and options that continues from no stored reply and has no turn in flight. Its request
         * fields are the same too, unless `fields` takes their place.
         */
        fork(fields = __classPrivateFieldGet(this, _ThreadState_fields, "f")) {
            const fork = new ThreadState({
                params: { ...fields, unsupportedRequestBehavior: this.unsupportedRequestBehavior },
                options: this.options,
                threading: __classPrivateFieldGet(this, _ThreadState_anchor, "f").type !== 'never_threaded',
                logger: __classPrivateFieldGet(this, _ThreadState_logger, "f"),
            });
            if (!this.threading)
                fork.stopThreading();
            if (__classPrivateFieldGet(this, _ThreadState_turn, "f")?.replacementHistory) {
                __classPrivateFieldSet(fork, _ThreadState_staged, __classPrivateFieldGet(this, _ThreadState_turn, "f").replacementHistory.map((param) => ({ param, reply: null })), "f");
            }
            else {
                __classPrivateFieldSet(fork, _ThreadState_stored, [...__classPrivateFieldGet(this, _ThreadState_stored, "f")], "f");
                __classPrivateFieldSet(fork, _ThreadState_staged, [...__classPrivateFieldGet(this, _ThreadState_staged, "f")], "f");
            }
            if (__classPrivateFieldGet(this, _ThreadState_turn, "f"))
                fork.push(__classPrivateFieldGet(this, _ThreadState_turn, "f").deferredMessages);
            return fork;
        }
        /** Replace the request fields with those of `params`, so a field it leaves out is gone, then `setMessages()`. */
        setParams({ messages, ...fields }) {
            __classPrivateFieldSet(this, _ThreadState_fields, fields, "f");
            if (__classPrivateFieldGet(this, _ThreadState_turn, "f"))
                __classPrivateFieldGet(this, _ThreadState_turn, "f").ownCreateOnly = {};
            this.setMessages(messages);
        }
        /**
         * Take the history from `messages`: additions to the current history are staged, and any other list replaces it
         * and starts a new thread.
         */
        setMessages(messages) {
            const entries = [...__classPrivateFieldGet(this, _ThreadState_stored, "f"), ...__classPrivateFieldGet(this, _ThreadState_staged, "f")];
            if (__classPrivateFieldGet(this, _ThreadState_turn, "f")) {
                // A turn in flight has already sent what is staged: an edit that only appends to it is deferred like
                // `push()`, and a rewritten history replaces the thread (and anything deferred so far) once the turn ends.
                const sent = entries.map((entry) => entry.param);
                if (startsWith(messages, sent)) {
                    __classPrivateFieldGet(this, _ThreadState_turn, "f").replacementHistory = null;
                    __classPrivateFieldGet(this, _ThreadState_turn, "f").deferredMessages = messages.slice(sent.length);
                }
                else {
                    __classPrivateFieldGet(this, _ThreadState_turn, "f").replacementHistory = messages;
                    __classPrivateFieldGet(this, _ThreadState_turn, "f").deferredMessages = [];
                }
                return;
            }
            if (!startsWith(messages, __classPrivateFieldGet(this, _ThreadState_stored, "f").map((entry) => entry.param))) {
                __classPrivateFieldSet(this, _ThreadState_stored, [], "f");
                if (this.threading)
                    __classPrivateFieldSet(this, _ThreadState_anchor, { type: 'create', replacesLostThread: false }, "f");
            }
            __classPrivateFieldSet(this, _ThreadState_staged, [], "f");
            // A message that is a recorded reply keeps that record, so a history copied from `messages` or `params` and
            // edited still knows which of its messages the thread received rather than was given.
            const replies = new Map(entries.filter((entry) => entry.reply).map((entry) => [entry.param.content, entry]));
            for (const message of messages.slice(__classPrivateFieldGet(this, _ThreadState_stored, "f").length)) {
                if (__classPrivateFieldGet(this, _ThreadState_instances, "m", _ThreadState_repeatsLastReply).call(this, message))
                    continue;
                __classPrivateFieldGet(this, _ThreadState_staged, "f").push({
                    ...(replies.get(message.content) ?? { reply: null }),
                    param: toMessageParam(message),
                });
            }
        }
        /** Whether the next turn has something to send: staged messages, or an unfinished reply to resume. */
        get hasTurnToSend() {
            return __classPrivateFieldGet(this, _ThreadState_staged, "f").length > 0 || isUnfinishedStopReason(__classPrivateFieldGet(this, _ThreadState_stored, "f").at(-1)?.reply?.stop_reason);
        }
        /** Stage `messages` and start the turn that sends them with the overrides `fields`, in flight until `endTurn()`. */
        startTurn(messages, fields) {
            if (__classPrivateFieldGet(this, _ThreadState_turn, "f")) {
                throw new AnthropicError('Another `send()`, `parse()` or `stream()` is already in progress on this thread');
            }
            rejectThreadField(fields);
            const alreadyStaged = __classPrivateFieldGet(this, _ThreadState_staged, "f").length;
            this.push(messages);
            const ownMessages = __classPrivateFieldGet(this, _ThreadState_staged, "f").slice(alreadyStaged);
            __classPrivateFieldGet(this, _ThreadState_instances, "m", _ThreadState_retryPartialTurn).call(this);
            const ownCreateOnly = {};
            if (fields.system !== undefined)
                ownCreateOnly.system = fields.system;
            if (fields.tools !== undefined)
                ownCreateOnly.tools = fields.tools;
            return (__classPrivateFieldSet(this, _ThreadState_turn, new Turn({ ...__classPrivateFieldGet(this, _ThreadState_fields, "f"), ...definedEntries(fields) }, ownMessages, ownCreateOnly), "f"));
        }
        /**
         * Mark `turn` finished, take back the messages its call staged if no reply to them started, and apply the history
         * edits deferred during it.
         */
        endTurn(turn) {
            __classPrivateFieldSet(this, _ThreadState_turn, null, "f");
            // A reply that started has moved everything staged into the stored history.
            __classPrivateFieldSet(this, _ThreadState_staged, __classPrivateFieldGet(this, _ThreadState_staged, "f").filter((entry) => !turn.ownMessages.includes(entry)), "f");
            if (turn.replacementHistory)
                this.setMessages(turn.replacementHistory);
            this.push(turn.deferredMessages);
        }
        /**
         * Whether the turn should be sent again because `error` is a thread rejection this state has now adjusted for. With
         * `'continue_unthreaded'` a replay that finds the new thread lost as well stops threading, because the server may be
         * unable to store the conversation.
         */
        recoversFrom(error) {
            if (!(error instanceof APIError))
                return false;
            const continuesUnthreaded = this.unsupportedRequestBehavior === 'continue_unthreaded';
            const reason = replayReason(error);
            if (reason !== null && __classPrivateFieldGet(this, _ThreadState_anchor, "f").type === 'continue') {
                if (reason === 'thread_not_found' && __classPrivateFieldGet(this, _ThreadState_anchor, "f").replacesLostThread && continuesUnthreaded) {
                    __classPrivateFieldGet(this, _ThreadState_logger, "f").info(`The server lost the thread again right after a replay; continuing without a thread: previous_message_id=${__classPrivateFieldGet(this, _ThreadState_anchor, "f").previousMessageId}`);
                    this.stopThreading();
                }
                else {
                    __classPrivateFieldGet(this, _ThreadState_instances, "m", _ThreadState_startNewThread).call(this, reason);
                }
                return true;
            }
            const unsupported = unsupportedFeatures(error);
            if (unsupported !== null && this.threading && continuesUnthreaded) {
                __classPrivateFieldGet(this, _ThreadState_logger, "f").info(`The server cannot thread this request; continuing without a thread: unsupported=${unsupported.join(',')}`);
                this.stopThreading();
                return true;
            }
            return false;
        }
        /** Drop the `thread` field from this turn and every later one. */
        stopThreading() {
            if (this.threading)
                __classPrivateFieldSet(this, _ThreadState_anchor, { type: 'unthreaded' }, "f");
        }
        /**
         * Record a turn whose stream ended after `message_start` and before `message_stop`. The next turn starts a new
         * thread because the server holds either the whole reply or none of it. `completedBlocks` is how many content
         * blocks received `content_block_stop`.
         */
        recordPartialReply(snapshot, completedBlocks) {
            if (__classPrivateFieldGet(this, _ThreadState_instances, "m", _ThreadState_dropsRefusedTurn).call(this, snapshot))
                return;
            __classPrivateFieldGet(this, _ThreadState_instances, "m", _ThreadState_storeTurn).call(this, partialReply(snapshot, completedBlocks), { partial: true });
            if (this.previousMessageId !== null) {
                __classPrivateFieldGet(this, _ThreadState_instances, "m", _ThreadState_startNewThread).call(this, 'stream_ended_before_message_stop');
            }
        }
        /**
         * Record `message` as the reply of `turn`, for the next turn to continue from. The server does not store a reply
         * that a fallback model wrote, so the turn after one starts a new thread.
         */
        recordReply(turn, message) {
            if (__classPrivateFieldGet(this, _ThreadState_instances, "m", _ThreadState_dropsRefusedTurn).call(this, message))
                return;
            __classPrivateFieldGet(this, _ThreadState_instances, "m", _ThreadState_storeTurn).call(this, message, { partial: false });
            if (__classPrivateFieldGet(this, _ThreadState_anchor, "f").type === 'create') {
                __classPrivateFieldSet(this, _ThreadState_fields, { ...__classPrivateFieldGet(this, _ThreadState_fields, "f"), ...turn.ownCreateOnly }, "f");
            }
            if (this.threading) {
                __classPrivateFieldSet(this, _ThreadState_anchor, {
                    type: 'continue',
                    previousMessageId: message.id,
                    createdWith: turn.createOnly,
                    replacesLostThread: __classPrivateFieldGet(this, _ThreadState_anchor, "f").type === 'create' && __classPrivateFieldGet(this, _ThreadState_anchor, "f").replacesLostThread,
                }, "f");
                if (message.usage.iterations?.some((iteration) => iteration.type === 'fallback_message')) {
                    __classPrivateFieldGet(this, _ThreadState_instances, "m", _ThreadState_startNewThread).call(this, 'fallback_message');
                }
            }
            if (message.container) {
                __classPrivateFieldGet(this, _ThreadState_instances, "m", _ThreadState_adoptContainer).call(this, message.container.id);
            }
        }
        /**
         * The `create()` arguments of `turn` except `stream`: request fields, betas, the `thread` field with the delta or
         * full history, and request options.
         */
        buildCreateArguments(turn, options, { stream }) {
            __classPrivateFieldGet(this, _ThreadState_instances, "m", _ThreadState_checkCreateOnly).call(this, turn.createOnly);
            const anchor = __classPrivateFieldGet(this, _ThreadState_anchor, "f");
            // A `continue` sends only what the server lacks. With nothing staged after a `pause_turn` reply that is
            // nothing: the server holds the unfinished turn and resumes it from an empty `messages`.
            let stored = anchor.type === 'continue' ? [] : __classPrivateFieldGet(this, _ThreadState_stored, "f").map((entry) => entry.param);
            // The caller set the cache markers of an answered message for the request that first sent it, and a thread that
            // sends them all again in one request can exceed what a request may hold. A stored message after the last reply
            // was never answered, so it goes out as given.
            if (anchor.type !== 'never_threaded') {
                const answered = __classPrivateFieldGet(this, _ThreadState_stored, "f").map((entry) => entry.reply !== null).lastIndexOf(true) + 1;
                stored = stored.map((message, i) => (i < answered ? withoutCacheControl(message) : message));
            }
            const params = {
                ...turn.fields,
                messages: [...stored, ...__classPrivateFieldGet(this, _ThreadState_staged, "f").map((entry) => entry.param)],
            };
            if (this.threading && !params.betas?.includes(MESSAGE_THREADS_BETA)) {
                params.betas = [...(params.betas ?? []), MESSAGE_THREADS_BETA];
            }
            if (anchor.type === 'create') {
                params.thread = { type: 'create' };
            }
            else if (anchor.type === 'continue') {
                params.thread = { type: 'continue', previous_message_id: anchor.previousMessageId };
                for (const field of CREATE_ONLY_FIELDS)
                    delete params[field];
            }
            return { params, options: __classPrivateFieldGet(this, _ThreadState_instances, "m", _ThreadState_requestOptions).call(this, options, { stream }) };
        }
        /** Throws if the thread refuses a turn with the overrides `fields`, as that turn would before it is sent. */
        checkNextTurn(fields) {
            __classPrivateFieldGet(this, _ThreadState_instances, "m", _ThreadState_checkCreateOnly).call(this, createOnlyJSON({ ...__classPrivateFieldGet(this, _ThreadState_fields, "f"), ...definedEntries(fields) }));
        }
    }
    _ThreadState_fields = new WeakMap(), _ThreadState_stored = new WeakMap(), _ThreadState_staged = new WeakMap(), _ThreadState_anchor = new WeakMap(), _ThreadState_turn = new WeakMap(), _ThreadState_logger = new WeakMap(), _ThreadState_instances = new WeakSet(), _ThreadState_lastReply_get = function _ThreadState_lastReply_get() {
        for (const entries of [__classPrivateFieldGet(this, _ThreadState_staged, "f"), __classPrivateFieldGet(this, _ThreadState_stored, "f")]) {
            for (let i = entries.length - 1; i >= 0; i--) {
                if (entries[i].reply)
                    return entries[i].reply;
            }
        }
        return null;
    }, _ThreadState_repeatsLastReply = function _ThreadState_repeatsLastReply(message) {
        if ('id' in message)
            return message.id === __classPrivateFieldGet(this, _ThreadState_instances, "a", _ThreadState_lastReply_get)?.id;
        const last = __classPrivateFieldGet(this, _ThreadState_staged, "f").at(-1) ?? __classPrivateFieldGet(this, _ThreadState_stored, "f").at(-1);
        return last?.reply != null && sameMessage(message, last.param);
    }, _ThreadState_startNewThread = function _ThreadState_startNewThread(reason) {
        __classPrivateFieldGet(this, _ThreadState_logger, "f").info(`Replaying the full message history under a new thread: reason=${reason} previous_message_id=${this.previousMessageId}`);
        __classPrivateFieldSet(this, _ThreadState_anchor, { type: 'create', replacesLostThread: reason === 'thread_not_found' }, "f");
    }, _ThreadState_retryPartialTurn = function _ThreadState_retryPartialTurn() {
        const tail = __classPrivateFieldGet(this, _ThreadState_stored, "f").at(-1);
        if (__classPrivateFieldGet(this, _ThreadState_staged, "f").length || !tail || (tail.reply && !tail.partial))
            return;
        if (tail.reply)
            __classPrivateFieldGet(this, _ThreadState_stored, "f").pop();
        let turnStart = __classPrivateFieldGet(this, _ThreadState_stored, "f").length;
        while (turnStart > 0 && !__classPrivateFieldGet(this, _ThreadState_stored, "f")[turnStart - 1].reply)
            turnStart -= 1;
        __classPrivateFieldSet(this, _ThreadState_staged, __classPrivateFieldGet(this, _ThreadState_stored, "f").splice(turnStart), "f");
        __classPrivateFieldGet(this, _ThreadState_logger, "f").info(`Re-sending the turn whose reply ended before \`message_stop\`: partial_reply_id=${tail.reply?.id ?? null}`);
    }, _ThreadState_dropsRefusedTurn = function _ThreadState_dropsRefusedTurn(reply) {
        if (reply.stop_reason !== 'refusal' || __classPrivateFieldGet(this, _ThreadState_anchor, "f").type === 'never_threaded')
            return false;
        if (this.previousMessageId !== null)
            __classPrivateFieldGet(this, _ThreadState_instances, "m", _ThreadState_startNewThread).call(this, 'refusal');
        return true;
    }, _ThreadState_storeTurn = function _ThreadState_storeTurn(reply, { partial }) {
        __classPrivateFieldGet(this, _ThreadState_stored, "f").push(...__classPrivateFieldGet(this, _ThreadState_staged, "f"));
        __classPrivateFieldSet(this, _ThreadState_staged, [], "f");
        if (reply)
            __classPrivateFieldGet(this, _ThreadState_stored, "f").push({ param: toMessageParam(reply), reply, partial });
    }, _ThreadState_adoptContainer = function _ThreadState_adoptContainer(containerId) {
        const { container } = __classPrivateFieldGet(this, _ThreadState_fields, "f");
        if (container == null) {
            __classPrivateFieldSet(this, _ThreadState_fields, { ...__classPrivateFieldGet(this, _ThreadState_fields, "f"), container: containerId }, "f");
        }
        else if (typeof container === 'object' && container.id == null) {
            __classPrivateFieldSet(this, _ThreadState_fields, { ...__classPrivateFieldGet(this, _ThreadState_fields, "f"), container: { ...container, id: containerId } }, "f");
        }
    }, _ThreadState_checkCreateOnly = function _ThreadState_checkCreateOnly(createOnly) {
        if (__classPrivateFieldGet(this, _ThreadState_anchor, "f").type !== 'continue')
            return;
        const { createdWith } = __classPrivateFieldGet(this, _ThreadState_anchor, "f");
        const changed = CREATE_ONLY_FIELDS.filter((field) => createOnly[field] !== createdWith[field]);
        if (changed.length) {
            const names = changed.map((field) => `\`${field}\``).join(' and ');
            throw new AnthropicError(`Cannot change ${names} on a thread: the server keeps the \`system\` and \`tools\` the thread was created ` +
                'with. To change them, start a new thread from `thread.params`.' +
                (changed.includes('tools') ?
                    ' To add or remove tools on this thread, send `tool_addition` or `tool_removal` blocks in a ' +
                        '`system` message.'
                    : ''));
        }
    }, _ThreadState_requestOptions = function _ThreadState_requestOptions(overrides, { stream }) {
        const options = { ...this.options, ...definedEntries(overrides) };
        if (stream) {
            options.headers = buildHeaders([{ [STAINLESS_HELPER_METHOD_HEADER]: 'stream' }, options.headers]);
        }
        // Added last, apart from the options, which the caller can replace.
        if (__classPrivateFieldGet(this, _ThreadState_anchor, "f").type !== 'never_threaded') {
            options.headers = buildHeaders([options.headers, helperHeader('message-thread')]);
        }
        if (this.threading) {
            options.headers = withThreadsBeta(options.headers);
        }
        return options;
    };
    return ThreadState;
})();
// A reply with one of these stop reasons is an unfinished turn: a request with no new message has the server go on
// from where it stopped (`compaction` hands the turn back before the model answers). On a thread that request is a
// `continue` with `messages: []`; without one it re-sends the full history, which ends in the unfinished reply.
const UNFINISHED_STOP_REASONS = ['pause_turn', 'compaction'];
export function isUnfinishedStopReason(stopReason) {
    return UNFINISHED_STOP_REASONS.some((unfinished) => unfinished === stopReason);
}
const MESSAGE_THREADS_BETA = 'message-threads-2026-08-12';
/** Request fields the server takes from the thread on a `continue` and rejects if the request repeats them. */
const CREATE_ONLY_FIELDS = ['system', 'tools'];
function createOnlyJSON(fields) {
    return { system: JSON.stringify(fields.system), tools: JSON.stringify(fields.tools) };
}
/**
 * `headers` with the threads beta appended to a caller-set `anthropic-beta` header, which would otherwise replace the
 * one `create()` builds from `betas`.
 */
function withThreadsBeta(headers) {
    const callerBetas = buildHeaders([headers]).values.get('anthropic-beta');
    if (callerBetas === null)
        return headers;
    return buildHeaders([headers, { 'anthropic-beta': appendHeaderValue(callerBetas, MESSAGE_THREADS_BETA) }]);
}
/** The `error_code` of a rejection that a full replay under a new thread recovers from, if it is one. */
function replayReason(error) {
    const errorCode = errorDetails(error)?.['error_code'];
    return REPLAY_ERROR_CODES.find((code) => code === errorCode) ?? null;
}
const REPLAY_ERROR_CODES = [
    'thread_not_found',
    'thread_already_continued',
    'thread_continue_in_flight',
];
/** The `unsupported` values of a `thread_unsupported_request` rejection, or `null` for any other error. */
function unsupportedFeatures(error) {
    const details = errorDetails(error);
    if (details?.['error_code'] !== 'thread_unsupported_request')
        return null;
    const unsupported = details['unsupported'];
    return Array.isArray(unsupported) ? unsupported.map(String) : [];
}
/** The `error.details` object of the response body, or `null` when the body has none. */
function errorDetails(error) {
    const body = error.error;
    const details = body?.error?.details;
    return isObj(details) ? details : null;
}
/** Throws if `fields` has a `thread`. The field types leave it out, which an untyped caller or a cast gets past. */
export function rejectThreadField(fields) {
    if ('thread' in fields && fields.thread !== undefined) {
        throw new TypeError('`thread` cannot be set here. The message thread sets it for each request itself.');
    }
}
/** `object` without the keys whose value is `undefined`, so a spread of it leaves those keys as they were. */
export function definedEntries(object) {
    return Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined));
}
/**
 * The part of a streamed reply worth keeping when the stream ended early, or `null` if nothing is. An unfinished block
 * stays only if it is `text`, because the `input` or `signature` of any other is incomplete.
 */
function partialReply(snapshot, completedBlocks) {
    const content = snapshot.content.slice(0, completedBlocks);
    const unfinished = snapshot.content[completedBlocks];
    if (unfinished?.type === 'text' && unfinished.text)
        content.push(unfinished);
    return content.length ? { ...snapshot, content } : null;
}
/**
 * A copy of `value`, a message or a content block, without its `cache_control` and that of the blocks and tool in it.
 * Those are reached through the keys below only, so the value of any other key is carried over as it is.
 */
function withoutCacheControl(value) {
    if (!isObj(value))
        return value;
    const { cache_control, ...copy } = value;
    for (const key of ['content', 'source', 'tool', 'definition', 'tool_references']) {
        const nested = copy[key];
        if (Array.isArray(nested))
            copy[key] = nested.map(withoutCacheControl);
        else if (isObj(nested))
            copy[key] = withoutCacheControl(nested);
    }
    return copy;
}
/** Whether `messages` begins with every message of `prefix`, in order. */
function startsWith(messages, prefix) {
    return prefix.length <= messages.length && prefix.every((message, i) => sameMessage(message, messages[i]));
}
/** Whether every field of the two messages is equal. A reply given as it was received counts as its param. */
export function sameMessage(a, b) {
    const [left, right] = [toMessageParam(a), toMessageParam(b)];
    const keys = Object.keys({ ...left, ...right });
    return keys.every((key) => left[key] === right[key] || JSON.stringify(left[key]) === JSON.stringify(right[key]));
}
function toMessageParam(message) {
    return 'id' in message ? { role: message.role, content: message.content } : message;
}
export function toMessageList(input) {
    if (input === undefined)
        return [];
    return isReadonlyArray(input) ? input : [input];
}
//# sourceMappingURL=ThreadState.mjs.map