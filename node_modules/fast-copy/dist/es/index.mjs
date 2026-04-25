/**
 * Error thrown when the copier traverses deeper than the configured `maxDepth`.
 *
 * @note
 * Extends `RangeError` for backwards compatibility, since exceeding the maximum depth
 * previously surfaced as a native `RangeError` from stack exhaustion.
 */
class MaxDepthExceededError extends RangeError {
    constructor(maxDepth) {
        super(`Maximum copy depth of ${String(maxDepth)} exceeded; the value copied is nested too deeply.`);
        this.maxDepth = maxDepth;
        this.name = 'MaxDepthExceededError';
    }
}
// eslint-disable-next-line @typescript-eslint/unbound-method
const toStringFunction = Function.prototype.toString;
// eslint-disable-next-line @typescript-eslint/unbound-method
const toStringObject = Object.prototype.toString;
/**
 * Get an empty version of the object with the same prototype it has.
 */
function getCleanClone(prototype) {
    if (!prototype) {
        return Object.create(null);
    }
    const Constructor = prototype.constructor;
    if (Constructor === Object) {
        return prototype === Object.prototype ? {} : Object.create(prototype);
    }
    // 2026-10-10: Prototype constructor properties may contain ordinary data.
    if (typeof Constructor === 'function' && ~toStringFunction.call(Constructor).indexOf('[native code]')) {
        try {
            return new Constructor();
        }
        catch (_a) {
            // Ignore
        }
    }
    return Object.create(prototype);
}
/**
 * Get the tag of the value passed, so that the correct copier can be used.
 */
function getTag(value) {
    const stringTag = value[Symbol.toStringTag];
    if (stringTag) {
        return stringTag;
    }
    const type = toStringObject.call(value);
    return type.substring(8, type.length - 1);
}

/**
 * The shared `%TypedArray%.prototype.slice`, which every typed array inherits.
 *
 * @note
 * This is used instead of the `slice` found on the value itself because subclasses can
 * override it with one that does not copy. `Buffer` is the notable case: its `slice`
 * returns a view over the same memory, so copying through it would alias the original.
 */
const sliceTypedArray = Object.getPrototypeOf(Int8Array.prototype).slice;
/**
 * Copy the descriptor from the original value to the clone.
 */
function copyOwnDescriptor(original, clone, property, state) {
    const ownDescriptor = Object.getOwnPropertyDescriptor(original, property) || {
        configurable: true,
        enumerable: true,
        value: original[property],
        writable: true,
    };
    const descriptor = ownDescriptor.get || ownDescriptor.set
        ? ownDescriptor
        : {
            configurable: ownDescriptor.configurable,
            enumerable: ownDescriptor.enumerable,
            value: state.copier(ownDescriptor.value, state),
            writable: ownDescriptor.writable,
        };
    try {
        Object.defineProperty(clone, property, descriptor);
    }
    catch (_a) {
        // The above can fail on node in extreme edge cases, so fall back to the loose assignment.
        clone[property] = descriptor.get ? descriptor.get() : descriptor.value;
    }
}
/**
 * Strictly copy all properties contained on the object, starting with the name at the `start` index.
 *
 * @note
 * `Object.getOwnPropertyNames` lists integer keys first in ascending order, so array-like values
 * whose indices are already copied can pass their count as `start` to skip them.
 */
function copyOwnPropertiesStrict(value, clone, state, names, start) {
    for (let index = start; index < names.length; ++index) {
        copyOwnDescriptor(value, clone, names[index], state);
    }
    for (const symbol of Object.getOwnPropertySymbols(value)) {
        copyOwnDescriptor(value, clone, symbol, state);
    }
    return clone;
}
/**
 * Deeply copy the indexed values in the array.
 */
function copyArray(array, state) {
    const clone = new state.Constructor();
    // set in the cache immediately to be able to reuse the object recursively
    state.cache.set(array, clone);
    for (let index = 0; index < array.length; ++index) {
        clone[index] = state.copier(array[index], state);
    }
    return clone;
}
/**
 * Deeply copy the indexed values in the array, as well as any custom properties.
 */
function copyArrayStrict(array, state) {
    const clone = new state.Constructor();
    // set in the cache immediately to be able to reuse the object recursively
    state.cache.set(array, clone);
    // Indices are copied by descriptor rather than by assignment, unlike typed arrays and strings,
    // because array indices can be holes, accessors, or non-writable / non-enumerable values.
    return copyOwnPropertiesStrict(array, clone, state, Object.getOwnPropertyNames(array), 0);
}
/**
 * Copy the contents of the ArrayBuffer, or of the typed array viewing one.
 *
 * @note
 * `slice` always returns a fixed-length buffer, so a resizable or growable buffer that can change
 * size is instead constructed with the same `maxByteLength` and has its contents copied in.
 */
