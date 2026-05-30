const require_global_utils = require("../internal/global-utils.cjs");
const require_diag = require("./diag.cjs");
const require_context_utils = require("../trace/context-utils.cjs");
const require_spancontext_utils = require("../trace/spancontext-utils.cjs");
const require_ProxyTracerProvider = require("../trace/ProxyTracerProvider.cjs");
//#region src/api/trace.ts
const API_NAME = "trace";
/**
* Singleton object which represents the entry point to the OpenTelemetry Tracing API
*
* @since 1.0.0
*/
var TraceAPI = class TraceAPI {
	/** Empty private constructor prevents end users from constructing a new instance of the API */
	constructor() {
		this._proxyTracerProvider = new require_ProxyTracerProvider.ProxyTracerProvider();
		this.wrapSpanContext = require_spancontext_utils.wrapSpanContext;
		this.isSpanContextValid = require_spancontext_utils.isSpanContextValid;
		this.deleteSpan = require_context_utils.deleteSpan;
		this.getSpan = require_context_utils.getSpan;
		this.getActiveSpan = require_context_utils.getActiveSpan;
		this.getSpanContext = require_context_utils.getSpanContext;
		this.setSpan = require_context_utils.setSpan;
		this.setSpanContext = require_context_utils.setSpanContext;
	}
	/** Get the singleton instance of the Trace API */
	static getInstance() {
		if (!this._instance) this._instance = new TraceAPI();
		return this._instance;
	}
	/**
	* Set the current global tracer.
	*
	* @returns true if the tracer provider was successfully registered, else false
	*/
	setGlobalTracerProvider(provider) {
		const success = require_global_utils.registerGlobal(API_NAME, this._proxyTracerProvider, require_diag.DiagAPI.instance());
		if (success) this._proxyTracerProvider.setDelegate(provider);
		return success;
	}
	/**
	* Returns the global tracer provider.
	*/
	getTracerProvider() {
		return require_global_utils.getGlobal(API_NAME) || this._proxyTracerProvider;
	}
	/**
	* Returns a tracer from the global tracer provider.
	*/
	getTracer(name, version) {
		return this.getTracerProvider().getTracer(name, version);
	}
	/** Remove the global tracer provider */
	disable() {
		require_global_utils.unregisterGlobal(API_NAME, require_diag.DiagAPI.instance());
		this._proxyTracerProvider = new require_ProxyTracerProvider.ProxyTracerProvider();
	}
};
//#endregion
exports.TraceAPI = TraceAPI;

//# sourceMappingURL=trace.cjs.map