import { Span } from "../../trace/span.cjs";
import { SpanOptions } from "../../trace/SpanOptions.cjs";
//#region src/experimental/trace/SugaredOptions.d.ts
/**
 * Options needed for span creation
 */
interface SugaredSpanOptions extends SpanOptions {
  /**
   * function to overwrite default exception behavior to record the exception. No exceptions should be thrown in the function.
   * @param e Error which triggered this exception
   * @param span current span from context
   */
  onException?: (e: Error, span: Span) => void;
}
//#endregion
export { SugaredSpanOptions };
//# sourceMappingURL=SugaredOptions.d.cts.map