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
export { NOOP_LOGGER, NoopLogger, createNoopLogger };

//# sourceMappingURL=NoopLogger.mjs.map