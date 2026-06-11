import { getGlobal, registerGlobal, unregisterGlobal } from "../internal/global-utils.mjs";
import { DiagAPI } from "./diag.mjs";
import { NOOP_METER_PROVIDER } from "../metrics/NoopMeterProvider.mjs";
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
		return registerGlobal(API_NAME, provider, DiagAPI.instance());
	}
	/**
	* Returns the global meter provider.
	*/
	getMeterProvider() {
		return getGlobal(API_NAME) || NOOP_METER_PROVIDER;
	}
	/**
	* Returns a meter from the global meter provider.
	*/
	getMeter(name, version, options) {
		return this.getMeterProvider().getMeter(name, version, options);
	}
	/** Remove the global meter provider */
	disable() {
		unregisterGlobal(API_NAME, DiagAPI.instance());
	}
};
//#endregion
export { MetricsAPI };

//# sourceMappingURL=metrics.mjs.map