import { APIResource } from "../../../core/resource.mjs";
import { buildHeaders } from "../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../internal/tracing.mjs";
import { path } from "../../../internal/utils/path.mjs";
export class ActionURLs extends APIResource {
    /**
     * Create Action URL
     *
     * @example
     * ```ts
     * const betaUserProfileActionURL =
     *   await client.beta.userProfiles.actionURLs.create(
     *     'uprof_011CZkZCu8hGbp5mYRQgUmz9',
     *     { action: { type: 'enroll_end_user' } },
     *   );
     * ```
     */
    create(userProfileID, params, options) {
        const { betas, workspace_id, ...body } = params;
        return this._client.post(path `/v1/user_profiles/${userProfileID}/action_urls`, {
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
            __span: startApiCallSpan(this._client, 'anthropic.user_profiles.action_urls.create', options, {
                route: '/v1/user_profiles/{user_profile_id}/action_urls',
                attributes: { 'anthropic.user_profile.id': userProfileID },
            }),
        });
    }
}
//# sourceMappingURL=action-urls.mjs.map