/**
 * Turns what a browser or computer member returned into `tool_result` content, and a `BetaBrowserState` into the
 * `browser_state` block.
 *
 * The registry row gives each member's result kind, and the renderer reads the fields it needs off
 * that result. A pure action renders as its fixed acknowledgment, followed by the line it
 * returned, if any. The tab-management members render no content of their own: the API accepts the
 * `browser_state` block as their whole result and produces the text the model reads from it.
 */
import type { BetaBrowserStateBlockParam, BetaBrowserStateChange, BetaBrowserStateTabEntry, BetaTextBlockParam } from "../../../resources/beta.mjs";
import type { BetaToolsetContent } from "../../tools/BetaRunnableToolset.mjs";
import type { ToolsetMember } from "./core.mjs";
import type { BetaFilePolicy } from "./hooks.mjs";
import type { ComputerTypedResult } from "./computer-members.mjs";
import type { TypedResult } from "./registry.mjs";
import type { BetaDialogDismissed, BetaNavigationRefused } from "./results.mjs";
import type { Report } from "./pipeline.mjs";
/**
 * The line the model reads, once, for any number of `BetaNavigationRefused` entries in a report. Nothing else in an
 * entry is echoed: it is shaped by the page that was refused.
 */
export declare const NAVIGATION_REFUSED_LINE = "A navigation was refused.";
export declare function text(value: string): BetaTextBlockParam;
/**
 * The line a pure action returned, as written (not yet checked, folded or cut). `undefined` when it returned none (or
 * anything but a non-empty string). The browser pipeline runs the error-text check on it first; `renderResult` then
 * folds and bounds it.
 */
export declare function actionLine(member: ToolsetMember, result: RenderedResult | undefined): string | undefined;
/** A result the renderer reads: either family's typed result, by its result kind. */
export type RenderedResult = TypedResult | ComputerTypedResult;
/** The content blocks for a member's result, by the registry's result kind. */
export declare function renderResult(member: ToolsetMember, input: unknown, result: RenderedResult): BetaToolsetContent;
export declare function isNavigationRefused(change: BetaBrowserStateChange | BetaNavigationRefused | BetaDialogDismissed): change is BetaNavigationRefused;
export declare function isDialogDismissed(change: BetaBrowserStateChange | BetaNavigationRefused | BetaDialogDismissed): change is BetaDialogDismissed;
/** The wire change kinds that have a page-supplied `url` (and possibly a local `path` or an `error`). */
export type DownloadChange = Exclude<BetaBrowserStateChange, {
    type: 'tab_opened';
}>;
export declare function isDownloadChange(change: BetaBrowserStateChange | BetaNavigationRefused | BetaDialogDismissed): change is DownloadChange;
/**
 * One line per dismissed dialog the driver reported (`A confirm dialog "…" was dismissed.`), the message capped and
 * at most a few lines, then a count of the rest, because a page can open dialogs in a loop.
 */
export declare function dialogLines(dialogs: readonly BetaDialogDismissed[]): string[];
/**
 * The state changes a block includes: those held back from an earlier call whose result never reached the model,
 * then this report's own, coalesced so the list meets the API's rules however the driver filled it. Of the download
 * changes the latest per `download_id` is kept, where it stands; of the `tab_opened` changes the first per tab, and
 * only for a tab the report still lists. The SDK's own kinds never reach here (see `reportOf`).
 */
export declare function coalesceChanges(pending: readonly BetaBrowserStateChange[], report: Report): BetaBrowserStateChange[];
/**
 * The file policy's verdict on one download path, hidden without a policy. The answer is awaited, so the predicate
 * may be `async`. Anything but `true` keeps the path hidden. A `ToolsetUsageError` propagates. Any other exception
 * or rejection from the predicate fails closed: the path stays hidden and the report, with its changes, still goes
 * out.
 */
export declare function pathVisible(filePolicy: BetaFilePolicy | undefined, path: string): Promise<boolean>;
/**
 * The `browser_state` block: the driver's tabs with each URL and title folded to one line and held to the API's length
 * limit, and `changes` with a download's `url` and a failed download's `error` bounded the same way and its `path`
 * removed from every download change, kept only on a `download_completed` whose path the file policy exposes to the
 * model and folding would leave unchanged.
 */
export declare function renderBrowserState(tabs: readonly BetaBrowserStateTabEntry[], changes: readonly BetaBrowserStateChange[], filePolicy: BetaFilePolicy | undefined): Promise<BetaBrowserStateBlockParam>;
//# sourceMappingURL=render.d.mts.map