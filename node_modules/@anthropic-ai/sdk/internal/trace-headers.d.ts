/**
 * The names, in lower case, of the headers that carry a trace context: those of W3C Trace Context
 * and Baggage, and any other that the propagator the application registered writes. An HTTP
 * instrumentation may add to them or replace them after a request is signed, so a signature must not
 * cover them. A propagator that fails to list its fields adds none.
 */
export declare function traceHeaderNames(): Set<string>;
//# sourceMappingURL=trace-headers.d.ts.map