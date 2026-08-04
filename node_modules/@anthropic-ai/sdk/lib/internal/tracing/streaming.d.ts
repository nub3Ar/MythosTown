import { type Span } from '@opentelemetry/api';
import type { BaseAnthropic } from "../../../client.js";
import type { APIResponseProps } from "../../../internal/parse.js";
import { type ApiCallSpan } from "../../../internal/tracing.js";
import type { AnyMessage, MessageCreateBody } from "./types.js";
/**
 * In content mode, records `message`, which a stream helper accumulated, as the response content
 * of `call`, under the same size limit as a response that is not streamed.
 */
export declare function recordStreamedMessageContent(client: BaseAnthropic, call: ApiCallSpan, body: MessageCreateBody, message: AnyMessage): void;
/**
 * Ends `span` when the application's read of `stream` ends. Only the stream of `messages.create`
 * has events that the span records.
 */
export declare function endAnthropicApiCallSpanWhenStreamEnds(client: BaseAnthropic, span: Span, stream: AsyncIterable<unknown>, props: APIResponseProps): void;
//# sourceMappingURL=streaming.d.ts.map