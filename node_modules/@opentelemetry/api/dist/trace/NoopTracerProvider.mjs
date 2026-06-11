import { NoopTracer } from "./NoopTracer.mjs";
//#region src/trace/NoopTracerProvider.ts
/**
* An implementation of the {@link TracerProvider} which returns an impotent
* Tracer for all calls to `getTracer`.
*
* All operations are no-op.
*/
var NoopTracerProvider = class {
	getTracer(_name, _version, _options) {
		return new NoopTracer();
	}
};
//#endregion
export { NoopTracerProvider };

//# sourceMappingURL=NoopTracerProvider.mjs.map