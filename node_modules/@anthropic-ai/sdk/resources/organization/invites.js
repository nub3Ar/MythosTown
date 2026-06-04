"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invites = void 0;
const resource_1 = require("../../core/resource.js");
const pagination_1 = require("../../core/pagination.js");
const tracing_1 = require("../../internal/tracing.js");
const path_1 = require("../../internal/utils/path.js");
class Invites extends resource_1.APIResource {
    /**
     * Invite a user to join the organization by email.
     *
     * On plans that draw members from a finite pool of purchased seats, the invite
     * automatically consumes a seat from the lowest tier with availability; there is
     * no seat-tier parameter. When no seat is free the request fails with a 400 error
     * rather than purchasing a seat.
     *
     * @example
     * ```ts
     * const organizationInvite =
     *   await client.organization.invites.create({
     *     email: 'user@emaildomain.com',
     *     role: 'user',
     *   });
     * ```
     */
    create(body, options) {
        return this._client.post('/v1/organizations/invites', {
            body,
            ...options,
            __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.organization.invites.create', options, {
                route: '/v1/organizations/invites',
                createdIDAttribute: 'anthropic.organization.invite.id',
            }),
        });
    }
    /**
     * Retrieve an invite by ID.
     *
     * @example
     * ```ts
     * const organizationInvite =
     *   await client.organization.invites.retrieve('invite_id');
     * ```
     */
    retrieve(inviteID, options) {
        return this._client.get((0, path_1.path) `/v1/organizations/invites/${inviteID}`, {
            ...options,
            __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.organization.invites.retrieve', options, {
                route: '/v1/organizations/invites/{invite_id}',
                attributes: { 'anthropic.organization.invite.id': inviteID },
            }),
        });
    }
    /**
     * List the organization's invites.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const organizationInvite of client.organization.invites.list()) {
     *   // ...
     * }
     * ```
     */
    list(query = {}, options) {
        return this._client.getAPIList('/v1/organizations/invites', (pagination_1.Page), {
            query,
            ...options,
            __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.organization.invites.list', options, {
                route: '/v1/organizations/invites',
                queryParams: ['after_id', 'before_id', 'email', 'limit', 'roles', 'statuses'],
            }),
        });
    }
    /**
     * Delete a pending invite.
     *
     * @example
     * ```ts
     * const invite = await client.organization.invites.delete(
     *   'invite_id',
     * );
     * ```
     */
    delete(inviteID, options) {
        return this._client.delete((0, path_1.path) `/v1/organizations/invites/${inviteID}`, {
            ...options,
            __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.organization.invites.delete', options, {
                route: '/v1/organizations/invites/{invite_id}',
                attributes: { 'anthropic.organization.invite.id': inviteID },
            }),
        });
    }
}
exports.Invites = Invites;
//# sourceMappingURL=invites.js.map