import { DiagLogLevel } from "./diag/types.mjs";
import { baggageEntryMetadataFromString } from "./baggage/utils.mjs";
import { ROOT_CONTEXT, createContextKey } from "./context/context.mjs";
import { DiagConsoleLogger } from "./diag/consoleLogger.mjs";
import { createNoopMeter } from "./metrics/NoopMeter.mjs";
import { ValueType } from "./metrics/Metric.mjs";
import { createNoopLogger } from "./logs/NoopLogger.mjs";
import { SeverityNumber } from "./logs/LogRecord.mjs";
import { defaultTextMapGetter, defaultTextMapSetter } from "./propagation/TextMapPropagator.mjs";
import { TraceFlags } from "./trace/trace_flags.mjs";
import { INVALID_SPANID, INVALID_SPAN_CONTEXT, INVALID_TRACEID } from "./trace/invalid-span-constants.mjs";
import { isSpanContextValid, isValidSpanId, isValidTraceId } from "./trace/spancontext-utils.mjs";
import { ProxyTracer } from "./trace/ProxyTracer.mjs";
import { SpanKind } from "./trace/span_kind.mjs";
import { SpanStatusCode } from "./trace/status.mjs";
import { createTraceState } from "./trace/internal/utils.mjs";
import { ProxyTracerProvider } from "./trace/ProxyTracerProvider.mjs";
import { SamplingDecision } from "./trace/SamplingResult.mjs";
import { context } from "./context-api.mjs";
import { diag } from "./diag-api.mjs";
import { logs } from "./logs-api.mjs";
import { metrics } from "./metrics-api.mjs";
import { propagation } from "./propagation-api.mjs";
import { trace } from "./trace-api.mjs";
//#region src/index.ts
var src_default = {
	context,
	diag,
	logs,
	metrics,
	propagation,
	trace
};
//#endregion
export { DiagConsoleLogger, DiagLogLevel, INVALID_SPANID, INVALID_SPAN_CONTEXT, INVALID_TRACEID, ProxyTracer, ProxyTracerProvider, ROOT_CONTEXT, SamplingDecision, SeverityNumber, SpanKind, SpanStatusCode, TraceFlags, ValueType, baggageEntryMetadataFromString, context, createContextKey, createNoopLogger, createNoopMeter, createTraceState, src_default as default, defaultTextMapGetter, defaultTextMapSetter, diag, isSpanContextValid, isValidSpanId, isValidTraceId, logs, metrics, propagation, trace };

//# sourceMappingURL=index.mjs.map