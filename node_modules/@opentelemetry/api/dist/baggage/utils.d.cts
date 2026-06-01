import { Baggage, BaggageEntry, BaggageEntryMetadata } from "./types.cjs";
//#region src/baggage/utils.d.ts
/**
 * Create a new Baggage with optional entries
 *
 * @param entries An array of baggage entries the new baggage should contain
 */
declare function createBaggage(entries?: Record<string, BaggageEntry>): Baggage;
/**
 * Create a serializable BaggageEntryMetadata object from a string.
 *
 * @param str string metadata. Format is currently not defined by the spec and has no special meaning.
 *
 * @since 1.0.0
 */
declare function baggageEntryMetadataFromString(str: string): BaggageEntryMetadata;
//#endregion
export { baggageEntryMetadataFromString, createBaggage };
//# sourceMappingURL=utils.d.cts.map