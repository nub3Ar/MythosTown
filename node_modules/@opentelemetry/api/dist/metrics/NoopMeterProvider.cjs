const require_NoopMeter = require("./NoopMeter.cjs");
//#region src/metrics/NoopMeterProvider.ts
/**
* An implementation of the {@link MeterProvider} which returns an impotent Meter
* for all calls to `getMeter`
*/
var NoopMeterProvider = class {
	getMeter(_name, _version, _options) {
		return require_NoopMeter.NOOP_METER;
	}
};
const NOOP_METER_PROVIDER = new NoopMeterProvider();
//#endregion
exports.NOOP_METER_PROVIDER = NOOP_METER_PROVIDER;
exports.NoopMeterProvider = NoopMeterProvider;

//# sourceMappingURL=NoopMeterProvider.cjs.map