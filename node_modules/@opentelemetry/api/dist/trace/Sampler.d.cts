import { Context } from "../context/types.cjs";
import { SpanAttributes } from "./attributes.cjs";
import { Link } from "./link.cjs";
import { SpanKind } from "./span_kind.cjs";
import { SamplingResult } from "./SamplingResult.cjs";
//#region src/trace/Sampler.d.ts
/**
 * @deprecated use the one declared in @opentelemetry/sdk-trace instead.
 * This interface represent a sampler. Sampling is a mechanism to control the
 * noise and overhead introduced by OpenTelemetry by reducing the number of
 * samples of traces collected and sent to the backend.
 *
 * @since 1.0.0
 */
interface Sampler {
  /**
   * Checks whether span needs to be created and tracked.
   *
   * @param context Parent Context which may contain a span.
   * @param traceId of the span to be created. It can be different from the
   *     traceId in the {@link SpanContext}. Typically in situations when the
   *     span to be created starts a new trace.
   * @param spanName of the span to be created.
   * @param spanKind of the span to be created.
   * @param attributes Initial set of SpanAttributes for the Span being constructed.
   * @param links Collection of links that will be associated with the Span to
   *     be created. Typically useful for batch operations.
   * @returns a {@link SamplingResult}.
   */
  shouldSample(context: Context, traceId: string, spanName: string, spanKind: SpanKind, attributes: SpanAttributes, links: Link[]): SamplingResult;
  /** Returns the sampler name or short description with the configuration. */
  toString(): string;
}
//#endregion
export { Sampler };
//# sourceMappingURL=Sampler.d.cts.map