import { APIResource } from "../../../core/resource.mjs";
import { PageCursor } from "../../../core/pagination.mjs";
import { startApiCallSpan } from "../../../internal/tracing.mjs";
import { path } from "../../../internal/utils/path.mjs";
export class RateLimits extends APIResource {
    /**
     * Set or clear rate-limit overrides for one rate-limit group in a workspace.
     *
     * Only the limiter types named in `limits` change: an integer `value` sets that
     * type's override and `null` clears it. Types not named keep their current value.
     * A value above the organization's own limit is stored, but the organization limit
     * still applies, so the lower of the two is enforced.
     *
     * Returns the targeted group's entry with this request applied, in the shape
     * `GET /v1/organizations/workspaces/{workspace_id}/rate_limits` returns. Changes
     * take effect within about an hour.
     *
     * @example
     * ```ts
     * const workspaceRateLimit =
     *   await client.organization.workspaces.rateLimits.update(
     *     'rate_limit_id',
     *     {
     *       workspace_id: 'workspace_id',
     *       limits: [{ type: 'fast_itpmca', value: 0 }],
     *     },
     *   );
     * ```
     */
    update(rateLimitID, params, options) {
        const { workspace_id, ...body } = params;
        return this._client.post(path `/v1/organizations/workspaces/${workspace_id}/rate_limits/${rateLimitID}`, {
            body,
            ...options,
            __span: startApiCallSpan(this._client, 'anthropic.organization.workspaces.rate_limits.update', options, {
                route: '/v1/organizations/workspaces/{workspace_id}/rate_limits/{rate_limit_id}',
                attributes: {
                    'anthropic.organization.workspace.id': workspace_id,
                    'anthropic.organization.workspace.rate_limit.id': rateLimitID,
                },
            }),
        });
    }
    /**
     * List a workspace's rate limits.
     *
     * By default, returns only the groups and limiter types that have a
     * workspace-level override. With `include_inherited=true`, returns every group
     * with organization-level limits the workspace can see, listing for each the
     * values it inherits from the organization as well as its own overrides. Each
     * value's `source` says which it is.
     *
     * When `limit` is omitted, every matching entry is returned in a single page; when
     * `limit` truncates the result, follow `next_page` to fetch the remaining entries.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const workspaceRateLimit of client.organization.workspaces.rateLimits.list(
     *   'workspace_id',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(workspaceID, query = {}, options) {
        return this._client.getAPIList(path `/v1/organizations/workspaces/${workspaceID}/rate_limits`, (PageCursor), {
            query,
            ...options,
            __span: startApiCallSpan(this._client, 'anthropic.organization.workspaces.rate_limits.list', options, {
                route: '/v1/organizations/workspaces/{workspace_id}/rate_limits',
                queryParams: ['group_type', 'include_inherited', 'limit', 'page'],
                attributes: { 'anthropic.organization.workspace.id': workspaceID },
            }),
        });
    }
}
//# sourceMappingURL=rate-limits.mjs.map