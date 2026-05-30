const require_diag = require("../api/diag.cjs");
const require_baggage_impl = require("./internal/baggage-impl.cjs");
const require_symbol = require("./internal/symbol.cjs");
//#region src/baggage/utils.ts
const diag = require_diag.DiagAPI.instance();
/**
* Create a new Baggage with optional entries
*
* @param entries An array of baggage entries the new baggage should contain
*/
function createBaggage(entries = {}) {
	return new require_baggage_impl.BaggageImpl(new Map(Object.entries(entries)));
}
/**
* Create a serializable BaggageEntryMetadata object from a string.
*
* @param str string metadata. Format is currently not defined by the spec and has no special meaning.
*
* @since 1.0.0
*/
function baggageEntryMetadataFromString(str) {
	if (typeof str !== "string") {
		diag.error(`Cannot create baggage metadata from unknown type: ${typeof str}`);
		str = "";
	}
	return {
		__TYPE__: require_symbol.baggageEntryMetadataSymbol,
		toString() {
			return str;
		}
	};
}
//#endregion
exports.baggageEntryMetadataFromString = baggageEntryMetadataFromString;
exports.createBaggage = createBaggage;

//# sourceMappingURL=utils.cjs.map