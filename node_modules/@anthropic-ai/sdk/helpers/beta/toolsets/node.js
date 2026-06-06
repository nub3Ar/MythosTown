"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.betaCheckUploadPath = exports.BetaNodeFilePolicy = void 0;
/**
 * Node entry for the browser toolset helpers: `@anthropic-ai/sdk/helpers/beta/toolsets/node`.
 *
 * `BetaNodeFilePolicy` and `betaCheckUploadPath` resolve symlinks through the real filesystem, so they are kept
 * apart from the runtime-agnostic `helpers/beta/toolsets` entry. In a browser bundle the module still
 * imports (the Node built-ins are stubbed) and throws when a filesystem check is used.
 */
var security_node_1 = require("../../../lib/internal/toolsets/security-node.js");
Object.defineProperty(exports, "BetaNodeFilePolicy", { enumerable: true, get: function () { return security_node_1.BetaNodeFilePolicy; } });
Object.defineProperty(exports, "betaCheckUploadPath", { enumerable: true, get: function () { return security_node_1.betaCheckUploadPath; } });
//# sourceMappingURL=node.js.map