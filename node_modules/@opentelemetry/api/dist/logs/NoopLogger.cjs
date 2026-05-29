//#region src/logs/NoopLogger.ts
var NoopLogger = class {
	emit(_logRecord) {}
	enabled() {
		return false;
	}
};
const NOOP_LOGGER = new NoopLogger();
/**
* Create a no-op Logger
*/
function createNoopLogger() {
	return NOOP_LOGGER;
}
//#endregion
exports.NOOP_LOGGER = NOOP_LOGGER;
exports.NoopLogger = NoopLogger;
exports.createNoopLogger = createNoopLogger;

//# sourceMappingURL=NoopLogger.cjs.map