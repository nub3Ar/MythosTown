/**
 * The stages of a member call that are plain computation: the input check, error classification,
 * rendering the outcome with the browser state. `run` on the toolset class fixes the order and does the
 * awaiting.
 */
import type { BetaBrowserMemberInput, BetaBrowserStateChange, BetaBrowserStateTabEntry } from "../../../resources/beta.mjs";
import type { BetaToolsetContent } from "../../tools/BetaRunnableToolset.mjs";
import { ToolError } from "../../tools/ToolError.mjs";
import { MemberCall } from "./core.mjs";
import type { BetaConfirmContext, BetaFilePolicy, BetaURLContext } from "./hooks.mjs";
import { type Member, type TypedResult } from "./registry.mjs";
import type { BetaBrowserState, BetaDialogDismissed } from "./results.mjs";
/** One browser member call in flight: what each stage produced, for the stages after it, and the tab it is about. */
export declare class CallRecord extends MemberCall<Member, BetaBrowserMemberInput, TypedResult> {
    /**
     * The tab the call names, or undefined when it names none (an absent or empty `tab_id` both mean the
     * active tab, as they do to a driver).
     */
    get tabId(): string | undefined;
}
/**
 * The model's `tool_use.input`, copied and typed as the member's input type. Nothing is checked here: every field stays
 * in the copy as sent, declared or not. If the driver throws on a field, the error becomes an `is_error` result.
 *
 * `confirm` gets the copy as `ctx.input`, and the driver gets it as `input`. `browserState` does not get the copy.
 * All three get `ctx.toolUse.input`, the input as the model sent it.
 */
export declare function parseInput(raw: unknown): BetaBrowserMemberInput;
/**
 * The driver's report as the pipeline reads it, built once: the tabs and the wire changes with each page-supplied URL
 * bounded, and the SDK's own change kinds set apart, since they reach the model as text.
 */
export interface Report {
    readonly tabs: BetaBrowserStateTabEntry[];
    readonly changes: BetaBrowserStateChange[];
    readonly navigationRefused: boolean;
    readonly dialogs: BetaDialogDismissed[];
}
/**
 * The checked `BetaBrowserState` as a `Report`: its tabs and wire changes as they stand, the SDK's own change kinds set
 * apart.
 */
export declare function reportOf(state: BetaBrowserState): Report;
/**
 * The report with each tab's and each download's page-supplied URL as the model will read it (folded to one line and
 * held to the API's limit, see `boundedTabURL`) before anything else reads or forwards it.
 * Tab entries are copies, so the inventory kept for the next call never aliases the driver's objects; state
 * changes are the driver's objects unless a URL was bounded.
 */
export declare function withBoundedTabURLs(state: BetaBrowserState): BetaBrowserState;
/**
 * A `new_tab` result must include exactly one `tab_opened`: the tab it opened. A popup the page opened around the
 * same time (drained by this call, or held back from a call whose result never reached the model) is still news,
 * so its `tab_opened` waits for the next block rather than making this one invalid. When the driver reported no
 * `tab_opened` for the opened tab, one is added.
 */
export declare function holdOtherTabOpened(call: CallRecord, changes: BetaBrowserStateChange[]): {
    keep: BetaBrowserStateChange[];
    held: BetaBrowserStateChange[];
};
/**
 * Which tab a call is about: the tab it names by `tab_id`, else the active tab.
 * `undefined` when the named tab is not in the report (or nothing is active).
 */
export declare function targetTab(tabs: readonly BetaBrowserStateTabEntry[], tabId: string | undefined): BetaBrowserStateTabEntry | undefined;
/** Per-toolset bookkeeping kept across calls. */
export declare class PipelineState {
    #private;
    /**
     * State changes a call drained but could not send: a failed call's, or another tab's `tab_opened` held back from a
     * `new_tab` result. They go out with the next block that can hold them.
     */
    pendingChanges: BetaBrowserStateChange[];
    /** A refused-navigation line that could not be attached yet (the result was state-only). */
    refusalPending: boolean;
    /** Dismissed dialogs whose lines could not be attached yet (the result was state-only). */
    dialogsPending: BetaDialogDismissed[];
    /**
     * The tab inventory of the most recent report: what `confirm` receives.
     * `undefined` before the first report (a report may list no tabs).
     */
    lastTabs: BetaBrowserStateTabEntry[] | undefined;
    /**
     * Render the call's outcome with the browser state the driver just reported.
     *
     * On success the content is the member's rendering plus the `browser_state` block (with any changes
     * held back earlier). On failure, and for a `new_tab` whose tab the report does not show as the only active tab,
     * the changes are held back for the next block, because an error result cannot include one, and the content is
     * the error text plus any refused-navigation and dismissed-dialog lines, since those are often why the member
     * failed.
     */
    finish(call: CallRecord, report: Report, filePolicy: BetaFilePolicy | undefined): Promise<{
        content: BetaToolsetContent;
        isError: boolean;
    }>;
}
/**
 * `error` with each text block cut to the API's field limit, or the same object when nothing was cut: a driver's
 * exception can embed a page-sized payload.
 */
export declare function boundedError(error: ToolError): ToolError;
export declare const HISTORY_NAVIGATION: ReadonlySet<string>;
export declare function urlContext(record: CallRecord): BetaURLContext;
/**
 * The `url` of a `navigate` call exactly as the model wrote it, for the URL policy. `undefined` for the history words
 * `back` / `forward` / `reload` (the driver receives the canonical lower-case word) and for other members.
 */
export declare function navigateRequestURL(record: CallRecord): string | undefined;
/**
 * A policy that threw refused the URL. A ToolError contains the text the model should read. Any other exception's
 * message may contain the URL it refused, so the model reads the SDK's own line instead. A TypeError out of your policy
 * is a refusal like any other exception, not a `ToolsetUsageError`.
 */
export declare function policyRefusal(error: unknown): ToolError;
/**
 * For `file_upload`: run `input.paths` and `input.document_ids` through the file policy before dispatch. Without a
 * file policy, an upload that names either is refused. In `ctx.input`, `confirm` gets the paths and document ids the
 * policy returned. The member gets them in `input`. A refused path or document stops the call before `confirm` or the
 * member runs. `browserState` still runs after a refusal. Its `ctx.toolUse.input` is the input as the model sent it.
 * That input includes the refused entries.
 */
export declare function resolveUploadPaths(record: CallRecord, filePolicy: BetaFilePolicy | undefined): Promise<void>;
/**
 * What the `confirm` callable receives: the member and its input, and the tab the call targets (named, else active)
 * with its URL, as of the last report and with no page read.
 */
export declare function confirmContext(record: CallRecord, pipeline: PipelineState): BetaConfirmContext;
//# sourceMappingURL=pipeline.d.mts.map