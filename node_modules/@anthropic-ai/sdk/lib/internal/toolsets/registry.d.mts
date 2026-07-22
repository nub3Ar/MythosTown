/**
 * The browser member registry: one row per member, from which most per-member tables derive.
 *
 * Member names and input types come from the API's `tool_use` union (`inputs.ts`). What is kept by
 * hand here is what the API types lack: each member's result kind, the confirmation text the
 * model reads after a pure action, which members the API disables by default, and which members render
 * only a `browser_state` block. A test diffs the member set and the default-disabled set against the
 * published toolset definition so the two cannot drift silently.
 */
import type { BetaBrowserStateTabEntry, BetaBrowserToolsetConfigs } from "../../../resources/beta.mjs";
import { type BetaScreenshotResult, type KindResultOf, type Registry, type ResultKind, type ToolsetMember, type TypedResultOf } from "./core.mjs";
import type { BrowserMemberInputs, BetaBrowserMemberName } from "./inputs.mjs";
import type { BetaBrowserNavigateResult } from "./results.mjs";
export declare const FAMILY: "browser";
/**
 * Members whose calls wait for a person unless the application says otherwise: page content can steer what the
 * model asks them to do, and what they do reaches outside the page.
 */
export declare const CONFIRM_REQUIRED: ReadonlySet<string>;
export declare const TOOLSET_TYPE: "browser_toolset_20260801";
/**
 * What each browser member's implementation returns. A pure action returns nothing, or one line of text the model reads
 * in a text block of its own after the SDK's acknowledgment.
 */
export interface BrowserMemberResults {
    navigate: BetaBrowserNavigateResult;
    screenshot: BetaScreenshotResult;
    zoom: BetaScreenshotResult;
    left_click: void | string;
    right_click: void | string;
    middle_click: void | string;
    double_click: void | string;
    triple_click: void | string;
    hover: void | string;
    left_click_drag: void | string;
    left_mouse_down: void | string;
    left_mouse_up: void | string;
    mouse_move: void | string;
    scroll: void | string;
    scroll_to: void | string;
    type: void | string;
    key: void | string;
    hold_key: void | string;
    form_input: void | string;
    read_page: string;
    find: string;
    get_page_text: string;
    wait: void | string;
    file_upload: void | string;
    read_console: string;
    read_network: string;
    javascript_exec: string;
    new_tab: BetaBrowserStateTabEntry;
    list_tabs: BetaBrowserStateTabEntry[];
    switch_tab: BetaBrowserStateTabEntry;
    close_tab: void;
}
/** The type-level registry: what the model sends and what the implementation returns, per member. */
export type BrowserMembers = {
    [K in BetaBrowserMemberName]: {
        input: BrowserMemberInputs[K];
        result: BrowserMemberResults[K];
    };
};
/** One member of the browser toolset. */
export type Member = ToolsetMember<BetaBrowserMemberName, BrowserResultKind>;
declare const ROWS: {
    readonly navigate: readonly ["navigate", null, true];
    readonly screenshot: readonly ["screenshot", null, true];
    readonly zoom: readonly ["screenshot", null, true];
    readonly left_click: readonly ["none", "Clicked.", true];
    readonly right_click: readonly ["none", "Right-clicked.", true];
    readonly middle_click: readonly ["none", "Middle-clicked.", true];
    readonly double_click: readonly ["none", "Double-clicked.", true];
    readonly triple_click: readonly ["none", "Triple-clicked.", true];
    readonly hover: readonly ["none", "Hovered.", true];
    readonly left_click_drag: readonly ["none", "Dragged.", true];
    readonly left_mouse_down: readonly ["none", "Mouse button pressed.", true];
    readonly left_mouse_up: readonly ["none", "Mouse button released.", true];
    readonly mouse_move: readonly ["none", "Moved the mouse.", true];
    readonly scroll: readonly ["none", "Scrolled {scroll_direction}.", true];
    readonly scroll_to: readonly ["none", "Scrolled to {ref}.", true];
    readonly type: readonly ["none", "Typed.", true];
    readonly key: readonly ["none", "Pressed {text}.", true];
    readonly hold_key: readonly ["none", "Held {text} for {duration}s.", true];
    readonly form_input: readonly ["none", "Set the value of {ref}.", true];
    readonly read_page: readonly ["text", null, true];
    readonly find: readonly ["text", null, true];
    readonly get_page_text: readonly ["text", null, true];
    readonly wait: readonly ["none", "Waited {duration}s.", true];
    readonly file_upload: readonly ["none", "Uploaded.", false];
    readonly read_console: readonly ["text", null, false];
    readonly read_network: readonly ["text", null, false];
    readonly javascript_exec: readonly ["text", null, false];
    readonly new_tab: readonly ["tab", null, true];
    readonly list_tabs: readonly ["tabs", null, true];
    readonly switch_tab: readonly ["tab", null, true];
    readonly close_tab: readonly ["none", null, true];
};
/** The result kinds the rows above use. */
export type BrowserResultKind = (typeof ROWS)[BetaBrowserMemberName][0];
/** The declared result (`BrowserMemberResults`) of every member the rows above give result kind `R`. */
export type KindResult<R extends ResultKind> = KindResultOf<BetaBrowserMemberName, typeof ROWS, BrowserMemberResults, R>;
/** A browser member's result with its result kind, which says how to read it. */
export type TypedResult<R extends BrowserResultKind = BrowserResultKind> = TypedResultOf<BetaBrowserMemberName, typeof ROWS, BrowserMemberResults, R>;
/**
 * `value` typed as what a member of result kind `kind` returns: the one place the driver's declared result type is
 * taken at its word.
 */
export declare function typedResult<R extends BrowserResultKind>(kind: R, value: KindResult<R>): TypedResult<R>;
type RowName = keyof typeof ROWS;
/**
 * Every browser member name, in the order of `ROWS`. Built from the table, not imported from the generated runtime list,
 * so the toolset modules do not load `resources/beta/messages/messages` (the runner loads them from there).
 */
export declare const BROWSER_MEMBER_NAMES: ReadonlyArray<RowName>;
/** Every browser member, in the order of `ROWS`. */
export declare const BROWSER_MEMBERS: ReadonlyMap<BetaBrowserMemberName, Member>;
/** Members the API withholds unless `configs` enables them. */
export declare const BROWSER_DEFAULT_DISABLED_MEMBERS: ReadonlySet<string>;
/** The browser registry as the shared toolset core reads it. */
export declare const BROWSER_REGISTRY: Registry<BetaBrowserMemberName, Member>;
export declare function getMember(name: string): Member | undefined;
/**
 * The tab members, which render no content of their own, so their non-error result is exactly one `browser_state`
 * block, and a line meant for the model (a refused navigation) waits for the next result that can hold it. Listed by
 * name rather than derived from `ROWS`, so a tab member that gains a confirmation line stays in the set.
 */
export declare const STATE_ONLY_MEMBERS: ReadonlySet<BetaBrowserMemberName>;
/** The wire entry's `configs`, read as `{ [member]: { enabled? } }`. */
export type MemberConfigs = BetaBrowserToolsetConfigs | undefined;
/** Whether `configs` leave the browser member `name` enabled (`isEnabled` over the browser defaults). */
export declare function memberEnabled(name: string, configs: MemberConfigs): boolean;
export {};
//# sourceMappingURL=registry.d.mts.map