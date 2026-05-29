const require_NoopTracer = require("./NoopTracer.cjs");
//#region src/trace/NoopTracerProvider.ts
/**
* An implementation of the {@link TracerProvider} which returns an impotent
* Tracer for all calls to `getTracer`.
*
* All operations are no-op.
*/
var NoopTracerProvider = class {
	getTracer(_name, _version, _options) {
		return new require_NoopTracer.NoopTracer();
	}
};
//#endregion
exports.NoopTracerProvider = NoopTracerProvider;

//# sourceMappingURL=NoopTracerProvider.cjs.map