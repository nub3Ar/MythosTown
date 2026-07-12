var _BetaToolRunner_instances, _BetaToolRunner_consumed, _BetaToolRunner_mutated, _BetaToolRunner_thread, _BetaToolRunner_settings, _BetaToolRunner_options, _BetaToolRunner_helperHeader, _BetaToolRunner_messagesWithoutReply, _BetaToolRunner_message, _BetaToolRunner_stream, _BetaToolRunner_toolResponse, _BetaToolRunner_completion, _BetaToolRunner_iterationCount, _BetaToolRunner_toolRunnerOtelContext, _BetaToolRunner_compaction, _BetaToolRunner_calls, _BetaToolRunner_lastStopReason, _BetaToolRunner_toolOverrides, _BetaToolRunner_pendingToolChanges, _BetaToolRunner_withToolRunnerSpan, _BetaToolRunner_send, _BetaToolRunner_turnOptions, _BetaToolRunner_streamThatStartsTools, _BetaToolRunner_startedCallsSettled, _BetaToolRunner_compact, _BetaToolRunner_compactionThread, _BetaToolRunner_runnableTools, _BetaToolRunner_availableToolNames, _BetaToolRunner_recordRemovalsFromHistory, _BetaToolRunner_compactAfterFinalTurn, _BetaToolRunner_generateToolResponse, _BetaToolRunner_toolsetFamilies, _BetaToolRunner_toolsetParams, _BetaToolRunner_flushPendingToolChanges, _BetaToolRunner_pendingToolChangesMessage;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "../../internal/tslib.mjs";
import { context, trace, SpanStatusCode } from '@opentelemetry/api';
import { runRunnableTool } from "./BetaRunnableTool.mjs";
import { isRunnableToolset, toolsetFamily } from "../internal/toolsets/family.mjs";
import { runToolsetMember, notExecutedText, toolsetResultBlock } from "../internal/toolsets/run.mjs";
import { quotedName } from "../internal/toolsets/sanitize.mjs";
import { ToolsetContractError } from "../internal/toolsets/errors.mjs";
import { AnthropicError } from "../../core/error.mjs";
import { BETA_CLIENT_TOOL_UNION_KEYS, } from "../../resources/beta.mjs";
import { BetaToolRunnerStream } from "../internal/BetaToolRunnerStream.mjs";
import { guardTracing, setErrorStatus } from "../../internal/tracing.mjs";
import { startToolRunnerSpan, withToolUseSpan } from "../internal/tracing.mjs";
import { buildHeaders } from "../../internal/headers.mjs";
import { promiseWithResolvers } from "../../internal/utils/promise.mjs";
import { checkNever } from "../../internal/utils/values.mjs";
import { loggerFor } from "../../internal/utils/log.mjs";
import { collectStainlessHelpers, helperHeader, SDK_HELPER_SYMBOL, STAINLESS_HELPER_HEADER, wasCreatedByStainlessHelper, } from "../../internal/stainless-helper-header.mjs";
import { definedEntries, isUnfinishedStopReason, sameMessage, } from "../internal/threads/ThreadState.mjs";
import { splitToolRunnerParams } from "../internal/threads/tool-runner-params.mjs";
const USE_A_NEW_RUNNER = "a tool runner's toolsets come only from its tools param; change them with setMessagesParams(), or build a new runner";
const REMOVE_WITH_A_NEW_RUNNER = "a tool runner's toolsets come only from its tools param; remove it there with setMessagesParams(), or build a new runner without it";
/**
 * A ToolRunner handles the automatic conversation loop between the assistant and tools.
 *
 * A ToolRunner is an async iterable that yields either BetaMessage or BetaMessageStream objects
 * depending on the streaming configuration. It runs over a `BetaMessageThread`, which holds the
 * conversation and sends each turn. With `runToolsEagerly` it starts each tool call while the reply is
 * still streaming, unless `deferToolCall()` holds the call.
 */
