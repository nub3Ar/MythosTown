/**
 * Every place a page- or model-supplied string is normalised or cut before it reaches the model, a log, or an
 * SDK-written line: one file, so what each does and how they differ can be read side by side.
 *
 * - `oneLine`: any page- or model-supplied value that goes into one line of text (a title, a download error, a field
 *   of a confirmation line): line breaks, controls and bidi characters folded to a space, a lone surrogate to U+FFFD,
 *   trimmed, cut to the API's field limit. `logSafe` and `quotedName` are the same, cut short, for a log record or a
 *   name echoed inside quotes.
 * - `errorText` / `errorTextContent`: an exception's text as an `is_error` result holds it (as a function tool's
 *   does), cut to the field limit, and the text-only content such a result may hold.
 * - `boundedTabURL`: a tab's or download's reported URL folded to one line and held to the field limit.
 * - `wellFormed`: lone surrogates replaced, used by all of the above.
 * - `cutPoints`: the code-point-safe cut the others use.
 */
import type { BetaTextBlockParam } from "../../../resources/beta.js";
import type { BetaToolsetContent } from "../../tools/BetaRunnableToolset.js";
/**
 * C0 and C1 controls, the line separators and the bidi controls: anything that would break or reorder the one line a
 * page- or model-supplied value goes into.
 */
export declare const LINE_UNSAFE = "\\x00-\\x1f\\x7f-\\x9f\\u061c\\u200e\\u200f\\u2028\\u2029\\u202a-\\u202e\\u2066-\\u2069";
/** `text` with each unpaired surrogate replaced by U+FFFD, so it can be sent. */
export declare function wellFormed(text: string): string;
/**
 * The API's limit for a text field of the block, for a URL, and the most of an exception's text an `is_error` result
 * holds.
 */
export declare const FIELD_MAX = 4096;
/**
 * A page- or model-supplied text on one line the model or an operator reads: a tab's title, a download's
 * error, a field of a member's confirmation line. Line breaks, control and bidi characters are folded to
 * spaces, a lone surrogate to U+FFFD, the ends trimmed, and the whole cut to `limit`.
 */
export declare function oneLine(text: string, limit?: number): string;
/** `Error: <message>` for a thrown value other than a `ToolError`: an `Error`'s message, else it as a string. */
export declare function thrownErrorText(e: unknown): string;
/**
 * A caught exception's text as the `is_error` result the model reads (the same `Error: <message>` a failing function
 * tool produces), made well-formed and cut to the field limit: a driver's exception can embed a page-sized payload.
 */
export declare function errorText(error: unknown): string;
/**
 * The first `limit` code points of `text`: a cut by UTF-16 units could split a surrogate pair, and a lone surrogate
 * fails the request.
 */
export declare function cutPoints(text: string, limit: number): string;
/**
 * A tab's or download's URL as the model reads it: the driver's string folded to one line (line breaks, control and
 * bidi characters a space, a lone surrogate U+FFFD) and held to the API's limit (`FIELD_MAX`, counted in code points).
 * Nothing is parsed. A longer one becomes `…` and its first 4,095 code points, so that the cut text parses to no site.
 */
export declare function boundedTabURL(url: string): string;
/**
 * The text blocks of a `ToolError`'s content. Deliberate, like the empty-content placeholder: the API accepts only
 * text on an is_error result and answers anything else with a 400 that ends the run, so an image a member attached to
 * its refusal is dropped here rather than ending the whole loop. The refusal's text still reaches the model.
 */
export declare function errorTextContent(content: string | BetaToolsetContent): string | BetaTextBlockParam[];
//# sourceMappingURL=sanitize.d.ts.map