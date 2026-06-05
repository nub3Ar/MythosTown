"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesCreateHeaders = messagesCreateHeaders;
exports.startMessagesStreamSpan = startMessagesStreamSpan;
const headers_1 = require("../../internal/headers.js");
const stainless_helper_header_1 = require("../../internal/stainless-helper-header.js");
const tracing_1 = require("../../internal/tracing.js");
const tracing_2 = require("./tracing.js");
/**
 * The headers of a `messages.create` request. `create()` and `stream()` build them before they
 * start the span, so that what throws here throws while no span is open.
 */
function messagesCreateHeaders(params, options) {
    const { user_profile_id, workspace_id, tools, messages } = params;
    return (0, headers_1.buildHeaders)([
        {
            ...(user_profile_id != null ? { 'anthropic-user-profile-id': user_profile_id } : undefined),
            ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
        },
        (0, stainless_helper_header_1.stainlessHelperHeader)(tools, messages),
        options?.headers,
    ]);
}
/**
 * Starts the call span of the request that a stream helper sends `body` with. The helper calls this
 * as it sends the request, so that what throws here fails the stream. It records the final message
 * on the span, which its `create()` call uses too.
 */
function startMessagesStreamSpan(client, body, options) {
    if (!client._tracer)
        return undefined;
    // Built here too, where no span is open yet: the helper's `create()` call builds them again
    // from the same input, so it cannot throw once the span is open.
    const headers = messagesCreateHeaders(body, options);
    return (0, tracing_1.startApiCallSpan)(client, 'anthropic.messages.create', options, (0, tracing_2.messagesCreateSpanSettings)(client, { ...body, stream: true }, headers));
}
//# sourceMappingURL=messages-request.js.map