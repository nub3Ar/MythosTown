import "./trace_flags.mjs";
//#region src/trace/invalid-span-constants.ts
/**
* @since 1.0.0
*/
const INVALID_SPANID = "0000000000000000";
/**
* @since 1.0.0
*/
const INVALID_TRACEID = "00000000000000000000000000000000";
/**
* @since 1.0.0
*/
const INVALID_SPAN_CONTEXT = {
	traceId: INVALID_TRACEID,
	spanId: INVALID_SPANID,
	traceFlags: 0
};
//#endregion
export { INVALID_SPANID, INVALID_SPAN_CONTEXT, INVALID_TRACEID };

//# sourceMappingURL=invalid-span-constants.mjs.map