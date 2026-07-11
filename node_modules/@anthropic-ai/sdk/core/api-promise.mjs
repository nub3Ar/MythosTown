var _APIPromise_client;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "../internal/tslib.mjs";
import { defaultParseResponse, addResponseIDs, } from "../internal/parse.mjs";
import { endApiCallSpan, guardTracing, setCreatedIDAttribute } from "../internal/tracing.mjs";
import { isAsyncIterable } from "../internal/uploads.mjs";
import { endAnthropicApiCallSpanWhenStreamEnds, setAnthropicSpanAttributes } from "../lib/internal/tracing.mjs";
/**
 * A subclass of `Promise` providing additional helper methods
 * for interacting with the SDK.
 */
export var APIPromise = /* @__PURE__ */ (() => {
    /**
     * A subclass of `Promise` providing additional helper methods
     * for interacting with the SDK.
     */
    class APIPromise extends Promise {
        constructor(client, responsePromise, parseResponse = defaultParseResponse) {
            super((resolve) => {
                // this is maybe a bit weird but this has to be a no-op to not implicitly
                // parse the response body; instead .then, .catch, .finally are overridden
                // to parse the response
                resolve(null);
            });
            this.responsePromise = responsePromise;
            this.parseResponse = parseResponse;
            _APIPromise_client.set(this, void 0);
            __classPrivateFieldSet(this, _APIPromise_client, client, "f");
        }
        /** @internal The unparsed response with its request metadata, for helpers that build one request on another. */
        _responseProps() {
            return this.responsePromise;
        }
        _thenUnwrap(transform) {
            return new APIPromise(__classPrivateFieldGet(this, _APIPromise_client, "f"), this.responsePromise, async (client, props) => addResponseIDs(transform(await this.parseResponse(client, props), props), props.response));
        }
        /**
         * Gets the raw `Response` instance instead of parsing the response
         * data.
         *
         * If you want to parse the response body but still get the `Response`
         * instance, you can use {@link withResponse()}.
         *
         * 👋 Getting the wrong TypeScript type for `Response`?
         * Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
         * to your `tsconfig.json`.
         */
        asResponse() {
            return this.responsePromise.then((props) => {
                // A traced API call's span ends with the body. A response read this way, before any parse
                // of its body has begun, may never be parsed, so its span ends now, without the body.
                const span = props.options.__span?.span;
                if (span && !this.parsedPromise) {
                    const result = { status: 'success', ...props, data: undefined };
                    setAnthropicSpanAttributes(__classPrivateFieldGet(this, _APIPromise_client, "f"), span, result);
                    guardTracing(__classPrivateFieldGet(this, _APIPromise_client, "f"), () => endApiCallSpan(span, result));
                }
                return props.response;
            });
        }
        /**
         * Gets the parsed response data, the raw `Response` instance and the ID of the request,
         * returned via the `request-id` header which is useful for debugging requests and resporting
         * issues to Anthropic.
         *
         * If you just want to get the raw `Response` instance without parsing it,
         * you can use {@link asResponse()}.
         *
         * 👋 Getting the wrong TypeScript type for `Response`?
         * Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
         * to your `tsconfig.json`.
         */
        async withResponse() {
            const [data, response] = await Promise.all([this.parse(), this.asResponse()]);
            return {
                data,
                response,
                request_id: response.headers.get('request-id'),
                workspace_id: response.headers.get('anthropic-workspace-id'),
            };
        }
        parse() {
            if (!this.parsedPromise) {
                this.parsedPromise = this.responsePromise.then((props) => this.parseResponseTraced(props));
            }
            return this.parsedPromise;
        }
        /**
         * Parses the body of an API call. When the call has a span, the span ends with the parse, or,
         * when the parse returns a streamed body, when the application has read that stream.
         */
        async parseResponseTraced(props) {
            const call = props.options.__span;
            if (!call) {
                return this.parseResponse(__classPrivateFieldGet(this, _APIPromise_client, "f"), props);
            }
            const { span } = call;
            let data;
            try {
                data = await this.parseResponse(__classPrivateFieldGet(this, _APIPromise_client, "f"), props);
            }
            catch (error) {
                const result = { status: 'error', ...props, error };
                setAnthropicSpanAttributes(__classPrivateFieldGet(this, _APIPromise_client, "f"), span, result);
                guardTracing(__classPrivateFieldGet(this, _APIPromise_client, "f"), () => endApiCallSpan(span, result));
                throw error;
            }
            const result = { status: 'success', ...props, data };
            guardTracing(__classPrivateFieldGet(this, _APIPromise_client, "f"), () => setCreatedIDAttribute(call, data));
            setAnthropicSpanAttributes(__classPrivateFieldGet(this, _APIPromise_client, "f"), span, result);
            if (props.options.stream && isAsyncIterable(data)) {
                guardTracing(__classPrivateFieldGet(this, _APIPromise_client, "f"), () => endAnthropicApiCallSpanWhenStreamEnds(__classPrivateFieldGet(this, _APIPromise_client, "f"), span, data, props));
            }
            else {
                guardTracing(__classPrivateFieldGet(this, _APIPromise_client, "f"), () => endApiCallSpan(span, result));
            }
            return data;
        }
        then(onfulfilled, onrejected) {
            return this.parse().then(onfulfilled, onrejected);
        }
        catch(onrejected) {
            return this.parse().catch(onrejected);
        }
        finally(onfinally) {
            return this.parse().finally(onfinally);
        }
    }
    _APIPromise_client = new WeakMap();
    return APIPromise;
})();
//# sourceMappingURL=api-promise.mjs.map