export var BetaToolRunner = /* @__PURE__ */ (() => {
    /**
     * A ToolRunner handles the automatic conversation loop between the assistant and tools.
     *
     * A ToolRunner is an async iterable that yields either BetaMessage or BetaMessageStream objects
     * depending on the streaming configuration. It runs over a `BetaMessageThread`, which holds the
     * conversation and sends each turn. With `runToolsEagerly` it starts each tool call while the reply is
     * still streaming, unless `deferToolCall()` holds the call.
     */
    class BetaToolRunner {
        constructor(clientOrThread, paramsOrSettings, options) {
            _BetaToolRunner_instances.add(this);
            /** Whether the async iterator has been consumed */
            _BetaToolRunner_consumed.set(this, false);
            /** Whether parameters have been mutated since the last API call */
            _BetaToolRunner_mutated.set(this, false);
            /** The thread that holds the conversation and sends each turn */
            _BetaToolRunner_thread.set(this, void 0);
            /** The runner's own settings; every other param is the thread's */
            _BetaToolRunner_settings.set(this, void 0);
            _BetaToolRunner_options.set(this, void 0);
            /** The helper telemetry header of every turn: the runner's tag and the tags of its tools and messages */
            _BetaToolRunner_helperHeader.set(this, void 0);
            /**
             * `params.messages` while the caller handles a reply: the messages that were sent and what the caller has made of them
             * since, without the reply. The thread takes them after the loop body if the caller changed anything.
             */
            _BetaToolRunner_messagesWithoutReply.set(this, void 0);
            /** Promise for the last message received from the assistant */
            _BetaToolRunner_message.set(this, void 0);
            /** The stream of the request in progress, when streaming */
            _BetaToolRunner_stream.set(this, void 0);
            /** Cached tool response to avoid redundant executions */
            _BetaToolRunner_toolResponse.set(this, void 0);
            /** Promise resolvers for waiting on completion */
            _BetaToolRunner_completion.set(this, void 0);
            /** Number of iterations (API requests) made so far */
            _BetaToolRunner_iterationCount.set(this, 0);
            /**
             * The OpenTelemetry `Context` of the loop that is running: the one that was active when the loop
             * started, with the tool runner span set as the active span.
             */
            _BetaToolRunner_toolRunnerOtelContext.set(this, void 0);
            /** A compaction scheduled with `compactBeforeNextTurn()`, in flight until its response has been handled */
            _BetaToolRunner_compaction.set(this, { status: 'idle' });
            /** The tool calls of the current reply that are held or have started, by `tool_use` id. See `runToolsEagerly`. */
            _BetaToolRunner_calls.set(this, void 0);
            /** The last turn's stop reason, or `null` once the history has been replaced since */
            _BetaToolRunner_lastStopReason.set(this, null);
            /**
             * `addTools()` / `removeTools()` never edit `params.tools`, because a changed `tools` misses the prompt
             * cache, so what they change about which tool runs under a name is kept here instead: the runnable tool
             * added under that name, or `null` once the name was removed or taken by a raw definition. A tool call is
             * looked up here first, and in `params.tools` only when its name has no entry.
             */
            _BetaToolRunner_toolOverrides.set(this, new Map());
            /** Changes queued by `addTools()` / `removeTools()`, in call order, for the next request */
            _BetaToolRunner_pendingToolChanges.set(this, []);
            const { thread, settings } = '_state' in clientOrThread ?
                { thread: clientOrThread, settings: paramsOrSettings }
                : clientOrThread.beta.messages._toolRunnerThread(paramsOrSettings);
            rejectCompactionParam(thread._state.params);
            rejectRunToolsEagerlyWithoutStream(settings);
            __classPrivateFieldSet(this, _BetaToolRunner_thread, thread, "f");
            __classPrivateFieldSet(this, _BetaToolRunner_settings, definedEntries(settings), "f");
            const { tools, messages } = thread._state.params;
            const collected = collectStainlessHelpers(tools, messages);
            if (!('_state' in clientOrThread)) {
                // A copy, so that a message the caller edits later goes out as it was given. It comes after the helper marks are
                // collected, because it drops symbol-keyed properties. Not structuredClone(): it throws on a function, and a
                // runnable tool written by value into a `tool_addition` block has `run`.
                thread._state.setMessages(JSON.parse(JSON.stringify(withToolDefinitions(messages))));
            }
            __classPrivateFieldSet(this, _BetaToolRunner_options, { ...options }, "f");
            __classPrivateFieldSet(this, _BetaToolRunner_helperHeader, buildHeaders([
                helperHeader('BetaToolRunner'),
                collected.length ? { [STAINLESS_HELPER_HEADER]: collected.join(', ') } : undefined,
            ]), "f");
            __classPrivateFieldSet(this, _BetaToolRunner_completion, promiseWithResolvers(), "f");
        }
        async *[(_BetaToolRunner_consumed = new WeakMap(), _BetaToolRunner_mutated = new WeakMap(), _BetaToolRunner_thread = new WeakMap(), _BetaToolRunner_settings = new WeakMap(), _BetaToolRunner_options = new WeakMap(), _BetaToolRunner_helperHeader = new WeakMap(), _BetaToolRunner_messagesWithoutReply = new WeakMap(), _BetaToolRunner_message = new WeakMap(), _BetaToolRunner_stream = new WeakMap(), _BetaToolRunner_toolResponse = new WeakMap(), _BetaToolRunner_completion = new WeakMap(), _BetaToolRunner_iterationCount = new WeakMap(), _BetaToolRunner_toolRunnerOtelContext = new WeakMap(), _BetaToolRunner_compaction = new WeakMap(), _BetaToolRunner_calls = new WeakMap(), _BetaToolRunner_lastStopReason = new WeakMap(), _BetaToolRunner_toolOverrides = new WeakMap(), _BetaToolRunner_pendingToolChanges = new WeakMap(), _BetaToolRunner_instances = new WeakSet(), _BetaToolRunner_withToolRunnerSpan = function _BetaToolRunner_withToolRunnerSpan(fn) {
            if (!__classPrivateFieldGet(this, _BetaToolRunner_toolRunnerOtelContext, "f")) {
                return fn();
            }
            return context.with(__classPrivateFieldGet(this, _BetaToolRunner_toolRunnerOtelContext, "f"), fn);
        }, Symbol.asyncIterator)]() {
            var _a;
            if (__classPrivateFieldGet(this, _BetaToolRunner_consumed, "f")) {
                throw new AnthropicError('Cannot iterate over a consumed stream');
            }
            __classPrivateFieldSet(this, _BetaToolRunner_consumed, true, "f");
            __classPrivateFieldSet(this, _BetaToolRunner_mutated, true, "f");
            __classPrivateFieldSet(this, _BetaToolRunner_toolResponse, undefined, "f");
            const toolRunnerSpan = guardTracing(__classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._client, () => startToolRunnerSpan(__classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._client, this.params, __classPrivateFieldGet(this, _BetaToolRunner_options, "f").openTelemetry?.conversationId));
            __classPrivateFieldSet(this, _BetaToolRunner_toolRunnerOtelContext, toolRunnerSpan && trace.setSpan(context.active(), toolRunnerSpan), "f");
            try {
                while (true) {
                    try {
                        if (__classPrivateFieldGet(this, _BetaToolRunner_settings, "f").max_iterations && __classPrivateFieldGet(this, _BetaToolRunner_iterationCount, "f") >= __classPrivateFieldGet(this, _BetaToolRunner_settings, "f").max_iterations) {
                            break;
                        }
                        __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_flushPendingToolChanges).call(this);
                        // The API can't compact a conversation that ends mid-turn, so a paused turn is resumed first.
                        if (__classPrivateFieldGet(this, _BetaToolRunner_compaction, "f").status === 'scheduled' &&
                            determineNextStepFromStopReason(__classPrivateFieldGet(this, _BetaToolRunner_lastStopReason, "f")) !== 'resume') {
                            yield* __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_compact).call(this, __classPrivateFieldGet(this, _BetaToolRunner_compaction, "f").config);
                            continue;
                        }
                        __classPrivateFieldSet(this, _BetaToolRunner_mutated, false, "f");
                        __classPrivateFieldSet(this, _BetaToolRunner_toolResponse, undefined, "f");
                        __classPrivateFieldSet(this, _BetaToolRunner_iterationCount, (_a = __classPrivateFieldGet(this, _BetaToolRunner_iterationCount, "f"), _a++, _a), "f");
                        __classPrivateFieldSet(this, _BetaToolRunner_message, undefined, "f");
                        yield* __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_send).call(this, __classPrivateFieldGet(this, _BetaToolRunner_thread, "f"));
                        const callerMessages = __classPrivateFieldGet(this, _BetaToolRunner_messagesWithoutReply, "f");
                        __classPrivateFieldSet(this, _BetaToolRunner_messagesWithoutReply, undefined, "f");
                        const next = await __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_withToolRunnerSpan).call(this, async () => {
                            let toAnswer;
                            if (!__classPrivateFieldGet(this, _BetaToolRunner_mutated, "f")) {
                                const message = await __classPrivateFieldGet(this, _BetaToolRunner_message, "f");
                                const nextStep = determineNextStepFromStopReason(message.stop_reason);
                                __classPrivateFieldSet(this, _BetaToolRunner_lastStopReason, message.stop_reason, "f");
                                if (nextStep === 'stop') {
                                    return 'stop';
                                }
                                // On "resume" there is nothing to push: the thread already holds the unfinished reply.
                                if (nextStep === 'resume') {
                                    return 'continue';
                                }
                                toAnswer = lastAssistantMessage(__classPrivateFieldGet(this, _BetaToolRunner_thread, "f").messages);
                            }
                            else {
                                // The caller has taken over the history, so the last response no longer says how it ends.
                                __classPrivateFieldSet(this, _BetaToolRunner_lastStopReason, null, "f");
                                // The thread takes a new history once the turn has ended.
                                __classPrivateFieldGet(this, _BetaToolRunner_stream, "f")?.abort();
                                // Checked first, because a history without the reply starts a new thread, which would take the change.
                                __classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._state.checkNextTurn(turnParams(__classPrivateFieldGet(this, _BetaToolRunner_thread, "f")));
                                __classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._state.setMessages(callerMessages);
                                toAnswer = callerMessages.at(-1);
                            }
                            // No tool runs for a turn the thread refuses.
                            if (hasToolUse(toAnswer))
                                __classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._state.checkNextTurn(turnParams(__classPrivateFieldGet(this, _BetaToolRunner_thread, "f")));
                            const toolMessage = await __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_generateToolResponse).call(this, toAnswer, __classPrivateFieldGet(this, _BetaToolRunner_options, "f").signal, __classPrivateFieldGet(this, _BetaToolRunner_toolRunnerOtelContext, "f"));
                            if (toolMessage) {
                                // The API takes tool results only right after the calls they answer, ahead of what the caller added since.
                                const history = __classPrivateFieldGet(this, _BetaToolRunner_thread, "f").messages;
                                const answered = history.map((message) => message.role).lastIndexOf('assistant') + 1;
                                __classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._state.setMessages([
                                    ...history.slice(0, answered),
                                    toolMessage,
                                    ...history.slice(answered),
                                ]);
                            }
                            else if (!__classPrivateFieldGet(this, _BetaToolRunner_mutated, "f") && !__classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._state.hasTurnToSend) {
                                return 'stop';
                            }
                            return 'continue';
                        });
                        if (next === 'stop') {
                            yield* __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_compactAfterFinalTurn).call(this);
                            break;
                        }
                    }
                    finally {
                        __classPrivateFieldGet(this, _BetaToolRunner_stream, "f")?.abort();
                        __classPrivateFieldSet(this, _BetaToolRunner_stream, undefined, "f");
                    }
                }
                await __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_startedCallsSettled).call(this);
                if (!__classPrivateFieldGet(this, _BetaToolRunner_message, "f")) {
                    throw new AnthropicError('ToolRunner concluded without a message from the server');
                }
                __classPrivateFieldGet(this, _BetaToolRunner_completion, "f").resolve(await __classPrivateFieldGet(this, _BetaToolRunner_message, "f"));
                guardTracing(__classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._client, () => toolRunnerSpan?.setStatus({ code: SpanStatusCode.OK }));
            }
            catch (error) {
                if (toolRunnerSpan) {
                    guardTracing(__classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._client, () => setErrorStatus(toolRunnerSpan, error));
                }
                __classPrivateFieldSet(this, _BetaToolRunner_consumed, false, "f");
                __classPrivateFieldSet(this, _BetaToolRunner_messagesWithoutReply, undefined, "f");
                // Silence unhandled promise errors
                __classPrivateFieldGet(this, _BetaToolRunner_completion, "f").promise.catch(() => { });
                __classPrivateFieldGet(this, _BetaToolRunner_completion, "f").reject(error);
                __classPrivateFieldSet(this, _BetaToolRunner_completion, promiseWithResolvers(), "f");
                throw error;
            }
            finally {
                // Ends with no status when the application closed the iterator: a cancellation.
                guardTracing(__classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._client, () => toolRunnerSpan?.end());
                __classPrivateFieldSet(this, _BetaToolRunner_toolRunnerOtelContext, undefined, "f");
            }
        }
        setMessagesParams(paramsOrMutator) {
            const params = typeof paramsOrMutator === 'function' ? paramsOrMutator(this.params) : paramsOrMutator;
            rejectCompactionParam(params);
            if (__classPrivateFieldGet(this, _BetaToolRunner_compaction, "f").status !== 'idle') {
                rejectCompactionEdit(params);
            }
            // `params` holds a new `messages` array on every read, so an unchanged history is told by value.
            if (__classPrivateFieldGet(this, _BetaToolRunner_compaction, "f").status === 'in_flight' && !sameMessages(params.messages, __classPrivateFieldGet(this, _BetaToolRunner_thread, "f").messages)) {
                throw new AnthropicError(MESSAGES_CHANGED_WHILE_COMPACTING);
            }
            // `thread` only chooses threading when the runner is created, so a later `false` is ignored.
            const { settings, threadParams } = splitToolRunnerParams(params);
            rejectRunToolsEagerlyWithoutStream(settings);
            __classPrivateFieldSet(this, _BetaToolRunner_settings, definedEntries(settings), "f");
            if (__classPrivateFieldGet(this, _BetaToolRunner_messagesWithoutReply, "f")) {
                __classPrivateFieldSet(this, _BetaToolRunner_messagesWithoutReply, threadParams.messages, "f");
                __classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._state.setParams({ ...threadParams, messages: __classPrivateFieldGet(this, _BetaToolRunner_thread, "f").messages });
            }
            else {
                __classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._state.setParams(threadParams);
            }
            __classPrivateFieldSet(this, _BetaToolRunner_mutated, true, "f");
            // Invalidate cached tool response since parameters changed
            __classPrivateFieldSet(this, _BetaToolRunner_toolResponse, undefined, "f");
        }
        setRequestOptions(optionsOrMutator) {
            if (typeof optionsOrMutator === 'function') {
                __classPrivateFieldSet(this, _BetaToolRunner_options, optionsOrMutator(__classPrivateFieldGet(this, _BetaToolRunner_options, "f")), "f");
            }
            else {
                __classPrivateFieldSet(this, _BetaToolRunner_options, { ...__classPrivateFieldGet(this, _BetaToolRunner_options, "f"), ...optionsOrMutator }, "f");
            }
        }
        /**
         * Get the tool response for the last message from the assistant.
         * Avoids redundant tool executions by caching results. With `runToolsEagerly`, it reuses the calls of
         * the reply that have started and runs the rest, including the ones `deferToolCall()` is holding, so that no
         * call runs twice.
         *
         * @returns A promise that resolves to a BetaUserMessageParam containing tool results, or null if no tools need to be executed
         *
         * @example
         * const toolResponse = await runner.generateToolResponse();
         * if (toolResponse) {
         *   console.log('Tool results:', toolResponse.content);
         * }
         */
        async generateToolResponse(signal = __classPrivateFieldGet(this, _BetaToolRunner_options, "f").signal) {
            // Read before the first `await`: a context manager that does not follow promises has lost the
            // caller's context after it. Only a tool span has a use for it.
            const callerOtelContext = __classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._client._tracer ? context.active() : undefined;
            const message = (await __classPrivateFieldGet(this, _BetaToolRunner_message, "f")) ?? __classPrivateFieldGet(this, _BetaToolRunner_thread, "f").messages.at(-1);
            if (!message) {
                return null;
            }
            return __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_generateToolResponse).call(this, message, signal, callerOtelContext);
        }
        /**
         * Hold a tool call of the current reply until you are done with the reply, which is when it runs without
         * streaming: at the end of the loop body, or when you call `generateToolResponse()`.
         *
         * With `runToolsEagerly` the runner otherwise starts each call while the reply streams, as soon as
         * the model has moved on from it: when the next block starts, or the reply stops with `tool_use`. A call
         * never starts before your stream listeners and any `for await` over the stream have handled that event, so
         * you can call this from either once you have seen the call. The other calls of the reply still start early,
         * except the later calls of the same toolset, which a toolset runs in order.
         * It does nothing for a call that has started, outside the loop body, and without `runToolsEagerly`.
         *
         * @param toolUse - The `tool_use` block of the call, or its id
         *
         * @example
         * for await (const stream of runner) {
         *   stream.on('contentBlock', (block) => {
         *     if (block.type === 'tool_use' && block.name === 'delete_file') {
         *       runner.deferToolCall(block);
         *     }
         *   });
         *   await stream.finalMessage();
         *   // No `delete_file` call has started yet.
         * }
         */
        deferToolCall(toolUse) {
            const id = typeof toolUse === 'string' ? toolUse : toolUse.id;
            if (__classPrivateFieldGet(this, _BetaToolRunner_calls, "f") && !__classPrivateFieldGet(this, _BetaToolRunner_calls, "f").has(id)) {
                __classPrivateFieldGet(this, _BetaToolRunner_calls, "f").set(id, { status: 'held' });
            }
        }
        /**
         * The tool calls of the current reply that `deferToolCall()` is holding, in the model's order, as their
         * `tool_use` blocks. A call is in the list once its block has finished streaming, so read the list when you
         * are done with the stream. A call that has started is not in it. It is empty without
         * `runToolsEagerly`.
         *
         * Held calls are listed whatever the reply's `stop_reason`, because `generateToolResponse()` runs them
         * whatever it is. After `max_tokens` the input of the last call can be cut off.
         *
         * @example
         * for await (const stream of runner) {
         *   stream.on('contentBlock', (block) => {
         *     if (block.type === 'tool_use' && block.name === 'delete_file') {
         *       runner.deferToolCall(block);
         *     }
         *   });
         *   await stream.finalMessage();
         *
         *   const held = runner.deferredToolCalls;
         *   if (held.length > 0 && !(await confirm(held))) break;
         * }
         */
        get deferredToolCalls() {
            const stream = __classPrivateFieldGet(this, _BetaToolRunner_stream, "f");
            const calls = __classPrivateFieldGet(this, _BetaToolRunner_calls, "f");
            if (!(stream instanceof BetaToolRunnerStream) || !calls) {
                return [];
            }
            return stream.toolCalls.filter((toolUse) => calls.get(toolUse.id)?.status === 'held');
        }
        /**
         * Wait for the async iterator to complete. This works even if the async iterator hasn't yet started, and
         * will wait for an instance to start and go to completion.
         *
         * @returns A promise that resolves to the final BetaMessage when the iterator completes
         *
         * @example
         * // Start consuming the iterator
         * for await (const message of runner) {
         *   console.log('Message:', message.content);
         * }
         *
         * // Meanwhile, wait for completion from another part of the code
         * const finalMessage = await runner.done();
         * console.log('Final response:', finalMessage.content);
         */
        done() {
            return __classPrivateFieldGet(this, _BetaToolRunner_completion, "f").promise;
        }
        /**
         * Returns a promise indicating that the stream is done. Unlike .done(), this will eagerly read the stream:
         * * If the iterator has not been consumed, consume the entire iterator and return the final message from the
         * assistant.
         * * If the iterator has been consumed, waits for it to complete and returns the final message.
         *
         * @returns A promise that resolves to the final BetaMessage from the conversation
         * @throws {AnthropicError} If no messages were processed during the conversation
         *
         * @example
         * const finalMessage = await runner.runUntilDone();
         * console.log('Final response:', finalMessage.content);
         */
        async runUntilDone() {
            // If not yet consumed, start consuming and wait for completion
            if (!__classPrivateFieldGet(this, _BetaToolRunner_consumed, "f")) {
                for await (const _ of this) {
                    // Iterator naturally populates this.#message
                }
            }
            // If consumed but not completed, wait for completion
            return this.done();
        }
        /**
         * Get the current parameters being used by the ToolRunner.
         *
         * @returns A readonly view of the current ToolRunnerParams
         *
         * @example
         * const currentParams = runner.params;
         * console.log('Current model:', currentParams.model);
         * console.log('Message count:', currentParams.messages.length);
         */
        get params() {
            // `tools` is left out when the thread has none: an empty list is another value of `tools` than none, so
            // writing these params back would change the `tools` of the thread.
            return {
                ...__classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._state.params,
                ...(__classPrivateFieldGet(this, _BetaToolRunner_messagesWithoutReply, "f") && { messages: [...__classPrivateFieldGet(this, _BetaToolRunner_messagesWithoutReply, "f")] }),
                ...__classPrivateFieldGet(this, _BetaToolRunner_settings, "f"),
            };
        }
        /**
         * Add one or more messages to the conversation history.
         *
         * @param messages - One or more BetaMessageParam objects to add to the conversation
         *
         * @example
         * runner.pushMessages(
         *   { role: 'user', content: 'Also, what about the weather in NYC?' }
         * );
         *
         * @example
         * // Adding multiple messages
         * runner.pushMessages(
         *   { role: 'user', content: 'What about NYC?' },
         *   { role: 'user', content: 'And Boston?' }
         * );
         */
        pushMessages(...messages) {
            this.setMessagesParams((params) => ({
                ...params,
                messages: [...params.messages, ...messages],
            }));
        }
        /**
         * Schedule a compaction of the conversation. Once the current turn has finished, including any tool
         * calls, the runner requests a summary and replaces the message history with the compaction response,
         * which is yielded like any other message. Requires the `compact-2026-09-04` beta.
         *
         * @param compaction - The config to send, as `messages.create()` takes it. Defaults to `{ type: 'summarize' }`
         *
         * @example
         * for await (const message of runner) {
         *   if (message.usage.input_tokens > 100_000) {
         *     runner.compactBeforeNextTurn();
         *   }
         * }
         */
        compactBeforeNextTurn(compaction) {
            if (__classPrivateFieldGet(this, _BetaToolRunner_compaction, "f").status === 'in_flight') {
                return;
            }
            rejectCompactionEdit(this.params);
            __classPrivateFieldSet(this, _BetaToolRunner_compaction, { status: 'scheduled', config: compaction ?? { type: 'summarize' } }, "f");
        }
        /**
         * Give the model more tools without changing `params.tools`, which would miss the prompt cache.
         *
         * Each tool's whole definition is sent in a `tool_addition` block with the next request, and a
         * runnable tool replaces a runnable tool of the same name straight away, even for a call already in
         * the message being handled. A call that started while the reply streamed keeps the old one. A raw definition
         * is only sent: the runner never runs it, and stops running a tool of the same name. Passing a runnable toolset,
         * or a raw definition of a toolset the runner has, throws `ToolsetContractError` and adds nothing: a runner's
         * toolsets come only from `params.tools`. A tool named like one of its toolsets is left to the API, which rejects
         * it with the next request. Requires the `inline-tools-2026-09-15` beta, which the runner does not add for you.
         *
         * @param tools - Runnable tools (for example from `betaZodTool()`) or raw tool definitions
         *
         * @example
         * runner.addTools(queryDatabaseTool);
         */
        addTools(...tools) {
            const families = __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_toolsetFamilies).call(this);
            for (const tool of tools) {
                if (isRunnableToolset(tool)) {
                    throw new ToolsetContractError(`addTools() can't add the '${quotedName(toolsetFamily(tool))}' toolset: ${USE_A_NEW_RUNNER}`);
                }
                // The API treats a definition of one of the runner's families as replacing that toolset, which would leave the
                // model with a toolset the runner doesn't run.
                const family = definitionFamily(tool);
                if (families.has(family)) {
                    throw new ToolsetContractError(`addTools() can't replace the '${quotedName(family)}' toolset: ${USE_A_NEW_RUNNER}`);
                }
            }
            for (const tool of tools) {
                // A definition without a `name` (an `mcp_toolset`) is nothing the runner runs or stops running.
                if ('name' in tool) {
                    __classPrivateFieldGet(this, _BetaToolRunner_toolOverrides, "f").set(tool.name, 'run' in tool ? tool : null);
                }
                __classPrivateFieldGet(this, _BetaToolRunner_pendingToolChanges, "f").push({ type: 'addition', tool });
            }
        }
        /**
         * Take tools away from the model without changing `params.tools`, which would miss the prompt cache.
         *
         * The tools stop being run straight away: a call to one of them, even one in the message being
         * handled, gets the same "not found" error result as a call to an unknown tool. A call that started while the
         * reply streamed finishes as usual. The model is told in a `tool_removal` block with the next request. Use
         * {@link addTools} to bring a tool back. Passing the name of one of the runner's toolsets throws
         * `ToolsetContractError` and removes nothing. Requires the `inline-tools-2026-09-15` beta, which the runner does
         * not add for you.
         *
         * @param tools - The tools to remove, or their names
         *
         * @example
         * runner.removeTools('query_database');
         */
        removeTools(...tools) {
            const families = __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_toolsetFamilies).call(this);
            for (const tool of tools) {
                // A toolset's name is always its own: the API rejects any other tool of that name.
                const name = typeof tool === 'string' ? tool : tool.name;
                if (families.has(name)) {
                    throw new ToolsetContractError(`removeTools() can't remove the '${quotedName(name)}' toolset: ${REMOVE_WITH_A_NEW_RUNNER}`);
                }
            }
            for (const tool of tools) {
                const name = typeof tool === 'string' ? tool : tool.name;
                __classPrivateFieldGet(this, _BetaToolRunner_toolOverrides, "f").set(name, null);
                __classPrivateFieldGet(this, _BetaToolRunner_pendingToolChanges, "f").push({ type: 'removal', name });
            }
        }
        /**
         * Makes the ToolRunner directly awaitable, equivalent to calling .runUntilDone()
         * This allows using `await runner` instead of `await runner.runUntilDone()`
         */
        then(onfulfilled, onrejected) {
            return this.runUntilDone().then(onfulfilled, onrejected);
        }
    }
    _BetaToolRunner_send = 
    /**
     * Sends the next turn of `thread` and yields its message, or its stream when streaming. `#message` and `#stream` are set
     * before the yield, so they are there while the caller handles the item; the loop aborts the stream at the
     * end of the iteration.
     */
    async function* _BetaToolRunner_send(thread) {
        await __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_startedCallsSettled).call(this);
        __classPrivateFieldSet(this, _BetaToolRunner_calls, undefined, "f");
        // A turn can't override the history, so a `tool_addition` block holding a runnable tool is rewritten in the thread's
        // history to hold only the tool's API fields.
        const messages = thread.messages;
        if (messages.some(addsRunnableTool)) {
            __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_withToolRunnerSpan).call(this, () => thread._state.setMessages(withToolDefinitions(messages)));
        }
        // A thread takes the `tools` of the turn that creates it as its own unless they are set during the turn, so the
        // runnable tools are set again.
        const { tools } = thread._state.params;
        if (__classPrivateFieldGet(this, _BetaToolRunner_settings, "f").stream) {
            __classPrivateFieldSet(this, _BetaToolRunner_stream, __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_withToolRunnerSpan).call(this, () => __classPrivateFieldGet(this, _BetaToolRunner_settings, "f").runToolsEagerly ?
                __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_streamThatStartsTools).call(this, thread)
                : thread.stream(undefined, turnParams(thread), __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_turnOptions).call(this, thread))), "f");
            if (tools)
                thread.update({ tools });
            if (thread === __classPrivateFieldGet(this, _BetaToolRunner_thread, "f"))
                __classPrivateFieldSet(this, _BetaToolRunner_messagesWithoutReply, thread.messages, "f");
            __classPrivateFieldSet(this, _BetaToolRunner_message, __classPrivateFieldGet(this, _BetaToolRunner_stream, "f").finalMessage(), "f");
            // Make sure that this promise doesn't throw before we get the option to do something about it.
            // Error will be caught when we call await this.#message ultimately
            __classPrivateFieldGet(this, _BetaToolRunner_message, "f").catch(() => { });
            yield __classPrivateFieldGet(this, _BetaToolRunner_stream, "f");
        }
        else {
            __classPrivateFieldSet(this, _BetaToolRunner_message, __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_withToolRunnerSpan).call(this, () => thread.send(undefined, turnParams(thread), __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_turnOptions).call(this, thread))), "f");
            if (tools)
                thread.update({ tools });
            if (thread === __classPrivateFieldGet(this, _BetaToolRunner_thread, "f"))
                __classPrivateFieldSet(this, _BetaToolRunner_messagesWithoutReply, thread.messages, "f");
            yield __classPrivateFieldGet(this, _BetaToolRunner_message, "f");
        }
    }, _BetaToolRunner_turnOptions = function _BetaToolRunner_turnOptions(thread) {
        const { headers = thread._state.options.headers } = __classPrivateFieldGet(this, _BetaToolRunner_options, "f");
        return { ...__classPrivateFieldGet(this, _BetaToolRunner_options, "f"), headers: buildHeaders([__classPrivateFieldGet(this, _BetaToolRunner_helperHeader, "f"), headers]) };
    }, _BetaToolRunner_streamThatStartsTools = function _BetaToolRunner_streamThatStartsTools(thread) {
        const calls = new Map();
        __classPrivateFieldSet(this, _BetaToolRunner_calls, calls, "f");
        // A toolset runs its calls one at a time, in the model's order. So a toolset's call starts here only while the
        // toolset is idle, and once one of its calls waits for the reply or fails, its later calls wait for the reply too.
        const toolsets = new Map();
        const onToolCall = (toolUse) => {
            // Held, or started by `generateToolResponse()` before a reader that is behind got to the call.
            const known = calls.has(toolUse.id);
            // A call named after a toolset is a toolset call with malformed actions, which `generateToolResponse()` answers.
            const malformed = !toolUse.toolset_name && __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_toolsetFamilies).call(this).has(toolUse.name);
            const family = malformed ? toolUse.name : toolUse.toolset_name;
            if (family) {
                if (known || malformed || toolsets.has(family)) {
                    toolsets.set(family, 'waiting');
                    return;
                }
                toolsets.set(family, 'running');
                const result = runToolsetCall(__classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_toolsetParams).call(this), family, toolUse, __classPrivateFieldGet(this, _BetaToolRunner_options, "f"), __classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._client, __classPrivateFieldGet(this, _BetaToolRunner_toolRunnerOtelContext, "f"));
                calls.set(toolUse.id, { status: 'started', result });
                result.then(({ is_error }) => {
                    if (is_error || toolsets.get(family) === 'waiting')
                        toolsets.set(family, 'waiting');
                    else
                        toolsets.delete(family);
                }, () => toolsets.set(family, 'waiting'));
                return;
            }
            if (known) {
                return;
            }
            // The call looks its tool up now, so a later `addTools()` or `removeTools()` doesn't change it.
            const result = runToolCall(__classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_runnableTools).call(this), __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_availableToolNames).call(this), toolUse, __classPrivateFieldGet(this, _BetaToolRunner_options, "f"), __classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._client, __classPrivateFieldGet(this, _BetaToolRunner_toolRunnerOtelContext, "f"));
            // Marks a rejection as handled until the results are collected.
            result.catch(() => { });
            calls.set(toolUse.id, { status: 'started', result });
        };
        const stream = new BetaToolRunnerStream(thread._state.params, onToolCall, thread._client);
        thread._stream(stream, undefined, turnParams(thread), __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_turnOptions).call(this, thread));
        return stream;
    }, _BetaToolRunner_startedCallsSettled = 
    /** Waits for the calls of the last streamed reply that have started, whether or not their results were sent. */
    async function _BetaToolRunner_startedCallsSettled() {
        const started = [...(__classPrivateFieldGet(this, _BetaToolRunner_calls, "f")?.values() ?? [])].filter((call) => call.status === 'started');
        await Promise.allSettled(started.map((call) => call.result));
    }, _BetaToolRunner_compact = async function* _BetaToolRunner_compact(compaction) {
        rejectCompactionEdit(this.params);
        __classPrivateFieldSet(this, _BetaToolRunner_compaction, { status: 'in_flight' }, "f");
        __classPrivateFieldSet(this, _BetaToolRunner_toolResponse, undefined, "f");
        const lastMessage = __classPrivateFieldGet(this, _BetaToolRunner_message, "f");
        const thread = __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_compactionThread).call(this, compaction);
        const summarized = __classPrivateFieldGet(this, _BetaToolRunner_thread, "f").messages.length;
        try {
            yield* __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_send).call(this, thread);
            const message = await __classPrivateFieldGet(this, _BetaToolRunner_message, "f");
            if (message.content.some((block) => block.type === 'compaction' && block.content)) {
                __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_recordRemovalsFromHistory).call(this);
                // The response has to be sent back as it came, first, replacing the messages it summarizes.
                const response = { role: message.role, content: message.content };
                // Appending a reply the thread already holds is a no-op, so a copy the caller appended is left out.
                const appended = __classPrivateFieldGet(this, _BetaToolRunner_thread, "f").messages.slice(summarized).filter((m) => !sameMessage(m, response));
                __classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._state.setMessages([response, ...appended]);
            }
            else {
                loggerFor(__classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._client).warn('Compaction produced no summary; keeping the conversation as it is.');
                // If the run ends here, `done()` resolves to the last real message rather than this response.
                __classPrivateFieldSet(this, _BetaToolRunner_message, lastMessage, "f");
            }
        }
        finally {
            __classPrivateFieldSet(this, _BetaToolRunner_compaction, { status: 'idle' }, "f");
            // The request after a compaction the server could not thread goes without a thread from the start.
            if (!thread._state.threading)
                __classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._state.stopThreading();
        }
    }, _BetaToolRunner_compactionThread = function _BetaToolRunner_compactionThread(compaction) {
        const { messages, ...fields } = withoutCompactionIncompatibleParams(__classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._state.params);
        const thread = __classPrivateFieldGet(this, _BetaToolRunner_thread, "f").fork();
        thread._state = __classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._state.fork({ ...fields, compaction });
        return thread;
    }, _BetaToolRunner_runnableTools = function _BetaToolRunner_runnableTools() {
        const runnable = new Map();
        for (const tool of __classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._state.params.tools ?? []) {
            if ('run' in tool && 'name' in tool) {
                runnable.set(tool.name, tool);
            }
        }
        for (const [name, tool] of __classPrivateFieldGet(this, _BetaToolRunner_toolOverrides, "f")) {
            if (tool) {
                runnable.set(name, tool);
            }
            else {
                runnable.delete(name);
            }
        }
        return runnable;
    }, _BetaToolRunner_availableToolNames = function _BetaToolRunner_availableToolNames() {
        const available = new Set(__classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_runnableTools).call(this).keys());
        for (const message of [...this.params.messages, __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_pendingToolChangesMessage).call(this)]) {
            if (!Array.isArray(message.content)) {
                continue;
            }
            for (const block of message.content) {
                if (message.role === 'system') {
                    applyToolChange(block, available);
                }
                else if (message.role === 'assistant' && block.type === 'compaction') {
                    // A compaction block's tool_changes stand in for the system messages of the turns it summarized.
                    for (const change of block.tool_changes ?? []) {
                        applyToolChange(change, available);
                    }
                }
            }
        }
        return available;
    }, _BetaToolRunner_recordRemovalsFromHistory = function _BetaToolRunner_recordRemovalsFromHistory() {
        const available = __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_availableToolNames).call(this);
        for (const name of __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_runnableTools).call(this).keys()) {
            if (!available.has(name)) {
                __classPrivateFieldGet(this, _BetaToolRunner_toolOverrides, "f").set(name, null);
            }
        }
    }, _BetaToolRunner_compactAfterFinalTurn = async function* _BetaToolRunner_compactAfterFinalTurn() {
        if (__classPrivateFieldGet(this, _BetaToolRunner_compaction, "f").status !== 'scheduled') {
            return;
        }
        if (hasToolUse(__classPrivateFieldGet(this, _BetaToolRunner_thread, "f").messages.at(-1))) {
            // A turn that was cut short can end with tool calls that are never run, and the API can't
            // compact a conversation whose last turn has an unanswered tool call.
            loggerFor(__classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._client).warn('The pending compaction was skipped because the last turn ended with tool calls that were not run. ' +
                'Call `compactBeforeNextTurn()` again if you continue the conversation.');
            __classPrivateFieldSet(this, _BetaToolRunner_compaction, { status: 'idle' }, "f");
            return;
        }
        yield* __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_compact).call(this, __classPrivateFieldGet(this, _BetaToolRunner_compaction, "f").config);
    }, _BetaToolRunner_generateToolResponse = async function _BetaToolRunner_generateToolResponse(lastMessage, signal, toolOtelContext) {
        if (__classPrivateFieldGet(this, _BetaToolRunner_toolResponse, "f") !== undefined) {
            return __classPrivateFieldGet(this, _BetaToolRunner_toolResponse, "f");
        }
        __classPrivateFieldSet(this, _BetaToolRunner_toolResponse, generateToolResponse(__classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_toolsetParams).call(this), __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_runnableTools).call(this), __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_availableToolNames).call(this), lastMessage, { ...__classPrivateFieldGet(this, _BetaToolRunner_options, "f"), signal }, __classPrivateFieldGet(this, _BetaToolRunner_calls, "f"), __classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._client, toolOtelContext), "f");
        return __classPrivateFieldGet(this, _BetaToolRunner_toolResponse, "f");
    }, _BetaToolRunner_toolsetFamilies = function _BetaToolRunner_toolsetFamilies() {
        return new Set(__classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_toolsetParams).call(this).tools.filter(isRunnableToolset).map(toolsetFamily));
    }, _BetaToolRunner_toolsetParams = function _BetaToolRunner_toolsetParams() {
        return { ...this.params, tools: __classPrivateFieldGet(this, _BetaToolRunner_thread, "f")._state.params.tools ?? [] };
    }, _BetaToolRunner_flushPendingToolChanges = function _BetaToolRunner_flushPendingToolChanges() {
        // A paused turn has to go back as the last message, so the changes wait for the request after it.
        if (__classPrivateFieldGet(this, _BetaToolRunner_lastStopReason, "f") === 'pause_turn' || __classPrivateFieldGet(this, _BetaToolRunner_pendingToolChanges, "f").length === 0) {
            return;
        }
        // Staged on the thread directly: this runner's pushMessages() is the caller's, and marks the params as changed by them.
        __classPrivateFieldGet(this, _BetaToolRunner_thread, "f").append(__classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_pendingToolChangesMessage).call(this));
        __classPrivateFieldSet(this, _BetaToolRunner_pendingToolChanges, [], "f");
    }, _BetaToolRunner_pendingToolChangesMessage = function _BetaToolRunner_pendingToolChangesMessage() {
        const content = [];
        for (const change of __classPrivateFieldGet(this, _BetaToolRunner_pendingToolChanges, "f")) {
            if (change.type === 'removal') {
                content.push({ type: 'tool_removal', tool: { type: 'tool_reference', name: change.name } });
                continue;
            }
            const definition = toolDefinition(change.tool);
            content.push({ type: 'tool_addition', tool: { type: 'tool_definition', definition } });
        }
        return { role: 'system', content };
    };
    return BetaToolRunner;
})();
const MESSAGES_CHANGED_WHILE_COMPACTING = "Message params can't be changed while the conversation is being compacted, because the compaction " +
    'response is about to replace them. Change them after this iteration instead.';
