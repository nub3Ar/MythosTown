import type { Span } from '@opentelemetry/api';
import type { RecordedMessage, RecordedUsage } from "./types.js";
/**
 * Sets the attributes that come from a Message. The stop reason and the output usage are final
 * only from the `message_delta` of a streamed Message on, and are set only when `complete` is true.
 */
export declare function setResponseAttributes(span: Span, message: RecordedMessage, usage: RecordedUsage, complete: boolean): void;
//# sourceMappingURL=response.d.ts.map