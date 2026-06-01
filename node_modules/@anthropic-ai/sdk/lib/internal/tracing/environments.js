"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startEnvironmentWorkSpan = startEnvironmentWorkSpan;
exports.endEnvironmentWorkSpan = endEnvironmentWorkSpan;
exports.failEnvironmentWorkSpan = failEnvironmentWorkSpan;
exports.withEnvironmentWorkSpan = withEnvironmentWorkSpan;
const api_1 = require("@opentelemetry/api");
const tracing_1 = require("../../../internal/tracing.js");
const attributes_1 = require("./attributes.js");
/**
 * Starts the span of `work`, a Work item that the work poller just claimed, under `parentContext`:
 * the context of whoever asked the poller for the item.
 */
function startEnvironmentWorkSpan(client, work, parentContext) {
    return client._tracer?.startSpan('anthropic.environment.work', {
        kind: api_1.SpanKind.INTERNAL,
        attributes: {
            [attributes_1.ATTR_GEN_AI_PROVIDER_NAME]: client._genAIProviderName,
            'anthropic.environment.id': work.environment_id,
            'anthropic.environment.work.id': work.id,
            'anthropic.session.id': work.data.id,
        },
    }, parentContext);
}
/**
 * Ends the span of a Work item that is finished with as `OK`. The status stays unset when `signal`,
 * the work poller's, was aborted first: the item was then neither finished with nor failed.
 */
function endEnvironmentWorkSpan(span, signal) {
    if (!span?.isRecording()) {
        return;
    }
    if (!signal.aborted) {
        span.setStatus({ code: api_1.SpanStatusCode.OK });
    }
    span.end();
}
/**
 * Ends the span of a Work item whose handling failed with `error`. The status stays unset when
 * `signal`, the work poller's, was aborted first, or `error` is such an abort.
 */
function failEnvironmentWorkSpan(span, signal, error) {
    if (!span?.isRecording()) {
        return;
    }
    if (!signal.aborted) {
        (0, tracing_1.setErrorStatus)(span, error);
    }
    span.end();
}
/**
 * Runs `handle`, the environment worker's handling of a Work item, with the item's span current,
 * and ends the span with how that went.
 */
async function withEnvironmentWorkSpan(client, span, signal, handle) {
    if (!span) {
        return handle();
    }
    try {
        await api_1.context.with(api_1.trace.setSpan(api_1.context.active(), span), handle);
    }
    catch (error) {
        (0, tracing_1.guardTracing)(client, () => failEnvironmentWorkSpan(span, signal, error));
        throw error;
    }
    (0, tracing_1.guardTracing)(client, () => endEnvironmentWorkSpan(span, signal));
}
//# sourceMappingURL=environments.js.map