import type { Span } from '@opentelemetry/api';
import type { BaseAnthropic } from "../../../client.mjs";
import { Stream } from "../../../core/streaming.mjs";
import { type NullableHeaders } from "../../../internal/headers.mjs";
import type { ApiCallResult, ApiCallSpan, ApiCallSpanSettings } from "../../../internal/tracing.mjs";
import type { BetaMessageTokensCount } from "../../../resources/beta/messages/messages.mjs";
import type { BetaManagedAgentsSession } from "../../../resources/beta/sessions/sessions.mjs";
import type { MessageTokensCount } from "../../../resources/messages/messages.mjs";
import type { AnyMessage, MessageCreateBody } from "./types.mjs";
/**
 * Sets the IDs in the response headers of `result` on `span`, the call span of any API call.
 * A failure to record, here and below, is logged and never fails the API call.
 */
export declare function setAnthropicSpanAttributes(client: BaseAnthropic, span: Span, result: ApiCallResult): void;
/**
 * The attributes that a `messages.create` span starts with, from the request's `body` and
 * `headers`. A sampler sees only the attributes that a span starts with.
 */
export declare function messagesCreateSpanSettings(client: BaseAnthropic, body: MessageCreateBody, headers: NullableHeaders): ApiCallSpanSettings;
/**
 * In content mode, sets the request's content on `call`. The span does not start with it, because
 * the size limit counts it together with the response's content. Returns `call`.
 */
export declare function recordMessagesCreateRequest(client: BaseAnthropic, call: ApiCallSpan | undefined, body: MessageCreateBody): ApiCallSpan | undefined;
/**
 * Sets the response attributes and, in content mode, the response's content on `call`. A streamed
 * response is recorded as the application reads it (`endAnthropicApiCallSpanWhenStreamEnds`).
 */
export declare function recordMessagesCreateResponse(client: BaseAnthropic, call: ApiCallSpan | undefined, body: MessageCreateBody, data: AnyMessage | Stream<unknown>): void;
/** Sets the token count of a `messages.countTokens` response on `call`. */
export declare function recordCountTokensResponse(client: BaseAnthropic, call: ApiCallSpan | undefined, count: MessageTokensCount | BetaMessageTokensCount): void;
/** Sets the Agent's name and model on `call`, as the created `session` resolved them. */
export declare function recordSessionsCreateResponse(client: BaseAnthropic, call: ApiCallSpan | undefined, session: BetaManagedAgentsSession): void;
//# sourceMappingURL=api-call.d.mts.map