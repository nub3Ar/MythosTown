const require_context = require("../context/context.cjs");
const require_context$1 = require("../api/context.cjs");
//#region src/baggage/context-helpers.ts
/**
* Baggage key
*/
const BAGGAGE_KEY = require_context.createContextKey("OpenTelemetry Baggage Key");
/**
* Retrieve the current baggage from the given context
*
* @param {Context} Context that manage all context values
* @returns {Baggage} Extracted baggage from the context
*/
function getBaggage(context) {
	return context.getValue(BAGGAGE_KEY) || void 0;
}
/**
* Retrieve the current baggage from the active/current context
*
* @returns {Baggage} Extracted baggage from the context
*/
function getActiveBaggage() {
	return getBaggage(require_context$1.ContextAPI.getInstance().active());
}
/**
* Store a baggage in the given context
*
* @param {Context} Context that manage all context values
* @param {Baggage} baggage that will be set in the actual context
*/
function setBaggage(context, baggage) {
	return context.setValue(BAGGAGE_KEY, baggage);
}
/**
* Delete the baggage stored in the given context
*
* @param {Context} Context that manage all context values
*/
function deleteBaggage(context) {
	return context.deleteValue(BAGGAGE_KEY);
}
//#endregion
exports.deleteBaggage = deleteBaggage;
exports.getActiveBaggage = getActiveBaggage;
exports.getBaggage = getBaggage;
exports.setBaggage = setBaggage;

//# sourceMappingURL=context-helpers.cjs.map