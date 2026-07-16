export function getDefaultFetch() {
    if (typeof fetch !== 'undefined') {
        return fetch;
    }
    throw new Error('`fetch` is not defined as a global; Either pass `fetch` to the client, `new Anthropic({ fetch })` or polyfill the global, `globalThis.fetch = fetch`');
}
export function makeReadableStream(...args) {
    const ReadableStream = globalThis.ReadableStream;
    if (typeof ReadableStream === 'undefined') {
        // Note: All of the platforms / runtimes we officially support already define
        // `ReadableStream` as a global, so this should only ever be hit on unsupported runtimes.
        throw new Error('`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`');
    }
    return new ReadableStream(...args);
}
export function ReadableStreamFrom(iterable) {
    let iter = Symbol.asyncIterator in iterable ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();
    return makeReadableStream({
        start() { },
        async pull(controller) {
            const { done, value } = await iter.next();
            if (done) {
                controller.close();
            }
            else {
                controller.enqueue(value);
            }
        },
        async cancel() {
            await iter.return?.();
        },
    });
}
/**
 * Most browsers don't yet have async iterable support for ReadableStream,
 * and Node has a very different way of reading bytes from its "ReadableStream".
 *
 * This polyfill was pulled from https://github.com/MattiasBuelens/web-streams-polyfill/pull/122#issuecomment-1627354490
 */
function readableStreamIterator(stream) {
    if (stream[Symbol.asyncIterator])
        return stream[Symbol.asyncIterator]();
    const reader = stream.getReader();
    return {
        async next() {
            try {
                const result = await reader.read();
                if (result?.done)
                    reader.releaseLock(); // release lock when stream becomes closed
                return result;
            }
            catch (e) {
                reader.releaseLock(); // release lock when stream becomes errored
                throw e;
            }
        },
        async return() {
            const cancelPromise = reader.cancel();
            reader.releaseLock();
            await cancelPromise;
            return { done: true, value: undefined };
        },
    };
}
// Cancels a stream whose reader was garbage collected before it finished. The reader's lock keeps
// anything else from reading or cancelling the stream, so it would hold on to its connection.
const droppedReaders = typeof FinalizationRegistry === 'undefined' ? undefined : (
/* @__PURE__ */ new FinalizationRegistry(async (iter) => {
    try {
        await iter.return?.();
    }
    catch {
        // The stream has already failed, e.g. because the request was aborted.
    }
}));
export async function* ReadableStreamToAsyncIterable(stream) {
    const iter = readableStreamIterator(stream);
    // Only this generator refers to `reader`, so it's collected once nothing can resume the generator.
    const reader = {};
    droppedReaders?.register(reader, iter, reader);
    try {
        for await (const chunk of { [Symbol.asyncIterator]: () => iter })
            yield chunk;
    }
    finally {
        droppedReaders?.unregister(reader);
    }
}
/**
 * Cancels a ReadableStream we don't need to consume.
 * See https://undici.nodejs.org/#/?id=garbage-collection
 */
export async function CancelReadableStream(stream) {
    if (stream === null || typeof stream !== 'object')
        return;
    if (stream[Symbol.asyncIterator]) {
        await stream[Symbol.asyncIterator]().return?.();
        return;
    }
    const reader = stream.getReader();
    const cancelPromise = reader.cancel();
    reader.releaseLock();
    await cancelPromise;
}
//# sourceMappingURL=shims.mjs.map