function sameMessages(a, b) {
    return a.length === b.length && a.every((message, i) => sameMessage(message, b[i]));
}
function rejectCompactionParam(params) {
    if ('compaction' in params && params.compaction != null) {
        throw new AnthropicError('`compaction` cannot be set on a tool runner: every request in the loop would compact again. ' +
            'Call `runner.compactBeforeNextTurn()` when the conversation should be compacted instead.');
    }
}
function rejectRunToolsEagerlyWithoutStream(settings) {
    if (settings.runToolsEagerly && !settings.stream) {
        throw new TypeError("`runToolsEagerly: true` needs `stream: true` in the tool runner's params, because a reply that " +
            "isn't streamed arrives whole.");
    }
}
function rejectCompactionEdit(params) {
    // The compaction request is sent without `context_management`, so the API can't refuse the pair there:
    // it would run and bill the compaction, then refuse the next request.
    if (params.context_management?.edits?.some((edit) => edit.type.startsWith('compact_'))) {
        throw new AnthropicError("`compactBeforeNextTurn()` can't be used while `context_management` has a compaction edit, " +
            "because the API doesn't accept a compaction block together with one. Remove the edit first.");
    }
}
/**
 * A compaction request returns only the compaction block, never a reply, so the API rejects the params that
 * only shape a reply. The runner's later requests keep them.
 */
