"use strict";
var _PipelineState_instances, _PipelineState_takeNotices;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HISTORY_NAVIGATION = exports.PipelineState = exports.CallRecord = void 0;
exports.parseInput = parseInput;
exports.reportOf = reportOf;
exports.withBoundedTabURLs = withBoundedTabURLs;
exports.holdOtherTabOpened = holdOtherTabOpened;
exports.targetTab = targetTab;
exports.boundedError = boundedError;
exports.urlContext = urlContext;
exports.navigateRequestURL = navigateRequestURL;
exports.policyRefusal = policyRefusal;
exports.resolveUploadPaths = resolveUploadPaths;
exports.confirmContext = confirmContext;
const tslib_1 = require("../../../internal/tslib.js");
const ToolError_1 = require("../../tools/ToolError.js");
const core_1 = require("./core.js");
const errors_1 = require("./errors.js");
const registry_1 = require("./registry.js");
const render_1 = require("./render.js");
const sanitize_1 = require("./sanitize.js");
/** One browser member call in flight: what each stage produced, for the stages after it, and the tab it is about. */
class CallRecord extends core_1.MemberCall {
    /**
     * The tab the call names, or undefined when it names none (an absent or empty `tab_id` both mean the
     * active tab, as they do to a driver).
     */
    get tabId() {
        const tabId = this.input !== undefined && 'tab_id' in this.input ? this.input.tab_id : undefined;
        return tabId == null || tabId === '' ? undefined : tabId;
    }
}
exports.CallRecord = CallRecord;
// --- input ---------------------------------------------------------------------------------------------
/**
 * The model's `tool_use.input`, copied and typed as the member's input type. Nothing is checked here: every field stays
 * in the copy as sent, declared or not. If the driver throws on a field, the error becomes an `is_error` result.
 *
 * `confirm` gets the copy as `ctx.input`, and the driver gets it as `input`. `browserState` does not get the copy.
 * All three get `ctx.toolUse.input`, the input as the model sent it.
 */
function parseInput(raw) {
    // The API sends `input` as an object. The copy keeps the SDK's own writes (a history word, resolved paths) out of it.
    return { ...raw };
}
/**
 * The checked `BetaBrowserState` as a `Report`: its tabs and wire changes as they stand, the SDK's own change kinds set
 * apart.
 */
function reportOf(state) {
    const changes = [];
    let navigationRefused = false;
    const dialogs = [];
    for (const change of state.state_changes ?? []) {
        if ((0, render_1.isNavigationRefused)(change))
            navigationRefused = true;
        else if ((0, render_1.isDialogDismissed)(change))
            dialogs.push(change);
        else
            changes.push(change);
    }
    return { tabs: state.tabs, changes, navigationRefused, dialogs };
}
/**
 * The report with each tab's and each download's page-supplied URL as the model will read it (folded to one line and
 * held to the API's limit, see `boundedTabURL`) before anything else reads or forwards it.
 * Tab entries are copies, so the inventory kept for the next call never aliases the driver's objects; state
 * changes are the driver's objects unless a URL was bounded.
 */
function withBoundedTabURLs(state) {
    const tabs = state.tabs.map((tab) => ({ ...tab, url: (0, sanitize_1.boundedTabURL)(tab.url) }));
    const state_changes = state.state_changes?.map((change) => {
        if (!(0, render_1.isDownloadChange)(change))
            return change;
        const bounded = (0, sanitize_1.boundedTabURL)(change.url);
        return bounded === change.url ? change : { ...change, url: bounded };
    });
    return state_changes === undefined ? { ...state, tabs } : { ...state, tabs, state_changes };
}
/** The `tab_id` of the tab a `new_tab` call returned, if it returned one. */
function openedTabId(call) {
    const opened = call.member?.name === 'new_tab' && call.result?.kind === 'tab' ? call.result.value : undefined;
    return opened?.tab_id;
}
/**
 * A `new_tab` result must include exactly one `tab_opened`: the tab it opened. A popup the page opened around the
 * same time (drained by this call, or held back from a call whose result never reached the model) is still news,
 * so its `tab_opened` waits for the next block rather than making this one invalid. When the driver reported no
 * `tab_opened` for the opened tab, one is added.
 */
function holdOtherTabOpened(call, changes) {
    const tabId = openedTabId(call);
    if (tabId === undefined)
        return { keep: changes, held: [] };
    const keep = [];
    const held = [];
    for (const change of changes) {
        if (change.type === 'tab_opened' && change.tab_id !== tabId)
            held.push(change);
        else
            keep.push(change);
    }
    if (!keep.some((change) => change.type === 'tab_opened'))
        keep.push({ type: 'tab_opened', tab_id: tabId });
    return { keep, held };
}
/** What the model reads when `new_tab` succeeded but the report does not have the opened tab as its only active tab. */
const NEW_TAB_NOT_ACTIVE_LINE = 'new_tab opened a tab, but the browser does not report it as the only active tab. Call list_tabs to see the tabs.';
/**
 * Which tab a call is about: the tab it names by `tab_id`, else the active tab.
 * `undefined` when the named tab is not in the report (or nothing is active).
 */
