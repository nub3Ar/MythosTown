import { AnyValue } from "./AnyValue.cjs";
//#region src/common/Attributes.d.ts
/**
 * Attributes is a mapping from string to attribute values.
 * https://opentelemetry.io/docs/specs/otel/common/#attribute-collections
 *
 * @since 1.1.0
 */
interface Attributes {
  [attributeKey: string]: AnyValue;
}
/**
 * @since 1.1.0
 * @deprecated use AnyValue
 */
type AttributeValue = AnyValue;
//#endregion
export { AttributeValue, Attributes };
//# sourceMappingURL=Attributes.d.cts.map