//#region src/trace/trace_flags.ts
/**
* @since 1.0.0
*/
let TraceFlags = /* @__PURE__ */ function(TraceFlags) {
	/** Represents no flag set. */
	TraceFlags[TraceFlags["NONE"] = 0] = "NONE";
	/** Bit to represent whether trace is sampled in trace flags. */
	TraceFlags[TraceFlags["SAMPLED"] = 1] = "SAMPLED";
	return TraceFlags;
}({});
//#endregion
exports.TraceFlags = TraceFlags;

//# sourceMappingURL=trace_flags.cjs.map