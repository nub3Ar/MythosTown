import { AnthropicError } from "../../../core/error.mjs";
import type { ToolsetFamily } from "./family.mjs";
import { ToolError } from "../../tools/ToolError.mjs";
/**
 * Thrown when your code uses a toolset's API incorrectly. Catch it to catch all three kinds below.
 *
 * The only exception the tool runner propagates from a member call: anything else a member throws becomes an
 * `is_error` result the model can react to, and the loop continues.
 */
export declare class ToolsetUsageError extends AnthropicError {
    /** The wrapped error, when there is one (a driver's `browserState` that threw). Its stack is the driver's own. */
    readonly cause?: unknown;
    constructor(message: string, options?: {
        cause?: unknown;
    });
}
/** A construction-time mistake: an option combination the toolset cannot honour. */
export declare class ToolsetConfigError extends ToolsetUsageError {
    constructor(message: string, options?: {
        cause?: unknown;
    });
}
/** Misuse of the SDK's own API detected at call time (a `browserState` that threw, a misrouted `tool_use`). */
export declare class ToolsetContractError extends ToolsetUsageError {
    constructor(message: string, options?: {
        cause?: unknown;
    });
}
/** A member run on a toolset you already closed. */
export declare class ToolsetClosedError extends ToolsetUsageError {
    constructor(message: string, options?: {
        cause?: unknown;
    });
}
/** The refusal the model reads for a member name the toolset does not have. */
export declare class UnknownMemberError extends ToolError {
    constructor(name: string, family: ToolsetFamily);
}
/** The refusal the model reads for a member your application's `configs` disabled. */
export declare class DisabledMemberError extends ToolError {
    constructor(name: string);
}
/** The refusal the model reads for a member the driver does not implement. */
export declare class UnavailableMemberError extends ToolError {
    constructor(name: string, family: ToolsetFamily);
}
/**
 * The refusal the model reads when its `tool_use.input` does not fit the member: `problem` is the field and what was
 * expected.
 */
export declare class InvalidMemberInputError extends ToolError {
    constructor(name: string, family: ToolsetFamily, problem: string);
}
/**
 * The refusal the model reads when your `urlPolicy` threw something other than a `ToolError` (a `ToolError` it throws
 * reaches the model as thrown). `reason` is the line it reads.
 */
export declare class URLRefusedError extends ToolError {
    constructor(reason: string);
}
/** The refusal the model reads when your `confirm` callable answered anything but `true` for the member `name`. */
export declare class ConfirmDeclinedError extends ToolError {
    constructor(name: string);
}
/** The refusal the model reads when your `confirm` callable threw, so no answer could be obtained for `name`. */
export declare class ConfirmFailedError extends ToolError {
    constructor(name: string);
}
/**
 * The refusal the model reads for a `file_upload` the file policy (or its absence) does not admit. `reason` is the line
 * it reads.
 */
export declare class UploadRefusedError extends ToolError {
    constructor(reason: string);
}
/** The refusal for a `file_upload` by path when no upload root is configured (no file policy, or one without roots). */
export declare const NO_UPLOAD_ROOTS = "file_upload has no configured upload roots";
//# sourceMappingURL=errors.d.mts.map