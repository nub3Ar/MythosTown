import { APIResource } from "../../../../core/resource.mjs";
import * as EffectiveAPI from "./effective.mjs";
import { Effective } from "./effective.mjs";
import * as IncreaseRequestsAPI from "./increase-requests.mjs";
import { IncreaseRequests, } from "./increase-requests.mjs";
import { PageCursor } from "../../../../core/pagination.mjs";
import { buildHeaders } from "../../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../../internal/tracing.mjs";
import { path } from "../../../../internal/utils/path.mjs";
export var SpendLimits = /* @__PURE__ */ (() => {
    class SpendLimits extends APIResource {
        constructor() {
            super(...arguments);
            this.effective = new EffectiveAPI.Effective(this._client);
            this.increaseRequests = new IncreaseRequestsAPI.IncreaseRequests(this._client);
        }
        /**
         * Retrieve a spend limit by ID.
         *
         * @example
         * ```ts
         * const betaSpendLimit =
         *   await client.beta.organization.spendLimits.retrieve(
         *     'spend_limit_id',
         *   );
         * ```
         */
        retrieve(spendLimitID, options) {
            return this._client.get(path `/v1/organizations/spend_limits/${spendLimitID}`, {
                ...options,
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.organization.spend_limits.retrieve', options, {
                    route: '/v1/organizations/spend_limits/{spend_limit_id}',
                    attributes: { 'anthropic.organization.spend_limit.id': spendLimitID },
                }),
            });
        }
        /**
         * List the organization's spend limits.
         *
         * A Claude Console organization's limits, including any read-only `usage_tier`
         * limit, come newest first. Listing them is in an early access preview. To request
         * access, contact your Anthropic account team. A Claude Enterprise organization's
         * limits are grouped by scope type, in the order `organization`, `seat_tier`,
         * `rbac_group`, `organization_service`, `user`; within a type they come in a fixed
         * order that is not creation order.
         *
         * @example
         * ```ts
         * // Automatically fetches more pages as needed.
         * for await (const betaSpendLimit of client.beta.organization.spendLimits.list()) {
         *   // ...
         * }
         * ```
         */
        list(params = {}, options) {
            const { betas, ...query } = params ?? {};
            return this._client.getAPIList('/v1/organizations/spend_limits', (PageCursor), {
                query,
                ...options,
                headers: buildHeaders([
                    { 'anthropic-beta': [...(betas ?? []), 'spend-limit-reads-2026-09-26'].toString() },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.organization.spend_limits.list', options, {
                    route: '/v1/organizations/spend_limits',
                    queryParams: ['limit', 'page', 'scope_type', 'workspace_id'],
                }),
            });
        }
        /**
         * Delete a spend limit.
         *
         * For a Claude Enterprise organization, this deletes a per-user override, and the
         * member falls back to any inherited spend limit at that period. Its seat-tier,
         * group, and organization-level rows cannot be deleted via this endpoint. A Claude
         * Console organization deletes its organization and workspace limits, but not its
         * `usage_tier` limit. Deleting organization and workspace limits through the API
         * is in an early access preview.
         *
         * @example
         * ```ts
         * const spendLimit =
         *   await client.beta.organization.spendLimits.delete(
         *     'spend_limit_id',
         *   );
         * ```
         */
        delete(spendLimitID, options) {
            return this._client.delete(path `/v1/organizations/spend_limits/${spendLimitID}`, {
                ...options,
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.organization.spend_limits.delete', options, {
                    route: '/v1/organizations/spend_limits/{spend_limit_id}',
                    attributes: { 'anthropic.organization.spend_limit.id': spendLimitID },
                }),
            });
        }
        /**
         * Set a spend limit.
         *
         * Upsert keyed on (scope, period): setting a limit that already exists overwrites
         * it in place. A Claude Enterprise organization sets `user` limits. Its seat-tier,
         * group, and organization-level defaults are configured in claude.ai. A Claude
         * Console organization sets `organization` and `workspace` limits, which are
         * monthly and always carry an amount. Setting those limits is in an early access
         * preview. To request access, contact your Anthropic account team.
         *
         * @example
         * ```ts
         * const betaSpendLimit =
         *   await client.beta.organization.spendLimits.set({
         *     amount: '50000',
         *     scope: {
         *       type: 'user',
         *       user_id: 'user_01WCz1FkmYMm4gnmykNKUu3Q',
         *     },
         *   });
         * ```
         */
        set(params, options) {
            const { betas, ...body } = params;
            return this._client.post('/v1/organizations/spend_limits', {
                body,
                ...options,
                headers: buildHeaders([
                    { ...(betas?.toString() != null ? { 'anthropic-beta': betas?.toString() } : undefined) },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.organization.spend_limits.set', options, {
                    route: '/v1/organizations/spend_limits',
                    createdIDAttribute: 'anthropic.organization.spend_limit.id',
                }),
            });
        }
    }
    SpendLimits.Effective = Effective;
    SpendLimits.IncreaseRequests = IncreaseRequests;
    return SpendLimits;
})();
//# sourceMappingURL=spend-limits.mjs.map