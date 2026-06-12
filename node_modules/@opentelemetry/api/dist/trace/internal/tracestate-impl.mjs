import { validateKey, validateValue } from "./tracestate-validators.mjs";
//#region src/trace/internal/tracestate-impl.ts
const MAX_TRACE_STATE_ITEMS = 32;
const MAX_TRACE_STATE_LEN = 512;
const LIST_MEMBERS_SEPARATOR = ",";
const LIST_MEMBER_KEY_VALUE_SPLITTER = "=";
/**
* TraceState must be a class and not a simple object type because of the spec
* requirement (https://www.w3.org/TR/trace-context/#tracestate-field).
*
* Here is the list of allowed mutations:
* - New key-value pair should be added into the beginning of the list
* - The value of any key can be updated. Modified keys MUST be moved to the
* beginning of the list.
*
* @deprecated Use TraceState from "@opentelemetry/core". This will be removed in the next major version.
*/
var TraceStateImpl = class TraceStateImpl {
	constructor(rawTraceState) {
		this._internalState = /* @__PURE__ */ new Map();
		if (rawTraceState) this._parse(rawTraceState);
	}
	set(key, value) {
		const currValue = this._internalState.get(key);
		let newLength = this.serialize().length;
		if (typeof currValue === "string") newLength += value.length - currValue.length;
		else {
			if (this._internalState.size >= MAX_TRACE_STATE_ITEMS) return this;
			newLength += key.length + value.length + (this._internalState.size > 0 ? 2 : 1);
		}
		if (newLength > MAX_TRACE_STATE_LEN) return this;
		const traceState = this._clone();
		if (traceState._internalState.has(key)) traceState._internalState.delete(key);
		traceState._internalState.set(key, value);
		return traceState;
	}
	unset(key) {
		const traceState = this._clone();
		traceState._internalState.delete(key);
		return traceState;
	}
	get(key) {
		return this._internalState.get(key);
	}
	serialize() {
		return Array.from(this._internalState.keys()).reduceRight((agg, key) => {
			agg.push(key + LIST_MEMBER_KEY_VALUE_SPLITTER + this.get(key));
			return agg;
		}, []).join(LIST_MEMBERS_SEPARATOR);
	}
	_parse(rawTraceState) {
		if (rawTraceState.length > MAX_TRACE_STATE_LEN) return;
		this._internalState = rawTraceState.split(LIST_MEMBERS_SEPARATOR).reduceRight((agg, part) => {
			const listMember = part.trim();
			const i = listMember.indexOf(LIST_MEMBER_KEY_VALUE_SPLITTER);
			if (i !== -1) {
				const key = listMember.slice(0, i);
				const value = listMember.slice(i + 1, part.length);
				if (validateKey(key) && validateValue(value)) agg.set(key, value);
			}
			return agg;
		}, /* @__PURE__ */ new Map());
		if (this._internalState.size > MAX_TRACE_STATE_ITEMS) this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, MAX_TRACE_STATE_ITEMS));
	}
	_keys() {
		return Array.from(this._internalState.keys()).reverse();
	}
	_clone() {
		const traceState = new TraceStateImpl();
		traceState._internalState = new Map(this._internalState);
		return traceState;
	}
};
//#endregion
export { TraceStateImpl };

//# sourceMappingURL=tracestate-impl.mjs.map