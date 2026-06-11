//#region src/trace/span_kind.ts
/**
* @since 1.0.0
*/
let SpanKind = /* @__PURE__ */ function(SpanKind) {
	/** Default value. Indicates that the span is used internally. */
	SpanKind[SpanKind["INTERNAL"] = 0] = "INTERNAL";
	/**
	* Indicates that the span covers server-side handling of an RPC or other
	* remote request.
	*/
	SpanKind[SpanKind["SERVER"] = 1] = "SERVER";
	/**
	* Indicates that the span covers the client-side wrapper around an RPC or
	* other remote request.
	*/
	SpanKind[SpanKind["CLIENT"] = 2] = "CLIENT";
	/**
	* Indicates that the span describes producer sending a message to a
	* broker. Unlike client and server, there is no direct critical path latency
	* relationship between producer and consumer spans.
	*/
	SpanKind[SpanKind["PRODUCER"] = 3] = "PRODUCER";
	/**
	* Indicates that the span describes consumer receiving a message from a
	* broker. Unlike client and server, there is no direct critical path latency
	* relationship between producer and consumer spans.
	*/
	SpanKind[SpanKind["CONSUMER"] = 4] = "CONSUMER";
	return SpanKind;
}({});
//#endregion
export { SpanKind };

//# sourceMappingURL=span_kind.mjs.map