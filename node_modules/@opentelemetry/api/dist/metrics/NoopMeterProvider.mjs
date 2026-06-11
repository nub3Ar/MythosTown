import { NOOP_METER } from "./NoopMeter.mjs";
//#region src/metrics/NoopMeterProvider.ts
/**
* An implementation of the {@link MeterProvider} which returns an impotent Meter
* for all calls to `getMeter`
*/
var NoopMeterProvider = class {
	getMeter(_name, _version, _options) {
		return NOOP_METER;
	}
};
const NOOP_METER_PROVIDER = new NoopMeterProvider();
//#endregion
export { NOOP_METER_PROVIDER, NoopMeterProvider };

//# sourceMappingURL=NoopMeterProvider.mjs.map