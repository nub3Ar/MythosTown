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
import { type Attributes, type Span, type Tracer, type TracerProvider } from '@opentelemetry/api';
import { type HeadersLike } from "./headers.js";
import type { BaseAnthropic } from "../client.js";
import type { APIResponseProps } from "./parse.js";
import type { RequestOptions } from "./request-options.js";
export declare const ATTR_ERROR_TYPE = "error.type";
export declare const ATTR_GEN_AI_CONVERSATION_ID = "gen_ai.conversation.id";
export declare const ATTR_GEN_AI_PROVIDER_NAME = "gen_ai.provider.name";
export declare const ATTR_HTTP_REQUEST_METHOD = "http.request.method";
export declare const ATTR_HTTP_REQUEST_RESEND_COUNT = "http.request.resend_count";
export declare const ATTR_HTTP_RESPONSE_STATUS_CODE = "http.response.status_code";
export declare const ATTR_HTTP_ROUTE = "http.route";
export declare const ATTR_SERVER_ADDRESS = "server.address";
export declare const ATTR_SERVER_PORT = "server.port";
export declare const ATTR_URL_FULL = "url.full";
export declare const ATTR_URL_PATH = "url.path";
export declare const ATTR_URL_QUERY = "url.query";
export declare const ATTR_URL_SCHEME = "url.scheme";
export declare const ATTR_ANTHROPIC_SESSION_THREAD_ID = "anthropic.session.thread.id";
/**
 * The `openTelemetry` client option.
 */
export interface OpenTelemetryOptions {
    /**
     * The tracer provider that creates this client's spans, in place of the one
     * registered with the OpenTelemetry API.
     */
    tracerProvider?: TracerProvider | undefined;
    /**
     * Whether this client sends the trace context of its spans with its requests, as the headers
     * that the propagator registered with the OpenTelemetry API writes: `traceparent`, and
     * `tracestate` and `baggage` when the propagator writes them. `false` is for an application
     * whose HTTP client instrumentation already propagates the trace context, so that a request
     * does not carry it twice. It does not affect the spans.
     *
     * @default true
     */
    propagation?: boolean | undefined;
    /**
     * This client's spans. `true` and `false` are short for `{ enabled: true }` and
     * `{ enabled: false }`.
     */
    traces?: boolean | OpenTelemetryTracesOptions | undefined;
}
/**
 * The `traces` field of the `openTelemetry` client option.
 */
export interface OpenTelemetryTracesOptions {
    /**
     * Whether this client emits spans. A client that emits no span does not use the other settings.
     *
     * @default true
     */
    enabled?: boolean | undefined;
    /**
     * Whether this client's spans carry the content of its requests and responses, such as
     * prompts and completions. `metadata_only` leaves the content out.
     *
     * @default 'metadata_only'
     */
    contentMode?: 'metadata_only' | 'content' | undefined;
    /**
     * The most content that one span carries, in bytes. The SDK measures the content attributes'
     * values by their size in UTF-8. A span with more content loses some of it, and has
     * `anthropic.content.truncated`. An integer of at least 1.
     *
     * @default 750000
     */
    maxContentBytes?: number | undefined;
}
/**
 * The `openTelemetry` request option.
 */
export interface OpenTelemetryRequestOptions {
    /**
     * An ID that links this API call's span to the spans of the other API calls in one
     * conversation. The SDK sets it as `gen_ai.conversation.id`, and does not send it to the API.
     * Without one, a call to a Session thread's path has the ID of that thread there.
     */
    conversationId?: string | undefined;
}
/**
 * The `openTelemetry` client option as a client keeps it, with every field of `traces` settled.
 * It is itself a valid `openTelemetry` option.
 */
export interface ResolvedOpenTelemetryOptions {
    /**
     * The tracer provider that creates the client's spans, or `undefined` for the one registered
     * with the OpenTelemetry API.
     */
    readonly tracerProvider?: TracerProvider | undefined;
    /** Whether the client sends the trace context of its spans with its requests. */
    readonly propagation: boolean;
    /** The settings of the client's spans. */
    readonly traces: {
        /** Whether the client emits spans. */
        readonly enabled: boolean;
        /** Whether the client's spans carry the content of its requests and responses. */
        readonly contentMode: 'metadata_only' | 'content';
        /** The most content that one span carries, which the SDK measures in UTF-8 bytes. */
        readonly maxContentBytes: number;
    };
}
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
export declare function resolveOpenTelemetryOptions(option: OpenTelemetryOptions | false | undefined): ResolvedOpenTelemetryOptions;
/**
 * The tracer for a client with the settled `openTelemetry` option `option`, or `undefined` when
 * the client's spans are disabled.
 * `version` is the SDK's version. It is a parameter because some packages build
 * `src/internal` without `src/version.ts`. The client of another platform's package gives
 * `platform`, which the name of the tracer's scope then ends with, and that package's `version`.
 */
export declare function getTracer(option: ResolvedOpenTelemetryOptions, version: string, platform?: string | undefined): Tracer | undefined;
/**
 * Runs `step`, a step of tracing that calls the application's OpenTelemetry code: its tracer
 * provider, sampler, span processors or propagator. A failure of telemetry never fails an API call,
 * so what `step` throws goes to the logger of `client`, when there is one, and the result is then
 * `undefined`: the SDK goes on as if tracing were off for that step.
 */
