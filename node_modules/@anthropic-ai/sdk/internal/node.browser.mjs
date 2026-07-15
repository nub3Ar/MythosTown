import { AnthropicError } from "../core/error.mjs";
/** Substituted for `./node` by the package.json `browser` field; every property access throws. */
function unavailable(module) {
    return new Proxy({}, {
        get(_target, property) {
            if (typeof property === 'symbol')
                return undefined;
            throw new AnthropicError(`\`${module}.${property}\` is not available in this environment; it needs a Node.js-compatible runtime`);
        },
    });
}
export const child_process = /* @__PURE__ */ unavailable('child_process');
export const crypto = /* @__PURE__ */ unavailable('crypto');
export const fs = /* @__PURE__ */ unavailable('fs');
export const os = /* @__PURE__ */ unavailable('os');
export const path = /* @__PURE__ */ unavailable('path');
export const stream = /* @__PURE__ */ unavailable('stream');
export const util = /* @__PURE__ */ unavailable('util');
//# sourceMappingURL=node.browser.mjs.map