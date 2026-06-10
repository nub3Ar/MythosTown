import { VERSION } from "../version.mjs";
import { isCompatible } from "./semver.mjs";
//#region src/internal/global-utils.ts
const major = VERSION.split(".")[0];
const GLOBAL_OPENTELEMETRY_API_KEY = Symbol.for(`opentelemetry.js.api.${major}`);
const _global = typeof globalThis === "object" ? globalThis : typeof self === "object" ? self : typeof window === "object" ? window : typeof global === "object" ? global : {};
function _makeGlobalApi() {
	return Object.defineProperty({}, "version", {
		value: VERSION,
		enumerable: true,
		writable: false,
		configurable: false
	});
}
function registerGlobal(type, instance, diag, allowOverride = false) {
	var _global$GLOBAL_OPENTE;
	const api = _global[GLOBAL_OPENTELEMETRY_API_KEY] = (_global$GLOBAL_OPENTE = _global[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _global$GLOBAL_OPENTE !== void 0 ? _global$GLOBAL_OPENTE : _makeGlobalApi();
	if (!allowOverride && api[type]) {
		const err = /* @__PURE__ */ new Error(`@opentelemetry/api: Attempted duplicate registration of API: ${type}`);
		diag.error(err.stack || err.message);
		return false;
	}
	if (api.version !== "1.10.0") {
		const err = /* @__PURE__ */ new Error(`@opentelemetry/api: Registration of version v${api.version} for ${type} does not match previously registered API v${VERSION}`);
		diag.error(err.stack || err.message);
		return false;
	}
	api[type] = instance;
	diag.debug(`@opentelemetry/api: Registered a global for ${type} v${VERSION}.`);
	return true;
}
let _compatibleGlobalApi;
function getGlobal(type) {
	const api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
	if (api == null) return;
	if (api !== _compatibleGlobalApi) {
		if (!api.version || !isCompatible(api.version)) return;
		_compatibleGlobalApi = api;
	}
	return api[type];
}
function unregisterGlobal(type, diag) {
	diag.debug(`@opentelemetry/api: Unregistering a global for ${type} v${VERSION}.`);
	const api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
	if (api) delete api[type];
}
//#endregion
export { getGlobal, registerGlobal, unregisterGlobal };

//# sourceMappingURL=global-utils.mjs.map