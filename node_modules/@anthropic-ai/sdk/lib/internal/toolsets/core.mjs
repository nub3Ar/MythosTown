var _CallQueue_chain;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "../../../internal/tslib.mjs";
/**
 * Shared building blocks for each toolset family's class.
 */
import { APIUserAbortError } from "../../../core/error.mjs";
import { throwIfPropagates } from "./run.mjs";
import { ToolError } from "../../tools/ToolError.mjs";
import { ConfirmDeclinedError, ConfirmFailedError, DisabledMemberError, ToolsetConfigError, UnavailableMemberError, UnknownMemberError, } from "./errors.mjs";
import { FIELD_MAX, cutPoints, errorTextContent } from "./sanitize.mjs";
/** The member table from a family's rows, in the order of `names`. */
export function buildMembers(names, rows) {
    return new Map(names.map((name) => {
        const [result, text, enabledByDefault] = rows[name];
        return [name, { name, result, ...(text !== null ? { text } : {}), enabledByDefault }];
    }));
}
/** The registry row for a model-supplied name, or undefined when it names no member. */
export function memberOf(registry, name) {
    return registry.members.get(name);
}
/**
 * Whether `configs` leave `name` enabled, failing closed when the answer is unclear.
 *
 * Only a real boolean `enabled` turns a member on or off. Any other value fails closed, so a malformed
 * entry (a `"false"` string that came through JSON or an environment variable) can never turn on a
 * member that is off by default.
 */
export function isEnabled(name, configs, defaultDisabled) {
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
export function overrides(instance, base, key) {
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
        throw new ToolsetConfigError(`configs enables member(s) this toolset does not implement: ${JSON.stringify(unserved.sort())} ` +
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
export function resolveToolsetOptions(registry, instance, base, options) {
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
        throw new ToolsetConfigError('toolConfigs sets "configs", which the toolset writes itself: pass member settings as the configs option');
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
export class MemberCall {
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
/**
 * Stage one of a call: the registry row for `name`, or the refusal the model reads (an unknown name, a
 * member this application disabled, or one the driver does not implement).
 */
export function resolveMember(registry, options, name) {
    const member = memberOf(registry, name);
    if (member === undefined)
        throw new UnknownMemberError(name, registry.family);
    if (!isEnabled(member.name, options.wireConfigs, registry.defaultDisabled)) {
        if (!options.served.has(member.name) && !options.configured.has(member.name)) {
            throw new UnavailableMemberError(member.name, registry.family);
        }
        throw new DisabledMemberError(member.name);
    }
    return member;
}
/**
 * `execute`'s default body: the member's method on `instance`, resolved through the registry rather than by property
 * name, since `instance[name]` on raw model output would reach `constructor`, `toString` or any other property.
 */
export async function dispatchMember(registry, instance, ctx, name, input) {
    if (registry.members.get(name) === undefined)
        throw new UnknownMemberError(name, registry.family);
    const method = instance[methodKey(name)];
    return await method.call(instance, ctx, input);
}
/**
 * The text blocks of a `ToolError`'s content: an is_error result may hold text only (`errorTextContent`). An empty one
 * still signals that the call failed.
 */
export function errorContent(error) {
    const content = errorTextContent(error.content);
    if (typeof content === 'string')
        return content === '' ? [] : [{ type: 'text', text: content }];
    return content;
}
/**
 * `error` with each text block run through `check` and then bounded to the field limit. The same object when nothing
 * changed. The bound comes after the check: a driver's exception can embed a page-sized payload, and cutting first
 * would let a page place a path across the cut where the check reads a shorter one.
 */
export async function checkedError(error, check = (text) => text) {
    const content = errorContent(error);
    const checked = await Promise.all(content.map(async (block) => ({ ...block, text: cutPoints(await check(block.text), FIELD_MAX) })));
    if (checked.every((block, i) => block.text === content[i].text))
        return error;
    return new ToolError(checked);
}
/**
 * Ask `confirm` about the call awaiting approval: returns when it approved, throws the refusal the model reads
 * otherwise. A `ToolError` it throws is relayed as-is. Any other exception means the prompt failed, and refuses the
 * call rather than ending the run. Anything but `true` declines the call.
 */
export async function confirmOrThrow(confirm, ctx, call) {
    const name = call.member.name;
    let returned;
    try {
        returned = await confirm(ctx);
    }
    catch (error) {
        throwIfPropagates(error, call.ctx);
        if (error instanceof ToolError)
            throw error;
        throw new ConfirmFailedError(name);
    }
    if (returned !== true)
        throw new ConfirmDeclinedError(name);
}
// --- one call at a time ------------------------------------------------------------------------------------
/** The queue every top-level call of one toolset chains behind: calls run one at a time, in arrival order. */
export var CallQueue = /* @__PURE__ */ (() => {
    // --- one call at a time ------------------------------------------------------------------------------------
    /** The queue every top-level call of one toolset chains behind: calls run one at a time, in arrival order. */
    class CallQueue {
        constructor() {
            _CallQueue_chain.set(this, Promise.resolve());
        }
        /** Run `turn` once the calls ahead of it have settled; a call whose `signal` aborts meanwhile leaves the queue at once. */
        enqueue(signal, turn) {
            const previous = __classPrivateFieldGet(this, _CallQueue_chain, "f");
            let ready = previous;
            let onAbort = () => undefined;
            if (signal) {
                // A queued call whose run is aborted leaves the queue at once rather than when its turn comes.
                const aborted = new Promise((_, reject) => {
                    onAbort = () => reject(new APIUserAbortError());
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
            __classPrivateFieldSet(this, _CallQueue_chain, Promise.allSettled([previous, run]).then(() => undefined), "f");
            return run;
        }
        /** Settles once every call accepted so far has settled, failed ones included. */
        drain() {
            return __classPrivateFieldGet(this, _CallQueue_chain, "f");
        }
    }
    _CallQueue_chain = new WeakMap();
    return CallQueue;
})();
/**
 * Wire `Symbol.asyncDispose` on a toolset class's prototype to its `close()`, where the engine provides the symbol.
 * The tsconfig targets ES2020, so there is no typed `AsyncDisposable` member: `await using` works from JavaScript on
 * those engines, and TypeScript callers use `close()`.
 */
export function wireAsyncDispose(prototype) {
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
//# sourceMappingURL=core.mjs.map