const require_context = require("../context/context.cjs");
const require_context$1 = require("../api/context.cjs");
const require_NonRecordingSpan = require("./NonRecordingSpan.cjs");
//#region src/trace/context-utils.ts
/**
* span key
*/
const SPAN_KEY = require_context.createContextKey("OpenTelemetry Context Key SPAN");
/**
* Return the span if one exists
*
* @param context context to get span from
*/
function getSpan(context) {
	return context.getValue(SPAN_KEY) || void 0;
}
/**
* Gets the span from the current context, if one exists.
*/
function getActiveSpan() {
	return getSpan(require_context$1.ContextAPI.getInstance().active());
}
/**
* Set the span on a context
*
* @param context context to use as parent
* @param span span to set active
*/
function setSpan(context, span) {
	return context.setValue(SPAN_KEY, span);
}
/**
* Remove current span stored in the context
*
* @param context context to delete span from
*/
function deleteSpan(context) {
	return context.deleteValue(SPAN_KEY);
}
/**
* Wrap span context in a NoopSpan and set as span in a new
* context
*
* @param context context to set active span on
* @param spanContext span context to be wrapped
*/
function setSpanContext(context, spanContext) {
	return setSpan(context, new require_NonRecordingSpan.NonRecordingSpan(spanContext));
}
/**
* Get the span context of the span if it exists.
*
* @param context context to get values from
*/
function getSpanContext(context) {
	var _getSpan;
	return (_getSpan = getSpan(context)) === null || _getSpan === void 0 ? void 0 : _getSpan.spanContext();
}
//#endregion
exports.deleteSpan = deleteSpan;
exports.getActiveSpan = getActiveSpan;
exports.getSpan = getSpan;
exports.getSpanContext = getSpanContext;
exports.setSpan = setSpan;
exports.setSpanContext = setSpanContext;

//# sourceMappingURL=context-utils.cjs.map