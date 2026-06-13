import { Context } from "../context/types.mjs";
import { Span } from "./span.mjs";
import { SpanOptions } from "./SpanOptions.mjs";
import { Tracer } from "./tracer.mjs";
import { TracerOptions } from "./tracer_options.mjs";
//#region src/trace/ProxyTracer.d.ts
/**
 * Proxy tracer provided by the proxy tracer provider
 *
 * @since 1.0.0
 */
declare class ProxyTracer implements Tracer {
  private _delegate?;
  private _provider;
  readonly name: string;
  readonly version?: string;
  /** @since 1.1.0 */
  readonly options?: TracerOptions;
  constructor(provider: TracerDelegator, name: string, version?: string, options?: TracerOptions);
  startSpan(name: string, options?: SpanOptions, context?: Context): Span;
  startActiveSpan<F extends (span: Span) => unknown>(_name: string, _options: F | SpanOptions, _context?: F | Context, _fn?: F): ReturnType<F>;
  /**
   * Try to get a tracer from the proxy tracer provider.
   * If the proxy tracer provider has no delegate, return a noop tracer.
   */
  private _getTracer;
}
/**
 * @since 1.0.3
 */
interface TracerDelegator {
  getDelegateTracer(name: string, version?: string, options?: TracerOptions): Tracer | undefined;
}
//#endregion
export { ProxyTracer, TracerDelegator };
//# sourceMappingURL=ProxyTracer.d.mts.map