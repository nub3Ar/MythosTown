//#region src/trace/status.ts
/**
* An enumeration of status codes.
*
* @since 1.0.0
*/
let SpanStatusCode = /* @__PURE__ */ function(SpanStatusCode) {
	/**
	* The default status.
	*/
	SpanStatusCode[SpanStatusCode["UNSET"] = 0] = "UNSET";
	/**
	* The operation has been validated by an Application developer or
	* Operator to have completed successfully.
	*/
	SpanStatusCode[SpanStatusCode["OK"] = 1] = "OK";
	/**
	* The operation contains an error.
	*/
	SpanStatusCode[SpanStatusCode["ERROR"] = 2] = "ERROR";
	return SpanStatusCode;
}({});
//#endregion
exports.SpanStatusCode = SpanStatusCode;

//# sourceMappingURL=status.cjs.map