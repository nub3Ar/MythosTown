import { APIResource } from "../../../../core/resource.mjs";
import { PageCursor } from "../../../../core/pagination.mjs";
import { startApiCallSpan } from "../../../../internal/tracing.mjs";
export class Effective extends APIResource {
    /**
     * List each member's effective spend limit and period-to-date spend.
     *
     * Returns one row per (member, period) the member resolves a spend limit for, with
     * the `source` scope the spend limit was inherited from. Paginates by member, so a
     * member's periods never split across pages. Supported for Claude Enterprise
     * organizations only, not for Claude Console organizations.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const betaSpendSummary of client.beta.organization.spendLimits.effective.list()) {
     *   // ...
     * }
     * ```
     */
    list(query = {}, options) {
        return this._client.getAPIList('/v1/organizations/spend_limits/effective', (PageCursor), {
            query,
            ...options,
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.organization.spend_limits.effective.list', options, {
                route: '/v1/organizations/spend_limits/effective',
                queryParams: ['limit', 'page', 'period', 'user_ids'],
            }),
        });
    }
}
//# sourceMappingURL=effective.mjs.map