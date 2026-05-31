import { SpanContext } from "./span_context.cjs";
import { Span } from "./span.cjs";
//#region src/trace/spancontext-utils.d.ts
/**
 * @since 1.0.0
 */
declare function isValidTraceId(traceId: string): boolean;
/**
 * @since 1.0.0
 */
declare function isValidSpanId(spanId: string): boolean;
/**
 * Returns true if this {@link SpanContext} is valid.
 * @return true if this {@link SpanContext} is valid.
 *
 * @since 1.0.0
 */
declare function isSpanContextValid(spanContext: SpanContext): boolean;
/**
 * Wrap the given {@link SpanContext} in a new non-recording {@link Span}
 *
 * @param spanContext span context to be wrapped
 * @returns a new non-recording {@link Span} with the provided context
 */
declare function wrapSpanContext(spanContext: SpanContext): Span;
//#endregion
export { isSpanContextValid, isValidSpanId, isValidTraceId, wrapSpanContext };
//# sourceMappingURL=spancontext-utils.d.cts.map