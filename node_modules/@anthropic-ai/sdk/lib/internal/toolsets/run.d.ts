/**
 * What the SDK does around one member call of a runnable toolset: the `tool_result` that answers the call, and how
 * an exception out of a member is classified. Kept out of `BetaRunnableToolset`, which is public and holds only the
 * toolset contract.
 */
import type { BetaToolResultBlockParam, BetaToolUseBlock } from "../../../resources/beta.js";
import { type BetaToolRunContext } from "../../tools/BetaRunnableTool.js";
import { ToolError } from "../../tools/ToolError.js";
import type { BetaRunnableToolset, BetaToolsetContent } from "../../tools/BetaRunnableToolset.js";
/**
 * What the runner answers for a toolset member it did not run because an earlier member of the same toolset failed
 * in the same assistant turn: the model planned those actions as a sequence, and a later one rarely makes sense once
 * an earlier one did not happen. The browser toolset's text; `notExecutedText` gives each family its own.
 */
export declare const NOT_EXECUTED = "Not executed: an earlier action in this turn failed.";
/** The not-executed text for `family` (a `tool_use.toolset_name`), or the browser's for a family the SDK doesn't know. */
export declare function notExecutedText(family: string): string;
/**
 * The `tool_result` answering a member `tool_use`. `toolset_name` is required on a member result (the API rejects a
 * mismatch), so it is echoed on error paths too.
 */
export declare function toolsetResultBlock(toolUse: BetaToolUseBlock, content: string | BetaToolsetContent, isError?: boolean): BetaToolResultBlockParam;
/**
 * What never becomes a tool result: a `ToolsetUsageError` propagates as it is, and once the call's own `AbortSignal`
 * has aborted the cancellation propagates as `APIUserAbortError`, whatever was thrown after it. An error named
 * `AbortError` that a driver throws while that signal has not aborted (a page-aborted request, a driver's own timeout)
 * is the driver's failure, not a cancellation.
 */
export declare function throwIfPropagates(error: unknown, ctx: {
    signal?: AbortSignal | undefined | null;
}): void;
/** Once `signal` has aborted, throws the `APIUserAbortError` an aborted request throws, so one `catch` covers both. */
export declare function throwIfAborted(signal: AbortSignal | undefined | null): void;
/**
 * How an exception out of a member call is classified, at the `execute` boundary and in the runner alike: what
 * `throwIfPropagates` covers propagates, a `ToolError` is the member's own refusal, and anything else a driver throws
 * (its `TypeError` included) becomes a refusal the model reads, so the loop continues.
 */
export declare function classify(error: unknown, ctx: {
    signal?: AbortSignal | undefined | null;
}): ToolError;
/**
 * Runs one member `tool_use` against `toolset` and builds its `tool_result`. Throws if `toolUse`
 * is not a member call of this family: a block without `toolset_name` is a plain tool (possibly a
 * custom tool sharing a member name) and must never be routed here.
 */
export declare function runToolsetMember(toolset: BetaRunnableToolset, toolUse: BetaToolUseBlock, options?: Omit<BetaToolRunContext, 'toolUse' | 'toolUseBlock'>): Promise<BetaToolResultBlockParam>;
//# sourceMappingURL=run.d.ts.map