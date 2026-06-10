"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traceHeaderNames = traceHeaderNames;
const api_1 = require("@opentelemetry/api");
const log_1 = require("./utils/log.js");
/**
 * The names, in lower case, of the headers that carry a trace context: those of W3C Trace Context
 * and Baggage, and any other that the propagator the application registered writes. An HTTP
 * instrumentation may add to them or replace them after a request is signed, so a signature must not
 * cover them. A propagator that fails to list its fields adds none.
 */
function traceHeaderNames() {
    const names = new Set(['traceparent', 'tracestate', 'baggage']);
    try {
        for (const name of api_1.propagation.fields()) {
            names.add(name.toLowerCase());
        }
    }
    catch (problem) {
        // A signer calls this with no client at hand.
        (0, log_1.defaultLogger)().debug('could not record telemetry', problem);
    }
    return names;
}
//# sourceMappingURL=trace-headers.js.map