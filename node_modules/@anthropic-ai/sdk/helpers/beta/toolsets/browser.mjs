var _BetaAbstractBrowserToolset20260801_instances, _BetaAbstractBrowserToolset20260801_options, _BetaAbstractBrowserToolset20260801_pipeline, _BetaAbstractBrowserToolset20260801_queue, _BetaAbstractBrowserToolset20260801_closed, _BetaAbstractBrowserToolset20260801_run, _BetaAbstractBrowserToolset20260801_browserState, _BetaAbstractBrowserToolset20260801_confirm, _BetaAbstractBrowserToolset20260801_applyPolicy;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "../../../internal/tslib.mjs";
import { classify, throwIfAborted, throwIfPropagates, runToolsetMember, } from "../../../lib/internal/toolsets/run.mjs";
import { ToolError } from "../../../lib/tools/ToolError.mjs";
import { CallQueue, confirmOrThrow, dispatchMember, resolveMember, resolveToolsetOptions, wireAsyncDispose, } from "../../../lib/internal/toolsets/core.mjs";
import { ToolsetClosedError, ToolsetConfigError, ToolsetContractError, UnavailableMemberError, } from "../../../lib/internal/toolsets/errors.mjs";
import { CallRecord, PipelineState, boundedError, confirmContext, navigateRequestURL, parseInput, policyRefusal, reportOf, resolveUploadPaths, urlContext, withBoundedTabURLs, } from "../../../lib/internal/toolsets/pipeline.mjs";
import { actionLine } from "../../../lib/internal/toolsets/render.mjs";
import { BROWSER_REGISTRY, CONFIRM_REQUIRED, FAMILY, TOOLSET_TYPE, memberEnabled, typedResult, } from "../../../lib/internal/toolsets/registry.mjs";
import { SDK_HELPER_SYMBOL, } from "../../../internal/stainless-helper-header.mjs";
import { oneLine } from "../../../lib/internal/toolsets/sanitize.mjs";
function resolveOptions(instance, base, options) {
    const shared = resolveToolsetOptions(BROWSER_REGISTRY, instance, base, options);
    const { served, wireConfigs: wire, confirm } = shared;
    const urlPolicy = options.urlPolicy;
    const required = [...CONFIRM_REQUIRED].filter((n) => served.has(n) && memberEnabled(n, wire)).sort();
    if (required.length && confirm === undefined) {
        throw new ToolsetConfigError(`${JSON.stringify(required)} requires a confirm callable: pass confirm: <callable>, or disable it in configs`);
    }
    return { ...shared, browserState: options.browserState, urlPolicy, filePolicy: options.filePolicy };
}
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
export var BetaAbstractBrowserToolset20260801 = /* @__PURE__ */ (() => {
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
            this.type = TOOLSET_TYPE;
            /** The family this toolset answers for: matched against `tool_use.toolset_name`. */
            this.toolsetName = FAMILY;
            /** Private, so spreading or serialising a toolset never copies the policies or the callbacks. */
            _BetaAbstractBrowserToolset20260801_options.set(this, void 0);
            _BetaAbstractBrowserToolset20260801_pipeline.set(this, new PipelineState());
            /** Every top-level call queues here: calls run one at a time, in arrival order. */
            _BetaAbstractBrowserToolset20260801_queue.set(this, new CallQueue());
            /** Set by `close()`: a run that arrives afterwards throws `ToolsetClosedError`. */
            _BetaAbstractBrowserToolset20260801_closed.set(this, false);
            this[SDK_HELPER_SYMBOL] = 'browser-toolset';
            wireAsyncDispose(BetaAbstractBrowserToolset20260801.prototype);
            __classPrivateFieldSet(this, _BetaAbstractBrowserToolset20260801_options, resolveOptions(this, BetaAbstractBrowserToolset20260801.prototype, options), "f");
        }
        /**
         * The wire `configs`: the caller's, plus `enabled: false` for every member this class does not serve. `null` when
         * the entry has none. Frozen and read-only (`toolset.configs = …` throws): it is what the dispatch gate reads and
         * what `toJSON()` copies.
         */
        get configs() {
            return __classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_options, "f").wireConfigs ?? null;
        }
        /**
         * The tool runner's entry point (and `toolResult`'s): run the member `toolUse.name` through the pipeline and
         * return its `tool_result` content. A refusal or failure is thrown as a `ToolError` holding the content. Calls
         * on one toolset run one at a time, in arrival order, whatever their context. Not an extension point (override
         * `execute` or a member method), and not for use from inside a member, where it would wait behind the call that
         * is waiting for it: a member that composes others calls their methods directly.
         */
        run(ctx, toolUse) {
            if (__classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_closed, "f"))
                throw new ToolsetClosedError(`this '${FAMILY}' toolset is closed`);
            const record = new CallRecord(ctx, toolUse.name, toolUse.input);
            return __classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_queue, "f").enqueue(ctx.signal, () => __classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_instances, "m", _BetaAbstractBrowserToolset20260801_run).call(this, record));
        }
        /**
         * Answer one member `tool_use` for a hand-written loop: runs it through the same pipeline as the
         * tool runner and returns the `tool_result` block, `toolset_name` and `is_error` set. It never
         * throws a `ToolError`, but a `ToolsetUsageError` still propagates.
         */
        toolResult(toolUse) {
            return runToolsetMember(this, toolUse);
        }
        /**
         * The `tools[]` entry: your `toolConfigs` fields, the type, and the wire `configs`. A fresh deep copy each call, so
         * nothing you do to it changes the toolset. Subclass state (a driver, counters) never reaches the request.
         */
        toJSON() {
            const { toolConfigs, wireConfigs } = __classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_options, "f");
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
            __classPrivateFieldSet(this, _BetaAbstractBrowserToolset20260801_closed, true, "f");
            await __classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_queue, "f").drain();
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
            return (await dispatchMember(BROWSER_REGISTRY, this, ctx, name, input));
        }
        navigate(ctx, input) {
            throw new UnavailableMemberError('navigate', FAMILY);
        }
        screenshot(ctx, input) {
            throw new UnavailableMemberError('screenshot', FAMILY);
        }
        zoom(ctx, input) {
            throw new UnavailableMemberError('zoom', FAMILY);
        }
        left_click(ctx, input) {
            throw new UnavailableMemberError('left_click', FAMILY);
        }
        right_click(ctx, input) {
            throw new UnavailableMemberError('right_click', FAMILY);
        }
        middle_click(ctx, input) {
            throw new UnavailableMemberError('middle_click', FAMILY);
        }
        double_click(ctx, input) {
            throw new UnavailableMemberError('double_click', FAMILY);
        }
        triple_click(ctx, input) {
            throw new UnavailableMemberError('triple_click', FAMILY);
        }
        hover(ctx, input) {
            throw new UnavailableMemberError('hover', FAMILY);
        }
        left_click_drag(ctx, input) {
            throw new UnavailableMemberError('left_click_drag', FAMILY);
        }
        left_mouse_down(ctx, input) {
            throw new UnavailableMemberError('left_mouse_down', FAMILY);
        }
        left_mouse_up(ctx, input) {
            throw new UnavailableMemberError('left_mouse_up', FAMILY);
        }
        mouse_move(ctx, input) {
            throw new UnavailableMemberError('mouse_move', FAMILY);
        }
        scroll(ctx, input) {
            throw new UnavailableMemberError('scroll', FAMILY);
        }
        scroll_to(ctx, input) {
            throw new UnavailableMemberError('scroll_to', FAMILY);
        }
        /** The `type` member, named `type_` because `type` is the entry's wire field on this object. */
        type_(ctx, input) {
            throw new UnavailableMemberError('type', FAMILY);
        }
        key(ctx, input) {
            throw new UnavailableMemberError('key', FAMILY);
        }
        hold_key(ctx, input) {
            throw new UnavailableMemberError('hold_key', FAMILY);
        }
        form_input(ctx, input) {
            throw new UnavailableMemberError('form_input', FAMILY);
        }
        read_page(ctx, input) {
            throw new UnavailableMemberError('read_page', FAMILY);
        }
        find(ctx, input) {
            throw new UnavailableMemberError('find', FAMILY);
        }
        get_page_text(ctx, input) {
            throw new UnavailableMemberError('get_page_text', FAMILY);
        }
        wait(ctx, input) {
            throw new UnavailableMemberError('wait', FAMILY);
        }
        /**
         * Default-disabled. Enabling it in `configs` lets a page read files on the machine running the
         * browser: pass a `filePolicy` confined to one dedicated upload directory. `input.paths` arrive
         * already resolved by it.
         */
        file_upload(ctx, input) {
            throw new UnavailableMemberError('file_upload', FAMILY);
        }
        read_console(ctx, input) {
            throw new UnavailableMemberError('read_console', FAMILY);
        }
        read_network(ctx, input) {
            throw new UnavailableMemberError('read_network', FAMILY);
        }
        /**
         * Default-disabled. Page content can steer what the model asks to run, so enabling it takes a `confirm`
         * callable, which receives every call first. The script runs with the page's own authority (its cookies, storage
         * and signed-in sessions), so the browser profile you drive must not be signed into accounts whose data or actions
         * you would not hand the model.
         */
        javascript_exec(ctx, input) {
            throw new UnavailableMemberError('javascript_exec', FAMILY);
        }
        new_tab(ctx, input) {
            throw new UnavailableMemberError('new_tab', FAMILY);
        }
        list_tabs(ctx, input) {
            throw new UnavailableMemberError('list_tabs', FAMILY);
        }
        switch_tab(ctx, input) {
            throw new UnavailableMemberError('switch_tab', FAMILY);
        }
        close_tab(ctx, input) {
            throw new UnavailableMemberError('close_tab', FAMILY);
        }
    }
    _BetaAbstractBrowserToolset20260801_options = new WeakMap(), _BetaAbstractBrowserToolset20260801_pipeline = new WeakMap(), _BetaAbstractBrowserToolset20260801_queue = new WeakMap(), _BetaAbstractBrowserToolset20260801_closed = new WeakMap(), _BetaAbstractBrowserToolset20260801_instances = new WeakSet(), _BetaAbstractBrowserToolset20260801_run = async function _BetaAbstractBrowserToolset20260801_run(record) {
        // A call aborted while it waited in the queue dispatches nothing and prompts nobody.
        throwIfAborted(record.ctx.signal);
        const options = __classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_options, "f");
        try {
            const member = resolveMember(BROWSER_REGISTRY, options, record.name);
            record.member = member;
            record.input = parseInput(record.rawInput);
            const url = navigateRequestURL(record);
            if (url !== undefined)
                await __classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_instances, "m", _BetaAbstractBrowserToolset20260801_applyPolicy).call(this, url, urlContext(record));
            await resolveUploadPaths(record, options.filePolicy);
            await __classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_instances, "m", _BetaAbstractBrowserToolset20260801_confirm).call(this, record);
            throwIfAborted(record.ctx.signal);
            try {
                record.result = typedResult(member.result, await this.execute(record.ctx, member.name, record.input));
            }
            catch (error) {
                // The driver's own error text reaches the model, cut to the field limit.
                record.error = boundedError(classify(error, record.ctx));
            }
            // A run aborted while the member was in flight is not answered with a success block: the abort
            // propagates (the runner is unwinding), whatever the member managed to finish.
            throwIfAborted(record.ctx.signal);
            const line = actionLine(member, record.result);
            // The line a pure action returned is page-shaped: folded to one line and cut.
            if (line !== undefined)
                record.result = { kind: 'none', value: oneLine(line) };
        }
        catch (error) {
            if (!(error instanceof ToolError))
                throw error;
            throwIfAborted(record.ctx.signal); // a refusal out of a hook once the run is cancelled is the cancellation
            record.error = boundedError(error);
        }
        const state = await __classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_instances, "m", _BetaAbstractBrowserToolset20260801_browserState).call(this, record.ctx);
        const { content, isError } = await __classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_pipeline, "f").finish(record, reportOf(state), options.filePolicy);
        if (isError)
            throw new ToolError(content);
        return content;
    }, _BetaAbstractBrowserToolset20260801_browserState = async function _BetaAbstractBrowserToolset20260801_browserState(ctx) {
        try {
            return withBoundedTabURLs(await __classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_options, "f").browserState(ctx));
        }
        catch (error) {
            throwIfPropagates(error, ctx);
            // The tab inventory is the SDK's only view of the browser, and without it nothing can be answered.
            throw new ToolsetContractError(`browserState threw ${String(error)} or returned no BetaBrowserState; return one, and catch failures inside browserState`, { cause: error });
        }
    }, _BetaAbstractBrowserToolset20260801_confirm = 
    /**
     * The approval gate: every call about to run is shown to `confirm` first, inside the pipeline and within the
     * call's turn in the queue, so no override of `execute` or of the member can skip it. A `ToolError` it throws is
     * relayed as-is. Any other exception means the prompt failed, and refuses the call rather than ending the run.
     * Anything but `true` declines the call.
     */
    async function _BetaAbstractBrowserToolset20260801_confirm(record) {
        const confirm = __classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_options, "f").confirm;
        if (confirm === undefined)
            return;
        await confirmOrThrow(confirm, confirmContext(record, __classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_pipeline, "f")), record);
    }, _BetaAbstractBrowserToolset20260801_applyPolicy = 
    /** Run the `urlPolicy` callable on one address. Throws the refusal the model reads when it does not pass. */
    async function _BetaAbstractBrowserToolset20260801_applyPolicy(url, ctx) {
        const policy = __classPrivateFieldGet(this, _BetaAbstractBrowserToolset20260801_options, "f").urlPolicy;
        if (policy === undefined)
            return;
        let returned;
        try {
            returned = await policy(ctx, url);
        }
        catch (error) {
            throw policyRefusal(error);
        }
        if (returned !== undefined) {
            // "return nothing to allow, throw to refuse": a policy mistakenly written as a predicate
            // returns false to block, and reading that as a pass would fail open silently.
            throw new ToolsetContractError(`urlPolicy must return nothing to allow or throw a ToolError to refuse; got ${returned === null ? 'null' : typeof returned}`);
        }
    };
    return BetaAbstractBrowserToolset20260801;
})();
//# sourceMappingURL=browser.mjs.map