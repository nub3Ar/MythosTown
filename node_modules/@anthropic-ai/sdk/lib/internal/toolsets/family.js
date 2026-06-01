"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOOLSET_TYPE_TO_FAMILY = void 0;
exports.toolsetFamily = toolsetFamily;
exports.isRunnableToolset = isRunnableToolset;
/** Dated `tools[]` entry `type` → the family stamped on member blocks. */
exports.TOOLSET_TYPE_TO_FAMILY = {
    browser_toolset_20260801: 'browser',
    computer_toolset_20260801: 'computer',
};
function toolsetFamily(toolset) {
    return exports.TOOLSET_TYPE_TO_FAMILY[toolset.type];
}
/** Whether a `tools` entry is a toolset the runner can execute locally. */
function isRunnableToolset(t) {
    // `in` alone would accept inherited keys such as `toString`
    return 'run' in t && t.type != null && Object.prototype.hasOwnProperty.call(exports.TOOLSET_TYPE_TO_FAMILY, t.type);
}
//# sourceMappingURL=family.js.map