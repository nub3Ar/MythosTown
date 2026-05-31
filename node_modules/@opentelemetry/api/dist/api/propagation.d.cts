import { Context } from "../context/types.cjs";
import { TextMapGetter, TextMapPropagator, TextMapSetter } from "../propagation/TextMapPropagator.cjs";
import { deleteBaggage, getActiveBaggage, getBaggage, setBaggage } from "../baggage/context-helpers.cjs";
import { createBaggage } from "../baggage/utils.cjs";
//#region src/api/propagation.d.ts
/**
 * Singleton object which represents the entry point to the OpenTelemetry Propagation API
 *
 * @since 1.0.0
 */
declare class PropagationAPI {
  private static _instance?;
  /** Empty private constructor prevents end users from constructing a new instance of the API */
  private constructor();
  /** Get the singleton instance of the Propagator API */
  static getInstance(): PropagationAPI;
  /**
   * Set the current propagator.
   *
   * @returns true if the propagator was successfully registered, else false
   */
  setGlobalPropagator(propagator: TextMapPropagator): boolean;
  /**
   * Inject context into a carrier to be propagated inter-process
   *
   * @param context Context carrying tracing data to inject
   * @param carrier carrier to inject context into
   * @param setter Function used to set values on the carrier
   */
  inject<Carrier>(context: Context, carrier: Carrier, setter?: TextMapSetter<Carrier>): void;
  /**
   * Extract context from a carrier
   *
   * @param context Context which the newly created context will inherit from
   * @param carrier Carrier to extract context from
   * @param getter Function used to extract keys from a carrier
   */
  extract<Carrier>(context: Context, carrier: Carrier, getter?: TextMapGetter<Carrier>): Context;
  /**
   * Return a list of all fields which may be used by the propagator.
   */
  fields(): string[];
  /** Remove the global propagator */
  disable(): void;
  createBaggage: typeof createBaggage;
  getBaggage: typeof getBaggage;
  /** @since 1.4.0 */
  getActiveBaggage: typeof getActiveBaggage;
  setBaggage: typeof setBaggage;
  deleteBaggage: typeof deleteBaggage;
  private _getGlobalPropagator;
}
//#endregion
export { PropagationAPI };
//# sourceMappingURL=propagation.d.cts.map