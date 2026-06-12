import { DiagAPI } from "../api/diag.mjs";
import { BaggageImpl } from "./internal/baggage-impl.mjs";
import { baggageEntryMetadataSymbol } from "./internal/symbol.mjs";
//#region src/baggage/utils.ts
const diag = DiagAPI.instance();
/**
* Create a new Baggage with optional entries
*
* @param entries An array of baggage entries the new baggage should contain
*/
function createBaggage(entries = {}) {
	return new BaggageImpl(new Map(Object.entries(entries)));
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
		__TYPE__: baggageEntryMetadataSymbol,
		toString() {
			return str;
		}
	};
}
//#endregion
export { baggageEntryMetadataFromString, createBaggage };

//# sourceMappingURL=utils.mjs.map