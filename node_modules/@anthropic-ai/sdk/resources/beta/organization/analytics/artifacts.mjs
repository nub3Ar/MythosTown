import { APIResource } from "../../../../core/resource.mjs";
import { PageCursor } from "../../../../core/pagination.mjs";
import { startApiCallSpan } from "../../../../internal/tracing.mjs";
export class Artifacts extends APIResource {
    /**
     * Get artifact-creation activity for a given day, broken out by MIME type.
     *
     * Returns the full (`artifact_type`, `is_shared`) cube for the organization;
     * `next_page` is null except for grouped queries, which paginate. The cube can be
     * broken out per product, per member, or per RBAC group via `group_by[]`, and
     * scoped via `filter[]`. Requires an API key with the `read:analytics` scope.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const betaAnalyticsArtifactActivity of client.beta.organization.analytics.artifacts.list(
     *   { date: '2019-12-27' },
     * )) {
     *   // ...
     * }
     * ```
     */
    list(query, options) {
        return this._client.getAPIList('/v1/organizations/analytics/artifacts', (PageCursor), {
            query,
            ...options,
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.organization.analytics.artifacts.list', options, {
                route: '/v1/organizations/analytics/artifacts',
                queryParams: ['date', 'filter', 'group_by', 'limit', 'page'],
            }),
        });
    }
}
//# sourceMappingURL=artifacts.mjs.map