function copyArrayBuffer(arrayBuffer, state) {
    if (ArrayBuffer.isView(arrayBuffer)) {
        return sliceTypedArray.call(arrayBuffer, 0);
    }
    if (arrayBuffer.resizable || arrayBuffer.growable) {
        const maxByteLength = arrayBuffer.maxByteLength;
        const clone = new state.Constructor(arrayBuffer.byteLength, { maxByteLength });
        // The new buffer is zero-filled, and buffers can only be read or written through a view, so
        // copy the original's bytes into it through byte-level views of both. Without this, the clone
        // would have the right size but be all zeros.
        new Uint8Array(clone).set(new Uint8Array(arrayBuffer));
        return clone;
    }
    // V8 throws when slicing an empty, fixed-length SharedArrayBuffer.
    if (!arrayBuffer.byteLength && getTag(arrayBuffer) === 'SharedArrayBuffer') {
        return new state.Constructor(0);
    }
    return arrayBuffer.slice(0);
}
/**
 * Copy the contents of the ArrayBuffer, or of the typed array viewing one, as well as
 * any custom properties.
 */
function copyArrayBufferStrict(arrayBuffer, state) {
    const clone = copyArrayBuffer(arrayBuffer, state);
    // set in the cache immediately to be able to reuse the object recursively
    state.cache.set(arrayBuffer, clone);
    // Typed arrays list their indices first, but unlike arrays have no own `length` to skip. The
    // fresh clone is read, since the original may have an own `length` that shadows the real one.
    const start = ArrayBuffer.isView(clone) ? clone.length || 0 : 0;
    return copyOwnPropertiesStrict(arrayBuffer, clone, state, Object.getOwnPropertyNames(arrayBuffer), start);
}
/**
 * Create a new Blob with the contents of the original.
 */
function copyBlob(blob, _state) {
    return blob.slice(0, blob.size, blob.type);
}
/**
 * Create a new Blob with the contents of the original, and copy any custom properties.
 */
const copyBlobStrict = createStrictHandler(copyBlob);
/**
 * Create a new DataView with the contents of the original.
 */
function copyDataView(dataView, state) {
    return new state.Constructor(state.copier(dataView.buffer, state), dataView.byteOffset, dataView.byteLength);
}
/**
 * Create a new DataView with the contents of the original, and copy any custom properties.
 *
 * @note
 * The buffer is shared with any other reference to it in the value being copied, and has
 * its own custom properties copied, the same as if it were reached directly.
 */
function copyDataViewStrict(dataView, state) {
    const { buffer } = dataView;
    const { cache, Constructor } = state;
    const bufferCopied = cache.has(buffer);
    const bufferClone = bufferCopied ? cache.get(buffer) : state.copier(buffer, state);
    // The buffer's custom properties may reference this DataView, in which case copying the buffer
    // already created and cached its clone. Reuse it so that every reference resolves to one clone.
    if (!bufferCopied && cache.has(dataView)) {
        return cache.get(dataView);
    }
    const clone = new Constructor(bufferClone, dataView.byteOffset, dataView.byteLength);
    // set in the cache immediately to be able to reuse the object recursively.
    state.cache.set(dataView, clone);
    return copyOwnPropertiesStrict(dataView, clone, state, Object.getOwnPropertyNames(dataView), 0);
}
/**
 * Create a new Date based on the time of the original.
 */
function copyDate(date, state) {
    return new state.Constructor(date.getTime());
}
/**
 * Create a new Date based on the time of the original, and copy any custom properties.
 */
const copyDateStrict = createStrictHandler(copyDate);
/**
 * Deeply copy the keys and values of the original.
 */
function copyMap(map, state) {
    const clone = new state.Constructor();
    // set in the cache immediately to be able to reuse the object recursively
    state.cache.set(map, clone);
    for (const [key, value] of map) {
        clone.set(key, state.copier(value, state));
    }
    return clone;
}
/**
 * Deeply copy the keys and values of the original, as well as any custom properties.
 */
function copyMapStrict(map, state) {
    return copyOwnPropertiesStrict(map, copyMap(map, state), state, Object.getOwnPropertyNames(map), 0);
}
/**
 * Deeply copy the properties (keys and symbols) and values of the original.
 */
