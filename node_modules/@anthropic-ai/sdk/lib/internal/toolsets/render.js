"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NAVIGATION_REFUSED_LINE = void 0;
exports.text = text;
exports.actionLine = actionLine;
exports.renderResult = renderResult;
exports.isNavigationRefused = isNavigationRefused;
exports.isDialogDismissed = isDialogDismissed;
exports.isDownloadChange = isDownloadChange;
exports.dialogLines = dialogLines;
exports.coalesceChanges = coalesceChanges;
exports.pathVisible = pathVisible;
exports.renderBrowserState = renderBrowserState;
const errors_1 = require("./errors.js");
const sanitize_1 = require("./sanitize.js");
const values_1 = require("../../../internal/utils/values.js");
/**
 * The line the model reads, once, for any number of `BetaNavigationRefused` entries in a report. Nothing else in an
 * entry is echoed: it is shaped by the page that was refused.
 */
exports.NAVIGATION_REFUSED_LINE = 'A navigation was refused.';
function inputField(input, path) {
    const value = path
        .split('.')
        .reduce((parent, part) => parent?.[part], input);
    return (0, sanitize_1.oneLine)(String(value ?? '')); // a number or boolean as JSON spells it, so the model reads `Waited 2s.` / `true`
}
const TEMPLATE_FIELDS = {
    scroll_direction: 'scroll_direction',
    text: 'text',
    duration: 'duration',
    ref: 'target.ref',
};
const TEMPLATE_TOKEN_RE = /* @__PURE__ */ new RegExp(
/* @__PURE__ */ Object.keys(TEMPLATE_FIELDS)
    .map((key) => `\\{${key}\\}`)
    .join('|'), 'g');
/**
 * Fill a pure action's template from its input in a single pass, so a model-supplied value such as
 * `"{ref}"` stays data and is never re-read as a placeholder.
 */
function confirmation(template, input) {
    return template.replace(TEMPLATE_TOKEN_RE, (token) => inputField(input, TEMPLATE_FIELDS[token.slice(1, -1)]));
}
function text(value) {
    return { type: 'text', text: value };
}
/**
 * The line a pure action returned, as written (not yet checked, folded or cut). `undefined` when it returned none (or
 * anything but a non-empty string). The browser pipeline runs the error-text check on it first; `renderResult` then
 * folds and bounds it.
 */
function actionLine(member, result) {
    if (member.text === undefined || result?.kind !== 'none' || typeof result.value !== 'string')
        return undefined;
    return result.value || undefined;
}
/** The content blocks for a member's result, by the registry's result kind. */
function renderResult(member, input, result) {
    switch (result.kind) {
        case 'none': {
            if (member.text === undefined)
                return [];
            // A line the action returned is its own block after the acknowledgment's, folded to one line and bounded here.
            const lines = [confirmation(member.text, input)];
            const line = actionLine(member, result);
            const folded = line === undefined ? '' : (0, sanitize_1.oneLine)(line);
            if (folded)
                lines.push(folded); // a line that folds to nothing adds no block: the API may reject an empty text block
            return lines.map(text);
        }
        case 'tab':
        case 'tabs':
            // new_tab / switch_tab / list_tabs: the browser_state block is the whole result.
            return [];
        case 'navigate': {
            const r = result.value;
            // the final address is page-chosen through redirects: folded to one line and held to the bound, as a tab's is
            let line = `Navigated to ${(0, sanitize_1.boundedTabURL)(r.url)}`;
            if (r.title != null)
                line += ` — ${(0, sanitize_1.oneLine)(r.title)}`;
            if (r.status != null)
                line += ` (HTTP ${r.status})`;
            return [text(line)];
        }
        case 'screenshot': {
            const r = result.value;
            const image = {
                type: 'image',
                source: { type: 'base64', media_type: r.mediaType ?? 'image/png', data: r.data },
            };
            return [image];
        }
        case 'point':
            // cursor_position: the cursor, in screenshot pixels
            return [text(`X=${result.value.x},Y=${result.value.y}`)];
        case 'text': {
            const value = (0, sanitize_1.wellFormed)(String(result.value)); // page text: a lone surrogate in it could not be sent
            return [text(value === '' ? '(empty)' : value)];
        }
        default:
            (0, values_1.checkNever)(result);
            return [];
    }
}
function isNavigationRefused(change) {
    return change.type === 'navigation_refused';
}
function isDialogDismissed(change) {
    return change.type === 'dialog_dismissed';
}
const DOWNLOAD_TYPES = /* @__PURE__ */ new Set(
/* @__PURE__ */ Object.keys({
    download_started: true,
    download_completed: true,
    download_failed: true,
}));
function isDownloadChange(change) {
    return DOWNLOAD_TYPES.has(change.type);
}
const DIALOG_MESSAGE_MAX = 200;
const DIALOG_KIND_MAX = 20; // `kind` is driver-supplied and lands unquoted in the line; a real one is a word
const DIALOG_LINES_MAX = 3;
/**
 * One line per dismissed dialog the driver reported (`A confirm dialog "…" was dismissed.`), the message capped and
 * at most a few lines, then a count of the rest, because a page can open dialogs in a loop.
 */
