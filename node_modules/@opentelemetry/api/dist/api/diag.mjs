import { getGlobal, registerGlobal, unregisterGlobal } from "../internal/global-utils.mjs";
import { DiagComponentLogger } from "../diag/ComponentLogger.mjs";
import "../diag/types.mjs";
import { createLogLevelDiagLogger } from "../diag/internal/logLevelLogger.mjs";
//#region src/api/diag.ts
const API_NAME = "diag";
/**
* Singleton object which represents the entry point to the OpenTelemetry internal
* diagnostic API
*
* @since 1.0.0
*/
var DiagAPI = class DiagAPI {
	/** Get the singleton instance of the DiagAPI API */
	static instance() {
		if (!this._instance) this._instance = new DiagAPI();
		return this._instance;
	}
	/**
	* Private internal constructor
	* @private
	*/
	constructor() {
		function _logProxy(funcName) {
			return function(...args) {
				const logger = getGlobal("diag");
				if (!logger) return;
				return logger[funcName](...args);
			};
		}
		const self = this;
		const setLogger = (logger, optionsOrLogLevel = { logLevel: 60 }) => {
			var _optionsOrLogLevel$lo;
			if (logger === self) {
				var _err$stack;
				const err = /* @__PURE__ */ new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
				self.error((_err$stack = err.stack) !== null && _err$stack !== void 0 ? _err$stack : err.message);
				return false;
			}
			if (typeof optionsOrLogLevel === "number") optionsOrLogLevel = { logLevel: optionsOrLogLevel };
			const oldLogger = getGlobal("diag");
			const newLogger = createLogLevelDiagLogger((_optionsOrLogLevel$lo = optionsOrLogLevel.logLevel) !== null && _optionsOrLogLevel$lo !== void 0 ? _optionsOrLogLevel$lo : 60, logger);
			if (oldLogger && !optionsOrLogLevel.suppressOverrideMessage) {
				var _Error$stack;
				const stack = (_Error$stack = (/* @__PURE__ */ new Error()).stack) !== null && _Error$stack !== void 0 ? _Error$stack : "<failed to generate stacktrace>";
				oldLogger.warn(`Current logger will be overwritten from ${stack}`);
				newLogger.warn(`Current logger will overwrite one already registered from ${stack}`);
			}
			return registerGlobal("diag", newLogger, self, true);
		};
		self.setLogger = setLogger;
		self.disable = () => {
			unregisterGlobal(API_NAME, self);
		};
		self.createComponentLogger = (options) => {
			return new DiagComponentLogger(options);
		};
		self.verbose = _logProxy("verbose");
		self.debug = _logProxy("debug");
		self.info = _logProxy("info");
		self.warn = _logProxy("warn");
		self.error = _logProxy("error");
	}
};
//#endregion
export { DiagAPI };

//# sourceMappingURL=diag.mjs.map