import { APIResource } from "../../../../core/resource.mjs";
import { PageCursor } from "../../../../core/pagination.mjs";
import { startApiCallSpan } from "../../../../internal/tracing.mjs";
export class Summaries extends APIResource {
    /**
     * Get organization-wide activity summaries for a date range.
     *
     * Returns one entry per day from `starting_date` (inclusive) to `ending_date`
     * (exclusive) in `data`, the same `data` / `next_page` envelope as the other
     * analytics list endpoints; the series is currently returned in full, so
     * `next_page` is always null. Data is typically available with a 1-day lag and may
     * be revised by a few percent over the following days: when `ending_date` is
     * omitted it defaults to the most recent available day + 1, so the last entry
     * covers the most recent available day. The series can be scoped to an RBAC group
     * via `filter[]=rbac_group_id:{id}`. Available to organizations on a Claude
     * Enterprise plan. Requires an API key with the `read:analytics` scope.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const betaAnalyticsSingleDayActivitySummary of client.beta.organization.analytics.summaries.list(
     *   { starting_date: '2019-12-27' },
     * )) {
     *   // ...
     * }
     * ```
     */
    list(query, options) {
        return this._client.getAPIList('/v1/organizations/analytics/summaries', (PageCursor), {
            query,
            ...options,
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.organization.analytics.summaries.list', options, {
                route: '/v1/organizations/analytics/summaries',
                queryParams: ['ending_date', 'filter', 'limit', 'page', 'starting_date'],
            }),
        });
    }
}
//# sourceMappingURL=summaries.mjs.map