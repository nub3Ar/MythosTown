const require_global_utils = require("../internal/global-utils.cjs");
const require_diag = require("./diag.cjs");
const require_NoopContextManager = require("../context/NoopContextManager.cjs");
//#region src/api/context.ts
const API_NAME = "context";
const NOOP_CONTEXT_MANAGER = new require_NoopContextManager.NoopContextManager();
const NOOP_TOKEN = Object.freeze({ dispose: () => {} });
/**
* Singleton object which represents the entry point to the OpenTelemetry Context API
*
* @since 1.0.0
*/
var ContextAPI = class ContextAPI {
	/** Empty private constructor prevents end users from constructing a new instance of the API */
	constructor() {
		this._attachUnsupportedWarned = false;
	}
	/** Get the singleton instance of the Context API */
	static getInstance() {
		if (!this._instance) this._instance = new ContextAPI();
		return this._instance;
	}
	/**
	* Set the current context manager.
	*
	* @returns true if the context manager was successfully registered, else false
	*/
	setGlobalContextManager(contextManager) {
		return require_global_utils.registerGlobal(API_NAME, contextManager, require_diag.DiagAPI.instance());
	}
	/**
	* Get the currently active context
	*/
	active() {
		return this._getContextManager().active();
	}
	/**
	* Execute a function with an active context
	*
	* @param context context to be active during function execution
	* @param fn function to execute in a context
	* @param thisArg optional receiver to be used for calling fn
	* @param args optional arguments forwarded to fn
	*/
	with(context, fn, thisArg, ...args) {
		return this._getContextManager().with(context, fn, thisArg, ...args);
	}
	/**
	* Bind a context to a target function or event emitter
	*
	* @param context context to bind to the event emitter or function. Defaults to the currently active context
	* @param target function or event emitter to bind
	*/
	bind(context, target) {
		return this._getContextManager().bind(context, target);
	}
	/**
	* Imperatively sets `context` as active, returning a {@link ContextManagementToken} whose
	* {@link ContextManagementToken.dispose} restores the previous context.
	*
	* This is a delicate, low-level API - prefer {@link with}/{@link bind}, which
	* restore context automatically. Use `attach` only to bridge callback
	* boundaries that `with` cannot wrap. Call `token.dispose()` when the
	* operation is done.
	*
	* **Caveat for async functions:** If called inside an async function before
	* the first `await`, the context change may leak into the caller's context
	* and remain active there. Prefer {@link with} for async code.
	*
	* Support is best-effort and varies by the active ContextManager (see
	* {@link ContextManager.attach}); if it does not implement `attach`, this logs
	* a warning and returns a no-op token.
	*
	* @param context The Context to attach
	* @returns A {@link ContextManagementToken} whose dispose() restores the previous Context
	* @since 1.10.0
	* @experimental This API is experimental and may change in minor releases without prior notice.
	*/
	attach(context) {
		const contextManager = this._getContextManager();
		if (contextManager.attach) return contextManager.attach(context);
		if (!this._attachUnsupportedWarned) {
			this._attachUnsupportedWarned = true;
			require_diag.DiagAPI.instance().warn("The current ContextManager does not implement attach(). The context will not be attached. Use a ContextManager that supports attach() (e.g. AsyncLocalStorageContextManager) or use with()/bind() instead.");
		}
		return NOOP_TOKEN;
	}
	_getContextManager() {
		return require_global_utils.getGlobal(API_NAME) || NOOP_CONTEXT_MANAGER;
	}
	/** Disable and remove the global context manager */
	disable() {
		this._getContextManager().disable();
		require_global_utils.unregisterGlobal(API_NAME, require_diag.DiagAPI.instance());
	}
};
//#endregion
exports.ContextAPI = ContextAPI;

//# sourceMappingURL=context.cjs.map