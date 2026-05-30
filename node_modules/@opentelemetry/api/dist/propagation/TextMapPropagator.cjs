//#region src/propagation/TextMapPropagator.ts
/**
* @since 1.0.0
*/
const defaultTextMapGetter = {
	get(carrier, key) {
		if (carrier == null) return;
		return carrier[key];
	},
	keys(carrier) {
		if (carrier == null) return [];
		return Object.keys(carrier);
	}
};
/**
* @since 1.0.0
*/
const defaultTextMapSetter = { set(carrier, key, value) {
	if (carrier == null) return;
	carrier[key] = value;
} };
//#endregion
exports.defaultTextMapGetter = defaultTextMapGetter;
exports.defaultTextMapSetter = defaultTextMapSetter;

//# sourceMappingURL=TextMapPropagator.cjs.map