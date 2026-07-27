import type { Promisable } from "../../tools/BetaRunnableTool.js";
import type { ToolsetFamily } from "./family.js";
import { ToolError } from "../../tools/ToolError.js";
import type { BetaToolConfigs, BetaToolsetCallContext } from "./hooks.js";
import type { BetaBase64ImageSource, BetaTextBlockParam } from "../../../resources/beta.js";
/** A screenshot or zoom image from either toolset, rendered as one image block. */
export interface BetaScreenshotResult {
    /** Base64 image bytes, without a `data:` prefix. */
    data: string;
    /** Defaults to `'image/png'`. */
    mediaType?: BetaBase64ImageSource['media_type'] | undefined;
}
/**
 * The kinds of value a member hands back, each rendered by `render.ts`. `point` is a cursor position. `none` is a
 * pure action, rendered from its confirmation template and then the line it returned, if any.
 */
export type ResultKind = 'navigate' | 'screenshot' | 'text' | 'tab' | 'tabs' | 'point' | 'none';
/**
 * One member of a toolset: what the generated types do not carry about it, kept by hand in the family's registry.
 * `Kind` is the result kinds the family's rows use.
 */
export interface ToolsetMember<Name extends string = string, Kind extends ResultKind = ResultKind> {
    readonly name: Name;
    readonly result: Kind;
    /**
     * The confirmation the model reads after a pure action, with the placeholders `render.ts` knows (`{text}`,
     * `{duration}`, …; `{ref}` reads `target.ref`) filled from the input. A line the action returned follows it.
     */
    readonly text?: string;
    readonly enabledByDefault: boolean;
}
/**
 * A registry row as a family writes it: result kind, confirmation template, default-enabled flag. A family writes its
 * rows `as const`, so each member's result kind is a literal the result types below can read.
 */
export type MemberRow = readonly [ResultKind, string | null, boolean];
/** The declared result type (`Results[K]`) of every member whose row in `Rows` gives result kind `R`. */
export type KindResultOf<Name extends string, Rows extends {
    readonly [K in Name]: MemberRow;
}, Results extends {
    readonly [K in Name]: unknown;
}, R extends ResultKind> = {
    [K in Name]: Rows[K][0] extends R ? Results[K] : never;
}[Name];
/**
 * A member's result with its result kind, which says how to read it: for each kind `R` the family uses, `value` is
 * what that family's members of that kind declare. A family exports its own instantiation and a `typedResult` that
 * builds one, the one place the driver's declared result type is taken at its word.
 */
export type TypedResultOf<Name extends string, Rows extends {
    readonly [K in Name]: MemberRow;
}, Results extends {
    readonly [K in Name]: unknown;
}, R extends ResultKind = Rows[Name][0]> = {
    [P in R]: {
        readonly kind: P;
        readonly value: KindResultOf<Name, Rows, Results, P>;
    };
}[R];
/** The member table from a family's rows, in the order of `names`. */
export declare function buildMembers<Name extends string, Rows extends {
    readonly [K in Name]: MemberRow;
}>(names: readonly Name[], rows: Rows): ReadonlyMap<Name, ToolsetMember<Name, Rows[Name][0]>>;
/** A family's member registry, as the parts of a toolset class shared by every family read it. */
export interface Registry<Name extends string, M extends ToolsetMember<Name> = ToolsetMember<Name>> {
    /** The family stamped on member blocks, matched against `tool_use.toolset_name`. */
    readonly family: ToolsetFamily;
    /** Every member name, in canonical order. */
    readonly names: readonly Name[];
    readonly members: ReadonlyMap<Name, M>;
    /** Members the API withholds unless `configs` enables them. */
    readonly defaultDisabled: ReadonlySet<string>;
}
/** The registry row for a model-supplied name, or undefined when it names no member. */
export declare function memberOf<Name extends string, M extends ToolsetMember<Name>>(registry: Registry<Name, M>, name: string): M | undefined;
/** A wire entry's `configs` (any generated `*ToolsetConfigs`), read as `{ [member]: { enabled? } }`. */
export type MemberConfigs = object | undefined;
/**
 * Whether `configs` leave `name` enabled, failing closed when the answer is unclear.
 *
 * Only a real boolean `enabled` turns a member on or off. Any other value fails closed, so a malformed
 * entry (a `"false"` string that came through JSON or an environment variable) can never turn on a
 * member that is off by default.
 */
