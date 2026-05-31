"use strict";
var _CallQueue_chain;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallQueue = exports.MemberCall = void 0;
exports.buildMembers = buildMembers;
exports.memberOf = memberOf;
exports.isEnabled = isEnabled;
exports.overrides = overrides;
exports.resolveToolsetOptions = resolveToolsetOptions;
exports.resolveMember = resolveMember;
exports.dispatchMember = dispatchMember;
exports.errorContent = errorContent;
exports.checkedError = checkedError;
exports.confirmOrThrow = confirmOrThrow;
exports.wireAsyncDispose = wireAsyncDispose;
const tslib_1 = require("../../../internal/tslib.js");
/**
 * Shared building blocks for each toolset family's class.
 */
const error_1 = require("../../../core/error.js");
const run_1 = require("./run.js");
const ToolError_1 = require("../../tools/ToolError.js");
const errors_1 = require("./errors.js");
const sanitize_1 = require("./sanitize.js");
/** The member table from a family's rows, in the order of `names`. */
function buildMembers(names, rows) {
    return new Map(names.map((name) => {
        const [result, text, enabledByDefault] = rows[name];
        return [name, { name, result, ...(text !== null ? { text } : {}), enabledByDefault }];
    }));
}
/** The registry row for a model-supplied name, or undefined when it names no member. */
function memberOf(registry, name) {
    return registry.members.get(name);
}
/**
 * Whether `configs` leave `name` enabled, failing closed when the answer is unclear.
 *
 * Only a real boolean `enabled` turns a member on or off. Any other value fails closed, so a malformed
 * entry (a `"false"` string that came through JSON or an environment variable) can never turn on a
 * member that is off by default.
 */
function isEnabled(name, configs, defaultDisabled) {
    // Own properties only: `in` would walk the prototype chain, so a member named `constructor` would find an entry.
    const entry = configs != null && Object.prototype.hasOwnProperty.call(configs, name) ?
        configs[name]
        : undefined;
    // an entry that is neither an object nor null (`{ navigate: false }`) reads as off, not as the member's default
    if (entry != null && typeof entry !== 'object')
        return false;
    const enabled = entry?.enabled;
    if (enabled === true)
        return true;
    if (enabled !== undefined && enabled !== null)
        return false;
    return !defaultDisabled.has(name);
}
function deepFreeze(value) {
    if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
        for (const v of Object.values(value))
            deepFreeze(v);
        Object.freeze(value);
    }
    return value;
}
/** The prototype property a member's method is defined under (`type` is `type_`). */
function methodKey(name) {
    return name === 'type' ? 'type_' : name;
}
/** Whether `instance`'s class chain overrides `key` before reaching `base`, by own-property lookup. Nothing is called. */
function overrides(instance, base, key) {
    let proto = Object.getPrototypeOf(instance);
    while (proto !== null && proto !== base) {
        if (Object.prototype.hasOwnProperty.call(proto, key))
            return true;
        proto = Object.getPrototypeOf(proto);
    }
    return false;
}
function wireConfigs(names, configs, served) {
    // The copy is what is both checked and sent, so whatever `configs` holds that JSON drops (an entry on a
    // prototype, a non-enumerable one) can neither pass the check nor reach the wire: the member stays at its default.
    const wire = JSON.parse(JSON.stringify(configs ?? {}));
    const unserved = names.filter((name) => !served.has(name) && wire[name]?.['enabled'] === true);
    if (unserved.length) {
        // Offering the model a member that can only ever answer "not available" is a configuration mistake:
        // implement the method (a subclass that overrides execute alone serves every member).
        throw new errors_1.ToolsetConfigError(`configs enables member(s) this toolset does not implement: ${JSON.stringify(unserved.sort())} ` +
            '(override the member method; a subclass that overrides only execute() serves every member)');
    }
    for (const name of names) {
        if (served.has(name))
            continue;
        wire[name] = { ...wire[name], enabled: false };
    }
    // Frozen: this object is what the dispatch gate reads and what toJSON() copies, and the runner snapshots the wire
    // entry when it is created. A later mutation would let the gate accept a member the API was told is off.
    return Object.keys(wire).length ? deepFreeze(wire) : undefined;
}
/**
 * Check and resolve the options every family shares, once, at construction. A family checks its own options in its
 * own class.
 */
function resolveToolsetOptions(registry, instance, base, options) {
    // a class that overrides execute serves every member, whether or not it also implements member methods
    const served = new Set(overrides(instance, base, 'execute') ?
        registry.names
        : registry.names.filter((name) => overrides(instance, base, methodKey(name))));
    const wire = wireConfigs(registry.names, options.configs, served);
    const confirm = options.confirm;
    // Copied once and frozen, like the wire configs: a later change to the object you passed never reaches a request.
    const toolConfigs = options.toolConfigs === undefined ?
        undefined
        : deepFreeze(JSON.parse(JSON.stringify(options.toolConfigs)));
    if (toolConfigs != null && 'configs' in toolConfigs) {
        // refused rather than left to silently replace, or be replaced by, what the `configs` option writes there
        throw new errors_1.ToolsetConfigError('toolConfigs sets "configs", which the toolset writes itself: pass member settings as the configs option');
    }
    return {
        wireConfigs: wire,
        served,
        configured: new Set(Object.keys(options.configs ?? {})),
        confirm,
        toolConfigs,
    };
}
// --- a call's stages ---------------------------------------------------------------------------------------
/** One member call in flight: what each stage produced, for the stages after it. `Result` is the family's typed result. */
class MemberCall {
    constructor(ctx, name, rawInput) {
        this.ctx = ctx;
        this.name = name;
        this.rawInput = rawInput;
        this.member = undefined;
        this.input = undefined;
        this.result = undefined;
        this.error = undefined;
    }
    get toolUseId() {
        return this.ctx.toolUse?.id;
    }
}
exports.MemberCall = MemberCall;
/**
 * Stage one of a call: the registry row for `name`, or the refusal the model reads (an unknown name, a
 * member this application disabled, or one the driver does not implement).
 */
