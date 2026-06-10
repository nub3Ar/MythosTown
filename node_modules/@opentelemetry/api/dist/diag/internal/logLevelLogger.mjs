import "../types.mjs";
//#region src/diag/internal/logLevelLogger.ts
function createLogLevelDiagLogger(maxLevel, logger) {
	if (maxLevel < 0) maxLevel = 0;
	else if (maxLevel > 9999) maxLevel = 9999;
	logger = logger || {};
	function _filterFunc(funcName, theLevel) {
		const theFunc = logger[funcName];
		if (typeof theFunc === "function" && maxLevel >= theLevel) return theFunc.bind(logger);
		return function() {};
	}
	return {
		error: _filterFunc("error", 30),
		warn: _filterFunc("warn", 50),
		info: _filterFunc("info", 60),
		debug: _filterFunc("debug", 70),
		verbose: _filterFunc("verbose", 80)
	};
}
//#endregion
export { createLogLevelDiagLogger };

//# sourceMappingURL=logLevelLogger.mjs.map