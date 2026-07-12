import { APIResource } from "../../../../core/resource.mjs";
import { ReportPageCursor } from "../../../../core/pagination.mjs";
import { buildHeaders } from "../../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../../internal/tracing.mjs";
export class Cost extends APIResource {
    /**
     * Get cost in USD across a date range, broken out by dimension.
     *
     * Returns one row per combination of the requested `group_by[]` dimensions (and
     * time bucket, when `time_bucket_width` is set) that has cost in the range, ranked
     * by spend or ordered by time bucket; every combination is returned across pages.
     * With no `group_by[]` and no `time_bucket_width`, a single row aggregates the
     * whole range. Includes all cost, whether or not it is attributable to a seat
     * user. Requires an API key with the `read:analytics` scope, or an Admin API key.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const betaAnalyticsCostItem of client.beta.organization.analytics.cost.list(
     *   { starting_at: '2026-09-01T00:00:00Z' },
     * )) {
     *   // ...
     * }
     * ```
     */
    list(params, options) {
        const { betas, ...query } = params;
        return this._client.getAPIList('/v1/organizations/analytics/cost', (ReportPageCursor), {
            query,
            ...options,
            headers: buildHeaders([
                { 'anthropic-beta': [...(betas ?? []), 'analytics-usage-cost-2026-08-24'].toString() },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.organization.analytics.cost.list', options, {
                route: '/v1/organizations/analytics/cost',
                queryParams: [
                    'actor_ids',
                    'actor_types',
                    'agent_ids',
                    'api_key_ids',
                    'claude_tag_categories',
                    'claude_tag_user_ids',
                    'context_windows',
                    'deployment_ids',
                    'ending_at',
                    'environment_ids',
                    'exclude_deleted_users',
                    'group_by',
                    'inference_geos',
                    'limit',
                    'models',
                    'order',
                    'order_by',
                    'page',
                    'products',
                    'rbac_group_ids',
                    'service_tiers',
                    'session_ids',
                    'slack_channel_ids',
                    'speeds',
                    'starting_at',
                    'time_bucket_width',
                    'user_profile_ids',
                    'workspace_ids',
                ],
            }),
        });
    }
}
//# sourceMappingURL=cost.mjs.map