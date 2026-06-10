//#region src/diag/consoleLogger.ts
const consoleMap = [
	{
		n: "error",
		c: "error"
	},
	{
		n: "warn",
		c: "warn"
	},
	{
		n: "info",
		c: "info"
	},
	{
		n: "debug",
		c: "debug"
	},
	{
		n: "verbose",
		c: "trace"
	}
];
const _originalConsoleMethods = {};
if (typeof console !== "undefined") {
	for (const key of [
		"error",
		"warn",
		"info",
		"debug",
		"trace",
		"log"
	]) if (typeof console[key] === "function") _originalConsoleMethods[key] = console[key];
}
/**
* A simple Immutable Console based diagnostic logger which will output any messages to the Console.
* If you want to limit the amount of logging to a specific level or lower use the
* {@link createLogLevelDiagLogger}
*
* @since 1.0.0
*/
var DiagConsoleLogger = class {
	constructor() {
		function _consoleFunc(funcName) {
			return function(...args) {
				let theFunc = _originalConsoleMethods[funcName];
				if (typeof theFunc !== "function") theFunc = _originalConsoleMethods["log"];
				if (typeof theFunc !== "function" && console) {
					theFunc = console[funcName];
					if (typeof theFunc !== "function") theFunc = console.log;
				}
				if (typeof theFunc === "function") return theFunc.apply(console, args);
			};
		}
		for (let i = 0; i < consoleMap.length; i++) this[consoleMap[i].n] = _consoleFunc(consoleMap[i].c);
	}
};
//#endregion
export { DiagConsoleLogger, _originalConsoleMethods };

//# sourceMappingURL=consoleLogger.mjs.map