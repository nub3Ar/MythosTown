var _BetaToolRunnerStream_instances, _BetaToolRunnerStream_onToolCall, _BetaToolRunnerStream_emitted, _BetaToolRunnerStream_readers, _BetaToolRunnerStream_toolCalls, _BetaToolRunnerStream_closed, _BetaToolRunnerStream_ready, _BetaToolRunnerStream_fallback, _BetaToolRunnerStream_track, _BetaToolRunnerStream_release, _BetaToolRunnerStream_removeReader;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "../../internal/tslib.mjs";
import { BetaMessageStream } from "../BetaMessageStream.mjs";
/**
 * The stream a tool runner yields. It hands each `tool_use` call to `onToolCall` once the model has moved on
 * from it, and the caller's listeners and `for await` loops over the stream have handled the event that shows it.
 */
export var BetaToolRunnerStream = /* @__PURE__ */ (() => {
    /**
     * The stream a tool runner yields. It hands each `tool_use` call to `onToolCall` once the model has moved on
     * from it, and the caller's listeners and `for await` loops over the stream have handled the event that shows it.
     */
    class BetaToolRunnerStream extends BetaMessageStream {
        constructor(params, onToolCall, client) {
            super(params, { client });
            _BetaToolRunnerStream_instances.add(this);
            _BetaToolRunnerStream_onToolCall.set(this, void 0);
            /** The number of stream events emitted so far */
            _BetaToolRunnerStream_emitted.set(this, 0);
            /** The `for await` loops over the stream that are still reading it */
            _BetaToolRunnerStream_readers.set(this, []);
            /** The `tool_use` blocks that have finished streaming, in the model's order */
            _BetaToolRunnerStream_toolCalls.set(this, []);
            /** The last `tool_use` block to close, until the model moves on from it */
            _BetaToolRunnerStream_closed.set(this, void 0);
            /** The calls the model has moved on from, in its order, until every reader has caught up with them */
            _BetaToolRunnerStream_ready.set(this, []);
            /** Whether a refusal has handed the reply to a fallback model */
            _BetaToolRunnerStream_fallback.set(this, false);
            __classPrivateFieldSet(this, _BetaToolRunnerStream_onToolCall, onToolCall, "f");
        }
        /** The `tool_use` blocks that have finished streaming, in the model's order */
        get toolCalls() {
            return __classPrivateFieldGet(this, _BetaToolRunnerStream_toolCalls, "f");
        }
        _deliverEvent(event, snapshot) {
            var _a;
            // Counted first, so that a reader created by a listener of this event starts after it.
            __classPrivateFieldSet(this, _BetaToolRunnerStream_emitted, (_a = __classPrivateFieldGet(this, _BetaToolRunnerStream_emitted, "f"), _a++, _a), "f");
            const block = event.type === 'content_block_stop' ? snapshot?.content[event.index] : undefined;
            const closed = block?.type === 'tool_use' ? block : undefined;
            if (closed) {
                __classPrivateFieldGet(this, _BetaToolRunnerStream_toolCalls, "f").push(closed);
            }
            super._deliverEvent(event, snapshot);
            __classPrivateFieldGet(this, _BetaToolRunnerStream_instances, "m", _BetaToolRunnerStream_track).call(this, event, closed);
            __classPrivateFieldGet(this, _BetaToolRunnerStream_instances, "m", _BetaToolRunnerStream_release).call(this);
        }
        [(_BetaToolRunnerStream_onToolCall = new WeakMap(), _BetaToolRunnerStream_emitted = new WeakMap(), _BetaToolRunnerStream_readers = new WeakMap(), _BetaToolRunnerStream_toolCalls = new WeakMap(), _BetaToolRunnerStream_closed = new WeakMap(), _BetaToolRunnerStream_ready = new WeakMap(), _BetaToolRunnerStream_fallback = new WeakMap(), _BetaToolRunnerStream_instances = new WeakSet(), Symbol.asyncIterator)]() {
            const iterator = super[Symbol.asyncIterator]();
            const reader = { handled: __classPrivateFieldGet(this, _BetaToolRunnerStream_emitted, "f") };
            __classPrivateFieldGet(this, _BetaToolRunnerStream_readers, "f").push(reader);
            let holdsEvent = false;
            return {
                next: async () => {
                    // Asking for the next event is how a `for await` loop says it is done with the one it holds.
                    if (holdsEvent) {
                        holdsEvent = false;
                        reader.handled++;
                        __classPrivateFieldGet(this, _BetaToolRunnerStream_instances, "m", _BetaToolRunnerStream_release).call(this);
                    }
                    try {
                        const result = await iterator.next();
                        holdsEvent = !result.done;
                        if (result.done) {
                            __classPrivateFieldGet(this, _BetaToolRunnerStream_instances, "m", _BetaToolRunnerStream_removeReader).call(this, reader);
                        }
                        return result;
                    }
                    catch (error) {
                        __classPrivateFieldGet(this, _BetaToolRunnerStream_instances, "m", _BetaToolRunnerStream_removeReader).call(this, reader);
                        throw error;
                    }
                },
                return: async () => {
                    // Leaving the loop aborts the stream, which has to come first so that no call starts after it.
                    const result = iterator.return?.();
                    __classPrivateFieldGet(this, _BetaToolRunnerStream_instances, "m", _BetaToolRunnerStream_removeReader).call(this, reader);
                    return (await result) ?? { value: undefined, done: true };
                },
            };
        }
    }
    _BetaToolRunnerStream_track = function _BetaToolRunnerStream_track(event, closed) {
        if (__classPrivateFieldGet(this, _BetaToolRunnerStream_fallback, "f")) {
            return;
        }
        if (event.type === 'content_block_start' && event.content_block.type === 'fallback') {
            // The refusal that led to the fallback may have cut the call before it off.
            __classPrivateFieldSet(this, _BetaToolRunnerStream_fallback, true, "f");
            __classPrivateFieldSet(this, _BetaToolRunnerStream_closed, undefined, "f");
            return;
        }
        // A call's own `content_block_stop` isn't enough, because a reply that is cut off closes its last call too.
        const movedOn = event.type === 'content_block_start' ||
            (event.type === 'message_delta' && event.delta.stop_reason === 'tool_use');
        if (__classPrivateFieldGet(this, _BetaToolRunnerStream_closed, "f") && movedOn) {
            __classPrivateFieldGet(this, _BetaToolRunnerStream_ready, "f").push({ toolUse: __classPrivateFieldGet(this, _BetaToolRunnerStream_closed, "f"), event: __classPrivateFieldGet(this, _BetaToolRunnerStream_emitted, "f") });
            __classPrivateFieldSet(this, _BetaToolRunnerStream_closed, undefined, "f");
        }
        if (closed) {
            __classPrivateFieldSet(this, _BetaToolRunnerStream_closed, closed, "f");
        }
    }, _BetaToolRunnerStream_release = function _BetaToolRunnerStream_release() {
        // Events that were already read still arrive after the stream has failed or been aborted.
        if (this.errored || this.controller.signal.aborted) {
            return;
        }
        const handled = Math.min(__classPrivateFieldGet(this, _BetaToolRunnerStream_emitted, "f"), ...__classPrivateFieldGet(this, _BetaToolRunnerStream_readers, "f").map((reader) => reader.handled));
        while (__classPrivateFieldGet(this, _BetaToolRunnerStream_ready, "f")[0] && __classPrivateFieldGet(this, _BetaToolRunnerStream_ready, "f")[0].event <= handled) {
            __classPrivateFieldGet(this, _BetaToolRunnerStream_onToolCall, "f").call(this, __classPrivateFieldGet(this, _BetaToolRunnerStream_ready, "f").shift().toolUse);
        }
    }, _BetaToolRunnerStream_removeReader = function _BetaToolRunnerStream_removeReader(reader) {
        const index = __classPrivateFieldGet(this, _BetaToolRunnerStream_readers, "f").indexOf(reader);
        if (index >= 0) {
            __classPrivateFieldGet(this, _BetaToolRunnerStream_readers, "f").splice(index, 1);
            __classPrivateFieldGet(this, _BetaToolRunnerStream_instances, "m", _BetaToolRunnerStream_release).call(this);
        }
    };
    return BetaToolRunnerStream;
})();
//# sourceMappingURL=BetaToolRunnerStream.mjs.map