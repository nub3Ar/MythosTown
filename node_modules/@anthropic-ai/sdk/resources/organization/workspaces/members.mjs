import { APIResource } from "../../../core/resource.mjs";
import { Page } from "../../../core/pagination.mjs";
import { startApiCallSpan } from "../../../internal/tracing.mjs";
import { path } from "../../../internal/utils/path.mjs";
export class Members extends APIResource {
    /**
     * Get Workspace Member
     *
     * @example
     * ```ts
     * const workspaceMember =
     *   await client.organization.workspaces.members.retrieve(
     *     'user_id',
     *     { workspace_id: 'workspace_id' },
     *   );
     * ```
     */
    retrieve(userID, params, options) {
        const { workspace_id } = params;
        return this._client.get(path `/v1/organizations/workspaces/${workspace_id}/members/${userID}`, {
            ...options,
            __span: startApiCallSpan(this._client, 'anthropic.organization.workspaces.members.retrieve', options, {
                route: '/v1/organizations/workspaces/{workspace_id}/members/{user_id}',
                attributes: {
                    'anthropic.organization.workspace.id': workspace_id,
                    'anthropic.organization.workspace.member.id': userID,
                },
            }),
        });
    }
    /**
     * Update Workspace Member
     *
     * @example
     * ```ts
     * const workspaceMember =
     *   await client.organization.workspaces.members.update(
     *     'user_id',
     *     {
     *       workspace_id: 'workspace_id',
     *       workspace_role: 'workspace_admin',
     *     },
     *   );
     * ```
     */
    update(userID, params, options) {
        const { workspace_id, ...body } = params;
        return this._client.post(path `/v1/organizations/workspaces/${workspace_id}/members/${userID}`, {
            body,
            ...options,
            __span: startApiCallSpan(this._client, 'anthropic.organization.workspaces.members.update', options, {
                route: '/v1/organizations/workspaces/{workspace_id}/members/{user_id}',
                attributes: {
                    'anthropic.organization.workspace.id': workspace_id,
                    'anthropic.organization.workspace.member.id': userID,
                },
            }),
        });
    }
    /**
     * List Workspace Members
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const workspaceMember of client.organization.workspaces.members.list(
     *   'workspace_id',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(workspaceID, query = {}, options) {
        return this._client.getAPIList(path `/v1/organizations/workspaces/${workspaceID}/members`, (Page), {
            query,
            ...options,
            __span: startApiCallSpan(this._client, 'anthropic.organization.workspaces.members.list', options, {
                route: '/v1/organizations/workspaces/{workspace_id}/members',
                queryParams: ['after_id', 'before_id', 'limit'],
                attributes: { 'anthropic.organization.workspace.id': workspaceID },
            }),
        });
    }
    /**
     * Create Workspace Member
     *
     * @example
     * ```ts
     * const workspaceMember =
     *   await client.organization.workspaces.members.add(
     *     'workspace_id',
     *     {
     *       user_id: 'user_01WCz1FkmYMm4gnmykNKUu3Q',
     *       workspace_role: 'workspace_admin',
     *     },
     *   );
     * ```
     */
    add(workspaceID, body, options) {
        return this._client.post(path `/v1/organizations/workspaces/${workspaceID}/members`, {
            body,
            ...options,
            __span: startApiCallSpan(this._client, 'anthropic.organization.workspaces.members.add', options, {
                route: '/v1/organizations/workspaces/{workspace_id}/members',
                attributes: { 'anthropic.organization.workspace.id': workspaceID },
                createdIDAttribute: 'anthropic.organization.workspace.member.id',
                createdIDField: 'user_id',
            }),
        });
    }
    /**
     * Delete Workspace Member
     *
     * @example
     * ```ts
     * const member =
     *   await client.organization.workspaces.members.remove(
     *     'user_id',
     *     { workspace_id: 'workspace_id' },
     *   );
     * ```
     */
    remove(userID, params, options) {
        const { workspace_id } = params;
        return this._client.delete(path `/v1/organizations/workspaces/${workspace_id}/members/${userID}`, {
            ...options,
            __span: startApiCallSpan(this._client, 'anthropic.organization.workspaces.members.remove', options, {
                route: '/v1/organizations/workspaces/{workspace_id}/members/{user_id}',
                attributes: {
                    'anthropic.organization.workspace.id': workspace_id,
                    'anthropic.organization.workspace.member.id': userID,
                },
            }),
        });
    }
}
//# sourceMappingURL=members.mjs.map