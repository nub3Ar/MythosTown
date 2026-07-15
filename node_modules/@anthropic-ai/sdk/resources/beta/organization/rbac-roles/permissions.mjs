import { APIResource } from "../../../../core/resource.mjs";
import { PageCursor } from "../../../../core/pagination.mjs";
import { startApiCallSpan } from "../../../../internal/tracing.mjs";
import { path } from "../../../../internal/utils/path.mjs";
export class Permissions extends APIResource {
    /**
     * List the permissions an RBAC Role grants.
     *
     * The RBAC Roles API is available to Claude Enterprise organizations only.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const betaRBACRolePermission of client.beta.organization.rbacRoles.permissions.list(
     *   'rbac_role_id',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(rbacRoleID, query = {}, options) {
        return this._client.getAPIList(path `/v1/organizations/rbac_roles/${rbacRoleID}/permissions`, (PageCursor), {
            query,
            ...options,
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.organization.rbac_roles.permissions.list', options, {
                route: '/v1/organizations/rbac_roles/{rbac_role_id}/permissions',
                queryParams: ['limit', 'page'],
                attributes: { 'anthropic.organization.rbac_role.id': rbacRoleID },
            }),
        });
    }
}
//# sourceMappingURL=permissions.mjs.map