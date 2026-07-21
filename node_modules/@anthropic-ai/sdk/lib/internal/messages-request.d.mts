import type { BaseAnthropic } from "../../client.mjs";
import type { RequestOptions } from "../../internal/request-options.mjs";
import { type ApiCallSpan } from "../../internal/tracing.mjs";
import type { MessageCreateParamsBase } from "../../resources/messages/messages.mjs";
/**
 * The headers of a `messages.create` request. `create()` and `stream()` build them before they
 * start the span, so that what throws here throws while no span is open.
 */
export declare function messagesCreateHeaders(params: MessageCreateParamsBase, options: RequestOptions | undefined): import("../../internal/headers.mjs").NullableHeaders;
/**
 * Starts the call span of the request that a stream helper sends `body` with. The helper calls this
 * as it sends the request, so that what throws here fails the stream. It records the final message
 * on the span, which its `create()` call uses too.
 */
export declare function startMessagesStreamSpan(client: BaseAnthropic, body: MessageCreateParamsBase, options: RequestOptions | undefined): ApiCallSpan | undefined;
//# sourceMappingURL=messages-request.d.mts.map