function withoutCompactionIncompatibleParams(params) {
    const { context_management, stop_sequences, output_format, ...kept } = params;
    const withoutFormat = ({ format, ...outputConfig }) => outputConfig;
    if (kept.tool_choice?.type === 'any' || kept.tool_choice?.type === 'tool') {
        delete kept.tool_choice;
    }
    if (kept.output_config) {
        kept.output_config = withoutFormat(kept.output_config);
    }
    if (Array.isArray(kept.fallbacks)) {
        kept.fallbacks = kept.fallbacks.map((fallback) => fallback.output_config ?
            { ...fallback, output_config: withoutFormat(fallback.output_config) }
            : fallback);
    }
    return kept;
}
function toolDefinition(tool) {
    if (!('run' in tool)) {
        return tool;
    }
    const apiKeys = BETA_CLIENT_TOOL_UNION_KEYS;
    const fields = 'toJSON' in tool && typeof tool.toJSON === 'function' ? tool.toJSON() : tool;
    return {
        ...Object.fromEntries(Object.entries(fields).filter(([key]) => apiKeys.includes(key))),
        ...(wasCreatedByStainlessHelper(tool) && { [SDK_HELPER_SYMBOL]: tool[SDK_HELPER_SYMBOL] }),
    };
}
/**
 * What every turn of `thread` overrides: `tools` with only each runnable tool's API fields (see `toolDefinition()`), not
 * its functions or other properties such as a class's own state. The thread's own `tools` keeps the runnable tools,
 * which the loop calls.
 */