export declare function guardTracing<Result>(client: BaseAnthropic | undefined, step: () => Result): Result | undefined;
/**
 * The call span of an API call, with its name and start time, which a `Span` does not expose. It
 * travels in the call's request options, as `__span`.
 */
export interface ApiCallSpan extends ApiCallSpanSettings {
    span: Span;
    /** The span's name, which says which SDK method makes the API call. */
    name: string;
    /** When the span started, in epoch milliseconds. */
    startTime: number;
    /** How many attempts the call has made so far. */
    attempts?: number;
    /**
     * The error of a stream helper that failed while it read the call's stream. Without it the
     * stream's end, which the helper's exit causes, would read as a cancellation.
     */
    failure?: unknown;
    /**
     * The size of the request's content on the span, which counts toward the content size limit, or
     * more than that when the content was not measured.
     */
    requestContentSize?: number;
}
/**
 * What an SDK method says of its API call when it starts the call span, besides the span's name.
 */
export interface ApiCallSpanSettings {
    /**
     * The endpoint's path as the API's description gives it, with the names of its parameters in
     * braces, for `http.route`.
     */
    route?: string | undefined;
    /**
     * The names of the query parameters that the API's description defines for the endpoint. Only
     * these are recorded in `url.query`.
     */
    queryParams?: readonly string[] | undefined;
    /** Those of `queryParams` whose value is content on this endpoint only. */
    contentQueryParams?: readonly string[] | undefined;
    /**
     * What the method knows of the call when it makes it, to start the span with: the IDs in the
     * request's path, each under its attribute's name, from the method's own arguments. The span of
     * a later page of a list starts with them too.
     */
    attributes?: Attributes | undefined;
    /**
     * The attribute for the ID of the object that the method creates. The span gets it from the
     * call's parsed response ({@link setCreatedIDAttribute}), so a failed create has none.
     */
    createdIDAttribute?: string | undefined;
    /**
     * The field of the parsed response that has the ID of the created object, when it is not `id`:
     * the response to adding a member has the member's `user_id`, and no `id`.
     */
    createdIDField?: string | undefined;
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
export declare function startApiCallSpan(client: BaseAnthropic, name: string, options?: RequestOptions | undefined, settings?: ApiCallSpanSettings | undefined): ApiCallSpan | undefined;
/**
 * Sets on `call`, the call span of an API call whose method creates one object, the ID of that
 * object from `data`, the call's parsed response: its `id`, or the field that the method named.
 * Does nothing for any other call, or when `data` has no string there.
 */
export declare function setCreatedIDAttribute(call: ApiCallSpan, data: unknown): void;
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
export declare function recordAttempt(call: ApiCallSpan, method: string, url: string, recordsContent?: boolean): void;
/**
 * Returns `headers` with the trace context of `span` injected, as the propagator the
 * application registered writes it, in place of any such headers already present. The client
 * sends these with each attempt, so a retry carries the context afresh.
 */
export declare function injectTraceHeaders(span: Span, headers: HeadersLike): Headers;
/**
 * The result of an API call made with `options`, as far as the call got.
 */
export type ApiCallResult = {
    /** `response` arrived. */
    status: 'success';
    options: RequestOptions;
    response: Response;
    /** The parsed body of `response`, or `undefined` when the body was not read. */
    data: unknown;
} | {
    /** The call failed with `error`. */
    status: 'error';
    options: RequestOptions;
    error: unknown;
    /** The response, when one arrived before the call failed. */
    response?: Response | undefined;
};
/**
 * Ends `span`, the call span of an API call, now that the call has `result`. The span gets
 * `http.response.status_code` when a response arrived, and its status: `ERROR` with `error.type`
 * when the call failed, none when the application aborted it, and `OK` otherwise. The span of a
 * streamed body that the application has yet to read ends through
 * {@link endApiCallSpanWhenStreamEnds} instead.
 *
 * Does nothing to a span that is not recording, such as one that already ended.
 */
export declare function endApiCallSpan(span: Span, result: ApiCallResult): void;
/** How the application's read of a streamed body ended. */
export type StreamEnd = {
    reason: 'completed';
} | {
    reason: 'canceled';
} | {
    reason: 'failed';
    error: unknown;
};
export interface StreamObserver<Item> {
    /** Called with each item, before the application receives it. */
    onItem?(item: Item): void;
    /** Called once: when the read ends, or when the request is aborted, whichever is first. */
    onEnd(end: StreamEnd): void;
}
/**
 * Reports the application's read of `stream` to `observer`, by replacing the iterator of `stream`
 * in place. `signal` is the abort signal of the request that `stream` reads. Only the first
 * iterator is observed. What the callbacks throw is dropped.
 */
export declare function observeStream<Item>(stream: AsyncIterable<Item>, signal: AbortSignal, observer: StreamObserver<Item>): void;
/**
 * Ends `span`, the call span of an API call, when the application's read of its streamed response
 * body `stream` ends. Server-sent events have no end event, so the server ending them is not `OK`;
 * any other body is complete at its end.
 */
export declare function endApiCallSpanWhenStreamEnds(span: Span, stream: AsyncIterable<unknown>, props: APIResponseProps): void;
/**
 * Gives `span` the status of an operation that failed with `error`: `ERROR`, with `error.type`
 * set to `type` or else derived from `error`. An abort by the application is a cancellation,
 * not a failure, and leaves the status unset.
 */
export declare function setErrorStatus(span: Span, error: unknown, type?: string): void;
//# sourceMappingURL=tracing.d.ts.map