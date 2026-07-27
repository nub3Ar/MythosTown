/**
 * The computer toolset's members: the names and input types, what each member returns, the registry row per member,
 * and the function that copies the model's input.
 *
 * The member names and every input type are the API types in `resources/beta`. A member's result kind is kept by hand.
 * So is the confirmation text the model reads after a pure action. Neither is in the API types. A test diffs the
 * member set against the published toolset definition so the two cannot drift silently.
 */
import type { BetaComputerMemberInput, BetaComputerMemberName, BetaResponseComputerToolUseBlock } from "../../../resources/beta.js";
import { type BetaScreenshotResult, type KindResultOf, type Registry, type ResultKind, type ToolsetMember, type TypedResultOf } from "./core.js";
export declare const COMPUTER_FAMILY: "computer";
export declare const COMPUTER_TOOLSET_TYPE: "computer_toolset_20260801";
export type { BetaComputerMemberName };
export type { BetaComputerMemberInput, BetaComputerCursorPositionInput, BetaComputerLeftMouseDownInput, BetaComputerLeftMouseUpInput, BetaComputerScreenshotInput, } from "../../../resources/beta.js";
/** Each computer member's input type, by member name. */
export type ComputerMemberInputs = {
    [K in BetaComputerMemberName]: Extract<BetaResponseComputerToolUseBlock, {
        name: K;
    }>['input'];
};
/** Where the cursor is, in screenshot pixels. Rendered as `X={x},Y={y}`. */
export interface BetaComputerCursorPositionResult {
    x: number;
    y: number;
}
/** Anything a computer member may return: `execute`'s un-narrowed result type. */
export type BetaComputerMemberResult = BetaScreenshotResult | BetaComputerCursorPositionResult | string | void;
/**
 * What each computer member's implementation returns. A pure action returns nothing, or one line of text the model
 * reads in a text block of its own after the SDK's acknowledgment.
 */
export interface ComputerMemberResults {
    key: void | string;
    hold_key: void | string;
    type: void | string;
    cursor_position: BetaComputerCursorPositionResult;
    mouse_move: void | string;
    left_mouse_down: void | string;
    left_mouse_up: void | string;
    left_click: void | string;
    left_click_drag: void | string;
    right_click: void | string;
    middle_click: void | string;
    double_click: void | string;
    triple_click: void | string;
    scroll: void | string;
    wait: void | string;
    screenshot: BetaScreenshotResult;
    zoom: BetaScreenshotResult;
}
/** One member of the computer toolset. */
export type ComputerMember = ToolsetMember<BetaComputerMemberName, ComputerResultKind>;
declare const ROWS: {
    readonly key: readonly ["none", "Pressed {text}.", true];
    readonly hold_key: readonly ["none", "Held {text} for {duration}s.", true];
    readonly type: readonly ["none", "Typed.", true];
    readonly cursor_position: readonly ["point", null, true];
    readonly mouse_move: readonly ["none", "Moved the mouse.", true];
    readonly left_mouse_down: readonly ["none", "Left mouse button pressed.", true];
    readonly left_mouse_up: readonly ["none", "Left mouse button released.", true];
    readonly left_click: readonly ["none", "Clicked.", true];
    readonly left_click_drag: readonly ["none", "Dragged.", true];
    readonly right_click: readonly ["none", "Right-clicked.", true];
    readonly middle_click: readonly ["none", "Middle-clicked.", true];
    readonly double_click: readonly ["none", "Double-clicked.", true];
    readonly triple_click: readonly ["none", "Triple-clicked.", true];
    readonly scroll: readonly ["none", "Scrolled {scroll_direction}.", true];
    readonly wait: readonly ["none", "Waited {duration}s.", true];
    readonly screenshot: readonly ["screenshot", null, true];
    readonly zoom: readonly ["screenshot", null, true];
};
/** The result kinds the rows above use. */
export type ComputerResultKind = (typeof ROWS)[BetaComputerMemberName][0];
/** The declared result (`ComputerMemberResults`) of every member the rows above give result kind `R`. */
export type ComputerKindResult<R extends ResultKind> = KindResultOf<BetaComputerMemberName, typeof ROWS, ComputerMemberResults, R>;
/** A computer member's result with its result kind, which says how to read it. */
export type ComputerTypedResult<R extends ComputerResultKind = ComputerResultKind> = TypedResultOf<BetaComputerMemberName, typeof ROWS, ComputerMemberResults, R>;
/**
 * `value` typed as what a computer member of result kind `kind` returns: the one place the driver's declared result
 * type is taken at its word.
 */
export declare function typedComputerResult<R extends ComputerResultKind>(kind: R, value: ComputerKindResult<R>): ComputerTypedResult<R>;
type RowName = keyof typeof ROWS;
/**
 * Every computer member name, in the order of `ROWS`. Built from the table, not imported from
 * `BETA_COMPUTER_MEMBER_NAME_VALUES`, so the toolset modules do not load `resources/beta/messages/messages`.
 */
export declare const COMPUTER_MEMBER_NAMES: ReadonlyArray<RowName>;
/** Every computer member, in the order of `ROWS`. */
export declare const COMPUTER_MEMBERS: ReadonlyMap<BetaComputerMemberName, ComputerMember>;
export declare const COMPUTER_CONFIRM_REQUIRED: ReadonlySet<string>;
/** The computer registry as the shared toolset core reads it. No member is off by default. */
export declare const COMPUTER_REGISTRY: Registry<BetaComputerMemberName, ComputerMember>;
/** Copies the model's input. The copy is a spread, so an own `__proto__` key stays an ordinary key. */
export declare function parseComputerInput(raw: unknown): BetaComputerMemberInput;
//# sourceMappingURL=computer-members.d.ts.map