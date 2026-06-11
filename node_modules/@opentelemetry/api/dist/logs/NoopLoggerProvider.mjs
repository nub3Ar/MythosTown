import { NoopLogger } from "./NoopLogger.mjs";
//#region src/logs/NoopLoggerProvider.ts
var NoopLoggerProvider = class {
	getLogger(_name, _version, _options) {
		return new NoopLogger();
	}
};
const NOOP_LOGGER_PROVIDER = new NoopLoggerProvider();
//#endregion
export { NOOP_LOGGER_PROVIDER, NoopLoggerProvider };

//# sourceMappingURL=NoopLoggerProvider.mjs.map