function turnParams(thread) {
    const { tools } = thread._state.params;
    return tools ? { tools: tools.map(toolDefinition) } : {};
}
function withToolDefinitions(messages) {
    return messages.map((message) => {
        if (message.role !== 'system' || !Array.isArray(message.content)) {
            return message;
        }
        const content = message.content.map((block) => block.type === 'tool_addition' && block.tool.type === 'tool_definition' ?
            { ...block, tool: { ...block.tool, definition: toolDefinition(block.tool.definition) } }
            : block);
        return { ...message, content };
    });
}
/**
 * Whether `message` has a `tool_addition` block holding a runnable tool: the only kind of block
 * `withToolDefinitions()` changes.
 */
function addsRunnableTool(message) {
    return (message.role === 'system' &&
        Array.isArray(message.content) &&
        message.content.some((block) => block.type === 'tool_addition' &&
            block.tool.type === 'tool_definition' &&
            'run' in block.tool.definition));
}
async function generateToolResponse(params, runnable, available, lastMessage, requestOptions, calls, client, toolOtelContext) {
    // Only process if the last message is from the assistant and has tool use blocks
    if (!lastMessage ||
        lastMessage.role !== 'assistant' ||
        !lastMessage.content ||
        typeof lastMessage.content === 'string') {
        return null;
    }
    const toolUseBlocks = lastMessage.content.filter((content) => content.type === 'tool_use');
    if (toolUseBlocks.length === 0) {
        return null;
    }
    // A toolset's members run one at a time in the order the model wrote them, and once one is answered with is_error
    // the rest of that toolset's members in this turn are not run (notExecutedText). Function tools run alongside them
    // and neither wait on nor stop a toolset's members.
    const sequences = new Map();
    const toolResults = await Promise.all(toolUseBlocks.map(async (toolUse) => {
        // The call may have started while the reply streamed, or in an earlier `generateToolResponse()`.
        const call = calls?.get(toolUse.id);
        const started = call?.status === 'started' ? call.result : undefined;
        // Members dispatch by family, never by name: a custom tool may share the bare `name`.
        if (toolUse.toolset_name) {
            const family = toolUse.toolset_name;
            const sequence = sequences.get(family) ?? { tail: Promise.resolve(), failed: false };
            sequences.set(family, sequence);
            const registered = params.tools.some((t) => isRunnableToolset(t) && toolsetFamily(t) === family);
            const run = started ??
                sequence.tail.then(() => sequence.failed ?
                    toolsetResultBlock(toolUse, notExecutedText(family), true)
                    : runToolsetCall(params, family, toolUse, requestOptions, client, toolOtelContext));
            // A rejection (a usage error) propagates through Promise.all and stops the run. It also stops this toolset's
            // later members here, which would otherwise still be dispatched after the run has failed.
            sequence.tail = run.then(({ is_error }) => {
                if (is_error && registered)
                    sequence.failed = true;
            }, () => {
                sequence.failed = true;
            });
            calls?.set(toolUse.id, { status: 'started', result: run });
            return run;
        }
        if (started) {
            return started;
        }
        // A `tool_removal` is only a hint to the model, which may still emit a tool_use for a
        // withdrawn tool — treat those exactly like a tool that was never defined.
        const tool = available.has(toolUse.name) ? runnable.get(toolUse.name) : undefined;
        if (!tool && params.tools.some((t) => isRunnableToolset(t) && toolsetFamily(t) === toolUse.name)) {
            // A call named after a toolset in the run, but with no `toolset_name`, is a toolset call with malformed
            // actions. It fails like one of the toolset's calls, so the toolset's later calls in this turn are not run.
            const sequence = sequences.get(toolUse.name) ?? { tail: Promise.resolve(), failed: false };
            sequences.set(toolUse.name, sequence);
            sequence.tail = sequence.tail.then(() => {
                sequence.failed = true;
            });
            return malformedToolsetCallResult(toolUse);
        }
        const result = runToolCall(runnable, available, toolUse, requestOptions, client, toolOtelContext);
        calls?.set(toolUse.id, { status: 'started', result });
        return result;
    }));
    return {
        role: 'user',
        content: toolResults,
    };
}
/** Runs a toolset's call with the toolset of its family in the run. */
async function runToolsetCall(params, family, toolUse, requestOptions, client, toolOtelContext) {
    const toolset = params.tools.find((t) => isRunnableToolset(t) && toolsetFamily(t) === family);
    if (!toolset) {
        return toolsetResultBlock(toolUse, `Error: Toolset '${quotedName(family)}' member '${quotedName(toolUse.name)}' not found`, true);
    }
    const spanOptions = {
        signal: requestOptions?.signal,
        conversationId: requestOptions?.openTelemetry?.conversationId,
        parentContext: toolOtelContext,
    };
    const outcome = await withToolUseSpan(client, toolset, toolUse, spanOptions, async () => {
        const block = await runToolsetMember(toolset, toolUse, { signal: requestOptions?.signal });
        return { block, content: block.content ?? [], isError: block.is_error === true };
    });
    return outcome.block;
}
async function runToolCall(runnable, available, toolUse, requestOptions, client, toolOtelContext) {
    // A `tool_removal` is only a hint to the model, which may still emit a tool_use for a
    // withdrawn tool — treat those exactly like a tool that was never defined.
    const tool = available.has(toolUse.name) ? runnable.get(toolUse.name) : undefined;
    if (!tool) {
        return toolNotFoundResult(toolUse);
    }
    const spanOptions = {
        signal: requestOptions?.signal,
        conversationId: requestOptions?.openTelemetry?.conversationId,
        parentContext: toolOtelContext,
    };
    const outcome = await withToolUseSpan(client, tool, toolUse, spanOptions, () => runRunnableTool(tool, toolUse.input, {
        toolUse,
        toolUseBlock: toolUse,
        signal: requestOptions?.signal,
    }));
    return {
        type: 'tool_result',
        tool_use_id: toolUse.id,
        content: outcome.content,
        ...(outcome.isError ? { is_error: true } : undefined),
    };
}
/** The assistant turn the loop answers next: the last one in the history, unless `tool_result`s already follow it. */
function lastAssistantMessage(messages) {
    for (let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i];
        if (message.role === 'assistant')
            return message;
        if (message.role === 'user' &&
            Array.isArray(message.content) &&
            message.content.some((block) => block.type === 'tool_result')) {
            return undefined;
        }
    }
    return undefined;
}
function hasToolUse(message) {
    return Array.isArray(message?.content) && message.content.some((block) => block.type === 'tool_use');
}
/**
 * A definition's family, as the API computes it for a toolset: its type without the date, and without `_toolset`.
 * So a later `browser_toolset_*` version is the browser family, and `computer_20250124` the computer family.
 */
