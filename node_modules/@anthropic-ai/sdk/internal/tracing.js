"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ATTR_ANTHROPIC_SESSION_THREAD_ID = exports.ATTR_URL_SCHEME = exports.ATTR_URL_QUERY = exports.ATTR_URL_PATH = exports.ATTR_URL_FULL = exports.ATTR_SERVER_PORT = exports.ATTR_SERVER_ADDRESS = exports.ATTR_HTTP_ROUTE = exports.ATTR_HTTP_RESPONSE_STATUS_CODE = exports.ATTR_HTTP_REQUEST_RESEND_COUNT = exports.ATTR_HTTP_REQUEST_METHOD = exports.ATTR_GEN_AI_PROVIDER_NAME = exports.ATTR_GEN_AI_CONVERSATION_ID = exports.ATTR_ERROR_TYPE = void 0;
exports.resolveOpenTelemetryOptions = resolveOpenTelemetryOptions;
exports.getTracer = getTracer;
exports.guardTracing = guardTracing;
exports.startApiCallSpan = startApiCallSpan;
exports.setCreatedIDAttribute = setCreatedIDAttribute;
exports.recordAttempt = recordAttempt;
exports.injectTraceHeaders = injectTraceHeaders;
exports.endApiCallSpan = endApiCallSpan;
exports.observeStream = observeStream;
exports.endApiCallSpanWhenStreamEnds = endApiCallSpanWhenStreamEnds;
exports.setErrorStatus = setErrorStatus;
/**
 * OpenTelemetry tracing of the client's API calls.
 *
 * Two terms recur in this file, and wherever else the SDK documents its spans:
 *
 * - An "API call" is one invocation of an SDK method that sends a request to the API. It
 *   includes every retry, and reading the stream that the method returns. Its span, a `CLIENT`
 *   span named after the method, is the "call span".
 * - An "attempt" is one HTTP request within an API call, with its response when it receives
 *   one. An API call that the SDK retries makes several attempts. This SDK emits no span per
 *   attempt. The application's HTTP instrumentation, when it has one, emits each "attempt span"
 *   as a child of the call span.
 *
 * Each SDK method starts the call span of the API call it makes (`startApiCallSpan`) and passes it
 * down in the call's request options (`__span`), so every part of the call records on it as things
 * happen. The client sends its trace context with each attempt (`injectTraceHeaders`), unless the
 * `propagation` option is off, and ends it with the call's result: at once when the call fails or
 * the response body has been parsed (`endApiCallSpan`), or, for a streamed body, when the
 * application has read or closed the stream (`endApiCallSpanWhenStreamEnds`).
 */
const api_1 = require("@opentelemetry/api");
const error_1 = require("../core/error.js");
const streaming_1 = require("../core/streaming.js");
const errors_1 = require("./errors.js");
const headers_1 = require("./headers.js");
const env_1 = require("./utils/env.js");
const log_1 = require("./utils/log.js");
const INSTRUMENTATION_SCOPE = 'com.anthropic.sdk.typescript';
// Attribute names of the OpenTelemetry semantic conventions, named as
// `@opentelemetry/semantic-conventions` names them. They are copied rather than imported: that
// package is not a dependency of this SDK.
exports.ATTR_ERROR_TYPE = 'error.type';
exports.ATTR_GEN_AI_CONVERSATION_ID = 'gen_ai.conversation.id';
exports.ATTR_GEN_AI_PROVIDER_NAME = 'gen_ai.provider.name';
exports.ATTR_HTTP_REQUEST_METHOD = 'http.request.method';
exports.ATTR_HTTP_REQUEST_RESEND_COUNT = 'http.request.resend_count';
exports.ATTR_HTTP_RESPONSE_STATUS_CODE = 'http.response.status_code';
exports.ATTR_HTTP_ROUTE = 'http.route';
exports.ATTR_SERVER_ADDRESS = 'server.address';
exports.ATTR_SERVER_PORT = 'server.port';
exports.ATTR_URL_FULL = 'url.full';
exports.ATTR_URL_PATH = 'url.path';
exports.ATTR_URL_QUERY = 'url.query';
exports.ATTR_URL_SCHEME = 'url.scheme';
// This API's own name, in the same style.
exports.ATTR_ANTHROPIC_SESSION_THREAD_ID = 'anthropic.session.thread.id';
/** The default `traces.maxContentBytes`. */
const DEFAULT_MAX_CONTENT_BYTES = 750000;
/**
 * Settles `propagation` and the `traces` field of `option`, the `openTelemetry` client option. The
 * environment variables apply only to a client that is given no option. An option that is given is
 * complete: a field that it leaves unset has the default, whatever the environment says. A content
 * mode or a size that is not valid is the default one.
 *
 * A client calls this once, when it is constructed, and keeps the result, which a
 * `withOptions()` copy without its own option takes as it is. So a later change to the environment
 * affects neither the client nor such a copy. The result is frozen.
 */
