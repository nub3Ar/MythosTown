"use strict";
var _BetaAbstractBrowserToolset20260801_instances, _BetaAbstractBrowserToolset20260801_options, _BetaAbstractBrowserToolset20260801_pipeline, _BetaAbstractBrowserToolset20260801_queue, _BetaAbstractBrowserToolset20260801_closed, _BetaAbstractBrowserToolset20260801_run, _BetaAbstractBrowserToolset20260801_browserState, _BetaAbstractBrowserToolset20260801_confirm, _BetaAbstractBrowserToolset20260801_applyPolicy;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetaAbstractBrowserToolset20260801 = void 0;
const tslib_1 = require("../../../internal/tslib.js");
const run_1 = require("../../../lib/internal/toolsets/run.js");
const ToolError_1 = require("../../../lib/tools/ToolError.js");
const core_1 = require("../../../lib/internal/toolsets/core.js");
const errors_1 = require("../../../lib/internal/toolsets/errors.js");
const pipeline_1 = require("../../../lib/internal/toolsets/pipeline.js");
const render_1 = require("../../../lib/internal/toolsets/render.js");
const registry_1 = require("../../../lib/internal/toolsets/registry.js");
const stainless_helper_header_1 = require("../../../internal/stainless-helper-header.js");
const sanitize_1 = require("../../../lib/internal/toolsets/sanitize.js");
function resolveOptions(instance, base, options) {
    const shared = (0, core_1.resolveToolsetOptions)(registry_1.BROWSER_REGISTRY, instance, base, options);
    const { served, wireConfigs: wire, confirm } = shared;
    const urlPolicy = options.urlPolicy;
    const required = [...registry_1.CONFIRM_REQUIRED].filter((n) => served.has(n) && (0, registry_1.memberEnabled)(n, wire)).sort();
    if (required.length && confirm === undefined) {
        throw new errors_1.ToolsetConfigError(`${JSON.stringify(required)} requires a confirm callable: pass confirm: <callable>, or disable it in configs`);
    }
    return { ...shared, browserState: options.browserState, urlPolicy, filePolicy: options.filePolicy };
}
var BetaAbstractBrowserToolset20260801 = /* @__PURE__ */ (() => {
    /**
     * The browser toolset for `browser_toolset_20260801`.
     *
     * Subclass it and override the members your backend supports. Each takes `(ctx, input)` and returns
     * the result type in its signature. A pure action (a click, typing, scrolling) returns nothing, or a string the
     * model reads in a text block of its own after the SDK's fixed acknowledgment (such as `Clicked.`), folded to one
     * line. See the browser use tool documentation
     * (https://platform.claude.com/docs/en/agents-and-tools/tool-use/browser-use-tool) and read "Running a
     * browser toolset safely" in the SDK guide (`browser-toolset.md`) before deploying one.
     */
    class BetaAbstractBrowserToolset20260801 {
        constructor(options) {
            _BetaAbstractBrowserToolset20260801_instances.add(this);
            this.type = registry_1.TOOLSET_TYPE;
            /** The family this toolset answers for: matched against `tool_use.toolset_name`. */
            this.toolsetName = registry_1.FAMILY;
            /** Private, so spreading or serialising a toolset never copies the policies or the callbacks. */
            _BetaAbstractBrowserToolset20260801_options.set(this, void 0);
            _BetaAbstractBrowserToolset20260801_pipeline.set(this, new pipeline_1.PipelineState());
            /** Every top-level call queues here: calls run one at a time, in arrival order. */
            _BetaAbstractBrowserToolset20260801_queue.set(this, new core_1.CallQueue());
            /** Set by `close()`: a run that arrives afterwards throws `ToolsetClosedError`. */
            _BetaAbstractBrowserToolset20260801_closed.set(this, false);
            this[stainless_helper_header_1.SDK_HELPER_SYMBOL] = 'browser-toolset';
            (0, core_1.wireAsyncDispose)(BetaAbstractBrowserToolset20260801.prototype);
            tslib_1.__classPrivateFieldSet(this, _BetaAbstractBrowserToolset20260801_options, resolveOptions(this, BetaAbstractBrowserToolset20260801.prototype, options), "f");
        }
        /**
         * The wire `configs`: the caller's, plus `enabled: false` for every member this class does not serve. `null` when
         * the entry has none. Frozen and read-only (`toolset.configs = …` throws): it is what the dispatch gate reads and
         * what `toJSON()` copies.
         */
        get configs() {
            return tslib_1.__classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_options, "f").wireConfigs ?? null;
        }
        /**
         * The tool runner's entry point (and `toolResult`'s): run the member `toolUse.name` through the pipeline and
         * return its `tool_result` content. A refusal or failure is thrown as a `ToolError` holding the content. Calls
         * on one toolset run one at a time, in arrival order, whatever their context. Not an extension point (override
         * `execute` or a member method), and not for use from inside a member, where it would wait behind the call that
         * is waiting for it: a member that composes others calls their methods directly.
         */
        run(ctx, toolUse) {
            if (tslib_1.__classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_closed, "f"))
                throw new errors_1.ToolsetClosedError(`this '${registry_1.FAMILY}' toolset is closed`);
            const record = new pipeline_1.CallRecord(ctx, toolUse.name, toolUse.input);
            return tslib_1.__classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_queue, "f").enqueue(ctx.signal, () => tslib_1.__classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_instances, "m", _BetaAbstractBrowserToolset20260801_run).call(this, record));
        }
        /**
         * Answer one member `tool_use` for a hand-written loop: runs it through the same pipeline as the
         * tool runner and returns the `tool_result` block, `toolset_name` and `is_error` set. It never
         * throws a `ToolError`, but a `ToolsetUsageError` still propagates.
         */
        toolResult(toolUse) {
            return (0, run_1.runToolsetMember)(this, toolUse);
        }
        /**
         * The `tools[]` entry: your `toolConfigs` fields, the type, and the wire `configs`. A fresh deep copy each call, so
         * nothing you do to it changes the toolset. Subclass state (a driver, counters) never reaches the request.
         */
        toJSON() {
            const { toolConfigs, wireConfigs } = tslib_1.__classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_options, "f");
            const entry = {
                ...toolConfigs,
                type: this.type,
                ...(wireConfigs != null ? { configs: wireConfigs } : {}),
            };
            return JSON.parse(JSON.stringify(entry));
        }
        /**
         * Release the browser when you are done. The tool runner never calls it, so one instance can serve several runs.
         * Marks the toolset closed at once (a member run that arrives afterwards throws `ToolsetClosedError`) and then
         * waits for the calls already accepted, queued or in flight, to settle, so an override that
         * awaits `super.close()` first tears the browser down with nothing still using it. From inside a member, call it
         * without awaiting (`void this.close()`): the browser is released as soon as that member returns, whereas awaiting
         * it there would wait on the member's own call. Also what `await using` runs: wired to `Symbol.asyncDispose` at
         * runtime where the engine provides it. There is no typed `[Symbol.asyncDispose]` member, so from TypeScript use
         * `try` / `finally` with `close()`.
         */
        async close() {
            tslib_1.__classPrivateFieldSet(this, _BetaAbstractBrowserToolset20260801_closed, true, "f");
            await tslib_1.__classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_queue, "f").drain();
        }
        /**
         * Dispatch one member call to its method.
         *
         * Override it, calling `super.execute(ctx, name, input)`, for before/after hooks around every member
         * (telemetry, logging, rewriting the input or the typed result). The pipeline still wraps the
         * override, so the URL policy, the file policy and `confirm` run before it. It is
         * also the only method a subclass that forwards every member elsewhere (a remote
         * browser, a recording proxy) implements. A subclass that overrides it serves every member: one it
         * implements runs through `super.execute`, one it does not throws `UnavailableMemberError` from its default
         * body there, and `configs` is how it turns off the members it does not serve. A call the SDK refused
         * before dispatch never reaches it.
         */
        async execute(ctx, name, input) {
            return (await (0, core_1.dispatchMember)(registry_1.BROWSER_REGISTRY, this, ctx, name, input));
        }
        navigate(ctx, input) {
            throw new errors_1.UnavailableMemberError('navigate', registry_1.FAMILY);
        }
        screenshot(ctx, input) {
            throw new errors_1.UnavailableMemberError('screenshot', registry_1.FAMILY);
        }
        zoom(ctx, input) {
            throw new errors_1.UnavailableMemberError('zoom', registry_1.FAMILY);
        }
        left_click(ctx, input) {
            throw new errors_1.UnavailableMemberError('left_click', registry_1.FAMILY);
        }
        right_click(ctx, input) {
            throw new errors_1.UnavailableMemberError('right_click', registry_1.FAMILY);
        }
        middle_click(ctx, input) {
            throw new errors_1.UnavailableMemberError('middle_click', registry_1.FAMILY);
        }
        double_click(ctx, input) {
            throw new errors_1.UnavailableMemberError('double_click', registry_1.FAMILY);
        }
        triple_click(ctx, input) {
            throw new errors_1.UnavailableMemberError('triple_click', registry_1.FAMILY);
        }
        hover(ctx, input) {
            throw new errors_1.UnavailableMemberError('hover', registry_1.FAMILY);
        }
        left_click_drag(ctx, input) {
            throw new errors_1.UnavailableMemberError('left_click_drag', registry_1.FAMILY);
        }
        left_mouse_down(ctx, input) {
            throw new errors_1.UnavailableMemberError('left_mouse_down', registry_1.FAMILY);
        }
        left_mouse_up(ctx, input) {
            throw new errors_1.UnavailableMemberError('left_mouse_up', registry_1.FAMILY);
        }
        mouse_move(ctx, input) {
            throw new errors_1.UnavailableMemberError('mouse_move', registry_1.FAMILY);
        }
        scroll(ctx, input) {
            throw new errors_1.UnavailableMemberError('scroll', registry_1.FAMILY);
        }
        scroll_to(ctx, input) {
            throw new errors_1.UnavailableMemberError('scroll_to', registry_1.FAMILY);
        }
        /** The `type` member, named `type_` because `type` is the entry's wire field on this object. */
        type_(ctx, input) {
            throw new errors_1.UnavailableMemberError('type', registry_1.FAMILY);
        }
        key(ctx, input) {
            throw new errors_1.UnavailableMemberError('key', registry_1.FAMILY);
        }
        hold_key(ctx, input) {
            throw new errors_1.UnavailableMemberError('hold_key', registry_1.FAMILY);
        }
        form_input(ctx, input) {
            throw new errors_1.UnavailableMemberError('form_input', registry_1.FAMILY);
        }
        read_page(ctx, input) {
            throw new errors_1.UnavailableMemberError('read_page', registry_1.FAMILY);
        }
        find(ctx, input) {
            throw new errors_1.UnavailableMemberError('find', registry_1.FAMILY);
        }
        get_page_text(ctx, input) {
            throw new errors_1.UnavailableMemberError('get_page_text', registry_1.FAMILY);
        }
        wait(ctx, input) {
            throw new errors_1.UnavailableMemberError('wait', registry_1.FAMILY);
        }
        /**
         * Default-disabled. Enabling it in `configs` lets a page read files on the machine running the
         * browser: pass a `filePolicy` confined to one dedicated upload directory. `input.paths` arrive
         * already resolved by it.
         */
        file_upload(ctx, input) {
            throw new errors_1.UnavailableMemberError('file_upload', registry_1.FAMILY);
        }
        read_console(ctx, input) {
            throw new errors_1.UnavailableMemberError('read_console', registry_1.FAMILY);
        }
        read_network(ctx, input) {
            throw new errors_1.UnavailableMemberError('read_network', registry_1.FAMILY);
        }
        /**
         * Default-disabled. Page content can steer what the model asks to run, so enabling it takes a `confirm`
         * callable, which receives every call first. The script runs with the page's own authority (its cookies, storage
         * and signed-in sessions), so the browser profile you drive must not be signed into accounts whose data or actions
         * you would not hand the model.
         */
        javascript_exec(ctx, input) {
            throw new errors_1.UnavailableMemberError('javascript_exec', registry_1.FAMILY);
        }
        new_tab(ctx, input) {
            throw new errors_1.UnavailableMemberError('new_tab', registry_1.FAMILY);
        }
        list_tabs(ctx, input) {
            throw new errors_1.UnavailableMemberError('list_tabs', registry_1.FAMILY);
        }
        switch_tab(ctx, input) {
            throw new errors_1.UnavailableMemberError('switch_tab', registry_1.FAMILY);
        }
        close_tab(ctx, input) {
            throw new errors_1.UnavailableMemberError('close_tab', registry_1.FAMILY);
        }
    }
    _BetaAbstractBrowserToolset20260801_options = new WeakMap(), _BetaAbstractBrowserToolset20260801_pipeline = new WeakMap(), _BetaAbstractBrowserToolset20260801_queue = new WeakMap(), _BetaAbstractBrowserToolset20260801_closed = new WeakMap(), _BetaAbstractBrowserToolset20260801_instances = new WeakSet(), _BetaAbstractBrowserToolset20260801_run = async function _BetaAbstractBrowserToolset20260801_run(record) {
        // A call aborted while it waited in the queue dispatches nothing and prompts nobody.
        (0, run_1.throwIfAborted)(record.ctx.signal);
        const options = tslib_1.__classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_options, "f");
        try {
            const member = (0, core_1.resolveMember)(registry_1.BROWSER_REGISTRY, options, record.name);
            record.member = member;
            record.input = (0, pipeline_1.parseInput)(record.rawInput);
            const url = (0, pipeline_1.navigateRequestURL)(record);
            if (url !== undefined)
                await tslib_1.__classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_instances, "m", _BetaAbstractBrowserToolset20260801_applyPolicy).call(this, url, (0, pipeline_1.urlContext)(record));
            await (0, pipeline_1.resolveUploadPaths)(record, options.filePolicy);
            await tslib_1.__classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_instances, "m", _BetaAbstractBrowserToolset20260801_confirm).call(this, record);
            (0, run_1.throwIfAborted)(record.ctx.signal);
            try {
                record.result = (0, registry_1.typedResult)(member.result, await this.execute(record.ctx, member.name, record.input));
            }
            catch (error) {
                // The driver's own error text reaches the model, cut to the field limit.
                record.error = (0, pipeline_1.boundedError)((0, run_1.classify)(error, record.ctx));
            }
            // A run aborted while the member was in flight is not answered with a success block: the abort
            // propagates (the runner is unwinding), whatever the member managed to finish.
            (0, run_1.throwIfAborted)(record.ctx.signal);
            const line = (0, render_1.actionLine)(member, record.result);
            // The line a pure action returned is page-shaped: folded to one line and cut.
            if (line !== undefined)
                record.result = { kind: 'none', value: (0, sanitize_1.oneLine)(line) };
        }
        catch (error) {
            if (!(error instanceof ToolError_1.ToolError))
                throw error;
            (0, run_1.throwIfAborted)(record.ctx.signal); // a refusal out of a hook once the run is cancelled is the cancellation
            record.error = (0, pipeline_1.boundedError)(error);
        }
        const state = await tslib_1.__classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_instances, "m", _BetaAbstractBrowserToolset20260801_browserState).call(this, record.ctx);
        const { content, isError } = await tslib_1.__classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_pipeline, "f").finish(record, (0, pipeline_1.reportOf)(state), options.filePolicy);
        if (isError)
            throw new ToolError_1.ToolError(content);
        return content;
    }, _BetaAbstractBrowserToolset20260801_browserState = async function _BetaAbstractBrowserToolset20260801_browserState(ctx) {
        try {
            return (0, pipeline_1.withBoundedTabURLs)(await tslib_1.__classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_options, "f").browserState(ctx));
        }
        catch (error) {
            (0, run_1.throwIfPropagates)(error, ctx);
            // The tab inventory is the SDK's only view of the browser, and without it nothing can be answered.
            throw new errors_1.ToolsetContractError(`browserState threw ${String(error)} or returned no BetaBrowserState; return one, and catch failures inside browserState`, { cause: error });
        }
    }, _BetaAbstractBrowserToolset20260801_confirm = 
    /**
     * The approval gate: every call about to run is shown to `confirm` first, inside the pipeline and within the
     * call's turn in the queue, so no override of `execute` or of the member can skip it. A `ToolError` it throws is
     * relayed as-is. Any other exception means the prompt failed, and refuses the call rather than ending the run.
     * Anything but `true` declines the call.
     */
    async function _BetaAbstractBrowserToolset20260801_confirm(record) {
        const confirm = tslib_1.__classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_options, "f").confirm;
        if (confirm === undefined)
            return;
        await (0, core_1.confirmOrThrow)(confirm, (0, pipeline_1.confirmContext)(record, tslib_1.__classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_pipeline, "f")), record);
    }, _BetaAbstractBrowserToolset20260801_applyPolicy = 
    /** Run the `urlPolicy` callable on one address. Throws the refusal the model reads when it does not pass. */
    async function _BetaAbstractBrowserToolset20260801_applyPolicy(url, ctx) {
        const policy = tslib_1.__classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_options, "f").urlPolicy;
        if (policy === undefined)
            return;
        let returned;
        try {
            returned = await policy(ctx, url);
        }
        catch (error) {
            throw (0, pipeline_1.policyRefusal)(error);
        }
        if (returned !== undefined) {
            // "return nothing to allow, throw to refuse": a policy mistakenly written as a predicate
            // returns false to block, and reading that as a pass would fail open silently.
            throw new errors_1.ToolsetContractError(`urlPolicy must return nothing to allow or throw a ToolError to refuse; got ${returned === null ? 'null' : typeof returned}`);
        }
    };
    return BetaAbstractBrowserToolset20260801;
})();
exports.BetaAbstractBrowserToolset20260801 = BetaAbstractBrowserToolset20260801;
//# sourceMappingURL=browser.js.map