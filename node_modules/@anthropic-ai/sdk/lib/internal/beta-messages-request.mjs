import { AnthropicError } from "../../error.mjs";
import { buildHeaders } from "../../internal/headers.mjs";
import { stainlessHelperHeader } from "../../internal/stainless-helper-header.mjs";
import { startApiCallSpan } from "../../internal/tracing.mjs";
import { messagesCreateSpanSettings } from "./tracing.mjs";
/**
 * The headers of a `messages.create` request. `create()` and `stream()` build them before they
 * start the span, so that what throws here throws while no span is open.
 */
export function messagesCreateHeaders(params, options) {
    const { betas, user_profile_id, workspace_id, tools, messages } = params;
    return buildHeaders([
        {
            ...(betas?.toString() != null ? { 'anthropic-beta': betas?.toString() } : undefined),
            ...(user_profile_id != null ? { 'anthropic-user-profile-id': user_profile_id } : undefined),
            ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
        },
        stainlessHelperHeader(tools, messages),
        options?.headers,
    ]);
}
/**
 * Starts the call span of the request that a stream helper sends `body` with. The helper calls this
 * as it sends the request, so that what throws here fails the stream. It records the final message
 * on the span, which its `create()` call uses too.
 */
export function startMessagesStreamSpan(client, body, options) {
    if (!client._tracer)
        return undefined;
    // Built here too, where no span is open yet: the helper's `create()` call builds them again
    // from the same input, so it cannot throw once the span is open.
    const headers = messagesCreateHeaders(body, options);
    return startApiCallSpan(client, 'anthropic.messages.create', options, messagesCreateSpanSettings(client, { ...transformOutputFormat(body), stream: true }, headers));
}
/**
 * Transform deprecated output_format to output_config.format
 * Returns a modified copy of the params without mutating the original
 */
export function transformOutputFormat(params) {
    if (!params.output_format) {
        return params;
    }
    assertOneOutputFormat(params);
    const { output_format, ...rest } = params;
    return {
        ...rest,
        output_config: {
            ...params.output_config,
            format: output_format,
        },
    };
}
/** Reject params that pass both `output_format` and `output_config.format`. */
export function assertOneOutputFormat(params) {
    if (params.output_format && params.output_config?.format) {
        throw new AnthropicError('Both output_format and output_config.format were provided. ' +
            'Please use only output_config.format (output_format is deprecated).');
    }
}
//# sourceMappingURL=beta-messages-request.mjs.map