import { AnthropicError } from "../../core/error.mjs";
import { ReadableStreamToAsyncIterable } from "../shims.mjs";
import { LineDecoder } from "./line.mjs";
export var JSONLDecoder = /* @__PURE__ */ (() => {
    class JSONLDecoder {
        constructor(iterator, controller, 
        // Node's fetch cancels an unread body once its response is garbage collected, so we hold a reference.
        response) {
            this.iterator = iterator;
            this.response = response;
            this.controller = controller;
        }
        async *decoder() {
            const iterator = this.iterator;
            if (!iterator) {
                throw new AnthropicError('Cannot iterate over a consumed stream.');
            }
            // Lets the iterator be collected with this generator, even if the decoder is still held.
            this.iterator = undefined;
            const lineDecoder = new LineDecoder();
            for await (const chunk of iterator) {
                for (const line of lineDecoder.decode(chunk)) {
                    yield JSON.parse(line);
                }
            }
            for (const line of lineDecoder.flush()) {
                yield JSON.parse(line);
            }
        }
        [Symbol.asyncIterator]() {
            return this.decoder();
        }
        static fromResponse(response, controller) {
            if (!response.body) {
                controller.abort();
                if (typeof globalThis.navigator !== 'undefined' &&
                    globalThis.navigator.product === 'ReactNative') {
                    throw new AnthropicError(`The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api`);
                }
                throw new AnthropicError(`Attempted to iterate over a response with no body`);
            }
            return new JSONLDecoder(ReadableStreamToAsyncIterable(response.body), controller, response);
        }
    }
    return JSONLDecoder;
})();
//# sourceMappingURL=jsonl.mjs.map