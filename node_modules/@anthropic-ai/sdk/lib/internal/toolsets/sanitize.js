"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIELD_MAX = exports.LINE_UNSAFE = void 0;
exports.wellFormed = wellFormed;
exports.oneLine = oneLine;
exports.logSafe = logSafe;
exports.quotedName = quotedName;
exports.thrownErrorText = thrownErrorText;
exports.errorText = errorText;
exports.cutPoints = cutPoints;
exports.boundedTabURL = boundedTabURL;
exports.errorTextContent = errorTextContent;
/**
 * C0 and C1 controls, the line separators and the bidi controls: anything that would break or reorder the one line a
 * page- or model-supplied value goes into.
 */
exports.LINE_UNSAFE = '\\x00-\\x1f\\x7f-\\x9f\\u061c\\u200e\\u200f\\u2028\\u2029\\u202a-\\u202e\\u2066-\\u2069';
const CONTROL_RE = /* @__PURE__ */ (() => new RegExp(`[${exports.LINE_UNSAFE}]+`, 'g'))();
// An unpaired surrogate cannot be encoded as UTF-8: in a page-chosen string it would fail every request for as long
// as the driver keeps reporting it. Folded to U+FFFD wherever page text is normalised (with the `u` flag the class
// matches a surrogate only when it stands alone).
const LONE_SURROGATE_RE = /[\uD800-\uDFFF]/gu;
/** `text` with each unpaired surrogate replaced by U+FFFD, so it can be sent. */
function wellFormed(text) {
    return text.replace(LONE_SURROGATE_RE, '\uFFFD');
}
/**
 * The API's limit for a text field of the block, for a URL, and the most of an exception's text an `is_error` result
 * holds.
 */
exports.FIELD_MAX = 4096;
const LOG_MAX = 200;
/**
 * A page- or model-supplied text on one line the model or an operator reads: a tab's title, a download's
 * error, a field of a member's confirmation line. Line breaks, control and bidi characters are folded to
 * spaces, a lone surrogate to U+FFFD, the ends trimmed, and the whole cut to `limit`.
 */
function oneLine(text, limit = exports.FIELD_MAX) {
    return cutPoints(wellFormed(text).replace(CONTROL_RE, ' ').trim(), limit);
}
/** A model- or page-supplied name for a log record or an SDK-written error text: `oneLine`, cut short. @internal */
function logSafe(name) {
    return oneLine(name, LOG_MAX);
}
/**
 * A model-chosen name as it is echoed inside single quotes in a text the model reads: one line, cut short, and without
 * the quotes and runs of spaces that could make it read as part of the text around it.
 * @internal
 */
function quotedName(name) {
    return logSafe(name).replace(/[' ]+/g, ' ').trim();
}
/** `Error: <message>` for a thrown value other than a `ToolError`: an `Error`'s message, else it as a string. */
function thrownErrorText(e) {
    return `Error: ${e instanceof Error ? e.message : String(e)}`;
}
/**
 * A caught exception's text as the `is_error` result the model reads (the same `Error: <message>` a failing function
 * tool produces), made well-formed and cut to the field limit: a driver's exception can embed a page-sized payload.
 */
function errorText(error) {
    return cutPoints(wellFormed(thrownErrorText(error)), exports.FIELD_MAX);
}
/**
 * The first `limit` code points of `text`: a cut by UTF-16 units could split a surrogate pair, and a lone surrogate
 * fails the request.
 */
function cutPoints(text, limit) {
    if (text.length <= limit)
        return text; // no more UTF-16 units than the limit: no more code points either
    let end = 0;
    let points = 0;
    for (const ch of text) {
        if (points === limit)
            break;
        points += 1;
        end += ch.length;
    }
    return text.slice(0, end);
}
/**
 * A tab's or download's URL as the model reads it: the driver's string folded to one line (line breaks, control and
 * bidi characters a space, a lone surrogate U+FFFD) and held to the API's limit (`FIELD_MAX`, counted in code points).
 * Nothing is parsed. A longer one becomes `…` and its first 4,095 code points, so that the cut text parses to no site.
 */
function boundedTabURL(url) {
    const line = oneLine(url, Infinity);
    return cutPoints(line, exports.FIELD_MAX) === line ? line : '\u2026' + cutPoints(line, exports.FIELD_MAX - 1);
}
/**
 * The text blocks of a `ToolError`'s content. Deliberate, like the empty-content placeholder: the API accepts only
 * text on an is_error result and answers anything else with a 400 that ends the run, so an image a member attached to
 * its refusal is dropped here rather than ending the whole loop. The refusal's text still reaches the model.
 */
function errorTextContent(content) {
    // The API rejects an `is_error` result whose content is empty or holds a non-text block. Empty text blocks are
    // dropped too, so an error with no text left gets the placeholder from `toolsetResultBlock`.
    if (typeof content === 'string')
        return wellFormed(content);
    return content
        .filter((block) => block.type === 'text' && block.text !== '')
        .map((block) => ({ ...block, text: wellFormed(block.text) }));
}
//# sourceMappingURL=sanitize.js.map