var _BetaAbstractComputerToolset20260801_instances, _BetaAbstractComputerToolset20260801_options, _BetaAbstractComputerToolset20260801_queue, _BetaAbstractComputerToolset20260801_closed, _BetaAbstractComputerToolset20260801_run, _BetaAbstractComputerToolset20260801_confirm;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "../../../internal/tslib.mjs";
import { ToolsetClosedError, } from "../../../lib/tools/BetaRunnableToolset.mjs";
import { classify, throwIfAborted, runToolsetMember } from "../../../lib/internal/toolsets/run.mjs";
import { ToolError } from "../../../lib/tools/ToolError.mjs";
import { CallQueue, MemberCall, checkedError, confirmOrThrow, dispatchMember, isEnabled, resolveMember, resolveToolsetOptions, wireAsyncDispose, } from "../../../lib/internal/toolsets/core.mjs";
import { COMPUTER_CONFIRM_REQUIRED, COMPUTER_FAMILY, COMPUTER_REGISTRY, COMPUTER_TOOLSET_TYPE, parseComputerInput, typedComputerResult, } from "../../../lib/internal/toolsets/computer-members.mjs";
import { ToolsetConfigError, UnavailableMemberError } from "../../../lib/internal/toolsets/errors.mjs";
import { renderResult } from "../../../lib/internal/toolsets/render.mjs";
import { SDK_HELPER_SYMBOL, } from "../../../internal/stainless-helper-header.mjs";
/**
 * The computer toolset for `computer_toolset_20260801`.
 *
 * Subclass it and override the members your desktop supports. Each takes `(ctx, input)` and returns the result type
 * in its signature.
 *
 * A pure action (a click, a key, scrolling) returns nothing, or one line of text the model reads in a text block of
 * its own after the SDK's fixed acknowledgment.
 *
 * Coordinates arrive in screenshot pixels. Scaling to and from the display is the driver's.
 *
 * See the computer use tool documentation
 * (https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool) and read "Running a computer
 * toolset safely" in the SDK guide (`computer-toolset.md`) before deploying one.
 */
