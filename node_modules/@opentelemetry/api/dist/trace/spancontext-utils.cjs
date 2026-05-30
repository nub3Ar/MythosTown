require("./invalid-span-constants.cjs");
const require_NonRecordingSpan = require("./NonRecordingSpan.cjs");
//#region src/trace/spancontext-utils.ts
const isHex = new Uint8Array([
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	1,
	1,
	1,
	1,
	1,
	1,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	1,
	1,
	1,
	1,
	1,
	1
]);
function isValidHex(id, length) {
	if (typeof id !== "string" || id.length !== length) return false;
	let r = 0;
	for (let i = 0; i < id.length; i += 4) r += (isHex[id.charCodeAt(i)] | 0) + (isHex[id.charCodeAt(i + 1)] | 0) + (isHex[id.charCodeAt(i + 2)] | 0) + (isHex[id.charCodeAt(i + 3)] | 0);
	return r === length;
}
/**
* @since 1.0.0
*/
function isValidTraceId(traceId) {
	return isValidHex(traceId, 32) && traceId !== "00000000000000000000000000000000";
}
/**
* @since 1.0.0
*/
function isValidSpanId(spanId) {
	return isValidHex(spanId, 16) && spanId !== "0000000000000000";
}
/**
* Returns true if this {@link SpanContext} is valid.
* @return true if this {@link SpanContext} is valid.
*
* @since 1.0.0
*/
function isSpanContextValid(spanContext) {
	return isValidTraceId(spanContext.traceId) && isValidSpanId(spanContext.spanId);
}
/**
* Wrap the given {@link SpanContext} in a new non-recording {@link Span}
*
* @param spanContext span context to be wrapped
* @returns a new non-recording {@link Span} with the provided context
*/
function wrapSpanContext(spanContext) {
	return new require_NonRecordingSpan.NonRecordingSpan(spanContext);
}
//#endregion
exports.isSpanContextValid = isSpanContextValid;
exports.isValidSpanId = isValidSpanId;
exports.isValidTraceId = isValidTraceId;
exports.wrapSpanContext = wrapSpanContext;

//# sourceMappingURL=spancontext-utils.cjs.map