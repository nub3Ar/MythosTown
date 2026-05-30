import { Context } from "../context/types.cjs";
import { Baggage } from "./types.cjs";
//#region src/baggage/context-helpers.d.ts
/**
 * Retrieve the current baggage from the given context
 *
 * @param {Context} Context that manage all context values
 * @returns {Baggage} Extracted baggage from the context
 */
declare function getBaggage(context: Context): Baggage | undefined;
/**
 * Retrieve the current baggage from the active/current context
 *
 * @returns {Baggage} Extracted baggage from the context
 */
declare function getActiveBaggage(): Baggage | undefined;
/**
 * Store a baggage in the given context
 *
 * @param {Context} Context that manage all context values
 * @param {Baggage} baggage that will be set in the actual context
 */
declare function setBaggage(context: Context, baggage: Baggage): Context;
/**
 * Delete the baggage stored in the given context
 *
 * @param {Context} Context that manage all context values
 */
declare function deleteBaggage(context: Context): Context;
//#endregion
export { deleteBaggage, getActiveBaggage, getBaggage, setBaggage };
//# sourceMappingURL=context-helpers.d.cts.map