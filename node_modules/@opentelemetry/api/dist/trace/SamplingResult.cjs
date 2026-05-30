//#region src/trace/SamplingResult.ts
/**
* @deprecated use the one declared in @opentelemetry/sdk-trace instead.
* A sampling decision that determines how a {@link Span} will be recorded
* and collected.
*
* @since 1.0.0
*/
let SamplingDecision = /* @__PURE__ */ function(SamplingDecision) {
	/**
	* `Span.isRecording() === false`, span will not be recorded and all events
	* and attributes will be dropped.
	*/
	SamplingDecision[SamplingDecision["NOT_RECORD"] = 0] = "NOT_RECORD";
	/**
	* `Span.isRecording() === true`, but `Sampled` flag in {@link TraceFlags}
	* MUST NOT be set.
	*/
	SamplingDecision[SamplingDecision["RECORD"] = 1] = "RECORD";
	/**
	* `Span.isRecording() === true` AND `Sampled` flag in {@link TraceFlags}
	* MUST be set.
	*/
	SamplingDecision[SamplingDecision["RECORD_AND_SAMPLED"] = 2] = "RECORD_AND_SAMPLED";
	return SamplingDecision;
}({});
//#endregion
exports.SamplingDecision = SamplingDecision;

//# sourceMappingURL=SamplingResult.cjs.map