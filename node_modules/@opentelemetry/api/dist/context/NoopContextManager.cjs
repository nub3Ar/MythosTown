const require_context = require("./context.cjs");
//#region src/context/NoopContextManager.ts
var NoopContextManager = class {
	active() {
		return require_context.ROOT_CONTEXT;
	}
	with(_context, fn, thisArg, ...args) {
		return fn.call(thisArg, ...args);
	}
	bind(_context, target) {
		return target;
	}
	enable() {
		return this;
	}
	disable() {
		return this;
	}
	/** @experimental This API is experimental and may change in minor releases without prior notice. */
	attach(_context) {
		return { dispose() {} };
	}
};
//#endregion
exports.NoopContextManager = NoopContextManager;

//# sourceMappingURL=NoopContextManager.cjs.map