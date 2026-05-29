const require_global_utils = require("../internal/global-utils.cjs");
const require_diag = require("./diag.cjs");
const require_utils = require("../baggage/utils.cjs");
const require_TextMapPropagator = require("../propagation/TextMapPropagator.cjs");
const require_NoopTextMapPropagator = require("../propagation/NoopTextMapPropagator.cjs");
const require_context_helpers = require("../baggage/context-helpers.cjs");
//#region src/api/propagation.ts
const API_NAME = "propagation";
const NOOP_TEXT_MAP_PROPAGATOR = new require_NoopTextMapPropagator.NoopTextMapPropagator();
/**
* Singleton object which represents the entry point to the OpenTelemetry Propagation API
*
* @since 1.0.0
*/
var PropagationAPI = class PropagationAPI {
	/** Empty private constructor prevents end users from constructing a new instance of the API */
	constructor() {
		this.createBaggage = require_utils.createBaggage;
		this.getBaggage = require_context_helpers.getBaggage;
		this.getActiveBaggage = require_context_helpers.getActiveBaggage;
		this.setBaggage = require_context_helpers.setBaggage;
		this.deleteBaggage = require_context_helpers.deleteBaggage;
	}
	/** Get the singleton instance of the Propagator API */
	static getInstance() {
		if (!this._instance) this._instance = new PropagationAPI();
		return this._instance;
	}
	/**
	* Set the current propagator.
	*
	* @returns true if the propagator was successfully registered, else false
	*/
	setGlobalPropagator(propagator) {
		return require_global_utils.registerGlobal(API_NAME, propagator, require_diag.DiagAPI.instance());
	}
	/**
	* Inject context into a carrier to be propagated inter-process
	*
	* @param context Context carrying tracing data to inject
	* @param carrier carrier to inject context into
	* @param setter Function used to set values on the carrier
	*/
	inject(context, carrier, setter = require_TextMapPropagator.defaultTextMapSetter) {
		return this._getGlobalPropagator().inject(context, carrier, setter);
	}
	/**
	* Extract context from a carrier
	*
	* @param context Context which the newly created context will inherit from
	* @param carrier Carrier to extract context from
	* @param getter Function used to extract keys from a carrier
	*/
	extract(context, carrier, getter = require_TextMapPropagator.defaultTextMapGetter) {
		return this._getGlobalPropagator().extract(context, carrier, getter);
	}
	/**
	* Return a list of all fields which may be used by the propagator.
	*/
	fields() {
		return this._getGlobalPropagator().fields();
	}
	/** Remove the global propagator */
	disable() {
		require_global_utils.unregisterGlobal(API_NAME, require_diag.DiagAPI.instance());
	}
	_getGlobalPropagator() {
		return require_global_utils.getGlobal(API_NAME) || NOOP_TEXT_MAP_PROPAGATOR;
	}
};
//#endregion
exports.PropagationAPI = PropagationAPI;

//# sourceMappingURL=propagation.cjs.map