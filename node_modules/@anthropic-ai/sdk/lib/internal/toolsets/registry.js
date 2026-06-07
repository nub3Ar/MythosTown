"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATE_ONLY_MEMBERS = exports.BROWSER_REGISTRY = exports.BROWSER_DEFAULT_DISABLED_MEMBERS = exports.BROWSER_MEMBERS = exports.BROWSER_MEMBER_NAMES = exports.TOOLSET_TYPE = exports.CONFIRM_REQUIRED = exports.FAMILY = void 0;
exports.typedResult = typedResult;
exports.getMember = getMember;
exports.memberEnabled = memberEnabled;
const core_1 = require("./core.js");
exports.FAMILY = 'browser';
/**
 * Members whose calls wait for a person unless the application says otherwise: page content can steer what the
 * model asks them to do, and what they do reaches outside the page.
 */
exports.CONFIRM_REQUIRED = new Set([
    'javascript_exec',
    'file_upload',
]);
exports.TOOLSET_TYPE = 'browser_toolset_20260801';
const _browserKeys = true;
void _browserKeys;
// Hand-kept: result kinds, confirmation templates and default-disabled flags. Everything else about a
// member comes from the API types. A member missing here (or an extra one) fails to compile.
const ROWS = {
    navigate: ['navigate', null, true],
    screenshot: ['screenshot', null, true],
    zoom: ['screenshot', null, true],
    left_click: ['none', 'Clicked.', true],
    right_click: ['none', 'Right-clicked.', true],
    middle_click: ['none', 'Middle-clicked.', true],
    double_click: ['none', 'Double-clicked.', true],
    triple_click: ['none', 'Triple-clicked.', true],
    hover: ['none', 'Hovered.', true],
    left_click_drag: ['none', 'Dragged.', true],
    left_mouse_down: ['none', 'Mouse button pressed.', true],
    left_mouse_up: ['none', 'Mouse button released.', true],
    mouse_move: ['none', 'Moved the mouse.', true],
    scroll: ['none', 'Scrolled {scroll_direction}.', true],
    scroll_to: ['none', 'Scrolled to {ref}.', true],
    type: ['none', 'Typed.', true],
    key: ['none', 'Pressed {text}.', true],
    hold_key: ['none', 'Held {text} for {duration}s.', true],
    form_input: ['none', 'Set the value of {ref}.', true],
    read_page: ['text', null, true],
    find: ['text', null, true],
    get_page_text: ['text', null, true],
    wait: ['none', 'Waited {duration}s.', true],
    file_upload: ['none', 'Uploaded.', false],
    read_console: ['text', null, false],
    read_network: ['text', null, false],
    javascript_exec: ['text', null, false],
    new_tab: ['tab', null, true],
    list_tabs: ['tabs', null, true],
    switch_tab: ['tab', null, true],
    close_tab: ['none', null, true],
};
/**
 * `value` typed as what a member of result kind `kind` returns: the one place the driver's declared result type is
 * taken at its word.
 */
function typedResult(kind, value) {
    return { kind, value };
}
/**
 * Every browser member name, in the order of `ROWS`. Built from the table, not imported from the generated runtime list,
 * so the toolset modules do not load `resources/beta/messages/messages` (the runner loads them from there).
 */
exports.BROWSER_MEMBER_NAMES = Object.keys(ROWS);
/** Every browser member, in the order of `ROWS`. */
exports.BROWSER_MEMBERS = (0, core_1.buildMembers)(exports.BROWSER_MEMBER_NAMES, ROWS);
/** Members the API withholds unless `configs` enables them. */
exports.BROWSER_DEFAULT_DISABLED_MEMBERS = new Set(
/* @__PURE__ */ [...exports.BROWSER_MEMBERS.values()].filter((m) => !m.enabledByDefault).map((m) => m.name));
/** The browser registry as the shared toolset core reads it. */
exports.BROWSER_REGISTRY = {
    family: exports.FAMILY,
    names: exports.BROWSER_MEMBER_NAMES,
    members: exports.BROWSER_MEMBERS,
    defaultDisabled: exports.BROWSER_DEFAULT_DISABLED_MEMBERS,
};
function getMember(name) {
    return (0, core_1.memberOf)(exports.BROWSER_REGISTRY, name);
}
/**
 * The tab members, which render no content of their own, so their non-error result is exactly one `browser_state`
 * block, and a line meant for the model (a refused navigation) waits for the next result that can hold it. Listed by
 * name rather than derived from `ROWS`, so a tab member that gains a confirmation line stays in the set.
 */
exports.STATE_ONLY_MEMBERS = new Set([
    'new_tab',
    'list_tabs',
    'switch_tab',
    'close_tab',
]);
/** Whether `configs` leave the browser member `name` enabled (`isEnabled` over the browser defaults). */
function memberEnabled(name, configs) {
    return (0, core_1.isEnabled)(name, configs, exports.BROWSER_DEFAULT_DISABLED_MEMBERS);
}
//# sourceMappingURL=registry.js.map