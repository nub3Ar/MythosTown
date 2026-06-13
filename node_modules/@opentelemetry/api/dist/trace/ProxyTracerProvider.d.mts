import { Tracer } from "./tracer.mjs";
import { TracerOptions } from "./tracer_options.mjs";
import { TracerProvider } from "./tracer_provider.mjs";
//#region src/trace/ProxyTracerProvider.d.ts
/**
 * Tracer provider which provides {@link ProxyTracer}s.
 *
 * Before a delegate is set, tracers provided are NoOp.
 *   When a delegate is set, traces are provided from the delegate.
 *   When a delegate is set after tracers have already been provided,
 *   all tracers already provided will use the provided delegate implementation.
 *
 * @deprecated This will be removed in the next major version.
 * @since 1.0.0
 */
declare class ProxyTracerProvider implements TracerProvider {
  private _delegate?;
  /**
   * Get a {@link ProxyTracer}
   */
  getTracer(name: string, version?: string, options?: TracerOptions): Tracer;
  getDelegate(): TracerProvider;
  /**
   * Set the delegate tracer provider
   */
  setDelegate(delegate: TracerProvider): void;
  getDelegateTracer(name: string, version?: string, options?: TracerOptions): Tracer | undefined;
}
//#endregion
export { ProxyTracerProvider };
//# sourceMappingURL=ProxyTracerProvider.d.mts.map