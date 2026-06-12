"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workspaces = void 0;
const resource_1 = require("../../../core/resource.js");
const pagination_1 = require("../../../core/pagination.js");
const tracing_1 = require("../../../internal/tracing.js");
const path_1 = require("../../../internal/utils/path.js");
class Workspaces extends resource_1.APIResource {
    /**
     * **Requires an OAuth access token with the `org:admin` scope**, from
     * `ant auth login --scope org:admin` or a workload identity federation rule; Admin
     * API keys are not accepted. See
     * [Manage WIF with the Admin API](/docs/en/manage-claude/wif-admin-api).
     *
     * List the workspaces a service account is a member of.
     *
     * Each entry includes the service account's `workspace_role` in that workspace.
     * Use `limit` and the `next_page` cursor to paginate. When the service account has
     * no explicit default-workspace membership, the implicit (`implicit: true`)
     * membership is returned as the first entry on the first page; with `limit=1` the
     * first page may return up to 2 entries (the implicit entry plus one explicit
     * membership) so a pagination cursor can be derived. Memberships are returned only
     * while the service account is active. Without a `page` cursor, an archived
     * service account returns an empty list. A `page` cursor that does not match an
     * active membership returns a 400 invalid-request error. A cursor stops matching
     * when the membership is removed, the workspace is deleted, or the service account
     * is archived. Restart pagination from the first page to recover.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const serviceAccountWorkspaceMember of client.organization.serviceAccounts.workspaces.list(
     *   'service_account_id',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(serviceAccountID, query = {}, options) {
        return this._client.getAPIList((0, path_1.path) `/v1/organizations/service_accounts/${serviceAccountID}/workspaces`, (pagination_1.PageCursor), {
            query,
            ...options,
            __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.organization.service_accounts.workspaces.list', options, {
                route: '/v1/organizations/service_accounts/{service_account_id}/workspaces',
                queryParams: ['limit', 'page'],
                attributes: { 'anthropic.organization.service_account.id': serviceAccountID },
            }),
        });
    }
    /**
     * **Requires an OAuth access token with the `org:admin` scope**, from
     * `ant auth login --scope org:admin` or a workload identity federation rule; Admin
     * API keys are not accepted. See
     * [Manage WIF with the Admin API](/docs/en/manage-claude/wif-admin-api).
     *
     * Add a service account to a workspace with the given `workspace_role`.
     *
     * Mirror of `POST /workspaces/{workspace_id}/service_accounts`, addressed from the
     * service-account side; both create the same membership. If the service account is
     * already an explicit member of the workspace, its `workspace_role` is replaced
     * with the value supplied here. Archived workspaces return 400. Archived service
     * accounts cannot be added and are rejected.
     *
     * @example
     * ```ts
     * const serviceAccountWorkspaceMember =
     *   await client.organization.serviceAccounts.workspaces.add(
     *     'service_account_id',
     *     {
     *       workspace_id: 'workspace_id',
     *       workspace_role: 'workspace_admin',
     *     },
     *   );
     * ```
     */
    add(serviceAccountID, body, options) {
        return this._client.post((0, path_1.path) `/v1/organizations/service_accounts/${serviceAccountID}/workspaces`, {
            body,
            ...options,
            __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.organization.service_accounts.workspaces.add', options, {
                route: '/v1/organizations/service_accounts/{service_account_id}/workspaces',
                attributes: { 'anthropic.organization.service_account.id': serviceAccountID },
                createdIDAttribute: 'anthropic.organization.service_account.workspace.id',
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
     * Remove a service account from a workspace.
     *
     * Mirror of
     * `DELETE /workspaces/{workspace_id}/service_accounts/{service_account_id}`,
     * addressed from the service-account side. Removal is idempotent (returns 200 even
     * if the membership was already removed). A DELETE against the implicit
     * default-workspace membership returns 200 but is a no-op and the membership
     * persists; deleting an explicit default-workspace row reverts to the implicit
     * `workspace_user` membership. Archived workspaces return 400.
     *
     * @example
     * ```ts
     * const workspace =
     *   await client.organization.serviceAccounts.workspaces.remove(
     *     'workspace_id',
     *     { service_account_id: 'service_account_id' },
     *   );
     * ```
     */
    remove(workspaceID, params, options) {
        const { service_account_id } = params;
        return this._client.delete((0, path_1.path) `/v1/organizations/service_accounts/${service_account_id}/workspaces/${workspaceID}`, {
            ...options,
            __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.organization.service_accounts.workspaces.remove', options, {
                route: '/v1/organizations/service_accounts/{service_account_id}/workspaces/{workspace_id}',
                attributes: {
                    'anthropic.organization.service_account.id': service_account_id,
                    'anthropic.organization.service_account.workspace.id': workspaceID,
                },
            }),
        });
    }
}
exports.Workspaces = Workspaces;
//# sourceMappingURL=workspaces.js.map