import { TraceStateImpl } from "./tracestate-impl.mjs";
//#region src/trace/internal/utils.ts
/**
* @deprecated Use TraceState from "@opentelemetry/core". This will be removed in the next major version.
* @since 1.1.0
*/
function createTraceState(rawTraceState) {
	return new TraceStateImpl(rawTraceState);
}
//#endregion
export { createTraceState };

//# sourceMappingURL=utils.mjs.map