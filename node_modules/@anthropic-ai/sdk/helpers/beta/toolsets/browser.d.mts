/**
 * The browser toolset interface: `BetaAbstractBrowserToolset20260801`.
 *
 * A driver subclasses it and overrides the members its backend supports. A member it does not override
 * is reported to the API as disabled and, if the model calls it anyway, answered with an `is_error`
 * result. `execute` is the dispatch layer: override it (calling `super.execute`) for before/after hooks
 * around every member. `run` is the SDK's pipeline around it.
 */
import type { BetaBrowserCloseTabInput, BetaBrowserDoubleClickInput, BetaBrowserFileUploadInput, BetaBrowserFindInput, BetaBrowserFormInputInput, BetaBrowserGetPageTextInput, BetaBrowserHoldKeyInput, BetaBrowserHoverInput, BetaBrowserJavascriptExecInput, BetaBrowserKeyInput, BetaBrowserLeftClickDragInput, BetaBrowserLeftClickInput, BetaBrowserLeftMouseDownInput, BetaBrowserLeftMouseUpInput, BetaBrowserListTabsInput, BetaBrowserMemberInput, BetaBrowserMiddleClickInput, BetaBrowserMouseMoveInput, BetaBrowserNavigateInput, BetaBrowserNewTabInput, BetaBrowserReadConsoleInput, BetaBrowserReadNetworkInput, BetaBrowserReadPageInput, BetaBrowserRightClickInput, BetaBrowserScreenshotInput, BetaBrowserScrollInput, BetaBrowserScrollToInput, BetaBrowserSwitchTabInput, BetaBrowserToolset20260801, BetaBrowserToolsetConfigs, BetaBrowserTripleClickInput, BetaBrowserTypeInput, BetaBrowserWaitInput, BetaBrowserZoomInput, BetaToolResultBlockParam, BetaToolUseBlock } from "../../../resources/beta.mjs";
import type { BetaToolRunContext, Promisable } from "../../../lib/tools/BetaRunnableTool.mjs";
import type { BetaRunnableToolset, BetaToolsetContent } from "../../../lib/tools/BetaRunnableToolset.mjs";
import type { BetaBrowserStateCallable, BetaConfirmCallable, BetaFilePolicy, BetaToolConfigs, BetaToolsetCallContext, BetaURLPolicy } from "../../../lib/internal/toolsets/hooks.mjs";
import type { BetaBrowserMemberName } from "../../../lib/internal/toolsets/inputs.mjs";
import { type BrowserMemberResults } from "../../../lib/internal/toolsets/registry.mjs";
import type { BetaBrowserMemberResult } from "../../../lib/internal/toolsets/results.mjs";
import { SDK_HELPER_SYMBOL, type StainlessHelperHeaderValue } from "../../../internal/stainless-helper-header.mjs";
type Ctx = BetaToolsetCallContext;
type Result<K extends BetaBrowserMemberName> = Promisable<BrowserMemberResults[K]>;
type BetaRunnableBrowserToolset = BetaRunnableToolset<BetaBrowserToolset20260801>;
export interface BetaBrowserToolsetOptions {
    /**
     * The `configs` object of the `tools[]` entry, sent as given: `{ <member>: { enabled, defer_loading } }`. This is
     * how a member is switched on or off. The SDK adds `enabled: false` for every member the subclass does not
     * implement and never dispatches a disabled member. A subclass that overrides `execute` serves every member, so
     * turn off the ones it does not serve here.
     */
    configs?: BetaBrowserToolsetConfigs | undefined;
    /**
     * Optional. `(ctx) => boolean | Promise<boolean>`, called before every member call the SDK is about to run (after
     * the URL policy and the file policy, never for a call already refused). Return true to run it, false to answer the
     * model with a refusal. Decide by `ctx.member` which members prompt a person. `ctx` also contains the member's
     * `input` and the target tab's `tabURL` / `tabId` as of the last `browserState` report the SDK collected.
     * Required when `javascript_exec` or `file_upload` is enabled.
     */
    confirm?: BetaConfirmCallable | undefined;
    /**
     * Required. `(ctx) => BetaBrowserState | Promise<BetaBrowserState>`: the open tabs (one marked active) and the state changes
     * since the previous call. The SDK calls it once after every call it answers, refused or failed ones too, and
     * attaches the result to the tool result as the `browser_state` block. A driver passes its own reporting method
     * and types the options it accepts from its callers as `Omit<BetaBrowserToolsetOptions, 'browserState'>`.
     */
    browserState: BetaBrowserStateCallable;
    /**
     * Optional. `(context, url) => void`, throwing `ToolError` to refuse. Called once for each `navigate` that has a
     * URL, with the URL exactly as the model wrote it, before the driver receives it. `back`, `forward` and `reload` are
     * not checked. Left unset, `navigate` is not checked. This is a hook for your own policy, not a security boundary:
     * it does not see redirects, sub-resources or addresses a page reaches on its own. Request interception in the
     * driver and egress rules around the browser cover those.
     */
    urlPolicy?: BetaURLPolicy | undefined;
    /**
     * Optional `BetaFilePolicy` (the shipped `BetaNodeFilePolicy`, or your own): which local paths and Files API document ids
     * `file_upload` may use, and whether a download's local path is shown to the model. Without one, an upload naming a
     * path or document id is refused and download paths stay hidden.
     */
    filePolicy?: BetaFilePolicy | undefined;
    /**
     * Optional fields set on the `tools[]` entry itself rather than on a member: `{ cache_control: { type: 'ephemeral' } }`.
     * Naming `configs` here throws: the `configs` option sets it.
     */
    toolConfigs?: BetaToolConfigs | undefined;
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
export declare abstract class BetaAbstractBrowserToolset20260801 implements BetaRunnableBrowserToolset {
    #private;
    readonly type: "browser_toolset_20260801";
    /** The family this toolset answers for: matched against `tool_use.toolset_name`. */
    readonly toolsetName: "browser";
    readonly [SDK_HELPER_SYMBOL]: StainlessHelperHeaderValue;
    constructor(options: BetaBrowserToolsetOptions);
    /**
     * The wire `configs`: the caller's, plus `enabled: false` for every member this class does not serve. `null` when
     * the entry has none. Frozen and read-only (`toolset.configs = …` throws): it is what the dispatch gate reads and
     * what `toJSON()` copies.
     */
    get configs(): BetaBrowserToolsetConfigs | null;
    /**
     * The tool runner's entry point (and `toolResult`'s): run the member `toolUse.name` through the pipeline and
     * return its `tool_result` content. A refusal or failure is thrown as a `ToolError` holding the content. Calls
     * on one toolset run one at a time, in arrival order, whatever their context. Not an extension point (override
     * `execute` or a member method), and not for use from inside a member, where it would wait behind the call that
     * is waiting for it: a member that composes others calls their methods directly.
     */
    run(ctx: BetaToolRunContext, toolUse: BetaToolUseBlock): Promise<BetaToolsetContent>;
    /**
     * Answer one member `tool_use` for a hand-written loop: runs it through the same pipeline as the
     * tool runner and returns the `tool_result` block, `toolset_name` and `is_error` set. It never
     * throws a `ToolError`, but a `ToolsetUsageError` still propagates.
     */
    toolResult(toolUse: BetaToolUseBlock): Promise<BetaToolResultBlockParam>;
    /**
     * The `tools[]` entry: your `toolConfigs` fields, the type, and the wire `configs`. A fresh deep copy each call, so
     * nothing you do to it changes the toolset. Subclass state (a driver, counters) never reaches the request.
     */
    toJSON(): BetaBrowserToolset20260801;
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
    close(): Promise<void>;
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
    protected execute(ctx: BetaToolsetCallContext, name: BetaBrowserMemberName, input: BetaBrowserMemberInput): Promise<BetaBrowserMemberResult>;
    protected navigate(ctx: Ctx, input: BetaBrowserNavigateInput): Result<'navigate'>;
    protected screenshot(ctx: Ctx, input: BetaBrowserScreenshotInput): Result<'screenshot'>;
    protected zoom(ctx: Ctx, input: BetaBrowserZoomInput): Result<'zoom'>;
    protected left_click(ctx: Ctx, input: BetaBrowserLeftClickInput): Result<'left_click'>;
    protected right_click(ctx: Ctx, input: BetaBrowserRightClickInput): Result<'right_click'>;
    protected middle_click(ctx: Ctx, input: BetaBrowserMiddleClickInput): Result<'middle_click'>;
    protected double_click(ctx: Ctx, input: BetaBrowserDoubleClickInput): Result<'double_click'>;
    protected triple_click(ctx: Ctx, input: BetaBrowserTripleClickInput): Result<'triple_click'>;
    protected hover(ctx: Ctx, input: BetaBrowserHoverInput): Result<'hover'>;
    protected left_click_drag(ctx: Ctx, input: BetaBrowserLeftClickDragInput): Result<'left_click_drag'>;
    protected left_mouse_down(ctx: Ctx, input: BetaBrowserLeftMouseDownInput): Result<'left_mouse_down'>;
    protected left_mouse_up(ctx: Ctx, input: BetaBrowserLeftMouseUpInput): Result<'left_mouse_up'>;
    protected mouse_move(ctx: Ctx, input: BetaBrowserMouseMoveInput): Result<'mouse_move'>;
    protected scroll(ctx: Ctx, input: BetaBrowserScrollInput): Result<'scroll'>;
    protected scroll_to(ctx: Ctx, input: BetaBrowserScrollToInput): Result<'scroll_to'>;
    /** The `type` member, named `type_` because `type` is the entry's wire field on this object. */
    protected type_(ctx: Ctx, input: BetaBrowserTypeInput): Result<'type'>;
    protected key(ctx: Ctx, input: BetaBrowserKeyInput): Result<'key'>;
    protected hold_key(ctx: Ctx, input: BetaBrowserHoldKeyInput): Result<'hold_key'>;
    protected form_input(ctx: Ctx, input: BetaBrowserFormInputInput): Result<'form_input'>;
    protected read_page(ctx: Ctx, input: BetaBrowserReadPageInput): Result<'read_page'>;
    protected find(ctx: Ctx, input: BetaBrowserFindInput): Result<'find'>;
    protected get_page_text(ctx: Ctx, input: BetaBrowserGetPageTextInput): Result<'get_page_text'>;
    protected wait(ctx: Ctx, input: BetaBrowserWaitInput): Result<'wait'>;
    /**
     * Default-disabled. Enabling it in `configs` lets a page read files on the machine running the
     * browser: pass a `filePolicy` confined to one dedicated upload directory. `input.paths` arrive
     * already resolved by it.
     */
    protected file_upload(ctx: Ctx, input: BetaBrowserFileUploadInput): Result<'file_upload'>;
    protected read_console(ctx: Ctx, input: BetaBrowserReadConsoleInput): Result<'read_console'>;
    protected read_network(ctx: Ctx, input: BetaBrowserReadNetworkInput): Result<'read_network'>;
    /**
     * Default-disabled. Page content can steer what the model asks to run, so enabling it takes a `confirm`
     * callable, which receives every call first. The script runs with the page's own authority (its cookies, storage
     * and signed-in sessions), so the browser profile you drive must not be signed into accounts whose data or actions
     * you would not hand the model.
     */
    protected javascript_exec(ctx: Ctx, input: BetaBrowserJavascriptExecInput): Result<'javascript_exec'>;
    protected new_tab(ctx: Ctx, input: BetaBrowserNewTabInput): Result<'new_tab'>;
    protected list_tabs(ctx: Ctx, input: BetaBrowserListTabsInput): Result<'list_tabs'>;
    protected switch_tab(ctx: Ctx, input: BetaBrowserSwitchTabInput): Result<'switch_tab'>;
    protected close_tab(ctx: Ctx, input: BetaBrowserCloseTabInput): Result<'close_tab'>;
}
export {};
//# sourceMappingURL=browser.d.mts.map