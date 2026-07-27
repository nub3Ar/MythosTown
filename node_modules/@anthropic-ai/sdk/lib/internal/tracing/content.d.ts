import type { Span } from '@opentelemetry/api';
import type { ApiCallSpan } from "../../../internal/tracing.js";
import { ATTR_ANTHROPIC_TOOL_RESULT_CONTENT, ATTR_GEN_AI_INPUT_MESSAGES, ATTR_GEN_AI_OUTPUT_MESSAGES, ATTR_GEN_AI_REQUEST_STOP_SEQUENCES, ATTR_GEN_AI_SYSTEM_INSTRUCTIONS } from "./attributes.js";
import type { AnyContentBlock, AnyToolResultContent, MessageCreateBody } from "./types.js";
/**
 * Sets the content attributes of a `messages.create` API call, within `limit` bytes: first
 * with the request alone, and again with `output`, the response's content blocks. The second call
 * sets only the output when that fits beside the request's content, and otherwise sets everything
 * again to remove more of it.
 */
export declare function setMessageContentAttributes(call: ApiCallSpan, body: MessageCreateBody, output: ReadonlyArray<AnyContentBlock> | undefined, limit: number): void;
/**
 * The content blocks of a tool result, always as a list: a result with no content has none. A text
 * block and a search result block keep their fields ({@link withoutLeftOutFields}), and any other
 * block has only its type.
 */
export declare function toolResultContentBlocks(content: AnyToolResultContent): unknown[];
/** A message of the generative-AI conventions. */
interface ContentMessage {
    role: string;
    parts: ContentPart[];
}
/** A part of a message's content in the generative-AI conventions. */
type ContentPart = {
    type: unknown;
    [field: string]: unknown;
};
/** The content attributes that hold message parts, which {@link setContentAttributes} reduces. */
interface MessageContentAttributes {
    [ATTR_GEN_AI_SYSTEM_INSTRUCTIONS]?: ContentPart[] | undefined;
    [ATTR_GEN_AI_INPUT_MESSAGES]?: ContentMessage[] | undefined;
    [ATTR_GEN_AI_OUTPUT_MESSAGES]?: ContentMessage[] | undefined;
}
/**
 * `gen_ai.request.stop_sequences` and `anthropic.tool_result.content` are named because
 * {@link setContentAttributes} treats each in its own way. An attribute with another name, such as
 * `gen_ai.tool.call.arguments`, is whole or absent.
 */
interface ContentAttributes extends MessageContentAttributes {
    [ATTR_GEN_AI_REQUEST_STOP_SEQUENCES]?: string[] | undefined;
    [ATTR_ANTHROPIC_TOOL_RESULT_CONTENT]?: unknown[] | undefined;
    [name: string]: unknown;
}
/**
 * Sets the content attributes of `span` within `limit` bytes of UTF-8.
 * `gen_ai.request.stop_sequences` alone is not JSON: the conventions type it as an array of
 * strings, which every backend takes, and its size is that of its strings. Each other attribute is
 * one JSON string.
 *
 * A UTF-16 code unit takes at most three bytes, so content whose `length` is at most a third of
 * the limit fits, as most does, and is not measured. Other content is measured in bytes
 * ({@link utf8Length}).
 *
 * First, the stop sequences, and an attribute that {@link ContentAttributes} does not name, are
 * left out whole when they alone are over the limit. Then message parts are removed to fit
 * ({@link withoutFirstParts}), and on a tool span the last blocks of the tool result
 * ({@link truncateToolResultContent}). A span that lost any of these gets
 * `anthropic.content.truncated`. Only what stays after that can leave a span over the limit: an
 * emptied list, a message without parts, and the last text part, cut from its end.
 *
 * Returns the size of what it set, or more than that when it did not measure.
 */
export declare function setContentAttributes(span: Span, attributes: ContentAttributes, limit: number): number;
export {};
//# sourceMappingURL=content.d.ts.map