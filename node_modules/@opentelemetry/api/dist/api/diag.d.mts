import { ComponentLoggerOptions, DiagLogFunction, DiagLogger, DiagLoggerApi } from "../diag/types.mjs";
//#region src/api/diag.d.ts
/**
 * Singleton object which represents the entry point to the OpenTelemetry internal
 * diagnostic API
 *
 * @since 1.0.0
 */
declare class DiagAPI implements DiagLogger, DiagLoggerApi {
  private static _instance?;
  /** Get the singleton instance of the DiagAPI API */
  static instance(): DiagAPI;
  /**
   * Private internal constructor
   * @private
   */
  private constructor();
  setLogger: DiagLoggerApi['setLogger'];
  /**
   *
   */
  createComponentLogger: (options: ComponentLoggerOptions) => DiagLogger;
  verbose: DiagLogFunction;
  debug: DiagLogFunction;
  info: DiagLogFunction;
  warn: DiagLogFunction;
  error: DiagLogFunction;
  /**
   * Unregister the global logger and return to Noop
   */
  disable: () => void;
}
//#endregion
export { DiagAPI };
//# sourceMappingURL=diag.d.mts.map