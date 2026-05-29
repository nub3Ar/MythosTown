const require_global_utils = require("../internal/global-utils.cjs");
const require_diag = require("./diag.cjs");
const require_NoopMeterProvider = require("../metrics/NoopMeterProvider.cjs");
//#region src/api/metrics.ts
const API_NAME = "metrics";
/**
* Singleton object which represents the entry point to the OpenTelemetry Metrics API
*
* @since 1.4.1
*/
var MetricsAPI = class MetricsAPI {
	/** Empty private constructor prevents end users from constructing a new instance of the API */
	constructor() {}
	/** Get the singleton instance of the Metrics API */
	static getInstance() {
		if (!this._instance) this._instance = new MetricsAPI();
		return this._instance;
	}
	/**
	* Set the current global meter provider.
	* Returns true if the meter provider was successfully registered, else false.
	*/
	setGlobalMeterProvider(provider) {
		return require_global_utils.registerGlobal(API_NAME, provider, require_diag.DiagAPI.instance());
	}
	/**
	* Returns the global meter provider.
	*/
	getMeterProvider() {
		return require_global_utils.getGlobal(API_NAME) || require_NoopMeterProvider.NOOP_METER_PROVIDER;
	}
	/**
	* Returns a meter from the global meter provider.
	*/
	getMeter(name, version, options) {
		return this.getMeterProvider().getMeter(name, version, options);
	}
	/** Remove the global meter provider */
	disable() {
		require_global_utils.unregisterGlobal(API_NAME, require_diag.DiagAPI.instance());
	}
};
//#endregion
exports.MetricsAPI = MetricsAPI;

//# sourceMappingURL=metrics.cjs.map