export declare function isEnabled(name: string, configs: MemberConfigs, defaultDisabled: ReadonlySet<string>): boolean;
/** The constructor options every family takes; a family's own options type adds to them. */
export interface ToolsetOptions<Configs extends object, Confirm> {
    configs?: Configs | undefined;
    confirm?: Confirm | undefined;
    toolConfigs?: BetaToolConfigs | undefined;
}
/** What the dispatch gate reads: the wire configs, and which members the class serves and the caller configured. */
export interface ServedMembers {
    /** What `toJSON` sends: the caller's `configs` plus `enabled: false` for every member the subclass does not serve. */
    readonly wireConfigs: MemberConfigs;
    /** The members a sampled call may reach: the implemented ones, or all of them for an execute-only subclass. */
    readonly served: ReadonlySet<string>;
    /** Members the caller's own `configs` mention. */
    readonly configured: ReadonlySet<string>;
}
/** The shared constructor options, validated and resolved once at construction. */
export interface ResolvedToolsetOptions<Configs extends object, Confirm> extends ServedMembers {
    readonly wireConfigs: Configs | undefined;
    readonly confirm: Confirm | undefined;
    /** Spread onto the `tools[]` entry `toJSON` returns: your `toolConfigs`, copied and frozen at construction. */
    readonly toolConfigs: BetaToolConfigs | undefined;
}
/** Whether `instance`'s class chain overrides `key` before reaching `base`, by own-property lookup. Nothing is called. */
export declare function overrides(instance: object, base: object, key: string): boolean;
/**
 * Check and resolve the options every family shares, once, at construction. A family checks its own options in its
 * own class.
 */
export declare function resolveToolsetOptions<Configs extends object, Confirm extends (ctx: never) => Promisable<boolean>>(registry: Registry<string>, instance: object, base: object, options: ToolsetOptions<Configs, Confirm>): ResolvedToolsetOptions<Configs, Confirm>;
/** One member call in flight: what each stage produced, for the stages after it. `Result` is the family's typed result. */
export declare class MemberCall<M extends ToolsetMember = ToolsetMember, Input = unknown, Result = unknown> {
    readonly ctx: BetaToolsetCallContext;
    readonly name: string;
    readonly rawInput: unknown;
    member: M | undefined;
    input: Input | undefined;
    result: Result | undefined;
    error: ToolError | undefined;
    constructor(ctx: BetaToolsetCallContext, name: string, rawInput: unknown);
    get toolUseId(): string | undefined;
}
/**
 * Stage one of a call: the registry row for `name`, or the refusal the model reads (an unknown name, a
 * member this application disabled, or one the driver does not implement).
 */
export declare function resolveMember<Name extends string, M extends ToolsetMember<Name>>(registry: Registry<Name, M>, options: ServedMembers, name: string): M;
/**
 * `execute`'s default body: the member's method on `instance`, resolved through the registry rather than by property
 * name, since `instance[name]` on raw model output would reach `constructor`, `toString` or any other property.
 */
export declare function dispatchMember<Name extends string>(registry: Registry<Name>, instance: object, ctx: BetaToolsetCallContext, name: Name, input: unknown): Promise<unknown>;
/**
 * The text blocks of a `ToolError`'s content: an is_error result may hold text only (`errorTextContent`). An empty one
 * still signals that the call failed.
 */
export declare function errorContent(error: ToolError): BetaTextBlockParam[];
/**
 * `error` with each text block run through `check` and then bounded to the field limit. The same object when nothing
 * changed. The bound comes after the check: a driver's exception can embed a page-sized payload, and cutting first
 * would let a page place a path across the cut where the check reads a shorter one.
 */
export declare function checkedError(error: ToolError, check?: (text: string) => Promisable<string>): Promise<ToolError>;
/**
 * Ask `confirm` about the call awaiting approval: returns when it approved, throws the refusal the model reads
 * otherwise. A `ToolError` it throws is relayed as-is. Any other exception means the prompt failed, and refuses the
 * call rather than ending the run. Anything but `true` declines the call.
 */
export declare function confirmOrThrow<Context>(confirm: (ctx: Context) => Promisable<boolean>, ctx: Context, call: MemberCall): Promise<void>;
/** The queue every top-level call of one toolset chains behind: calls run one at a time, in arrival order. */
export declare class CallQueue {
    #private;
    /** Run `turn` once the calls ahead of it have settled; a call whose `signal` aborts meanwhile leaves the queue at once. */
    enqueue<T>(signal: AbortSignal | null | undefined, turn: () => Promise<T>): Promise<T>;
    /** Settles once every call accepted so far has settled, failed ones included. */
    drain(): Promise<void>;
}
/**
 * Wire `Symbol.asyncDispose` on a toolset class's prototype to its `close()`, where the engine provides the symbol.
 * The tsconfig targets ES2020, so there is no typed `AsyncDisposable` member: `await using` works from JavaScript on
 * those engines, and TypeScript callers use `close()`.
 */
export declare function wireAsyncDispose(prototype: {
    close(): Promise<void>;
}): void;
//# sourceMappingURL=core.d.ts.map