function dialogLines(dialogs) {
    const lines = [];
    for (const dialog of dialogs.slice(0, DIALOG_LINES_MAX)) {
        const kind = (0, sanitize_1.cutPoints)((0, sanitize_1.oneLine)(dialog.kind), DIALOG_KIND_MAX) || 'dialog';
        const article = 'aeiou'.includes(kind.slice(0, 1).toLowerCase()) ? 'An' : 'A';
        const noun = kind === 'dialog' ? kind : `${kind} dialog`;
        const message = (0, sanitize_1.oneLine)(dialog.message ?? '');
        const shown = (0, sanitize_1.cutPoints)(message, DIALOG_MESSAGE_MAX);
        const quoted = message ? ` ${JSON.stringify(shown.length < message.length ? shown + '…' : shown)}` : '';
        lines.push(`${article} ${noun}${quoted} was dismissed.`);
    }
    if (dialogs.length > DIALOG_LINES_MAX)
        lines.push(`${dialogs.length - DIALOG_LINES_MAX} more dialogs were dismissed.`);
    return lines;
}
/**
 * The state changes a block includes: those held back from an earlier call whose result never reached the model,
 * then this report's own, coalesced so the list meets the API's rules however the driver filled it. Of the download
 * changes the latest per `download_id` is kept, where it stands; of the `tab_opened` changes the first per tab, and
 * only for a tab the report still lists. The SDK's own kinds never reach here (see `reportOf`).
 */
function coalesceChanges(pending, report) {
    const all = [...pending, ...report.changes];
    const liveTabs = new Set(report.tabs.map((t) => t.tab_id));
    const latest = new Map();
    all.forEach((change, index) => {
        if ('download_id' in change)
            latest.set(change.download_id, index);
    });
    const opened = new Set();
    return all.filter((change, index) => {
        if (change.type === 'tab_opened') {
            if (!liveTabs.has(change.tab_id) || opened.has(change.tab_id))
                return false;
            opened.add(change.tab_id);
            return true;
        }
        return !('download_id' in change) || latest.get(change.download_id) === index;
    });
}
/**
 * The file policy's verdict on one download path, hidden without a policy. The answer is awaited, so the predicate
 * may be `async`. Anything but `true` keeps the path hidden. A `ToolsetUsageError` propagates. Any other exception
 * or rejection from the predicate fails closed: the path stays hidden and the report, with its changes, still goes
 * out.
 */
async function pathVisible(filePolicy, path) {
    if (!filePolicy)
        return false;
    let verdict;
    try {
        verdict = await filePolicy.isPathVisible(path);
    }
    catch (error) {
        if (error instanceof errors_1.ToolsetUsageError)
            throw error;
        return false;
    }
    return verdict === true;
}
/**
 * The `browser_state` block: the driver's tabs with each URL and title folded to one line and held to the API's length
 * limit, and `changes` with a download's `url` and a failed download's `error` bounded the same way and its `path`
 * removed from every download change, kept only on a `download_completed` whose path the file policy exposes to the
 * model and folding would leave unchanged.
 */
async function renderBrowserState(tabs, changes, filePolicy) {
    const wire = [];
    for (let change of changes) {
        if (isDownloadChange(change)) {
            // removed from whichever kind has it, declared or not: a local path never goes out unchecked
            const { path, ...rest } = change;
            change = { ...rest, url: (0, sanitize_1.boundedTabURL)(change.url) };
            if (change.type === 'download_completed' && typeof path === 'string') {
                // page-shaped: a path that folding would change could name another file, so it is withheld
                if ((0, sanitize_1.oneLine)(path) === path && (await pathVisible(filePolicy, path)))
                    change.path = path;
            }
            if (change.type === 'download_failed' && change.error != null)
                change.error = (0, sanitize_1.oneLine)(String(change.error));
        }
        else {
            // copied like the others: the block holds nothing the driver can still change after the call
            change = { ...change };
        }
        wire.push(change);
    }
    const bounded = tabs.map((tab) => ({
        ...tab,
        url: (0, sanitize_1.boundedTabURL)(tab.url),
        title: (0, sanitize_1.oneLine)(tab.title),
    }));
    const block = { type: 'browser_state', tabs: bounded };
    // "Nothing to report" is an absent field, never an empty list.
    if (wire.length)
        block.state_changes = wire;
    return block;
}
//# sourceMappingURL=render.js.map