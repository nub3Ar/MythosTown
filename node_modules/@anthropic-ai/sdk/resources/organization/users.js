"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const resource_1 = require("../../core/resource.js");
const pagination_1 = require("../../core/pagination.js");
const tracing_1 = require("../../internal/tracing.js");
const path_1 = require("../../internal/utils/path.js");
class Users extends resource_1.APIResource {
    /**
     * Retrieve a member of the organization by user ID.
     *
     * @example
     * ```ts
     * const organizationUser =
     *   await client.organization.users.retrieve('user_id');
     * ```
     */
    retrieve(userID, options) {
        return this._client.get((0, path_1.path) `/v1/organizations/users/${userID}`, {
            ...options,
            __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.organization.users.retrieve', options, {
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
     * const organizationUser =
     *   await client.organization.users.update('user_id', {
     *     role: 'user',
     *   });
     * ```
     */
    update(userID, body, options) {
        return this._client.post((0, path_1.path) `/v1/organizations/users/${userID}`, {
            body,
            ...options,
            __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.organization.users.update', options, {
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
     * for await (const organizationUser of client.organization.users.list()) {
     *   // ...
     * }
     * ```
     */
    list(query = {}, options) {
        return this._client.getAPIList('/v1/organizations/users', (pagination_1.Page), {
            query,
            ...options,
            __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.organization.users.list', options, {
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
     * const user = await client.organization.users.remove(
     *   'user_id',
     * );
     * ```
     */
    remove(userID, options) {
        return this._client.delete((0, path_1.path) `/v1/organizations/users/${userID}`, {
            ...options,
            __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.organization.users.remove', options, {
                route: '/v1/organizations/users/{user_id}',
                attributes: { 'anthropic.organization.user.id': userID },
            }),
        });
    }
}
exports.Users = Users;
//# sourceMappingURL=users.js.map