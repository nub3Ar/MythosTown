import { APIResource } from "../../../../core/resource.mjs";
import { PageCursor } from "../../../../core/pagination.mjs";
import { startApiCallSpan } from "../../../../internal/tracing.mjs";
export class Users extends APIResource {
    /**
     * Get per-user activity for a given day, with cursor-based pagination.
     *
     * Returns activity metrics for each user in the organization, sorted by email
     * address. Use `group_by[]` for per-RBAC-group aggregates, or `filter[]` to scope
     * results to specific members, groups, or a chat project. Available to
     * organizations on a Claude Enterprise plan. Requires an API key with the
     * `read:analytics` scope.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const betaAnalyticsUserActivity of client.beta.organization.analytics.users.list()) {
     *   // ...
     * }
     * ```
     */
    list(query = {}, options) {
        return this._client.getAPIList('/v1/organizations/analytics/users', (PageCursor), {
            query,
            ...options,
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.organization.analytics.users.list', options, {
                route: '/v1/organizations/analytics/users',
                queryParams: [
                    'date',
                    'ending_date',
                    'filter',
                    'group_by',
                    'limit',
                    'order',
                    'order_by',
                    'page',
                    'starting_date',
                ],
                contentQueryParams: ['page'],
            }),
        });
    }
}
//# sourceMappingURL=users.mjs.map