const require_global_utils = require("../internal/global-utils.cjs");
const require_diag = require("./diag.cjs");
const require_ProxyLoggerProvider = require("../logs/ProxyLoggerProvider.cjs");
//#region src/api/logs.ts
const API_NAME = "logs";
/**
* Singleton object which represents the entry point to the OpenTelemetry Logs API
*
* @since 1.10.0
*/
var LogsAPI = class LogsAPI {
	/** Empty private constructor prevents end users from constructing a new instance of the API */
	constructor() {
		this._proxyLoggerProvider = new require_ProxyLoggerProvider.ProxyLoggerProvider();
	}
	/** Get the singleton instance of the Logs API */
	static getInstance() {
		if (!this._instance) this._instance = new LogsAPI();
		return this._instance;
	}
	setGlobalLoggerProvider(provider) {
		const success = require_global_utils.registerGlobal(API_NAME, provider, require_diag.DiagAPI.instance());
		if (success) this._proxyLoggerProvider._setDelegate(provider);
		return success;
	}
	/**
	* Returns the global logger provider.
	*
	* @returns LoggerProvider
	*/
	getLoggerProvider() {
		return require_global_utils.getGlobal(API_NAME) || this._proxyLoggerProvider;
	}
	/**
	* Returns a Logger, creating one if one with the given name, version,
	* schemaUrl, and attributes is not already created.
	*
	* Getting a Logger may be expensive, especially when `attributes` are
	* provided. Reuse Logger instances where possible instead of calling
	* `getLogger()` on hot paths.
	*
	* @param name The name of the logger or instrumentation library.
	* @param version The version of the logger or instrumentation library.
	* @param options The options of the logger or instrumentation library.
	* @returns {@link Logger}
	*/
	getLogger(name, version, options) {
		return this.getLoggerProvider().getLogger(name, version, options);
	}
	/** Remove the global logger provider */
	disable() {
		require_global_utils.unregisterGlobal(API_NAME, require_diag.DiagAPI.instance());
		this._proxyLoggerProvider = new require_ProxyLoggerProvider.ProxyLoggerProvider();
	}
};
//#endregion
exports.LogsAPI = LogsAPI;

//# sourceMappingURL=logs.cjs.map