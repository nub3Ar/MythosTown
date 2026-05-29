const require_ProxyTracer = require("./ProxyTracer.cjs");
//#region src/trace/ProxyTracerProvider.ts
const NOOP_TRACER_PROVIDER = new (require("./NoopTracerProvider.cjs")).NoopTracerProvider();
/**
* Tracer provider which provides {@link ProxyTracer}s.
*
* Before a delegate is set, tracers provided are NoOp.
*   When a delegate is set, traces are provided from the delegate.
*   When a delegate is set after tracers have already been provided,
*   all tracers already provided will use the provided delegate implementation.
*
* @deprecated This will be removed in the next major version.
* @since 1.0.0
*/
var ProxyTracerProvider = class {
	/**
	* Get a {@link ProxyTracer}
	*/
	getTracer(name, version, options) {
		var _this$getDelegateTrac;
		return (_this$getDelegateTrac = this.getDelegateTracer(name, version, options)) !== null && _this$getDelegateTrac !== void 0 ? _this$getDelegateTrac : new require_ProxyTracer.ProxyTracer(this, name, version, options);
	}
	getDelegate() {
		var _this$_delegate;
		return (_this$_delegate = this._delegate) !== null && _this$_delegate !== void 0 ? _this$_delegate : NOOP_TRACER_PROVIDER;
	}
	/**
	* Set the delegate tracer provider
	*/
	setDelegate(delegate) {
		this._delegate = delegate;
	}
	getDelegateTracer(name, version, options) {
		var _this$_delegate2;
		return (_this$_delegate2 = this._delegate) === null || _this$_delegate2 === void 0 ? void 0 : _this$_delegate2.getTracer(name, version, options);
	}
};
//#endregion
exports.ProxyTracerProvider = ProxyTracerProvider;

//# sourceMappingURL=ProxyTracerProvider.cjs.map