function resolveOpenTelemetryOptions(option) {
    // `false` is short for `{ traces: false }`.
    const { tracerProvider, propagation, traces } = option === false ? { traces: false } : option ?? optionFromEnv();
    const { enabled, contentMode, maxContentBytes } = typeof traces === 'boolean' ? { enabled: traces } : traces ?? {};
    return Object.freeze({
        tracerProvider,
        propagation: propagation ?? true,
        traces: Object.freeze({
            enabled: enabled ?? true,
            contentMode: contentMode === 'content' ? 'content' : 'metadata_only',
            maxContentBytes: maxContentBytes !== undefined && Number.isInteger(maxContentBytes) && maxContentBytes >= 1 ?
                maxContentBytes
                : DEFAULT_MAX_CONTENT_BYTES,
        }),
    });
}
/** What the environment variables give, for a client that is given no `openTelemetry` option. */
function optionFromEnv() {
    return {
        propagation: (0, env_1.readEnv)('ANTHROPIC_OPEN_TELEMETRY_PROPAGATION')?.toLowerCase() !== 'false',
        traces: {
            enabled: (0, env_1.readEnv)('ANTHROPIC_OPEN_TELEMETRY')?.toLowerCase() !== 'false',
            contentMode: (0, env_1.readEnv)('ANTHROPIC_OPEN_TELEMETRY_TRACES_CONTENT_MODE')?.toLowerCase() === 'content' ?
                'content'
                : 'metadata_only',
            // The variable holds decimal digits only: `1e3` and `0x10` are not sizes.
            maxContentBytes: Number(/^\d+$/.exec((0, env_1.readEnv)('ANTHROPIC_OPEN_TELEMETRY_TRACES_MAX_CONTENT_BYTES') ?? '')?.[0] ?? NaN),
        },
    };
}
/**
 * The tracer for a client with the settled `openTelemetry` option `option`, or `undefined` when
 * the client's spans are disabled.
 * `version` is the SDK's version. It is a parameter because some packages build
 * `src/internal` without `src/version.ts`. The client of another platform's package gives
 * `platform`, which the name of the tracer's scope then ends with, and that package's `version`.
 */
function getTracer(option, version, platform) {
    if (!option.traces.enabled) {
        return undefined;
    }
    const scope = platform !== undefined ? `${INSTRUMENTATION_SCOPE}.${platform}` : INSTRUMENTATION_SCOPE;
    return (option.tracerProvider ?? api_1.trace.getTracerProvider()).getTracer(scope, version);
}
/**
 * Runs `step`, a step of tracing that calls the application's OpenTelemetry code: its tracer
 * provider, sampler, span processors or propagator. A failure of telemetry never fails an API call,
 * so what `step` throws goes to the logger of `client`, when there is one, and the result is then
 * `undefined`: the SDK goes on as if tracing were off for that step.
 */
