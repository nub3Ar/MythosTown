import { APIResource } from "../../core/resource.mjs";
import * as ActionURLsAPI from "./action-urls.mjs";
import { ActionURLs, } from "./action-urls.mjs";
import { PageCursor } from "../../core/pagination.mjs";
import { buildHeaders } from "../../internal/headers.mjs";
import { startApiCallSpan } from "../../internal/tracing.mjs";
import { path } from "../../internal/utils/path.mjs";
export var UserProfiles = /* @__PURE__ */ (() => {
    class UserProfiles extends APIResource {
        constructor() {
            super(...arguments);
            this.actionURLs = new ActionURLsAPI.ActionURLs(this._client);
        }
        /**
         * Create User Profile
         *
         * @example
         * ```ts
         * const userProfile = await client.userProfiles.create();
         * ```
         */
        create(params, options) {
            const { workspace_id, ...body } = params;
            return this._client.post('/v1/user_profiles', {
                body,
                ...options,
                headers: buildHeaders([
                    { ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined) },
                    options?.headers,
                ]),
                __span: startApiCallSpan(this._client, 'anthropic.user_profiles.create', options, {
                    route: '/v1/user_profiles',
                    createdIDAttribute: 'anthropic.user_profile.id',
                }),
            });
        }
        /**
         * Get User Profile
         *
         * @example
         * ```ts
         * const userProfile = await client.userProfiles.retrieve(
         *   'uprof_011CZkZCu8hGbp5mYRQgUmz9',
         * );
         * ```
         */
        retrieve(userProfileID, params = {}, options) {
            const { workspace_id } = params ?? {};
            return this._client.get(path `/v1/user_profiles/${userProfileID}`, {
                ...options,
                headers: buildHeaders([
                    { ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined) },
                    options?.headers,
                ]),
                __span: startApiCallSpan(this._client, 'anthropic.user_profiles.retrieve', options, {
                    route: '/v1/user_profiles/{user_profile_id}',
                    attributes: { 'anthropic.user_profile.id': userProfileID },
                }),
            });
        }
        /**
         * Update User Profile
         *
         * @example
         * ```ts
         * const userProfile = await client.userProfiles.update(
         *   'uprof_011CZkZCu8hGbp5mYRQgUmz9',
         * );
         * ```
         */
        update(userProfileID, params, options) {
            const { workspace_id, ...body } = params;
            return this._client.post(path `/v1/user_profiles/${userProfileID}`, {
                body,
                ...options,
                headers: buildHeaders([
                    { ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined) },
                    options?.headers,
                ]),
                __span: startApiCallSpan(this._client, 'anthropic.user_profiles.update', options, {
                    route: '/v1/user_profiles/{user_profile_id}',
                    attributes: { 'anthropic.user_profile.id': userProfileID },
                }),
            });
        }
        /**
         * List User Profiles
         *
         * @example
         * ```ts
         * // Automatically fetches more pages as needed.
         * for await (const userProfile of client.userProfiles.list()) {
         *   // ...
         * }
         * ```
         */
        list(params = {}, options) {
            const { workspace_id, ...query } = params ?? {};
            return this._client.getAPIList('/v1/user_profiles', (PageCursor), {
                query,
                ...options,
                headers: buildHeaders([
                    { ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined) },
                    options?.headers,
                ]),
                __span: startApiCallSpan(this._client, 'anthropic.user_profiles.list', options, {
                    route: '/v1/user_profiles',
                    queryParams: ['enforcement_status', 'limit', 'order', 'order_by', 'page'],
                }),
            });
        }
        /**
         * Delete User Profile
         *
         * @example
         * ```ts
         * const deletedUserProfile = await client.userProfiles.delete(
         *   'uprof_011CZkZCu8hGbp5mYRQgUmz9',
         * );
         * ```
         */
        delete(userProfileID, params = {}, options) {
            const { workspace_id } = params ?? {};
            return this._client.delete(path `/v1/user_profiles/${userProfileID}`, {
                ...options,
                headers: buildHeaders([
                    { ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined) },
                    options?.headers,
                ]),
                __span: startApiCallSpan(this._client, 'anthropic.user_profiles.delete', options, {
                    route: '/v1/user_profiles/{user_profile_id}',
                    attributes: { 'anthropic.user_profile.id': userProfileID },
                }),
            });
        }
    }
    UserProfiles.ActionURLs = ActionURLs;
    return UserProfiles;
})();
//# sourceMappingURL=user-profiles.mjs.map