export var BetaAbstractComputerToolset20260801 = /* @__PURE__ */ (() => {
    /**
     * The computer toolset for `computer_toolset_20260801`.
     *
     * Subclass it and override the members your desktop supports. Each takes `(ctx, input)` and returns the result type
     * in its signature.
     *
     * A pure action (a click, a key, scrolling) returns nothing, or one line of text the model reads in a text block of
     * its own after the SDK's fixed acknowledgment.
     *
     * Coordinates arrive in screenshot pixels. Scaling to and from the display is the driver's.
     *
     * See the computer use tool documentation
     * (https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool) and read "Running a computer
     * toolset safely" in the SDK guide (`computer-toolset.md`) before deploying one.
     */
    class BetaAbstractComputerToolset20260801 {
        constructor(options = {}) {
            _BetaAbstractComputerToolset20260801_instances.add(this);
            this.type = COMPUTER_TOOLSET_TYPE;
            /** The API sets `tool_use.toolset_name` to this value on every call to this toolset. */
            this.toolsetName = COMPUTER_FAMILY;
            /** Private, so spreading or serialising a toolset never copies the callbacks. */
            _BetaAbstractComputerToolset20260801_options.set(this, void 0);
            /** Every top-level call queues here: calls run one at a time, in arrival order. */
            _BetaAbstractComputerToolset20260801_queue.set(this, new CallQueue());
            /** Set by `close()`: a run that arrives afterwards throws `ToolsetClosedError`. */
            _BetaAbstractComputerToolset20260801_closed.set(this, false);
            this[SDK_HELPER_SYMBOL] = 'computer-toolset';
            wireAsyncDispose(BetaAbstractComputerToolset20260801.prototype);
            const resolved = resolveToolsetOptions(COMPUTER_REGISTRY, this, BetaAbstractComputerToolset20260801.prototype, options);
            const required = [...COMPUTER_CONFIRM_REQUIRED]
                .filter((n) => isEnabled(n, resolved.wireConfigs, COMPUTER_REGISTRY.defaultDisabled))
                .sort();
            if (required.length && resolved.confirm === undefined) {
                throw new ToolsetConfigError(`${JSON.stringify(required)} requires a confirm callable: pass confirm: <callable>, or disable it in configs`);
            }
            __classPrivateFieldSet(this, _BetaAbstractComputerToolset20260801_options, resolved, "f");
        }
        /**
         * The wire `configs`: the caller's, plus `enabled: false` for every member this class does not serve; `null` when
         * the entry carries none. Frozen and read-only (`toolset.configs = …` throws): it is what the dispatch gate reads
         * and what `toJSON()` copies.
         */
        get configs() {
            return __classPrivateFieldGet(this, _BetaAbstractComputerToolset20260801_options, "f").wireConfigs ?? null;
        }
        /**
         * The tool runner and `toolResult` call this to run the member `toolUse.name` through the pipeline. It returns the
         * `tool_result` content, or throws a `ToolError` for a refusal or failure, with the blocks as they were thrown. It
         * is not an extension point. Override `execute` or a member method instead.
         */
        run(ctx, toolUse) {
            if (__classPrivateFieldGet(this, _BetaAbstractComputerToolset20260801_closed, "f"))
                throw new ToolsetClosedError(`this '${COMPUTER_FAMILY}' toolset is closed`);
            const call = new MemberCall(ctx, toolUse.name, toolUse.input);
            return __classPrivateFieldGet(this, _BetaAbstractComputerToolset20260801_queue, "f").enqueue(ctx.signal, () => __classPrivateFieldGet(this, _BetaAbstractComputerToolset20260801_instances, "m", _BetaAbstractComputerToolset20260801_run).call(this, call));
        }
        /**
         * Answer one member `tool_use` for a hand-written loop: runs it through the same pipeline as the
         * tool runner and returns the `tool_result` block, `toolset_name` and `is_error` set. It never
         * throws a `ToolError`; a `ToolsetUsageError` still propagates.
         */
        toolResult(toolUse) {
            return runToolsetMember(this, toolUse);
        }
        /**
         * The `tools[]` entry: your `toolConfigs` fields, the type, and the wire `configs`. A fresh deep copy each call, so
         * nothing you do to it changes the toolset; subclass state (a display connection, counters) never reaches the
         * request.
         */
        toJSON() {
            const { toolConfigs, wireConfigs } = __classPrivateFieldGet(this, _BetaAbstractComputerToolset20260801_options, "f");
            const entry = {
                ...toolConfigs,
                type: this.type,
                ...(wireConfigs != null ? { configs: wireConfigs } : {}),
            };
            return JSON.parse(JSON.stringify(entry));
        }
        /**
         * Release the desktop when you are done. The tool runner never calls it, so one instance can serve several runs.
         *
         * - A call that arrives afterwards throws `ToolsetClosedError`.
         * - It waits for calls already accepted.
         * - Inside a member, call `void this.close()`, since awaiting it there would wait on its own call.
         * - `await using` runs it where the engine supports that, but the class declares no `[Symbol.asyncDispose]`
         *   type, so TypeScript callers use `try` / `finally`.
         */
        async close() {
            __classPrivateFieldSet(this, _BetaAbstractComputerToolset20260801_closed, true, "f");
            await __classPrivateFieldGet(this, _BetaAbstractComputerToolset20260801_queue, "f").drain();
        }
        /**
         * Dispatch one member call to its method.
         *
         * Override it for hooks around every member, and call `super.execute(ctx, name, input)` from the override.
         * `confirm` still runs first.
         *
         * A subclass that overrides it receives calls for every member. A member it does not implement throws
         * `UnavailableMemberError`, so use `configs` to turn off the ones it does not handle.
         */
        async execute(ctx, name, input) {
            return (await dispatchMember(COMPUTER_REGISTRY, this, ctx, name, input));
        }
        /** Default body of every member: the model called a member this driver does not implement. */
        unavailable(name, _ctx, _input) {
            throw new UnavailableMemberError(name, COMPUTER_FAMILY);
        }
        key(ctx, input) {
            return this.unavailable('key', ctx, input);
        }
        hold_key(ctx, input) {
            return this.unavailable('hold_key', ctx, input);
        }
        /** The `type` member; named `type_` because `type` is the entry's wire field on this object. */
        type_(ctx, input) {
            return this.unavailable('type', ctx, input);
        }
        cursor_position(ctx, input) {
            return this.unavailable('cursor_position', ctx, input);
        }
        mouse_move(ctx, input) {
            return this.unavailable('mouse_move', ctx, input);
        }
        left_mouse_down(ctx, input) {
            return this.unavailable('left_mouse_down', ctx, input);
        }
        left_mouse_up(ctx, input) {
            return this.unavailable('left_mouse_up', ctx, input);
        }
        left_click(ctx, input) {
            return this.unavailable('left_click', ctx, input);
        }
        left_click_drag(ctx, input) {
            return this.unavailable('left_click_drag', ctx, input);
        }
        right_click(ctx, input) {
            return this.unavailable('right_click', ctx, input);
        }
        middle_click(ctx, input) {
            return this.unavailable('middle_click', ctx, input);
        }
        double_click(ctx, input) {
            return this.unavailable('double_click', ctx, input);
        }
        triple_click(ctx, input) {
            return this.unavailable('triple_click', ctx, input);
        }
        scroll(ctx, input) {
            return this.unavailable('scroll', ctx, input);
        }
        wait(ctx, input) {
            return this.unavailable('wait', ctx, input);
        }
        screenshot(ctx, input) {
            return this.unavailable('screenshot', ctx, input);
        }
        zoom(ctx, input) {
            return this.unavailable('zoom', ctx, input);
        }
    }
    _BetaAbstractComputerToolset20260801_options = new WeakMap(), _BetaAbstractComputerToolset20260801_queue = new WeakMap(), _BetaAbstractComputerToolset20260801_closed = new WeakMap(), _BetaAbstractComputerToolset20260801_instances = new WeakSet(), _BetaAbstractComputerToolset20260801_run = async function _BetaAbstractComputerToolset20260801_run(call) {
        // A call aborted while it waited in the queue dispatches nothing and prompts nobody.
        throwIfAborted(call.ctx.signal);
        try {
            const member = resolveMember(COMPUTER_REGISTRY, __classPrivateFieldGet(this, _BetaAbstractComputerToolset20260801_options, "f"), call.name);
            call.member = member;
            call.input = parseComputerInput(call.rawInput);
            await __classPrivateFieldGet(this, _BetaAbstractComputerToolset20260801_instances, "m", _BetaAbstractComputerToolset20260801_confirm).call(this, call);
            throwIfAborted(call.ctx.signal);
            try {
                call.result = typedComputerResult(member.result, await this.execute(call.ctx, member.name, call.input));
            }
            catch (error) {
                // The driver's own error text reaches the model, bounded to the field limit.
                call.error = await checkedError(classify(error, call.ctx));
            }
            // A run aborted while the member was in flight is not answered with a success block: the abort
            // propagates (the runner is unwinding), whatever the member managed to finish.
            throwIfAborted(call.ctx.signal);
        }
        catch (error) {
            if (!(error instanceof ToolError))
                throw error;
            call.error = await checkedError(error);
        }
        if (call.error !== undefined) {
            // Thrown as raised, images included: `toolResult` and the runner keep only the text an is_error result may hold.
            const { content } = call.error;
            throw new ToolError(typeof content === 'string' ? [{ type: 'text', text: content }] : content);
        }
        return renderResult(call.member, call.input, call.result);
    }, _BetaAbstractComputerToolset20260801_confirm = 
    /**
     * The approval gate: every call about to run is shown to `confirm` first, inside the pipeline and on the
     * one-at-a-time queue, so no override of `execute` or of the member can skip it.
     */
    async function _BetaAbstractComputerToolset20260801_confirm(call) {
        const confirm = __classPrivateFieldGet(this, _BetaAbstractComputerToolset20260801_options, "f").confirm;
        if (confirm === undefined)
            return;
        const ctx = { ...call.ctx, member: call.member.name, input: call.input };
        await confirmOrThrow(confirm, ctx, call);
    };
    return BetaAbstractComputerToolset20260801;
})();
//# sourceMappingURL=computer.mjs.map