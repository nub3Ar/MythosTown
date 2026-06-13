import { Logger } from "../logs/Logger.mjs";
import { LoggerOptions } from "../logs/LoggerOptions.mjs";
import { LoggerProvider } from "../logs/LoggerProvider.mjs";
//#region src/api/logs.d.ts
/**
 * Singleton object which represents the entry point to the OpenTelemetry Logs API
 *
 * @since 1.10.0
 */
declare class LogsAPI {
  private static _instance?;
  private _proxyLoggerProvider;
  /** Empty private constructor prevents end users from constructing a new instance of the API */
  private constructor();
  /** Get the singleton instance of the Logs API */
  static getInstance(): LogsAPI;
  setGlobalLoggerProvider(provider: LoggerProvider): boolean;
  /**
   * Returns the global logger provider.
   *
   * @returns LoggerProvider
   */
  getLoggerProvider(): LoggerProvider;
  /**
   * Returns a Logger, creating one if one with the given name, version,
   * schemaUrl, and attributes is not already created.
   *
   * Getting a Logger may be expensive, especially when `attributes` are
   * provided. Reuse Logger instances where possible instead of calling
   * `getLogger()` on hot paths.
   *
   * @param name The name of the logger or instrumentation library.
   * @param version The version of the logger or instrumentation library.
   * @param options The options of the logger or instrumentation library.
   * @returns {@link Logger}
   */
  getLogger(name: string, version?: string, options?: LoggerOptions): Logger;
  /** Remove the global logger provider */
  disable(): void;
}
//#endregion
export { LogsAPI };
//# sourceMappingURL=logs.d.mts.map