function targetTab(tabs, tabId) {
    return tabs.find((tab) => (tabId !== undefined ? tab.tab_id === tabId : tab.active === true));
}
var PipelineState = /* @__PURE__ */ (() => {
    /** Per-toolset bookkeeping kept across calls. */
    class PipelineState {
        constructor() {
            _PipelineState_instances.add(this);
            /**
             * State changes a call drained but could not send: a failed call's, or another tab's `tab_opened` held back from a
             * `new_tab` result. They go out with the next block that can hold them.
             */
            this.pendingChanges = [];
            /** A refused-navigation line that could not be attached yet (the result was state-only). */
            this.refusalPending = false;
            /** Dismissed dialogs whose lines could not be attached yet (the result was state-only). */
            this.dialogsPending = [];
            /**
             * The tab inventory of the most recent report: what `confirm` receives.
             * `undefined` before the first report (a report may list no tabs).
             */
            this.lastTabs = undefined;
        }
        /**
         * Render the call's outcome with the browser state the driver just reported.
         *
         * On success the content is the member's rendering plus the `browser_state` block (with any changes
         * held back earlier). On failure, and for a `new_tab` whose tab the report does not show as the only active tab,
         * the changes are held back for the next block, because an error result cannot include one, and the content is
         * the error text plus any refused-navigation and dismissed-dialog lines, since those are often why the member
         * failed.
         */
        async finish(call, report, filePolicy) {
            this.lastTabs = report.tabs;
            const refused = report.navigationRefused || this.refusalPending;
            const dialogs = [...this.dialogsPending, ...report.dialogs];
            const changes = (0, render_1.coalesceChanges)(this.pendingChanges, report);
            // Held first: should rendering stop the run (a ToolsetUsageError out of the file policy), the
            // drained changes are still on hand rather than lost with this call.
            this.pendingChanges = changes;
            const openedId = call.error === undefined ? openedTabId(call) : undefined;
            const activeIds = report.tabs.filter((tab) => tab.active === true).map((tab) => tab.tab_id);
            if (openedId !== undefined && (activeIds.length !== 1 || activeIds[0] !== openedId)) {
                // The API refuses a non-error new_tab result unless the tab it opened is its only active tab.
                return {
                    content: [(0, render_1.text)(NEW_TAB_NOT_ACTIVE_LINE), ...tslib_1.__classPrivateFieldGet(this, _PipelineState_instances, "m", _PipelineState_takeNotices).call(this, refused, dialogs)],
                    isError: true,
                };
            }
            if (call.error === undefined) {
                const content = (0, render_1.renderResult)(call.member, call.input, call.result);
                const { keep, held } = holdOtherTabOpened(call, changes);
                const block = await (0, render_1.renderBrowserState)(report.tabs, keep, filePolicy);
                this.pendingChanges = held;
                if (registry_1.STATE_ONLY_MEMBERS.has(call.member.name)) {
                    // A block-only result has no text, so the lines wait for the next result that can hold them.
                    this.refusalPending = refused;
                    this.dialogsPending = dialogs;
                    return { content: [block], isError: false };
                }
                content.push(...tslib_1.__classPrivateFieldGet(this, _PipelineState_instances, "m", _PipelineState_takeNotices).call(this, refused, dialogs), block);
                return { content, isError: false };
            }
            return { content: [...(0, core_1.errorContent)(call.error), ...tslib_1.__classPrivateFieldGet(this, _PipelineState_instances, "m", _PipelineState_takeNotices).call(this, refused, dialogs)], isError: true };
        }
    }
    _PipelineState_instances = new WeakSet(), _PipelineState_takeNotices = function _PipelineState_takeNotices(refused, dialogs) {
        this.refusalPending = false;
        this.dialogsPending = [];
        return [...(refused ? [render_1.NAVIGATION_REFUSED_LINE] : []), ...(0, render_1.dialogLines)(dialogs)].map(render_1.text);
    };
    return PipelineState;
})();
exports.PipelineState = PipelineState;
// --- URL and file policy enforcement -----------------------------------------------------------------
/**
 * `error` with each text block cut to the API's field limit, or the same object when nothing was cut: a driver's
 * exception can embed a page-sized payload.
 */