function guardTracing(client, step) {
    try {
        return step();
    }
    catch (problem) {
        if (client) {
            (0, log_1.loggerFor)(client).debug('could not record telemetry', problem);
        }
        return undefined;
    }
}
/**
 * Starts the call span of the API call that an SDK method of `client` is about to make with
 * `options`, as a child of the current span. `name` is the span's name, and `settings` is what
 * else the method says of the call. The method passes the result down in the call's request
 * options, as `__span`.
 *
 * When `options` already has a span, that span is the result: a helper that calls an SDK method
 * starts the span itself, to record on it, and the method's API call uses that span instead of
 * starting another.
 *
 * Returns `undefined` when the client's spans are disabled, when the span failed to start
 * ({@link guardTracing}), or when the span neither records nor propagates a trace context: such a
 * span has no effect, so the API call runs as if tracing were off. With `propagation` off, a span
 * with a valid context counts as propagating: it is the active span during the attempts, which the
 * application's HTTP instrumentation continues.
 */
function startApiCallSpan(client, name, options, settings) {
    if (options?.__span) {
        return options.__span;
    }
    const tracer = client._tracer;
    if (!tracer) {
        return undefined;
    }
    return guardTracing(client, () => {
        const startTime = Date.now();
        // A Session thread is a conversation, so its ID in the path stands in for one the application
        // did not give.
        const threadID = settings?.attributes?.[exports.ATTR_ANTHROPIC_SESSION_THREAD_ID];
        const conversationId = options?.openTelemetry?.conversationId ?? (typeof threadID === 'string' ? threadID : undefined);
        const span = tracer.startSpan(name, {
            kind: api_1.SpanKind.CLIENT,
            // On the span from its start, with what the method gives, for a sampler to decide on.
            attributes: {
                [exports.ATTR_GEN_AI_PROVIDER_NAME]: client._genAIProviderName,
                ...serverAttributes(client.baseURL),
                ...(conversationId != null ? { [exports.ATTR_GEN_AI_CONVERSATION_ID]: conversationId } : undefined),
                ...(settings?.route != null ? { [exports.ATTR_HTTP_ROUTE]: settings.route } : undefined),
                ...settings?.attributes,
            },
        });
        if (!span.isRecording() &&
            !(client.openTelemetry.propagation ?
                Object.keys(injectContext(span)).length > 0
                : api_1.trace.isSpanContextValid(span.spanContext()))) {
            return undefined;
        }
        return { ...settings, span, name, startTime };
    });
}
/**
 * Sets on `call`, the call span of an API call whose method creates one object, the ID of that
 * object from `data`, the call's parsed response: its `id`, or the field that the method named.
 * Does nothing for any other call, or when `data` has no string there.
 */
function setCreatedIDAttribute(call, data) {
    if (call.createdIDAttribute === undefined || typeof data !== 'object' || data === null) {
        return;
    }
    const id = data[call.createdIDField ?? 'id'];
    if (typeof id === 'string') {
        call.span.setAttribute(call.createdIDAttribute, id);
    }
}
/**
 * `server.address` and `server.port` for the server at `url`, a client's base URL.
 */
function serverAttributes(url) {
    try {
        const { hostname, port, protocol } = new URL(url);
        return {
            // `URL.hostname` keeps an IPv6 literal's brackets, which delimit it in a URL;
            // `server.address` is the bare address.
            [exports.ATTR_SERVER_ADDRESS]: hostname.replace(/^\[(.*)\]$/, '$1'),
            [exports.ATTR_SERVER_PORT]: port ? Number(port)
                : protocol === 'http:' ? 80
                    : 443,
        };
    }
    catch {
        return {};
    }
}
/**
 * Records on `call` that the client is about to make an attempt of the call: a request with
 * `method` to `url`. The first attempt gives the span `http.request.method` and the `url.*`
 * attributes, which a later attempt never replaces. Each later attempt, whatever its reason,
 * counts in `http.request.resend_count`, which a call with one attempt does not have.
 *
 * A query with a parameter whose value is content ({@link CONTENT_QUERY_PARAMS}, and the call's own
 * `contentQueryParams`) makes `url.query` and `url.full` content too, which the span has only when
 * `recordsContent` is true.
 */
