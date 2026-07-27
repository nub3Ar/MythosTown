/**
 * The computer toolset interface: `BetaAbstractComputerToolset20260801`.
 */
import type { BetaComputerDoubleClickInput, BetaComputerHoldKeyInput, BetaComputerKeyInput, BetaComputerLeftClickDragInput, BetaComputerLeftClickInput, BetaComputerMiddleClickInput, BetaComputerMouseMoveInput, BetaComputerRightClickInput, BetaComputerScrollInput, BetaComputerToolset20260801, BetaComputerToolsetConfigs, BetaComputerTripleClickInput, BetaComputerTypeInput, BetaComputerWaitInput, BetaComputerZoomInput, BetaToolResultBlockParam, BetaToolUseBlock } from "../../../resources/beta.js";
import type { BetaToolRunContext, Promisable } from "../../../lib/tools/BetaRunnableTool.js";
import { type BetaRunnableToolset, type BetaToolsetContent } from "../../../lib/tools/BetaRunnableToolset.js";
import { type BetaComputerCursorPositionInput, type BetaComputerLeftMouseDownInput, type BetaComputerLeftMouseUpInput, type BetaComputerMemberInput, type BetaComputerScreenshotInput, type BetaComputerMemberName, type BetaComputerMemberResult, type ComputerMemberResults } from "../../../lib/internal/toolsets/computer-members.js";
import type { BetaComputerConfirmCallable, BetaToolConfigs, BetaToolsetCallContext } from "../../../lib/internal/toolsets/hooks.js";
import { SDK_HELPER_SYMBOL, type StainlessHelperHeaderValue } from "../../../internal/stainless-helper-header.js";
type Ctx = BetaToolsetCallContext;
type Result<K extends BetaComputerMemberName> = Promisable<ComputerMemberResults[K]>;
type BetaRunnableComputerToolset = BetaRunnableToolset<BetaComputerToolset20260801>;
export interface BetaComputerToolsetOptions {
    /**
     * The `configs` object of the `tools[]` entry. This is how a member is switched off (every member is on by
     * default).
     */
    configs?: BetaComputerToolsetConfigs | undefined;
    /**
     * Optional. `(ctx) => boolean | Promise<boolean>`, called before every member call the SDK is about to run (never
     * for a call already refused). Return true to run it, false to answer the model with a refusal; decide by
     * `ctx.member` and `ctx.input` which calls actually prompt a person.
     */
    confirm?: BetaComputerConfirmCallable | undefined;
    /**
     * Optional fields set on the `tools[]` entry itself rather than on a member: `{ cache_control: { type: 'ephemeral' } }`.
     * Naming `configs` here throws: the `configs` option sets it.
     */
    toolConfigs?: BetaToolConfigs | undefined;
}
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
export declare abstract class BetaAbstractComputerToolset20260801 implements BetaRunnableComputerToolset {
    #private;
    readonly type: "computer_toolset_20260801";
    /** The API sets `tool_use.toolset_name` to this value on every call to this toolset. */
    readonly toolsetName: "computer";
    readonly [SDK_HELPER_SYMBOL]: StainlessHelperHeaderValue;
    constructor(options?: BetaComputerToolsetOptions);
    /**
     * The wire `configs`: the caller's, plus `enabled: false` for every member this class does not serve; `null` when
     * the entry carries none. Frozen and read-only (`toolset.configs = …` throws): it is what the dispatch gate reads
     * and what `toJSON()` copies.
     */
    get configs(): BetaComputerToolsetConfigs | null;
    /**
     * The tool runner and `toolResult` call this to run the member `toolUse.name` through the pipeline. It returns the
     * `tool_result` content, or throws a `ToolError` for a refusal or failure, with the blocks as they were thrown. It
     * is not an extension point. Override `execute` or a member method instead.
     */
    run(ctx: BetaToolRunContext, toolUse: BetaToolUseBlock): Promise<BetaToolsetContent>;
    /**
     * Answer one member `tool_use` for a hand-written loop: runs it through the same pipeline as the
     * tool runner and returns the `tool_result` block, `toolset_name` and `is_error` set. It never
     * throws a `ToolError`; a `ToolsetUsageError` still propagates.
     */
    toolResult(toolUse: BetaToolUseBlock): Promise<BetaToolResultBlockParam>;
    /**
     * The `tools[]` entry: your `toolConfigs` fields, the type, and the wire `configs`. A fresh deep copy each call, so
     * nothing you do to it changes the toolset; subclass state (a display connection, counters) never reaches the
     * request.
     */
    toJSON(): BetaComputerToolset20260801;
    /**
     * Release the desktop when you are done. The tool runner never calls it, so one instance can serve several runs.
     *
     * - A call that arrives afterwards throws `ToolsetClosedError`.
     * - It waits for calls already accepted.
     * - Inside a member, call `void this.close()`, since awaiting it there would wait on its own call.
     * - `await using` runs it where the engine supports that, but the class declares no `[Symbol.asyncDispose]`
     *   type, so TypeScript callers use `try` / `finally`.
     */
    close(): Promise<void>;
    /**
     * Dispatch one member call to its method.
     *
     * Override it for hooks around every member, and call `super.execute(ctx, name, input)` from the override.
     * `confirm` still runs first.
     *
     * A subclass that overrides it receives calls for every member. A member it does not implement throws
     * `UnavailableMemberError`, so use `configs` to turn off the ones it does not handle.
     */
    protected execute(ctx: BetaToolsetCallContext, name: BetaComputerMemberName, input: BetaComputerMemberInput): Promise<BetaComputerMemberResult>;
    /** Default body of every member: the model called a member this driver does not implement. */
    protected unavailable(name: BetaComputerMemberName, _ctx?: BetaToolsetCallContext, _input?: unknown): never;
    protected key(ctx: Ctx, input: BetaComputerKeyInput): Result<'key'>;
    protected hold_key(ctx: Ctx, input: BetaComputerHoldKeyInput): Result<'hold_key'>;
    /** The `type` member; named `type_` because `type` is the entry's wire field on this object. */
    protected type_(ctx: Ctx, input: BetaComputerTypeInput): Result<'type'>;
    protected cursor_position(ctx: Ctx, input: BetaComputerCursorPositionInput): Result<'cursor_position'>;
    protected mouse_move(ctx: Ctx, input: BetaComputerMouseMoveInput): Result<'mouse_move'>;
    protected left_mouse_down(ctx: Ctx, input: BetaComputerLeftMouseDownInput): Result<'left_mouse_down'>;
    protected left_mouse_up(ctx: Ctx, input: BetaComputerLeftMouseUpInput): Result<'left_mouse_up'>;
    protected left_click(ctx: Ctx, input: BetaComputerLeftClickInput): Result<'left_click'>;
    protected left_click_drag(ctx: Ctx, input: BetaComputerLeftClickDragInput): Result<'left_click_drag'>;
    protected right_click(ctx: Ctx, input: BetaComputerRightClickInput): Result<'right_click'>;
    protected middle_click(ctx: Ctx, input: BetaComputerMiddleClickInput): Result<'middle_click'>;
    protected double_click(ctx: Ctx, input: BetaComputerDoubleClickInput): Result<'double_click'>;
    protected triple_click(ctx: Ctx, input: BetaComputerTripleClickInput): Result<'triple_click'>;
    protected scroll(ctx: Ctx, input: BetaComputerScrollInput): Result<'scroll'>;
    protected wait(ctx: Ctx, input: BetaComputerWaitInput): Result<'wait'>;
    protected screenshot(ctx: Ctx, input: BetaComputerScreenshotInput): Result<'screenshot'>;
    protected zoom(ctx: Ctx, input: BetaComputerZoomInput): Result<'zoom'>;
}
export {};
//# sourceMappingURL=computer.d.ts.map