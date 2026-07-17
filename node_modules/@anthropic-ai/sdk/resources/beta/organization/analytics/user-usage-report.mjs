import { APIResource } from "../../../../core/resource.mjs";
import { ReportPageCursor } from "../../../../core/pagination.mjs";
import { startApiCallSpan } from "../../../../internal/tracing.mjs";
export class UserUsageReport extends APIResource {
    /**
     * [Legacy] Get per-user token usage across a date range.
     *
     * Returns usage per user, ranked by the chosen token metric; `group_by[]` or
     * `bucket_width` splits a user across several rows. Use this to see which users
     * consume the most tokens. Only usage attributed to a user account is included;
     * usage with no user attributed to it, such as Code Review usage and Claude Tag
     * usage in Slack channels, is left out. Available to organizations on a Claude
     * Enterprise plan. Requires an API key with the `read:analytics` scope.
     *
     * This endpoint is one of the legacy Claude Enterprise usage and cost reports. For
     * new integrations, use
     * [`GET /v1/organizations/analytics/usage`](/docs/en/api/beta/organization/analytics/usage/list)
     * in the Usage and Cost Analytics API instead. To move an existing integration,
     * see
     * [Migrate from the Claude Enterprise usage and cost reports](/docs/en/manage-claude/usage-cost-analytics-api#migrate-from-enterprise-analytics-reports).
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const betaAnalyticsUsageUsersItem of client.beta.organization.analytics.userUsageReport.list(
     *   { starting_at: '2019-12-27T18:11:19.117Z' },
     * )) {
     *   // ...
     * }
     * ```
     */
    list(query, options) {
        return this._client.getAPIList('/v1/organizations/analytics/user_usage_report', (ReportPageCursor), {
            query,
            ...options,
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.organization.analytics.user_usage_report.list', options, {
                route: '/v1/organizations/analytics/user_usage_report',
                queryParams: [
                    'bucket_width',
                    'claude_tag_categories',
                    'claude_tag_user_ids',
                    'context_windows',
                    'ending_at',
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
                    'slack_channel_ids',
                    'speeds',
                    'starting_at',
                    'user_ids',
                ],
            }),
        });
    }
}
//# sourceMappingURL=user-usage-report.mjs.map