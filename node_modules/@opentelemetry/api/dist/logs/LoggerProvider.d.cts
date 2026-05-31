import { Logger } from "./Logger.cjs";
import { LoggerOptions } from "./LoggerOptions.cjs";
//#region src/logs/LoggerProvider.d.ts
/**
 * A registry for creating named {@link Logger}s.
 *
 * @since 1.10.0
 */
interface LoggerProvider {
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
}
//#endregion
export { LoggerProvider };
//# sourceMappingURL=LoggerProvider.d.cts.map