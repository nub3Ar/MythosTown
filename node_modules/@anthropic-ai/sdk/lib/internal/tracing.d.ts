export { messagesCreateSpanSettings, recordCountTokensResponse, recordMessagesCreateRequest, recordMessagesCreateResponse, recordSessionsCreateResponse, setAnthropicSpanAttributes, } from "./tracing/api-call.js";
export { takeTraceHeaders, withoutTraceHeaders } from "./tracing/headers.js";
export { endAnthropicApiCallSpanWhenStreamEnds, recordStreamedMessageContent } from "./tracing/streaming.js";
export { endEnvironmentWorkSpan, failEnvironmentWorkSpan, startEnvironmentWorkSpan, withEnvironmentWorkSpan, } from "./tracing/environments.js";
export { startToolRunnerSpan, withToolUseSpan } from "./tracing/tools.js";
//# sourceMappingURL=tracing.d.ts.map