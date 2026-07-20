import type { Middleware } from "../../../core/middleware.mjs";
/**
 * Removes the trace-context headers ({@link traceHeaderNames}) from `headers` and returns them.
 */
export declare function takeTraceHeaders(headers: Headers): Array<[string, string]>;
/**
 * Returns a middleware that runs `middleware`, which may sign the request, without the trace-context
 * headers, and sets them again on what `middleware` passes on.
 */
export declare function withoutTraceHeaders(middleware: Middleware): Middleware;
//# sourceMappingURL=headers.d.mts.map