function copyObject(object, state) {
    const clone = getCleanClone(state.prototype);
    // set in the cache immediately to be able to reuse the object recursively
    state.cache.set(object, clone);
    for (const key of Object.keys(object)) {
        if (key === '__proto__') {
            // Native assignment would attempt to use `Object.setPropertyOf` under the hood, when this
            // property has been explicitly set as a standard property. Using `defineProperty` ensures
            // its treatment in the clone is unchanged from the source.
            Object.defineProperty(clone, key, {
                configurable: true,
                enumerable: true,
                value: state.copier(object[key], state),
                writable: true,
            });
        }
        else {
            clone[key] = state.copier(object[key], state);
        }
    }
    for (const symbol of Object.getOwnPropertySymbols(object)) {
        // Only copy enumerable symbols in loose mode, to align with handling of `keys`.
        if (Object.prototype.propertyIsEnumerable.call(object, symbol)) {
            clone[symbol] = state.copier(object[symbol], state);
        }
    }
    return clone;
}
/**
 * Deeply copy the properties (keys and symbols) and values of the original, as well
 * as any hidden or non-enumerable properties.
 */
function copyObjectStrict(object, state) {
    const clone = getCleanClone(state.prototype);
    // set in the cache immediately to be able to reuse the object recursively
    state.cache.set(object, clone);
    return copyOwnPropertiesStrict(object, clone, state, Object.getOwnPropertyNames(object), 0);
}
/**
 * Create a new primitive wrapper from the value of the original.
 */
function copyPrimitiveWrapper(primitiveObject, state) {
    return new state.Constructor(primitiveObject.valueOf());
}
/**
 * Create a new primitive wrapper from the value of the original, and copy any
 * custom properties.
 */
const copyPrimitiveWrapperStrict = createStrictHandler(copyPrimitiveWrapper);
/**
 * Create a new RegExp based on the value and flags of the original.
 */
function copyRegExp(regExp, state) {
    const clone = new state.Constructor(regExp.source, regExp.flags);
    // `lastIndex` is not retained when constructing anew, so manually copy it.
    clone.lastIndex = regExp.lastIndex;
    return clone;
}
/**
 * Copy the original RegExp, as well as any custom properties.
 */
const copyRegExpStrict = createStrictHandler(copyRegExp);
/**
 * Return the original value (an identity function).
 *
 * @note
 * THis is used for objects that cannot be copied, such as WeakMap.
 */
function copySelf(value, _state) {
    return value;
}
/**
 * Deeply copy the values of the original.
 */
function copySet(set, state) {
    const clone = new state.Constructor();
    // set in the cache immediately to be able to reuse the object recursively
    state.cache.set(set, clone);
    for (const value of set) {
        clone.add(state.copier(value, state));
    }
    return clone;
}
/**
 * Deeply copy the values of the original, as well as any custom properties.
 */
function copySetStrict(set, state) {
    return copyOwnPropertiesStrict(set, copySet(set, state), state, Object.getOwnPropertyNames(set), 0);
}
/**
 * Copy the original value based on the handler passed, and also copy custom properties.
 *
 * @note
 * The handlers used here have no nested values to copy, so they skip the cache to keep loose
 * copies fast. Custom properties can reference the value itself, so the clone is cached here
 * before they are copied.
 */
function createStrictHandler(handler) {
    return (value, state) => {
        const clone = handler(value, state);
        // set in the cache immediately to be able to reuse the object recursively
        state.cache.set(value, clone);
        return copyOwnPropertiesStrict(value, clone, state, Object.getOwnPropertyNames(value), 0);
    };
}
/**
 * Create a new String wrapper from the value of the original, and copy custom properties.
 */
// `String` primitive constructor is intentional.
// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
function copyStringStrict(string, state) {
    const clone = copyPrimitiveWrapper(string, state);
    // set in the cache immediately to be able to reuse the object recursively
    state.cache.set(string, clone);
    const { length } = string;
    const names = Object.getOwnPropertyNames(string);
    // Custom integer keys beyond the string's length are listed before `length`, so only skip
    // `length` when it directly follows the characters.
    const start = names[length] === 'length' ? length + 1 : length;
    return copyOwnPropertiesStrict(string, clone, state, names, start);
}

/**
 * The maximum depth traversed when none is provided.
 *
 * @note
 * This is deliberately below the depth at which the native call stack is exhausted
 * (~1875 for strict copies in node), so that untrusted, deeply-nested values fail with a
 * catchable, descriptive error instead of a raw `RangeError`.
 */
const DEFAULT_MAX_DEPTH = 1000;
function createDefaultCache() {
    return new WeakMap();
}
function getOptions({ createCache: createCacheOverride, maxDepth, methods: methodsOverride, strict, }) {
    const defaultMethods = {
        array: strict ? copyArrayStrict : copyArray,
        arrayBuffer: strict ? copyArrayBufferStrict : copyArrayBuffer,
        asyncGenerator: copySelf,
        blob: strict ? copyBlobStrict : copyBlob,
        dataView: strict ? copyDataViewStrict : copyDataView,
        date: strict ? copyDateStrict : copyDate,
        error: copySelf,
        generator: copySelf,
        map: strict ? copyMapStrict : copyMap,
        object: strict ? copyObjectStrict : copyObject,
        regExp: strict ? copyRegExpStrict : copyRegExp,
        set: strict ? copySetStrict : copySet,
    };
    const methods = methodsOverride ? Object.assign(defaultMethods, methodsOverride) : defaultMethods;
    const copiers = getTagSpecificCopiers(methods, strict);
    const createCache = createCacheOverride || createDefaultCache;
    // Extra safety check to ensure that object and array copiers are always provided,
    // avoiding runtime errors.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!copiers.Object || !copiers.Array) {
        throw new Error('An object and array copier must be provided.');
    }
    return {
        createCache,
        copiers,
        maxDepth: maxDepth == null ? DEFAULT_MAX_DEPTH : maxDepth,
        methods,
        strict: Boolean(strict),
    };
}
/**
 * Get the copiers used for each specific object tag.
 */