function recordAttempt(call, method, url, recordsContent = false) {
    call.attempts = (call.attempts ?? 0) + 1;
    if (call.attempts > 1) {
        call.span.setAttribute(exports.ATTR_HTTP_REQUEST_RESEND_COUNT, call.attempts - 1);
        return;
    }
    call.span.setAttribute(exports.ATTR_HTTP_REQUEST_METHOD, method);
    try {
        const { protocol, host, pathname, search } = new URL(url);
        const query = definedQuery(search.slice(1), call.queryParams, call.contentQueryParams);
        call.span.setAttributes({
            [exports.ATTR_URL_SCHEME]: protocol.slice(0, -1),
            [exports.ATTR_URL_PATH]: pathname,
        });
        if (query?.content && !recordsContent) {
            return;
        }
        call.span.setAttributes({
            ...(query !== undefined ? { [exports.ATTR_URL_QUERY]: query.value } : undefined),
            // With the recorded query, not the one sent.
            [exports.ATTR_URL_FULL]: `${protocol}//${host}${pathname}${query !== undefined ? `?${query.value}` : ''}`,
        });
    }
    catch { }
}
/**
 * The query parameters whose value is content on every endpoint that defines them.
 */
const CONTENT_QUERY_PARAMS = ['email', 'path_prefix', 'expected_content_sha256'];
/**
 * The parts of `query`, a query string as sent, whose parameter is one of `defined`, as they were
 * sent and in their order, or `undefined` when there is none. A part's parameter is its
 * percent-decoded name, or that name without a final `[]`, which is how an array parameter `ids`
 * is sent: a name with other brackets, such as `created_at[gte]`, has to be one of `defined` as it
 * is. `content` says whether one of those parameters is one of {@link CONTENT_QUERY_PARAMS} or of
 * `contentParams`.
 */
function definedQuery(query, defined, contentParams) {
    if (!query || !defined?.length) {
        return undefined;
    }
    let content = false;
    const parts = query.split('&').filter((part) => {
        try {
            const name = decodeURIComponent(part.split('=', 1)[0]);
            const param = defined.includes(name) || !name.endsWith('[]') ? name : name.slice(0, -2);
            if (!defined.includes(param)) {
                return false;
            }
            content || (content = CONTENT_QUERY_PARAMS.includes(param) || !!contentParams?.includes(param));
            return true;
        }
        catch {
            return false;
        }
    });
    return parts.length ? { value: parts.join('&'), content } : undefined;
}
/**
 * Returns `headers` with the trace context of `span` injected, as the propagator the
 * application registered writes it, in place of any such headers already present. The client
 * sends these with each attempt, so a retry carries the context afresh.
 */
function injectTraceHeaders(span, headers) {
    // `fetchOptions` can replace the built headers with a plain object.
    const values = (0, headers_1.buildHeaders)([headers]).values;
    for (const [key, value] of Object.entries(injectContext(span))) {
        values.set(key, value);
    }
    return values;
}
/**
 * Ends `span`, the call span of an API call, now that the call has `result`. The span gets
 * `http.response.status_code` when a response arrived, and its status: `ERROR` with `error.type`
 * when the call failed, none when the application aborted it, and `OK` otherwise. The span of a
 * streamed body that the application has yet to read ends through
 * {@link endApiCallSpanWhenStreamEnds} instead.
 *
 * Does nothing to a span that is not recording, such as one that already ended.
 */
function endApiCallSpan(span, result) {
    if (!span.isRecording()) {
        return;
    }
    setResponseStatusCode(span, result);
    switch (result.status) {
        case 'success':
            span.setStatus({ code: api_1.SpanStatusCode.OK });
            break;
        case 'error':
            setErrorStatus(span, result.error);
            break;
    }
    span.end();
}
/**
 * Reports the application's read of `stream` to `observer`, by replacing the iterator of `stream`
 * in place. `signal` is the abort signal of the request that `stream` reads. Only the first
 * iterator is observed. What the callbacks throw is dropped.
 */
