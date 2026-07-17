import { APIResource } from "../../../core/resource.mjs";
import * as ActionURLsAPI from "./action-urls.mjs";
import { ActionURLs, } from "./action-urls.mjs";
import { PageCursor } from "../../../core/pagination.mjs";
import { buildHeaders } from "../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../internal/tracing.mjs";
import { path } from "../../../internal/utils/path.mjs";
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
         * const betaUserProfile =
         *   await client.beta.userProfiles.create();
         * ```
         */
        create(params, options) {
            const { betas, workspace_id, ...body } = params;
            return this._client.post('/v1/user_profiles', {
                body,
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'user-profiles-2026-08-18'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
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
         * const betaUserProfile =
         *   await client.beta.userProfiles.retrieve(
         *     'uprof_011CZkZCu8hGbp5mYRQgUmz9',
         *   );
         * ```
         */
        retrieve(userProfileID, params = {}, options) {
            const { betas, workspace_id } = params ?? {};
            return this._client.get(path `/v1/user_profiles/${userProfileID}`, {
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'user-profiles-2026-08-18'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
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
         * const betaUserProfile =
         *   await client.beta.userProfiles.update(
         *     'uprof_011CZkZCu8hGbp5mYRQgUmz9',
         *   );
         * ```
         */
        update(userProfileID, params, options) {
            const { betas, workspace_id, ...body } = params;
            return this._client.post(path `/v1/user_profiles/${userProfileID}`, {
                body,
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'user-profiles-2026-08-18'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
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
         * for await (const betaUserProfile of client.beta.userProfiles.list()) {
         *   // ...
         * }
         * ```
         */
        list(params = {}, options) {
            const { betas, workspace_id, ...query } = params ?? {};
            return this._client.getAPIList('/v1/user_profiles', (PageCursor), {
                query,
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'user-profiles-2026-08-18'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.user_profiles.list', options, {
                    route: '/v1/user_profiles',
                    queryParams: ['limit', 'order', 'order_by', 'page'],
                }),
            });
        }
        /**
         * Delete User Profile
         *
         * @example
         * ```ts
         * const betaDeletedUserProfile =
         *   await client.beta.userProfiles.delete(
         *     'uprof_011CZkZCu8hGbp5mYRQgUmz9',
         *   );
         * ```
         */
        delete(userProfileID, params = {}, options) {
            const { betas, workspace_id } = params ?? {};
            return this._client.delete(path `/v1/user_profiles/${userProfileID}`, {
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'user-profiles-2026-08-18'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.user_profiles.delete', options, {
                    route: '/v1/user_profiles/{user_profile_id}',
                    attributes: { 'anthropic.user_profile.id': userProfileID },
                }),
            });
        }
        /**
         * Create Enrollment URL
         *
         * @example
         * ```ts
         * const betaUserProfileEnrollmentURL =
         *   await client.beta.userProfiles.createEnrollmentURL(
         *     'uprof_011CZkZCu8hGbp5mYRQgUmz9',
         *   );
         * ```
         */
        createEnrollmentURL(userProfileID, params = {}, options) {
            const { betas, workspace_id } = params ?? {};
            return this._client.post(path `/v1/user_profiles/${userProfileID}/enrollment_url`, {
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'user-profiles-2026-08-18'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.user_profiles.create_enrollment_url', options, {
                    route: '/v1/user_profiles/{user_profile_id}/enrollment_url',
                    attributes: { 'anthropic.user_profile.id': userProfileID },
                }),
            });
        }
    }
    UserProfiles.ActionURLs = ActionURLs;
    return UserProfiles;
})();
//# sourceMappingURL=user-profiles.mjs.map