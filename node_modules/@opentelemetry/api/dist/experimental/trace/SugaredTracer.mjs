import "../../trace/status.mjs";
import { context } from "../../context-api.mjs";
//#region src/experimental/trace/SugaredTracer.ts
const defaultOnException = (e, span) => {
	span.recordException(e);
	span.setStatus({ code: 2 });
};
/**
* return a new SugaredTracer created from the supplied one
* @param tracer
*/
function wrapTracer(tracer) {
	return new SugaredTracer(tracer);
}
var SugaredTracer = class {
	constructor(tracer) {
		this._tracer = tracer;
		this.startSpan = tracer.startSpan.bind(this._tracer);
		this.startActiveSpan = tracer.startActiveSpan.bind(this._tracer);
	}
	withActiveSpan(name, arg2, arg3, arg4) {
		const { opts, ctx, fn } = massageParams(arg2, arg3, arg4);
		return this._tracer.startActiveSpan(name, opts, ctx, (span) => handleFn(span, opts, fn));
	}
	withSpan(name, arg2, arg3, arg4) {
		const { opts, ctx, fn } = massageParams(arg2, arg3, arg4);
		return handleFn(this._tracer.startSpan(name, opts, ctx), opts, fn);
	}
};
/**
* Massages parameters of withSpan and withActiveSpan to allow signature overwrites
* @param arg
* @param arg2
* @param arg3
*/
function massageParams(arg, arg2, arg3) {
	var _opts, _ctx;
	let opts;
	let ctx;
	let fn;
	if (!arg2 && !arg3) fn = arg;
	else if (!arg3) {
		opts = arg;
		fn = arg2;
	} else {
		opts = arg;
		ctx = arg2;
		fn = arg3;
	}
	opts = (_opts = opts) !== null && _opts !== void 0 ? _opts : {};
	ctx = (_ctx = ctx) !== null && _ctx !== void 0 ? _ctx : context.active();
	return {
		opts,
		ctx,
		fn
	};
}
/**
* Executes fn, returns results and runs onException in the case of exception to allow overwriting of error handling
* @param span
* @param opts
* @param fn
*/
function handleFn(span, opts, fn) {
	var _opts$onException;
	const onException = (_opts$onException = opts.onException) !== null && _opts$onException !== void 0 ? _opts$onException : defaultOnException;
	const errorHandler = (e) => {
		onException(e, span);
		span.end();
		throw e;
	};
	try {
		const ret = fn(span);
		if (typeof (ret === null || ret === void 0 ? void 0 : ret.then) === "function") return ret.then((val) => {
			span.end();
			return val;
		}, errorHandler);
		span.end();
		return ret;
	} catch (e) {
		throw errorHandler(e);
	}
}
//#endregion
export { SugaredTracer, wrapTracer };

//# sourceMappingURL=SugaredTracer.mjs.map