function observeStream(stream, signal, observer) {
    // Unbound, so that the abort listener, which `signal` keeps, does not keep an unread `stream`.
    const iterate = stream[Symbol.asyncIterator];
    let ended = false;
    const end = (how) => {
        if (ended)
            return;
        ended = true;
        signal.removeEventListener('abort', cancel);
        try {
            observer.onEnd(how);
        }
        catch { }
    };
    const cancel = () => end({ reason: 'canceled' });
    if (signal.aborted)
        return cancel();
    signal.addEventListener('abort', cancel, { once: true });
    let observed = false;
    stream[Symbol.asyncIterator] = function () {
        const source = iterate.call(this);
        if (observed)
            return source;
        observed = true;
        // From here the iterator sees every way the read can end. `Stream` also aborts its own
        // controller when it fails or is closed, which must not count as the application's abort.
        signal.removeEventListener('abort', cancel);
        const iterator = {
            async next() {
                let result;
                try {
                    result = await source.next();
                }
                catch (error) {
                    end({ reason: 'failed', error });
                    throw error;
                }
                if (result.done) {
                    // `Stream` ends quietly when the application aborts the request.
                    end({ reason: signal.aborted ? 'canceled' : 'completed' });
                }
                else if (!ended) {
                    try {
                        observer.onItem?.(result.value);
                    }
                    catch { }
                }
                return result;
            },
            async return(value) {
                cancel();
                return (await source.return?.(value)) ?? { done: true, value };
            },
            async throw(error) {
                cancel();
                if (source.throw)
                    return source.throw(error);
                throw error;
            },
            [Symbol.asyncIterator]: () => iterator,
        };
        return iterator;
    };
}
/**
 * Ends `span`, the call span of an API call, when the application's read of its streamed response
 * body `stream` ends. Server-sent events have no end event, so the server ending them is not `OK`;
 * any other body is complete at its end.
 */
function endApiCallSpanWhenStreamEnds(span, stream, props) {
    if (!span.isRecording())
        return;
    span.setAttribute(exports.ATTR_HTTP_RESPONSE_STATUS_CODE, props.response.status);
    const isSSE = stream instanceof streaming_1.Stream;
    observeStream(stream, props.controller.signal, {
        onEnd(end) {
            if (end.reason === 'failed')
                setErrorStatus(span, end.error);
            else if (end.reason === 'completed' && !isSSE) {
                span.setStatus({ code: api_1.SpanStatusCode.OK });
            }
            span.end();
        },
    });
}
/**
 * Sets `http.response.status_code` on the call span from the response in `result`, or from its
 * error when that is an error response.
 */
function setResponseStatusCode(span, result) {
    const status = result.response?.status ??
        (result.status === 'error' && result.error instanceof error_1.APIError ? result.error.status : undefined);
    if (status !== undefined) {
        span.setAttribute(exports.ATTR_HTTP_RESPONSE_STATUS_CODE, status);
    }
}
/**
 * Gives `span` the status of an operation that failed with `error`: `ERROR`, with `error.type`
 * set to `type` or else derived from `error`. An abort by the application is a cancellation,
 * not a failure, and leaves the status unset.
 */
function setErrorStatus(span, error, type) {
    if (error instanceof error_1.APIUserAbortError || (0, errors_1.isAbortError)(error)) {
        return;
    }
    span.setStatus({ code: api_1.SpanStatusCode.ERROR });
    span.setAttribute(exports.ATTR_ERROR_TYPE, type ?? errorType(error));
}
/**
 * The headers that carry `span`'s trace context, from the propagator the application registered.
 */
function injectContext(span) {
    const carrier = {};
    api_1.propagation.inject(api_1.trace.setSpan(api_1.context.active(), span), carrier);
    return carrier;
}
/**
 * The `error.type` of an operation that failed with `error`. An error response has the type of
 * its error envelope when the API sent one, and its status code otherwise.
 */
function errorType(error) {
    if (error instanceof error_1.APIConnectionTimeoutError) {
        return 'client_timeout_error';
    }
    if (error instanceof error_1.APIConnectionError) {
        return 'connection_error';
    }
    if (error instanceof error_1.APIError) {
        if (error.type) {
            return error.type;
        }
        if (error.status !== undefined) {
            return String(error.status);
        }
    }
    return 'client_error';
}
//# sourceMappingURL=tracing.js.map