import { Context } from "../context/types.mjs";
import { SpanContext } from "./span_context.mjs";
import { Span } from "./span.mjs";
//#region src/trace/context-utils.d.ts
/**
 * Return the span if one exists
 *
 * @param context context to get span from
 */
declare function getSpan(context: Context): Span | undefined;
/**
 * Gets the span from the current context, if one exists.
 */
declare function getActiveSpan(): Span | undefined;
/**
 * Set the span on a context
 *
 * @param context context to use as parent
 * @param span span to set active
 */
declare function setSpan(context: Context, span: Span): Context;
/**
 * Remove current span stored in the context
 *
 * @param context context to delete span from
 */
declare function deleteSpan(context: Context): Context;
/**
 * Wrap span context in a NoopSpan and set as span in a new
 * context
 *
 * @param context context to set active span on
 * @param spanContext span context to be wrapped
 */
declare function setSpanContext(context: Context, spanContext: SpanContext): Context;
/**
 * Get the span context of the span if it exists.
 *
 * @param context context to get values from
 */
declare function getSpanContext(context: Context): SpanContext | undefined;
//#endregion
export { deleteSpan, getActiveSpan, getSpan, getSpanContext, setSpan, setSpanContext };
//# sourceMappingURL=context-utils.d.mts.map