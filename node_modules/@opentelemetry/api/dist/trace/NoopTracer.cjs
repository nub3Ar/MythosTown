const require_context = require("../api/context.cjs");
const require_NonRecordingSpan = require("./NonRecordingSpan.cjs");
const require_context_utils = require("./context-utils.cjs");
const require_spancontext_utils = require("./spancontext-utils.cjs");
//#region src/trace/NoopTracer.ts
const contextApi = require_context.ContextAPI.getInstance();
/**
* No-op implementations of {@link Tracer}.
*/
var NoopTracer = class {
	startSpan(name, options, context = contextApi.active()) {
		if (Boolean(options === null || options === void 0 ? void 0 : options.root)) return new require_NonRecordingSpan.NonRecordingSpan();
		const parentFromContext = context && require_context_utils.getSpanContext(context);
		if (isSpanContext(parentFromContext) && require_spancontext_utils.isSpanContextValid(parentFromContext)) return new require_NonRecordingSpan.NonRecordingSpan(parentFromContext);
		else return new require_NonRecordingSpan.NonRecordingSpan();
	}
	startActiveSpan(name, arg2, arg3, arg4) {
		var _ctx;
		let opts;
		let ctx;
		let fn;
		if (arguments.length < 2) return;
		else if (arguments.length === 2) fn = arg2;
		else if (arguments.length === 3) {
			opts = arg2;
			fn = arg3;
		} else {
			opts = arg2;
			ctx = arg3;
			fn = arg4;
		}
		const parentContext = (_ctx = ctx) !== null && _ctx !== void 0 ? _ctx : contextApi.active();
		const span = this.startSpan(name, opts, parentContext);
		const contextWithSpanSet = require_context_utils.setSpan(parentContext, span);
		return contextApi.with(contextWithSpanSet, fn, void 0, span);
	}
};
function isSpanContext(spanContext) {
	return spanContext !== null && typeof spanContext === "object" && "spanId" in spanContext && typeof spanContext["spanId"] === "string" && "traceId" in spanContext && typeof spanContext["traceId"] === "string" && "traceFlags" in spanContext && typeof spanContext["traceFlags"] === "number";
}
//#endregion
exports.NoopTracer = NoopTracer;

//# sourceMappingURL=NoopTracer.cjs.map