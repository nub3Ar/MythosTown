import { getGlobal, registerGlobal, unregisterGlobal } from "../internal/global-utils.mjs";
import { DiagAPI } from "./diag.mjs";
import { ProxyLoggerProvider } from "../logs/ProxyLoggerProvider.mjs";
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
		this._proxyLoggerProvider = new ProxyLoggerProvider();
	}
	/** Get the singleton instance of the Logs API */
	static getInstance() {
		if (!this._instance) this._instance = new LogsAPI();
		return this._instance;
	}
	setGlobalLoggerProvider(provider) {
		const success = registerGlobal(API_NAME, provider, DiagAPI.instance());
		if (success) this._proxyLoggerProvider._setDelegate(provider);
		return success;
	}
	/**
	* Returns the global logger provider.
	*
	* @returns LoggerProvider
	*/
	getLoggerProvider() {
		return getGlobal(API_NAME) || this._proxyLoggerProvider;
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
		unregisterGlobal(API_NAME, DiagAPI.instance());
		this._proxyLoggerProvider = new ProxyLoggerProvider();
	}
};
//#endregion
export { LogsAPI };

//# sourceMappingURL=logs.mjs.map