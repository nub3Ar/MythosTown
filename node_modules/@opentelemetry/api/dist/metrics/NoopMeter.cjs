//#region src/metrics/NoopMeter.ts
/**
* NoopMeter is a noop implementation of the {@link Meter} interface. It reuses
* constant NoopMetrics for all of its methods.
*/
var NoopMeter = class {
	constructor() {}
	/**
	* @see {@link Meter.createGauge}
	*/
	createGauge(_name, _options) {
		return NOOP_GAUGE_METRIC;
	}
	/**
	* @see {@link Meter.createHistogram}
	*/
	createHistogram(_name, _options) {
		return NOOP_HISTOGRAM_METRIC;
	}
	/**
	* @see {@link Meter.createCounter}
	*/
	createCounter(_name, _options) {
		return NOOP_COUNTER_METRIC;
	}
	/**
	* @see {@link Meter.createUpDownCounter}
	*/
	createUpDownCounter(_name, _options) {
		return NOOP_UP_DOWN_COUNTER_METRIC;
	}
	/**
	* @see {@link Meter.createObservableGauge}
	*/
	createObservableGauge(_name, _options) {
		return NOOP_OBSERVABLE_GAUGE_METRIC;
	}
	/**
	* @see {@link Meter.createObservableCounter}
	*/
	createObservableCounter(_name, _options) {
		return NOOP_OBSERVABLE_COUNTER_METRIC;
	}
	/**
	* @see {@link Meter.createObservableUpDownCounter}
	*/
	createObservableUpDownCounter(_name, _options) {
		return NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
	}
	/**
	* @see {@link Meter.addBatchObservableCallback}
	*/
	addBatchObservableCallback(_callback, _observables) {}
	/**
	* @see {@link Meter.removeBatchObservableCallback}
	*/
	removeBatchObservableCallback(_callback) {}
};
var NoopMetric = class {};
var NoopCounterMetric = class extends NoopMetric {
	add(_value, _attributes) {}
};
var NoopUpDownCounterMetric = class extends NoopMetric {
	add(_value, _attributes) {}
};
var NoopGaugeMetric = class extends NoopMetric {
	record(_value, _attributes) {}
};
var NoopHistogramMetric = class extends NoopMetric {
	record(_value, _attributes) {}
};
var NoopObservableMetric = class {
	addCallback(_callback) {}
	removeCallback(_callback) {}
};
var NoopObservableCounterMetric = class extends NoopObservableMetric {};
var NoopObservableGaugeMetric = class extends NoopObservableMetric {};
var NoopObservableUpDownCounterMetric = class extends NoopObservableMetric {};
const NOOP_METER = new NoopMeter();
const NOOP_COUNTER_METRIC = new NoopCounterMetric();
const NOOP_GAUGE_METRIC = new NoopGaugeMetric();
const NOOP_HISTOGRAM_METRIC = new NoopHistogramMetric();
const NOOP_UP_DOWN_COUNTER_METRIC = new NoopUpDownCounterMetric();
const NOOP_OBSERVABLE_COUNTER_METRIC = new NoopObservableCounterMetric();
const NOOP_OBSERVABLE_GAUGE_METRIC = new NoopObservableGaugeMetric();
const NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new NoopObservableUpDownCounterMetric();
/**
* Create a no-op Meter
*
* @since 1.3.0
*/
function createNoopMeter() {
	return NOOP_METER;
}
//#endregion
exports.NOOP_COUNTER_METRIC = NOOP_COUNTER_METRIC;
exports.NOOP_GAUGE_METRIC = NOOP_GAUGE_METRIC;
exports.NOOP_HISTOGRAM_METRIC = NOOP_HISTOGRAM_METRIC;
exports.NOOP_METER = NOOP_METER;
exports.NOOP_OBSERVABLE_COUNTER_METRIC = NOOP_OBSERVABLE_COUNTER_METRIC;
exports.NOOP_OBSERVABLE_GAUGE_METRIC = NOOP_OBSERVABLE_GAUGE_METRIC;
exports.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
exports.NOOP_UP_DOWN_COUNTER_METRIC = NOOP_UP_DOWN_COUNTER_METRIC;
exports.NoopCounterMetric = NoopCounterMetric;
exports.NoopGaugeMetric = NoopGaugeMetric;
exports.NoopHistogramMetric = NoopHistogramMetric;
exports.NoopMeter = NoopMeter;
exports.NoopMetric = NoopMetric;
exports.NoopObservableCounterMetric = NoopObservableCounterMetric;
exports.NoopObservableGaugeMetric = NoopObservableGaugeMetric;
exports.NoopObservableMetric = NoopObservableMetric;
exports.NoopObservableUpDownCounterMetric = NoopObservableUpDownCounterMetric;
exports.NoopUpDownCounterMetric = NoopUpDownCounterMetric;
exports.createNoopMeter = createNoopMeter;

//# sourceMappingURL=NoopMeter.cjs.map