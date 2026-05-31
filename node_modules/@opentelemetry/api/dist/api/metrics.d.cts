import { Meter, MeterOptions } from "../metrics/Meter.cjs";
import { MeterProvider } from "../metrics/MeterProvider.cjs";
//#region src/api/metrics.d.ts
/**
 * Singleton object which represents the entry point to the OpenTelemetry Metrics API
 *
 * @since 1.4.1
 */
declare class MetricsAPI {
  private static _instance?;
  /** Empty private constructor prevents end users from constructing a new instance of the API */
  private constructor();
  /** Get the singleton instance of the Metrics API */
  static getInstance(): MetricsAPI;
  /**
   * Set the current global meter provider.
   * Returns true if the meter provider was successfully registered, else false.
   */
  setGlobalMeterProvider(provider: MeterProvider): boolean;
  /**
   * Returns the global meter provider.
   */
  getMeterProvider(): MeterProvider;
  /**
   * Returns a meter from the global meter provider.
   */
  getMeter(name: string, version?: string, options?: MeterOptions): Meter;
  /** Remove the global meter provider */
  disable(): void;
}
//#endregion
export { MetricsAPI };
//# sourceMappingURL=metrics.d.cts.map