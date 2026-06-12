import { Context, ContextManagementToken, ContextManager } from "../context/types.mjs";
//#region src/api/context.d.ts
/**
 * Singleton object which represents the entry point to the OpenTelemetry Context API
 *
 * @since 1.0.0
 */
declare class ContextAPI {
  private static _instance?;
  /**
   * Tracks whether we have already warned that the active ContextManager does
   * not implement attach(), so we warn at most once instead of on every call.
   */
  private _attachUnsupportedWarned;
  /** Empty private constructor prevents end users from constructing a new instance of the API */
  private constructor();
  /** Get the singleton instance of the Context API */
  static getInstance(): ContextAPI;
  /**
   * Set the current context manager.
   *
   * @returns true if the context manager was successfully registered, else false
   */
  setGlobalContextManager(contextManager: ContextManager): boolean;
  /**
   * Get the currently active context
   */
  active(): Context;
  /**
   * Execute a function with an active context
   *
   * @param context context to be active during function execution
   * @param fn function to execute in a context
   * @param thisArg optional receiver to be used for calling fn
   * @param args optional arguments forwarded to fn
   */
  with<A extends unknown[], F extends (...args: A) => ReturnType<F>>(context: Context, fn: F, thisArg?: ThisParameterType<F>, ...args: A): ReturnType<F>;
  /**
   * Bind a context to a target function or event emitter
   *
   * @param context context to bind to the event emitter or function. Defaults to the currently active context
   * @param target function or event emitter to bind
   */
  bind<T>(context: Context, target: T): T;
  /**
   * Imperatively sets `context` as active, returning a {@link ContextManagementToken} whose
   * {@link ContextManagementToken.dispose} restores the previous context.
   *
   * This is a delicate, low-level API - prefer {@link with}/{@link bind}, which
   * restore context automatically. Use `attach` only to bridge callback
   * boundaries that `with` cannot wrap. Call `token.dispose()` when the
   * operation is done.
   *
   * **Caveat for async functions:** If called inside an async function before
   * the first `await`, the context change may leak into the caller's context
   * and remain active there. Prefer {@link with} for async code.
   *
   * Support is best-effort and varies by the active ContextManager (see
   * {@link ContextManager.attach}); if it does not implement `attach`, this logs
   * a warning and returns a no-op token.
   *
   * @param context The Context to attach
   * @returns A {@link ContextManagementToken} whose dispose() restores the previous Context
   * @since 1.10.0
   * @experimental This API is experimental and may change in minor releases without prior notice.
   */
  attach(context: Context): ContextManagementToken;
  private _getContextManager;
  /** Disable and remove the global context manager */
  disable(): void;
}
//#endregion
export { ContextAPI };
//# sourceMappingURL=context.d.mts.map