function getTagSpecificCopiers(methods, strict) {
    const copyPrimitive = strict ? copyPrimitiveWrapperStrict : copyPrimitiveWrapper;
    // A `null` prototype is used so that a value carrying a custom `Symbol.toStringTag`
    // cannot resolve to an inherited `Object.prototype` member as its copier. Without it,
    // a tag such as `toString` or `valueOf` finds a function on the prototype chain and
    // that function is invoked in place of a real copier.
    return Object.assign(Object.create(null), {
        Arguments: methods.object,
        Array: methods.array,
        ArrayBuffer: methods.arrayBuffer,
        AsyncGenerator: methods.asyncGenerator,
        BigInt64Array: methods.arrayBuffer,
        BigUint64Array: methods.arrayBuffer,
        Blob: methods.blob,
        Boolean: copyPrimitive,
        DataView: methods.dataView,
        Date: methods.date,
        Error: methods.error,
        Float32Array: methods.arrayBuffer,
        Float64Array: methods.arrayBuffer,
        Generator: methods.generator,
        Int8Array: methods.arrayBuffer,
        Int16Array: methods.arrayBuffer,
        Int32Array: methods.arrayBuffer,
        Map: methods.map,
        Number: copyPrimitive,
        Object: methods.object,
        Promise: copySelf,
        RegExp: methods.regExp,
        Set: methods.set,
        SharedArrayBuffer: methods.arrayBuffer,
        String: strict ? copyStringStrict : copyPrimitiveWrapper,
        WeakMap: copySelf,
        WeakSet: copySelf,
        Uint8Array: methods.arrayBuffer,
        Uint8ClampedArray: methods.arrayBuffer,
        Uint16Array: methods.arrayBuffer,
        Uint32Array: methods.arrayBuffer,
    });
}

/**
 * Create a custom copier based on custom options for any of the following:
 *   - `createCache` method to create a cache for copied objects
 *   - custom copier `methods` for specific object types
 *   - `strict` mode to copy all properties with their descriptors
 */
function createCopier(options = {}) {
    const { createCache, copiers, maxDepth } = getOptions(options);
    const { Array: copyArray, Object: copyObject } = copiers;
    function copier(value, state) {
        state.prototype = state.Constructor = undefined;
        if (!value || typeof value !== 'object') {
            return value;
        }
        if (state.cache.has(value)) {
            return state.cache.get(value);
        }
        // Bound the traversal of nested objects, so that values nested more deeply than the
        // call stack can handle fail with a descriptive error instead of a raw `RangeError`.
        if (++state.depth > maxDepth) {
            throw new MaxDepthExceededError(maxDepth);
        }
        state.prototype = Object.getPrototypeOf(value);
        // Using logical AND for speed, since optional chaining transforms to
        // a local variable usage.
        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
        state.Constructor = state.prototype && state.prototype.constructor;
        let clone;
        // plain objects
        if (!state.Constructor || state.Constructor === Object) {
            clone = copyObject(value, state);
        }
        else if (Array.isArray(value)) {
            // arrays
            clone = copyArray(value, state);
        }
        else {
            const tagSpecificCopier = copiers[getTag(value)];
            if (tagSpecificCopier) {
                clone = tagSpecificCopier(value, state);
            }
            else {
                clone = typeof value.then === 'function' ? value : copyObject(value, state);
            }
        }
        --state.depth;
        return clone;
    }
    return function copy(value) {
        return copier(value, {
            Constructor: undefined,
            cache: createCache(),
            copier,
            depth: 0,
            prototype: undefined,
        });
    };
}
/**
 * Copy an value deeply as much as possible, where strict recreation of object properties
 * are maintained. All properties (including non-enumerable ones) are copied with their
 * original property descriptors on both objects and arrays.
 */
const copyStrict = createCopier({ strict: true });
/**
 * Copy an value deeply as much as possible.
 */
const copy = createCopier();

export { MaxDepthExceededError, copy, copyStrict, createCopier };
//# sourceMappingURL=index.mjs.map
