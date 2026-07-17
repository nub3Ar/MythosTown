import { APIResource } from "../../../core/resource.mjs";
import { Page } from "../../../core/pagination.mjs";
import { startApiCallSpan } from "../../../internal/tracing.mjs";
import { path } from "../../../internal/utils/path.mjs";
export class Users extends APIResource {
    /**
     * Retrieve a member of the organization by user ID.
     *
     * @example
     * ```ts
     * const betaOrganizationUser =
     *   await client.beta.organization.users.retrieve('user_id');
     * ```
     */
    retrieve(userID, options) {
        return this._client.get(path `/v1/organizations/users/${userID}`, {
            ...options,
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.organization.users.retrieve', options, {
                route: '/v1/organizations/users/{user_id}',
                attributes: { 'anthropic.organization.user.id': userID },
            }),
        });
    }
    /**
     * Update a member's organization role.
     *
     * @example
     * ```ts
     * const betaOrganizationUser =
     *   await client.beta.organization.users.update('user_id', {
     *     role: 'user',
     *   });
     * ```
     */
    update(userID, body, options) {
        return this._client.post(path `/v1/organizations/users/${userID}`, {
            body,
            ...options,
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.organization.users.update', options, {
                route: '/v1/organizations/users/{user_id}',
                attributes: { 'anthropic.organization.user.id': userID },
            }),
        });
    }
    /**
     * List the organization's members.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const betaOrganizationUser of client.beta.organization.users.list()) {
     *   // ...
     * }
     * ```
     */
    list(query = {}, options) {
        return this._client.getAPIList('/v1/organizations/users', (Page), {
            query,
            ...options,
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.organization.users.list', options, {
                route: '/v1/organizations/users',
                queryParams: ['after_id', 'before_id', 'email', 'limit', 'roles'],
            }),
        });
    }
    /**
     * Remove a member from the organization.
     *
     * @example
     * ```ts
     * const user = await client.beta.organization.users.remove(
     *   'user_id',
     * );
     * ```
     */
    remove(userID, options) {
        return this._client.delete(path `/v1/organizations/users/${userID}`, {
            ...options,
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.organization.users.remove', options, {
                route: '/v1/organizations/users/{user_id}',
                attributes: { 'anthropic.organization.user.id': userID },
            }),
        });
    }
}
//# sourceMappingURL=users.mjs.map