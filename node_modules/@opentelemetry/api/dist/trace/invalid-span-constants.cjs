require("./trace_flags.cjs");
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
exports.INVALID_SPANID = INVALID_SPANID;
exports.INVALID_SPAN_CONTEXT = INVALID_SPAN_CONTEXT;
exports.INVALID_TRACEID = INVALID_TRACEID;

//# sourceMappingURL=invalid-span-constants.cjs.map