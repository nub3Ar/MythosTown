/** Dated `tools[]` entry `type` → the family stamped on member blocks. */
export const TOOLSET_TYPE_TO_FAMILY = {
    browser_toolset_20260801: 'browser',
    computer_toolset_20260801: 'computer',
};
export function toolsetFamily(toolset) {
    return TOOLSET_TYPE_TO_FAMILY[toolset.type];
}
/** Whether a `tools` entry is a toolset the runner can execute locally. */
export function isRunnableToolset(t) {
    // `in` alone would accept inherited keys such as `toString`
    return 'run' in t && t.type != null && Object.prototype.hasOwnProperty.call(TOOLSET_TYPE_TO_FAMILY, t.type);
}
//# sourceMappingURL=family.mjs.map