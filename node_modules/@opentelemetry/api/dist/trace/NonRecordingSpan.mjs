import { INVALID_SPAN_CONTEXT } from "./invalid-span-constants.mjs";
//#region src/trace/NonRecordingSpan.ts
/**
* The NonRecordingSpan is the default {@link Span} that is used when no Span
* implementation is available. All operations are no-op including context
* propagation.
*/
var NonRecordingSpan = class {
	constructor(spanContext = INVALID_SPAN_CONTEXT) {
		this._spanContext = spanContext;
	}
	spanContext() {
		return this._spanContext;
	}
	setAttribute(_key, _value) {
		return this;
	}
	setAttributes(_attributes) {
		return this;
	}
	addEvent(_name, _attributes) {
		return this;
	}
	addLink(_link) {
		return this;
	}
	addLinks(_links) {
		return this;
	}
	setStatus(_status) {
		return this;
	}
	updateName(_name) {
		return this;
	}
	end(_endTime) {}
	isRecording() {
		return false;
	}
	recordException(_exception, _time) {}
};
//#endregion
export { NonRecordingSpan };

//# sourceMappingURL=NonRecordingSpan.mjs.map