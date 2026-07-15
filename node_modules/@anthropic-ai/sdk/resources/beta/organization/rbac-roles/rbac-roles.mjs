import { APIResource } from "../../../../core/resource.mjs";
import * as PermissionsAPI from "./permissions.mjs";
import { Permissions, } from "./permissions.mjs";
import { PageCursor } from "../../../../core/pagination.mjs";
import { startApiCallSpan } from "../../../../internal/tracing.mjs";
import { path } from "../../../../internal/utils/path.mjs";
export var RBACRoles = /* @__PURE__ */ (() => {
    class RBACRoles extends APIResource {
        constructor() {
            super(...arguments);
            this.permissions = new PermissionsAPI.Permissions(this._client);
        }
        /**
         * Retrieve an RBAC Role by ID.
         *
         * The RBAC Roles API is available to Claude Enterprise organizations only.
         *
         * @example
         * ```ts
         * const betaRBACRole =
         *   await client.beta.organization.rbacRoles.retrieve(
         *     'rbac_role_id',
         *   );
         * ```
         */
        retrieve(rbacRoleID, options) {
            return this._client.get(path `/v1/organizations/rbac_roles/${rbacRoleID}`, {
                ...options,
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.organization.rbac_roles.retrieve', options, {
                    route: '/v1/organizations/rbac_roles/{rbac_role_id}',
                    attributes: { 'anthropic.organization.rbac_role.id': rbacRoleID },
                }),
            });
        }
        /**
         * List RBAC Roles in the organization.
         *
         * The RBAC Roles API is available to Claude Enterprise organizations only.
         *
         * @example
         * ```ts
         * // Automatically fetches more pages as needed.
         * for await (const betaRBACRole of client.beta.organization.rbacRoles.list()) {
         *   // ...
         * }
         * ```
         */
        list(query = {}, options) {
            return this._client.getAPIList('/v1/organizations/rbac_roles', (PageCursor), {
                query,
                ...options,
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.organization.rbac_roles.list', options, {
                    route: '/v1/organizations/rbac_roles',
                    queryParams: ['limit', 'page'],
                }),
            });
        }
    }
    RBACRoles.Permissions = Permissions;
    return RBACRoles;
})();
//# sourceMappingURL=rbac-roles.mjs.map