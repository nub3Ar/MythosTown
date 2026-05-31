import { Attributes } from "../common/Attributes.cjs";
import { TimeInput } from "../common/Time.cjs";
import { Link } from "./link.cjs";
import { SpanKind } from "./span_kind.cjs";
//#region src/trace/SpanOptions.d.ts
/**
 * Options needed for span creation
 *
 * @since 1.0.0
 */
interface SpanOptions {
  /**
   * The SpanKind of a span
   * @default {@link SpanKind.INTERNAL}
   */
  kind?: SpanKind;
  /** A span's attributes */
  attributes?: Attributes;
  /** {@link Link}s span to other spans */
  links?: Link[];
  /** A manually specified start time for the created `Span` object. */
  startTime?: TimeInput;
  /** The new span should be a root span. (Ignore parent from context). */
  root?: boolean;
}
//#endregion
export { SpanOptions };
//# sourceMappingURL=SpanOptions.d.cts.map