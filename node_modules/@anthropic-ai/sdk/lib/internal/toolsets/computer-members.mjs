import { buildMembers, } from "./core.mjs";
export const COMPUTER_FAMILY = 'computer';
export const COMPUTER_TOOLSET_TYPE = 'computer_toolset_20260801';
const _computerKeys = true;
void _computerKeys;
// Hand-kept: result kinds and confirmation templates. Every member is on by default. A member missing here (or an
// extra one) fails to compile.
const ROWS = {
    key: ['none', 'Pressed {text}.', true],
    hold_key: ['none', 'Held {text} for {duration}s.', true],
    type: ['none', 'Typed.', true],
    cursor_position: ['point', null, true],
    mouse_move: ['none', 'Moved the mouse.', true],
    left_mouse_down: ['none', 'Left mouse button pressed.', true],
    left_mouse_up: ['none', 'Left mouse button released.', true],
    left_click: ['none', 'Clicked.', true],
    left_click_drag: ['none', 'Dragged.', true],
    right_click: ['none', 'Right-clicked.', true],
    middle_click: ['none', 'Middle-clicked.', true],
    double_click: ['none', 'Double-clicked.', true],
    triple_click: ['none', 'Triple-clicked.', true],
    scroll: ['none', 'Scrolled {scroll_direction}.', true],
    wait: ['none', 'Waited {duration}s.', true],
    screenshot: ['screenshot', null, true],
    zoom: ['screenshot', null, true],
};
/**
 * `value` typed as what a computer member of result kind `kind` returns: the one place the driver's declared result
 * type is taken at its word.
 */
export function typedComputerResult(kind, value) {
    return { kind, value };
}
/**
 * Every computer member name, in the order of `ROWS`. Built from the table, not imported from
 * `BETA_COMPUTER_MEMBER_NAME_VALUES`, so the toolset modules do not load `resources/beta/messages/messages`.
 */
export const COMPUTER_MEMBER_NAMES = /* @__PURE__ */ Object.keys(ROWS);
/** Every computer member, in the order of `ROWS`. */
export const COMPUTER_MEMBERS = 
/* @__PURE__ */ buildMembers(COMPUTER_MEMBER_NAMES, ROWS);
// The API's member data marks no computer tool as needing `confirm`, so this list is the SDK's own.
export const COMPUTER_CONFIRM_REQUIRED = /* @__PURE__ */ new Set([
    'type',
    'key',
    'hold_key',
]);
/** The computer registry as the shared toolset core reads it. No member is off by default. */
export const COMPUTER_REGISTRY = {
    family: COMPUTER_FAMILY,
    names: COMPUTER_MEMBER_NAMES,
    members: COMPUTER_MEMBERS,
    defaultDisabled: /* @__PURE__ */ new Set(),
};
// --- input -------------------------------------------------------------------------------------------------
/** Copies the model's input. The copy is a spread, so an own `__proto__` key stays an ordinary key. */
export function parseComputerInput(raw) {
    return { ...raw };
}
//# sourceMappingURL=computer-members.mjs.map