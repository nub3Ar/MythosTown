import { APIResource } from "../../../../core/resource.mjs";
import { PageCursor } from "../../../../core/pagination.mjs";
import { startApiCallSpan } from "../../../../internal/tracing.mjs";
export class Plugins extends APIResource {
    /**
     * Get per-plugin install + invocation usage for a given day, with pagination.
     *
     * Returns plugin usage metrics for the organization across Cowork and Claude Code,
     * sorted by plugin name. The `plugin_name` value `third-party` is an aggregate
     * bucket, not a plugin: it collects plugin activity, from either surface, for
     * which the reporting client did not provide a plugin name — so an organization's
     * own plugins can contribute both to their own named rows and to this bucket. Use
     * `group_by[]` to break usage out per member, per RBAC group, or per product
     * surface (Cowork / Claude Code), and `filter[]` to scope results; the parameter
     * descriptions list the supported dimensions. Requires an API key with the
     * `read:analytics` scope. `starting_date` / `ending_date` select range-rollup mode
     * like `/skills`.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const betaAnalyticsPluginActivity of client.beta.organization.analytics.plugins.list()) {
     *   // ...
     * }
     * ```
     */
    list(query = {}, options) {
        return this._client.getAPIList('/v1/organizations/analytics/plugins', (PageCursor), {
            query,
            ...options,
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.organization.analytics.plugins.list', options, {
                route: '/v1/organizations/analytics/plugins',
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
                contentQueryParams: ['filter'],
            }),
        });
    }
}
//# sourceMappingURL=plugins.mjs.map