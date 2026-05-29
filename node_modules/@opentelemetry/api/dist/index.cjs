Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
const require_types = require("./diag/types.cjs");
const require_utils = require("./baggage/utils.cjs");
const require_context = require("./context/context.cjs");
const require_consoleLogger = require("./diag/consoleLogger.cjs");
const require_NoopMeter = require("./metrics/NoopMeter.cjs");
const require_Metric = require("./metrics/Metric.cjs");
const require_NoopLogger = require("./logs/NoopLogger.cjs");
const require_LogRecord = require("./logs/LogRecord.cjs");
const require_TextMapPropagator = require("./propagation/TextMapPropagator.cjs");
const require_trace_flags = require("./trace/trace_flags.cjs");
const require_invalid_span_constants = require("./trace/invalid-span-constants.cjs");
const require_spancontext_utils = require("./trace/spancontext-utils.cjs");
const require_ProxyTracer = require("./trace/ProxyTracer.cjs");
const require_span_kind = require("./trace/span_kind.cjs");
const require_status = require("./trace/status.cjs");
const require_utils$1 = require("./trace/internal/utils.cjs");
const require_ProxyTracerProvider = require("./trace/ProxyTracerProvider.cjs");
const require_SamplingResult = require("./trace/SamplingResult.cjs");
const require_context_api = require("./context-api.cjs");
const require_diag_api = require("./diag-api.cjs");
const require_logs_api = require("./logs-api.cjs");
const require_metrics_api = require("./metrics-api.cjs");
const require_propagation_api = require("./propagation-api.cjs");
const require_trace_api = require("./trace-api.cjs");
//#region src/index.ts
var src_default = {
	context: require_context_api.context,
	diag: require_diag_api.diag,
	logs: require_logs_api.logs,
	metrics: require_metrics_api.metrics,
	propagation: require_propagation_api.propagation,
	trace: require_trace_api.trace
};
//#endregion
exports.DiagConsoleLogger = require_consoleLogger.DiagConsoleLogger;
exports.DiagLogLevel = require_types.DiagLogLevel;
exports.INVALID_SPANID = require_invalid_span_constants.INVALID_SPANID;
exports.INVALID_SPAN_CONTEXT = require_invalid_span_constants.INVALID_SPAN_CONTEXT;
exports.INVALID_TRACEID = require_invalid_span_constants.INVALID_TRACEID;
exports.ProxyTracer = require_ProxyTracer.ProxyTracer;
exports.ProxyTracerProvider = require_ProxyTracerProvider.ProxyTracerProvider;
exports.ROOT_CONTEXT = require_context.ROOT_CONTEXT;
exports.SamplingDecision = require_SamplingResult.SamplingDecision;
exports.SeverityNumber = require_LogRecord.SeverityNumber;
exports.SpanKind = require_span_kind.SpanKind;
exports.SpanStatusCode = require_status.SpanStatusCode;
exports.TraceFlags = require_trace_flags.TraceFlags;
exports.ValueType = require_Metric.ValueType;
exports.baggageEntryMetadataFromString = require_utils.baggageEntryMetadataFromString;
exports.context = require_context_api.context;
exports.createContextKey = require_context.createContextKey;
exports.createNoopLogger = require_NoopLogger.createNoopLogger;
exports.createNoopMeter = require_NoopMeter.createNoopMeter;
exports.createTraceState = require_utils$1.createTraceState;
exports.default = src_default;
exports.defaultTextMapGetter = require_TextMapPropagator.defaultTextMapGetter;
exports.defaultTextMapSetter = require_TextMapPropagator.defaultTextMapSetter;
exports.diag = require_diag_api.diag;
exports.isSpanContextValid = require_spancontext_utils.isSpanContextValid;
exports.isValidSpanId = require_spancontext_utils.isValidSpanId;
exports.isValidTraceId = require_spancontext_utils.isValidTraceId;
exports.logs = require_logs_api.logs;
exports.metrics = require_metrics_api.metrics;
exports.propagation = require_propagation_api.propagation;
exports.trace = require_trace_api.trace;

//# sourceMappingURL=index.cjs.map