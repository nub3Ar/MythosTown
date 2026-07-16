import { APIUserAbortError } from "../../../core/error.mjs";
import { ToolError } from "../../tools/ToolError.mjs";
import { ToolsetContractError, ToolsetUsageError } from "./errors.mjs";
import { errorText, errorTextContent, thrownErrorText, wellFormed } from "./sanitize.mjs";
import { toolsetFamily } from "./family.mjs";
/**
 * What the runner answers for a toolset member it did not run because an earlier member of the same toolset failed
 * in the same assistant turn: the model planned those actions as a sequence, and a later one rarely makes sense once
 * an earlier one did not happen. The browser toolset's text; `notExecutedText` gives each family its own.
 */
export const NOT_EXECUTED = 'Not executed: an earlier action in this turn failed.';
const NOT_EXECUTED_BY_FAMILY = {
    browser: NOT_EXECUTED,
    computer: 'Not executed: an earlier computer action in this turn failed.',
};
/** The not-executed text for `family` (a `tool_use.toolset_name`), or the browser's for a family the SDK doesn't know. */
export function notExecutedText(family) {
    return Object.prototype.hasOwnProperty.call(NOT_EXECUTED_BY_FAMILY, family) ?
        NOT_EXECUTED_BY_FAMILY[family]
        : NOT_EXECUTED;
}
/**
 * The `tool_result` answering a member `tool_use`. `toolset_name` is required on a member result (the API rejects a
 * mismatch), so it is echoed on error paths too.
 */
export function toolsetResultBlock(toolUse, content, isError = false) {
    if (isError && (content === '' || (Array.isArray(content) && content.length === 0))) {
        // Deliberate: an empty ToolError (`throw new ToolError('')`, or one whose non-text blocks were dropped) would be
        // an is_error result with empty content, which the API rejects with a 400, ending the whole run over a refusal
        // the model could have recovered from. The model still learns the call failed, and the developer loses nothing
        // they wrote.
        content = 'The tool call failed with an empty error message.';
    }
    return {
        type: 'tool_result',
        tool_use_id: toolUse.id,
        toolset_name: toolUse.toolset_name ?? null,
        content,
        ...(isError ? { is_error: true } : {}),
    };
}
/**
 * What never becomes a tool result: a `ToolsetUsageError` propagates as it is, and once the call's own `AbortSignal`
 * has aborted the cancellation propagates as `APIUserAbortError`, whatever was thrown after it. An error named
 * `AbortError` that a driver throws while that signal has not aborted (a page-aborted request, a driver's own timeout)
 * is the driver's failure, not a cancellation.
 */
export function throwIfPropagates(error, ctx) {
    if (error instanceof ToolsetUsageError)
        throw error;
    throwIfAborted(ctx.signal);
}
/** Once `signal` has aborted, throws the `APIUserAbortError` an aborted request throws, so one `catch` covers both. */
export function throwIfAborted(signal) {
    if (signal?.aborted)
        throw new APIUserAbortError();
}
/**
 * How an exception out of a member call is classified, at the `execute` boundary and in the runner alike: what
 * `throwIfPropagates` covers propagates, a `ToolError` is the member's own refusal, and anything else a driver throws
 * (its `TypeError` included) becomes a refusal the model reads, so the loop continues.
 */
export function classify(error, ctx) {
    throwIfPropagates(error, ctx);
    if (error instanceof ToolError)
        return error;
    // Not cut here: the toolset cuts the text to the field limit when it builds the result.
    return new ToolError(wellFormed(thrownErrorText(error)));
}
/**
 * Runs one member `tool_use` against `toolset` and builds its `tool_result`. Throws if `toolUse`
 * is not a member call of this family: a block without `toolset_name` is a plain tool (possibly a
 * custom tool sharing a member name) and must never be routed here.
 */
export async function runToolsetMember(toolset, toolUse, options = {}) {
    const family = toolsetFamily(toolset);
    if (toolUse.toolset_name !== family) {
        // a caller's routing mistake, like every other misuse of the toolset's API
        throw new ToolsetContractError(`tool_use ${JSON.stringify(toolUse.id)} (toolset_name=${JSON.stringify(toolUse.toolset_name ?? null)}, name=${JSON.stringify(toolUse.name)}) is not a member call of the ${JSON.stringify(family)} toolset`);
    }
    const ctx = { ...options, toolUse, toolUseBlock: toolUse };
    try {
        return toolsetResultBlock(toolUse, await toolset.run(ctx, toolUse));
    }
    catch (e) {
        // `classify`, as an is_error result: a converted exception is cut to the field limit here
        throwIfPropagates(e, ctx);
        return toolsetResultBlock(toolUse, errorTextContent(e instanceof ToolError ? e.content : errorText(e)), true);
    }
}
//# sourceMappingURL=run.mjs.map