"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workspaces = void 0;
const resource_1 = require("../../../../core/resource.js");
const pagination_1 = require("../../../../core/pagination.js");
const tracing_1 = require("../../../../internal/tracing.js");
const path_1 = require("../../../../internal/utils/path.js");
class Workspaces extends resource_1.APIResource {
    /**
     * **Requires an OAuth access token with the `org:admin` scope**, from
     * `ant auth login --scope org:admin` or a workload identity federation rule; Admin
     * API keys are not accepted. See
     * [Manage WIF with the Admin API](/docs/en/manage-claude/wif-admin-api).
     *
     * List workspaces where this federation rule is enabled.
     *
     * Returns all workspace enablements in a single response; the `limit` and `page`
     * parameters are accepted but have no effect, and `next_page` is always `null`.
     * Returns explicit per-workspace enablements only; for rules with
     * `applies_to_all_workspaces` or a legacy single `workspace_id`, check those
     * fields on the rule itself.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const federationRuleWorkspace of client.organization.federation.rules.workspaces.list(
     *   'federation_rule_id',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(federationRuleID, query = {}, options) {
        return this._client.getAPIList((0, path_1.path) `/v1/organizations/federation_rules/${federationRuleID}/workspaces`, (pagination_1.PageCursor), {
            query,
            ...options,
            __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.organization.federation.rules.workspaces.list', options, {
                route: '/v1/organizations/federation_rules/{federation_rule_id}/workspaces',
                queryParams: ['limit', 'page'],
                attributes: { 'anthropic.organization.federation_rule.id': federationRuleID },
            }),
        });
    }
    /**
     * **Requires an OAuth access token with the `org:admin` scope**, from
     * `ant auth login --scope org:admin` or a workload identity federation rule; Admin
     * API keys are not accepted. See
     * [Manage WIF with the Admin API](/docs/en/manage-claude/wif-admin-api).
     *
     * Enable a federation rule for a workspace.
     *
     * Idempotent; re-enabling returns the existing enablement. The rule and workspace
     * must both belong to your organization. Membership of the rule's target service
     * account in this workspace is not checked at enablement: token exchange into this
     * workspace is rejected unless the target is a member (it is implicitly a member
     * of the default workspace). Archived rules are rejected with 400. OAuth callers
     * may only manage rules whose `oauth_scope` is `workspace:developer` or
     * `workspace:inference`; other scopes require a Console session.
     *
     * @example
     * ```ts
     * const federationRuleWorkspace =
     *   await client.organization.federation.rules.workspaces.add(
     *     'federation_rule_id',
     *     { workspace_id: 'workspace_id' },
     *   );
     * ```
     */
    add(federationRuleID, body, options) {
        return this._client.post((0, path_1.path) `/v1/organizations/federation_rules/${federationRuleID}/workspaces`, {
            body,
            ...options,
            __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.organization.federation.rules.workspaces.add', options, {
                route: '/v1/organizations/federation_rules/{federation_rule_id}/workspaces',
                attributes: { 'anthropic.organization.federation_rule.id': federationRuleID },
                createdIDAttribute: 'anthropic.organization.federation_rule.workspace.id',
                createdIDField: 'workspace_id',
            }),
        });
    }
    /**
     * **Requires an OAuth access token with the `org:admin` scope**, from
     * `ant auth login --scope org:admin` or a workload identity federation rule; Admin
     * API keys are not accepted. See
     * [Manage WIF with the Admin API](/docs/en/manage-claude/wif-admin-api).
     *
     * Disable a federation rule for a workspace.
     *
     * Idempotent; succeeds even if the enablement was already removed. OAuth callers
     * may only manage rules whose `oauth_scope` is `workspace:developer` or
     * `workspace:inference`; other scopes require a Console session.
     *
     * @example
     * ```ts
     * const workspace =
     *   await client.organization.federation.rules.workspaces.remove(
     *     'workspace_id',
     *     { federation_rule_id: 'federation_rule_id' },
     *   );
     * ```
     */
    remove(workspaceID, params, options) {
        const { federation_rule_id } = params;
        return this._client.delete((0, path_1.path) `/v1/organizations/federation_rules/${federation_rule_id}/workspaces/${workspaceID}`, {
            ...options,
            __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.organization.federation.rules.workspaces.remove', options, {
                route: '/v1/organizations/federation_rules/{federation_rule_id}/workspaces/{workspace_id}',
                attributes: {
                    'anthropic.organization.federation_rule.id': federation_rule_id,
                    'anthropic.organization.federation_rule.workspace.id': workspaceID,
                },
            }),
        });
    }
}
exports.Workspaces = Workspaces;
//# sourceMappingURL=workspaces.js.map