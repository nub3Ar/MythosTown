import { APIResource } from "../../../core/resource.mjs";
import * as MembersAPI from "./members.mjs";
import { Members, } from "./members.mjs";
import * as RateLimitsAPI from "./rate-limits.mjs";
import { RateLimits, } from "./rate-limits.mjs";
import * as ServiceAccountsAPI from "./service-accounts.mjs";
import { ServiceAccounts, } from "./service-accounts.mjs";
import { Page } from "../../../core/pagination.mjs";
import { startApiCallSpan } from "../../../internal/tracing.mjs";
import { path } from "../../../internal/utils/path.mjs";
export var Workspaces = /* @__PURE__ */ (() => {
    class Workspaces extends APIResource {
        constructor() {
            super(...arguments);
            this.rateLimits = new RateLimitsAPI.RateLimits(this._client);
            this.members = new MembersAPI.Members(this._client);
            this.serviceAccounts = new ServiceAccountsAPI.ServiceAccounts(this._client);
        }
        /**
         * Create Workspace
         *
         * @example
         * ```ts
         * const workspace =
         *   await client.organization.workspaces.create({
         *     name: 'x',
         *   });
         * ```
         */
        create(body, options) {
            return this._client.post('/v1/organizations/workspaces', {
                body,
                ...options,
                __span: startApiCallSpan(this._client, 'anthropic.organization.workspaces.create', options, {
                    route: '/v1/organizations/workspaces',
                    createdIDAttribute: 'anthropic.organization.workspace.id',
                }),
            });
        }
        /**
         * Get Workspace
         *
         * @example
         * ```ts
         * const workspace =
         *   await client.organization.workspaces.retrieve(
         *     'workspace_id',
         *   );
         * ```
         */
        retrieve(workspaceID, options) {
            return this._client.get(path `/v1/organizations/workspaces/${workspaceID}`, {
                ...options,
                __span: startApiCallSpan(this._client, 'anthropic.organization.workspaces.retrieve', options, {
                    route: '/v1/organizations/workspaces/{workspace_id}',
                    attributes: { 'anthropic.organization.workspace.id': workspaceID },
                }),
            });
        }
        /**
         * Update Workspace
         *
         * @example
         * ```ts
         * const workspace =
         *   await client.organization.workspaces.update(
         *     'workspace_id',
         *   );
         * ```
         */
        update(workspaceID, body, options) {
            return this._client.post(path `/v1/organizations/workspaces/${workspaceID}`, {
                body,
                ...options,
                __span: startApiCallSpan(this._client, 'anthropic.organization.workspaces.update', options, {
                    route: '/v1/organizations/workspaces/{workspace_id}',
                    attributes: { 'anthropic.organization.workspace.id': workspaceID },
                }),
            });
        }
        /**
         * List Workspaces
         *
         * @example
         * ```ts
         * // Automatically fetches more pages as needed.
         * for await (const workspace of client.organization.workspaces.list()) {
         *   // ...
         * }
         * ```
         */
        list(query = {}, options) {
            return this._client.getAPIList('/v1/organizations/workspaces', (Page), {
                query,
                ...options,
                __span: startApiCallSpan(this._client, 'anthropic.organization.workspaces.list', options, {
                    route: '/v1/organizations/workspaces',
                    queryParams: ['after_id', 'before_id', 'include_archived', 'include_default', 'limit'],
                }),
            });
        }
        /**
         * Archive Workspace
         *
         * @example
         * ```ts
         * const workspace =
         *   await client.organization.workspaces.archive(
         *     'workspace_id',
         *   );
         * ```
         */
        archive(workspaceID, options) {
            return this._client.post(path `/v1/organizations/workspaces/${workspaceID}/archive`, {
                ...options,
                __span: startApiCallSpan(this._client, 'anthropic.organization.workspaces.archive', options, {
                    route: '/v1/organizations/workspaces/{workspace_id}/archive',
                    attributes: { 'anthropic.organization.workspace.id': workspaceID },
                }),
            });
        }
    }
    Workspaces.RateLimits = RateLimits;
    Workspaces.Members = Members;
    Workspaces.ServiceAccounts = ServiceAccounts;
    return Workspaces;
})();
//# sourceMappingURL=workspaces.mjs.map