function definitionFamily(tool) {
    return (tool.type ?? 'custom').replace(/_\d{8}$/, '').replace(/_toolset$/, '');
}
function toolNotFoundResult(toolUse) {
    return {
        type: 'tool_result',
        tool_use_id: toolUse.id,
        content: `Error: Tool '${toolUse.name}' not found`,
        is_error: true,
    };
}
/** The error for a toolset call with malformed actions. None of its actions run. */
function malformedToolsetCallResult(toolUse) {
    return {
        type: 'tool_result',
        tool_use_id: toolUse.id,
        content: `Error: the '${quotedName(toolUse.name)}' toolset could not run this call${malformedActions(toolUse.input)}; nothing in the batch was executed`,
        is_error: true,
    };
}
/** What is wrong with the call's `actions`. It quotes action names but no other part of the input. */
function malformedActions(input) {
    const fields = typeof input === 'object' && input !== null ? input : {};
    if (!('actions' in fields)) {
        const action = 'action' in fields ? fields.action : undefined;
        return typeof action === 'string' ?
            `: the call has no 'actions' list (action: '${quotedName(action)}')`
            : ": the call has no 'actions' list";
    }
    const { actions } = fields;
    if (typeof actions === 'string')
        return ": 'actions' is text, not a list of actions";
    if (!Array.isArray(actions))
        return ": 'actions' is not a list of actions";
    if (actions.length === 0)
        return ": the 'actions' list is empty";
    const names = [];
    for (const [i, entry] of actions.entries()) {
        const action = typeof entry === 'object' && entry !== null && 'action' in entry ? entry.action : undefined;
        if (typeof action !== 'string')
            return `: action ${i} must be an object with a string 'action' field`;
        names.push(`'${quotedName(action)}'`);
    }
    const more = names.length > 10 ? `, and ${names.length - 10} more` : '';
    return `: its actions could not be run as sent (actions: ${names.slice(0, 10).join(', ')}${more})`;
}
function applyToolChange(block, available) {
    switch (block.type) {
        case 'tool_removal':
        case 'tool_addition':
            applyToolReference(block, available);
            break;
    }
}
function applyToolReference(block, available) {
    const name = changedToolName(block.tool);
    if (name === undefined)
        return;
    if (block.type === 'tool_removal') {
        available.delete(name);
    }
    else {
        available.add(name);
    }
}
function changedToolName(tool) {
    switch (tool.type) {
        case 'tool_reference':
            return tool.name;
        case 'tool_definition':
            // Not every `tools[]` entry has a `name` (e.g. `mcp_toolset`); those are never locally runnable.
            return 'name' in tool.definition ? tool.definition.name : undefined;
        default:
            // mcp_tool_reference / mcp_toolset_reference run server-side; unknown types are ignored
            // rather than rejected.
            return undefined;
    }
}
/**
 * Sorts every stop reason into one of three buckets: `run_tools` turns run their client tool
 * calls and continue the loop; `resume` turns are sent back unchanged so the server continues
 * them; `stop` turns end the loop without running any tool calls.
 */
function determineNextStepFromStopReason(stopReason) {
    if (stopReason === null)
        return 'stop';
    if (isUnfinishedStopReason(stopReason))
        return 'resume';
    switch (stopReason) {
        case 'tool_use':
            return 'run_tools';
        case 'end_turn':
        case 'stop_sequence':
        case 'max_tokens':
        case 'model_context_window_exceeded':
        case 'refusal':
            return 'stop';
        default:
            // The union is forward-compatible, so a stop reason this SDK doesn't know yet ends the
            // loop rather than throwing; the `never` check makes tsc reject an unclassified member.
            checkNever(stopReason);
            return 'stop';
    }
}
//# sourceMappingURL=BetaToolRunner.mjs.map