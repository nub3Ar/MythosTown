//#region src/propagation/NoopTextMapPropagator.ts
/**
* No-op implementations of {@link TextMapPropagator}.
*/
var NoopTextMapPropagator = class {
	/** Noop inject function does nothing */
	inject(_context, _carrier) {}
	/** Noop extract function does nothing and returns the input context */
	extract(context, _carrier) {
		return context;
	}
	fields() {
		return [];
	}
};
//#endregion
exports.NoopTextMapPropagator = NoopTextMapPropagator;

//# sourceMappingURL=NoopTextMapPropagator.cjs.map