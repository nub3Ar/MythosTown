import { APIResource } from "../../../../../../core/resource.mjs";
import { PageCursor } from "../../../../../../core/pagination.mjs";
import { startApiCallSpan } from "../../../../../../internal/tracing.mjs";
export class Projects extends APIResource {
    /**
     * Get per-project activity for a given day, with cursor-based pagination.
     *
     * Returns activity metrics for each project in the organization, sorted by project
     * ID. Use `group_by[]` to break projects out per member or per RBAC group, and
     * `filter[]` to scope results; the parameter descriptions list the supported
     * dimensions. Available to organizations on a Claude Enterprise plan. Requires an
     * API key with the `read:analytics` scope.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const betaAnalyticsProjectActivity of client.beta.organization.analytics.apps.chat.projects.list()) {
     *   // ...
     * }
     * ```
     */
    list(query = {}, options) {
        return this._client.getAPIList('/v1/organizations/analytics/apps/chat/projects', (PageCursor), {
            query,
            ...options,
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.organization.analytics.apps.chat.projects.list', options, {
                route: '/v1/organizations/analytics/apps/chat/projects',
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
            }),
        });
    }
}
//# sourceMappingURL=projects.mjs.map