function boundedError(error) {
    const content = (0, core_1.errorContent)(error);
    const bounded = content.map((block) => ({ ...block, text: (0, sanitize_1.cutPoints)(block.text, sanitize_1.FIELD_MAX) }));
    if (bounded.every((block, i) => block.text === content[i].text))
        return error;
    return new ToolError_1.ToolError(bounded);
}
exports.HISTORY_NAVIGATION = new Set(['back', 'forward', 'reload']);
function urlContext(record) {
    return { member: record.member.name, tabId: record.tabId, toolUseId: record.toolUseId };
}
/**
 * The `url` of a `navigate` call exactly as the model wrote it, for the URL policy. `undefined` for the history words
 * `back` / `forward` / `reload` (the driver receives the canonical lower-case word) and for other members.
 */
function navigateRequestURL(record) {
    if (record.member?.name !== 'navigate' || record.input === undefined)
        return undefined;
    const input = record.input;
    // the URL policy is promised a string
    if (typeof input.url !== 'string')
        throw new errors_1.InvalidMemberInputError(record.member.name, registry_1.FAMILY, 'url: expected a string');
    const word = input.url.trim().toLowerCase();
    if (exports.HISTORY_NAVIGATION.has(word)) {
        input.url = word;
        return undefined;
    }
    return input.url;
}
/**
 * A policy that threw refused the URL. A ToolError contains the text the model should read. Any other exception's
 * message may contain the URL it refused, so the model reads the SDK's own line instead. A TypeError out of your policy
 * is a refusal like any other exception, not a `ToolsetUsageError`.
 */
function policyRefusal(error) {
    if (error instanceof errors_1.ToolsetUsageError)
        throw error;
    if (error instanceof ToolError_1.ToolError)
        return error;
    return new errors_1.URLRefusedError('refused by the URL policy');
}
/**
 * For `file_upload`: run `input.paths` and `input.document_ids` through the file policy before dispatch. Without a
 * file policy, an upload that names either is refused. In `ctx.input`, `confirm` gets the paths and document ids the
 * policy returned. The member gets them in `input`. A refused path or document stops the call before `confirm` or the
 * member runs. `browserState` still runs after a refusal. Its `ctx.toolUse.input` is the input as the model sent it.
 * That input includes the refused entries.
 */
async function resolveUploadPaths(record, filePolicy) {
    if (record.member?.name !== 'file_upload' || record.input === undefined)
        return;
    const input = record.input;
    const ctx = urlContext(record);
    if (!nothingToVet(input.paths)) {
        input.paths = await vetUpload(filePolicy, ctx, input.paths, 'resolveUploadPaths', errors_1.NO_UPLOAD_ROOTS);
    }
    if (!nothingToVet(input.document_ids)) {
        input.document_ids = await vetUpload(filePolicy, ctx, input.document_ids, 'resolveUploadDocuments', 'file_upload has no configured document allowlist');
    }
}
/** Only an absent value or an empty array skips the file policy, so a value that is not a list can't get past it. */
function nothingToVet(value) {
    return value == null || (Array.isArray(value) && value.length === 0);
}
async function vetUpload(filePolicy, ctx, given, hook, missing) {
    const field = hook === 'resolveUploadPaths' ? 'paths' : 'document_ids';
    if (!Array.isArray(given) || given.some((entry) => typeof entry !== 'string'))
        throw new errors_1.InvalidMemberInputError('file_upload', registry_1.FAMILY, `${field}: expected a list of strings`);
    if (filePolicy === undefined)
        throw new errors_1.UploadRefusedError(missing);
    try {
        // a copy, so what `confirm` and the driver receive is not the policy's own array
        return [...(await filePolicy[hook](ctx, given))];
    }
    catch (error) {
        // The hook rule: a ToolsetUsageError stops the run, a ToolError is the policy's own refusal, and
        // anything else fails closed as a refusal the model reads. The upload never reaches the driver.
        if (error instanceof errors_1.ToolsetUsageError || error instanceof ToolError_1.ToolError)
            throw error;
        throw new errors_1.UploadRefusedError('the file policy could not vet the upload');
    }
}
// --- confirmation --------------------------------------------------------------------------------------
/**
 * What the `confirm` callable receives: the member and its input, and the tab the call targets (named, else active)
 * with its URL, as of the last report and with no page read.
 */
function confirmContext(record, pipeline) {
    const tab = targetTab(pipeline.lastTabs ?? [], record.tabId);
    // The URL as a `browser_state` block carries it: folded and bounded when the report was collected.
    return {
        ...record.ctx,
        member: record.member.name,
        input: record.input,
        tabId: tab === undefined ? record.tabId : tab.tab_id,
        tabURL: tab?.url,
    };
}
//# sourceMappingURL=pipeline.js.map