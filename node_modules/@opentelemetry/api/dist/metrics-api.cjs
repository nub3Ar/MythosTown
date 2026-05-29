//#region src/metrics-api.ts
/**
* Entrypoint for metrics API
*
* @since 1.3.0
*/
const metrics = require("./api/metrics.cjs").MetricsAPI.getInstance();
//#endregion
exports.metrics = metrics;

//# sourceMappingURL=metrics-api.cjs.map