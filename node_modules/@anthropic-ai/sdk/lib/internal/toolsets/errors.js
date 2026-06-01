"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NO_UPLOAD_ROOTS = exports.UploadRefusedError = exports.ConfirmFailedError = exports.ConfirmDeclinedError = exports.URLRefusedError = exports.InvalidMemberInputError = exports.UnavailableMemberError = exports.DisabledMemberError = exports.UnknownMemberError = exports.ToolsetClosedError = exports.ToolsetContractError = exports.ToolsetConfigError = exports.ToolsetUsageError = void 0;
const error_1 = require("../../../core/error.js");
const ToolError_1 = require("../../tools/ToolError.js");
const sanitize_1 = require("./sanitize.js");
/**
 * Thrown when your code uses a toolset's API incorrectly. Catch it to catch all three kinds below.
 *
 * The only exception the tool runner propagates from a member call: anything else a member throws becomes an
 * `is_error` result the model can react to, and the loop continues.
 */
class ToolsetUsageError extends error_1.AnthropicError {
    constructor(message, options) {
        super(message);
        this.name = 'ToolsetUsageError';
        if (options && 'cause' in options)
            this.cause = options.cause;
    }
}
exports.ToolsetUsageError = ToolsetUsageError;
/** A construction-time mistake: an option combination the toolset cannot honour. */
class ToolsetConfigError extends ToolsetUsageError {
    constructor(message, options) {
        super(message, options);
        this.name = 'ToolsetConfigError';
    }
}
exports.ToolsetConfigError = ToolsetConfigError;
/** Misuse of the SDK's own API detected at call time (a `browserState` that threw, a misrouted `tool_use`). */
class ToolsetContractError extends ToolsetUsageError {
    constructor(message, options) {
        super(message, options);
        this.name = 'ToolsetContractError';
    }
}
exports.ToolsetContractError = ToolsetContractError;
/** A member run on a toolset you already closed. */
class ToolsetClosedError extends ToolsetUsageError {
    constructor(message, options) {
        super(message, options);
        this.name = 'ToolsetClosedError';
    }
}
exports.ToolsetClosedError = ToolsetClosedError;
// --- the SDK's own refusals ---------------------------------------------------------------------------
// Each is a `ToolError`, so the model reads it as an `is_error` result and the loop continues. The subclass lets
// your code (an `execute` override, a test) identify the refusal without comparing text.
/** The refusal the model reads for a member name the toolset does not have. */
class UnknownMemberError extends ToolError_1.ToolError {
    constructor(name, family) {
        super(`Error: unknown ${family} toolset member '${(0, sanitize_1.quotedName)(name)}'`);
        this.name = 'UnknownMemberError';
    }
}
exports.UnknownMemberError = UnknownMemberError;
/** The refusal the model reads for a member your application's `configs` disabled. */
class DisabledMemberError extends ToolError_1.ToolError {
    constructor(name) {
        super(`The '${name}' action is not permitted by this application's permissions and cannot be used in this session.`);
        this.name = 'DisabledMemberError';
    }
}
exports.DisabledMemberError = DisabledMemberError;
/** The refusal the model reads for a member the driver does not implement. */
class UnavailableMemberError extends ToolError_1.ToolError {
    constructor(name, family) {
        super(`The ${family} toolset member '${name}' is not available in this environment.`);
        this.name = 'UnavailableMemberError';
    }
}
exports.UnavailableMemberError = UnavailableMemberError;
/**
 * The refusal the model reads when its `tool_use.input` does not fit the member: `problem` is the field and what was
 * expected.
 */
class InvalidMemberInputError extends ToolError_1.ToolError {
    constructor(name, family, problem) {
        super(`invalid input for ${family} member '${name}': ${problem}`);
        this.name = 'InvalidMemberInputError';
    }
}
exports.InvalidMemberInputError = InvalidMemberInputError;
/**
 * The refusal the model reads when your `urlPolicy` threw something other than a `ToolError` (a `ToolError` it throws
 * reaches the model as thrown). `reason` is the line it reads.
 */
class URLRefusedError extends ToolError_1.ToolError {
    constructor(reason) {
        // one bounded line: a reason may echo a model-written address of any length
        super((0, sanitize_1.logSafe)(reason));
        this.name = 'URLRefusedError';
    }
}
exports.URLRefusedError = URLRefusedError;
/** The refusal the model reads when your `confirm` callable answered anything but `true` for the member `name`. */
class ConfirmDeclinedError extends ToolError_1.ToolError {
    constructor(name) {
        super(`The user did not grant permission to run '${name}'. Do not retry it unless the user asks you to.`);
        this.name = 'ConfirmDeclinedError';
    }
}
exports.ConfirmDeclinedError = ConfirmDeclinedError;
/** The refusal the model reads when your `confirm` callable threw, so no answer could be obtained for `name`. */
class ConfirmFailedError extends ToolError_1.ToolError {
    constructor(name) {
        super(`Permission to run '${name}' could not be obtained (the confirmation prompt failed). Do not retry it unless the user asks you to.`);
        this.name = 'ConfirmFailedError';
    }
}
exports.ConfirmFailedError = ConfirmFailedError;
/**
 * The refusal the model reads for a `file_upload` the file policy (or its absence) does not admit. `reason` is the line
 * it reads.
 */
class UploadRefusedError extends ToolError_1.ToolError {
    constructor(reason) {
        super(reason);
        this.name = 'UploadRefusedError';
    }
}
exports.UploadRefusedError = UploadRefusedError;
/** The refusal for a `file_upload` by path when no upload root is configured (no file policy, or one without roots). */
exports.NO_UPLOAD_ROOTS = 'file_upload has no configured upload roots';
//# sourceMappingURL=errors.js.map