import type { ApiCallSpan } from "../../../internal/tracing.js";
import type { BetaContentBlock, BetaContentBlockParam, BetaMessage, BetaRawMessageStreamEvent, BetaToolResultBlockParam, BetaUsage, MessageCreateParamsBase as BetaMessageCreateParamsBase } from "../../../resources/beta/messages/messages.js";
import type { BetaManagedAgentsUserCustomToolResultEventParams } from "../../../resources/beta/sessions/events.js";
import type { ContentBlock, ContentBlockParam, Message, MessageCreateParamsBase, RawMessageStreamEvent, ToolResultBlockParam, Usage } from "../../../resources/messages/messages.js";
export type MessageCreateBody = MessageCreateParamsBase | BetaMessageCreateParamsBase;
export type AnyMessage = Message | BetaMessage;
export type AnyStreamEvent = RawMessageStreamEvent | BetaRawMessageStreamEvent;
export type AnyToolResultContent = (ToolResultBlockParam | BetaToolResultBlockParam)['content'] | Array<NonNullable<BetaManagedAgentsUserCustomToolResultEventParams['content']>[number] | Extract<BetaToolResultBlockParam['content'], unknown[]>[number]>;
export type AnyContentBlock = ContentBlock | ContentBlockParam | BetaContentBlock | BetaContentBlockParam;
export type AnyResultBlockContent = Extract<AnyContentBlock, {
    tool_use_id: string;
}>['content'];
export type RecordedMessage = Pick<AnyMessage, 'id' | 'model' | 'stop_reason'>;
export type RecordedUsage = Pick<Usage | BetaUsage, 'input_tokens' | 'output_tokens' | 'cache_creation' | 'cache_creation_input_tokens' | 'cache_read_input_tokens' | 'output_tokens_details' | 'service_tier'> & Partial<Pick<BetaUsage, 'iterations'>>;
/** The call span of a `messages.create` API call that a stream helper reads. */
export interface MessagesCreateSpan extends ApiCallSpan {
    /**
     * The request, and the Message that the helper builds from the events, from `message_start` on.
     * The span records the Message as far as it got when the stream ends before `message_stop`.
     */
    streamed?: {
        body: MessageCreateBody;
        message: AnyMessage;
    } | undefined;
}
//# sourceMappingURL=types.d.ts.map