import { NOOP_LOGGER_PROVIDER } from "./NoopLoggerProvider.mjs";
import { ProxyLogger } from "./ProxyLogger.mjs";
//#region src/logs/ProxyLoggerProvider.ts
var ProxyLoggerProvider = class {
	getLogger(name, version, options) {
		var _this$_getDelegateLog;
		return (_this$_getDelegateLog = this._getDelegateLogger(name, version, options)) !== null && _this$_getDelegateLog !== void 0 ? _this$_getDelegateLog : new ProxyLogger(this, name, version, options);
	}
	/**
	* Get the delegate logger provider.
	* Used by tests only.
	* @internal
	*/
	_getDelegate() {
		var _this$_delegate;
		return (_this$_delegate = this._delegate) !== null && _this$_delegate !== void 0 ? _this$_delegate : NOOP_LOGGER_PROVIDER;
	}
	/**
	* Set the delegate logger provider
	* @internal
	*/
	_setDelegate(delegate) {
		this._delegate = delegate;
	}
	/**
	* @internal
	*/
	_getDelegateLogger(name, version, options) {
		var _this$_delegate2;
		return (_this$_delegate2 = this._delegate) === null || _this$_delegate2 === void 0 ? void 0 : _this$_delegate2.getLogger(name, version, options);
	}
};
//#endregion
export { ProxyLoggerProvider };

//# sourceMappingURL=ProxyLoggerProvider.mjs.map