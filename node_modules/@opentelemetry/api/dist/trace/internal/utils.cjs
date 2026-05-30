const require_tracestate_impl = require("./tracestate-impl.cjs");
//#region src/trace/internal/utils.ts
/**
* @deprecated Use TraceState from "@opentelemetry/core". This will be removed in the next major version.
* @since 1.1.0
*/
function createTraceState(rawTraceState) {
	return new require_tracestate_impl.TraceStateImpl(rawTraceState);
}
//#endregion
exports.createTraceState = createTraceState;

//# sourceMappingURL=utils.cjs.map