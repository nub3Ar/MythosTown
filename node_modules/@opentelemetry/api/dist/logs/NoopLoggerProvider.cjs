const require_NoopLogger = require("./NoopLogger.cjs");
//#region src/logs/NoopLoggerProvider.ts
var NoopLoggerProvider = class {
	getLogger(_name, _version, _options) {
		return new require_NoopLogger.NoopLogger();
	}
};
const NOOP_LOGGER_PROVIDER = new NoopLoggerProvider();
//#endregion
exports.NOOP_LOGGER_PROVIDER = NOOP_LOGGER_PROVIDER;
exports.NoopLoggerProvider = NoopLoggerProvider;

//# sourceMappingURL=NoopLoggerProvider.cjs.map