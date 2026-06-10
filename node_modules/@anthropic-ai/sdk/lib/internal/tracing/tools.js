"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startToolRunnerSpan = startToolRunnerSpan;
exports.withToolUseSpan = withToolUseSpan;
const api_1 = require("@opentelemetry/api");
const stainless_helper_header_1 = require("../../../internal/stainless-helper-header.js");
const tracing_1 = require("../../../internal/tracing.js");
const log_1 = require("../../../internal/utils/log.js");
const attributes_1 = require("./attributes.js");
const content_1 = require("./content.js");
/**
 * Starts the `anthropic.messages.tool_runner` span of one loop of the Messages tool runner, as a
 * child of the current span. The runner sets its status and ends it.
 */
function startToolRunnerSpan(client, params, conversationId) {
    // A client whose spans are disabled computes nothing for one.
    if (!client._tracer)
        return undefined;
    const hasJSONOutput = params.output_config?.format?.type === 'json_schema' || params.output_format?.type === 'json_schema';
    return client._tracer.startSpan('anthropic.messages.tool_runner', {
        kind: api_1.SpanKind.INTERNAL,
        attributes: {
            [attributes_1.ATTR_GEN_AI_OPERATION_NAME]: attributes_1.GEN_AI_OPERATION_NAME_VALUE_INVOKE_AGENT,
            [attributes_1.ATTR_GEN_AI_PROVIDER_NAME]: client._genAIProviderName,
            [attributes_1.ATTR_GEN_AI_REQUEST_MODEL]: params.model,
            ...(hasJSONOutput ? { [attributes_1.ATTR_GEN_AI_OUTPUT_TYPE]: attributes_1.GEN_AI_OUTPUT_TYPE_VALUE_JSON } : undefined),
            ...(conversationId != null ? { [attributes_1.ATTR_GEN_AI_CONVERSATION_ID]: conversationId } : undefined),
        },
    });
}
/**
 * Runs `run`, one client tool run of a tool runner, with the run's span current, and returns its
 * result. An error result fails the span with `tool_error`, unless the application has aborted
 * `signal`: a canceled run gets no status and no result.
 */
async function withToolUseSpan(client, tool, toolUse, options, run) {
    // A client whose spans are disabled computes nothing for one.
    const tracer = client._tracer;
    if (!tracer)
        return run();
    const { signal, conversationId, sessionID, parentContext = api_1.context.active() } = options;
    // Only a tool that the application or an MCP server defines has a description. It is not content.
    const description = 'description' in tool ? tool.description : undefined;
    const attributes = {
        [attributes_1.ATTR_GEN_AI_OPERATION_NAME]: attributes_1.GEN_AI_OPERATION_NAME_VALUE_EXECUTE_TOOL,
        [attributes_1.ATTR_GEN_AI_PROVIDER_NAME]: client._genAIProviderName,
        [attributes_1.ATTR_GEN_AI_TOOL_NAME]: toolUse.name,
        // Only a call to a member of a toolset, such as `computer`, has one.
        ...('toolset_name' in toolUse && typeof toolUse.toolset_name === 'string' ?
            { [attributes_1.ATTR_ANTHROPIC_TOOLSET_NAME]: toolUse.toolset_name }
            : undefined),
        ...(description ? { [attributes_1.ATTR_GEN_AI_TOOL_DESCRIPTION]: description } : undefined),
        [attributes_1.ATTR_GEN_AI_TOOL_CALL_ID]: toolUse.id,
        [attributes_1.ATTR_GEN_AI_TOOL_TYPE]: attributes_1.GEN_AI_TOOL_TYPE_VALUE_FUNCTION,
        ...(conversationId != null ? { [attributes_1.ATTR_GEN_AI_CONVERSATION_ID]: conversationId } : undefined),
        ...(sessionID != null ? { 'anthropic.session.id': sessionID } : undefined),
        // Only a Session event of a child thread has one.
        ...('session_thread_id' in toolUse && toolUse.session_thread_id != null ?
            { 'anthropic.session.thread.id': toolUse.session_thread_id }
            : undefined),
    };
    const operation = toolUse.type === 'agent.tool_use' ? 'anthropic.tool_use'
        : (0, stainless_helper_header_1.wasCreatedByStainlessHelper)(tool) && tool[stainless_helper_header_1.SDK_HELPER_SYMBOL] === 'mcpTool' ? 'anthropic.mcp_tool_use'
            : 'anthropic.custom_tool_use';
    const span = (0, tracing_1.guardTracing)(client, () => tracer.startSpan(`${operation} ${toolUse.name}`, { kind: api_1.SpanKind.INTERNAL, attributes }, parentContext));
    if (!span)
        return run();
    let result;
    try {
        result = await api_1.context.with(api_1.trace.setSpan(parentContext, span), run);
        return result;
    }
    finally {
        // `run` makes an error result of what the tool throws, so no result is the runner's own failure.
        const succeeded = result !== undefined && !result.isError;
        const canceled = !succeeded && signal?.aborted === true;
        const { contentMode, maxContentBytes } = client.openTelemetry.traces;
        if (contentMode === 'content' && span.isRecording()) {
            try {
                (0, content_1.setContentAttributes)(span, {
                    [attributes_1.ATTR_GEN_AI_TOOL_CALL_ARGUMENTS]: toolUse.input,
                    [attributes_1.ATTR_ANTHROPIC_TOOL_RESULT_CONTENT]: result && !canceled ? (0, content_1.toolResultContentBlocks)(result.content) : undefined,
                }, maxContentBytes);
            }
            catch (problem) {
                // A failure to record telemetry, such as content that JSON cannot hold, must not fail the run.
                (0, log_1.loggerFor)(client).debug('could not record the tool run on its span', problem);
            }
        }
        (0, tracing_1.guardTracing)(client, () => {
            if (succeeded) {
                span.setStatus({ code: api_1.SpanStatusCode.OK });
            }
            else if (!canceled) {
                (0, tracing_1.setErrorStatus)(span, result, 'tool_error');
            }
            span.end();
        });
    }
}
//# sourceMappingURL=tools.js.map