function resolveMember(registry, options, name) {
    const member = memberOf(registry, name);
    if (member === undefined)
        throw new errors_1.UnknownMemberError(name, registry.family);
    if (!isEnabled(member.name, options.wireConfigs, registry.defaultDisabled)) {
        if (!options.served.has(member.name) && !options.configured.has(member.name)) {
            throw new errors_1.UnavailableMemberError(member.name, registry.family);
        }
        throw new errors_1.DisabledMemberError(member.name);
    }
    return member;
}
/**
 * `execute`'s default body: the member's method on `instance`, resolved through the registry rather than by property
 * name, since `instance[name]` on raw model output would reach `constructor`, `toString` or any other property.
 */
async function dispatchMember(registry, instance, ctx, name, input) {
    if (registry.members.get(name) === undefined)
        throw new errors_1.UnknownMemberError(name, registry.family);
    const method = instance[methodKey(name)];
    return await method.call(instance, ctx, input);
}
/**
 * The text blocks of a `ToolError`'s content: an is_error result may hold text only (`errorTextContent`). An empty one
 * still signals that the call failed.
 */
function errorContent(error) {
    const content = (0, sanitize_1.errorTextContent)(error.content);
    if (typeof content === 'string')
        return content === '' ? [] : [{ type: 'text', text: content }];
    return content;
}
/**
 * `error` with each text block run through `check` and then bounded to the field limit. The same object when nothing
 * changed. The bound comes after the check: a driver's exception can embed a page-sized payload, and cutting first
 * would let a page place a path across the cut where the check reads a shorter one.
 */
async function checkedError(error, check = (text) => text) {
    const content = errorContent(error);
    const checked = await Promise.all(content.map(async (block) => ({ ...block, text: (0, sanitize_1.cutPoints)(await check(block.text), sanitize_1.FIELD_MAX) })));
    if (checked.every((block, i) => block.text === content[i].text))
        return error;
    return new ToolError_1.ToolError(checked);
}
/**
 * Ask `confirm` about the call awaiting approval: returns when it approved, throws the refusal the model reads
 * otherwise. A `ToolError` it throws is relayed as-is. Any other exception means the prompt failed, and refuses the
 * call rather than ending the run. Anything but `true` declines the call.
 */
async function confirmOrThrow(confirm, ctx, call) {
    const name = call.member.name;
    let returned;
    try {
        returned = await confirm(ctx);
    }
    catch (error) {
        (0, run_1.throwIfPropagates)(error, call.ctx);
        if (error instanceof ToolError_1.ToolError)
            throw error;
        throw new errors_1.ConfirmFailedError(name);
    }
    if (returned !== true)
        throw new errors_1.ConfirmDeclinedError(name);
}
var CallQueue = /* @__PURE__ */ (() => {
    // --- one call at a time ------------------------------------------------------------------------------------
    /** The queue every top-level call of one toolset chains behind: calls run one at a time, in arrival order. */
    class CallQueue {
        constructor() {
            _CallQueue_chain.set(this, Promise.resolve());
        }
        /** Run `turn` once the calls ahead of it have settled; a call whose `signal` aborts meanwhile leaves the queue at once. */
        enqueue(signal, turn) {
            const previous = tslib_1.__classPrivateFieldGet(this, _CallQueue_chain, "f");
            let ready = previous;
            let onAbort = () => undefined;
            if (signal) {
                // A queued call whose run is aborted leaves the queue at once rather than when its turn comes.
                const aborted = new Promise((_, reject) => {
                    onAbort = () => reject(new error_1.APIUserAbortError());
                    if (signal.aborted)
                        onAbort();
                    else
                        signal.addEventListener('abort', onAbort, { once: true });
                });
                aborted.catch(() => undefined);
                ready = Promise.race([previous, aborted]);
            }
            const run = ready.then(turn);
            if (signal) {
                // The listener goes when the call settles, so a long-lived signal shared by many calls does not collect one each.
                run.finally(() => signal.removeEventListener('abort', onAbort)).catch(() => undefined);
            }
            // The queue still waits for the call ahead even when this one gave up waiting for it, and a failed call does not
            // break it.
            tslib_1.__classPrivateFieldSet(this, _CallQueue_chain, Promise.allSettled([previous, run]).then(() => undefined), "f");
            return run;
        }
        /** Settles once every call accepted so far has settled, failed ones included. */
        drain() {
            return tslib_1.__classPrivateFieldGet(this, _CallQueue_chain, "f");
        }
    }
    _CallQueue_chain = new WeakMap();
    return CallQueue;
})();
exports.CallQueue = CallQueue;
/**
 * Wire `Symbol.asyncDispose` on a toolset class's prototype to its `close()`, where the engine provides the symbol.
 * The tsconfig targets ES2020, so there is no typed `AsyncDisposable` member: `await using` works from JavaScript on
 * those engines, and TypeScript callers use `close()`.
 */
function wireAsyncDispose(prototype) {
    const asyncDispose = Symbol.asyncDispose;
    if (!asyncDispose || Object.prototype.hasOwnProperty.call(prototype, asyncDispose))
        return;
    Object.defineProperty(prototype, asyncDispose, {
        // Through `this`, so a subclass's `close()` override is what runs.
        value: function () {
            return this.close();
        },
        configurable: true,
        writable: true,
    });
}
//# sourceMappingURL=core.js.map