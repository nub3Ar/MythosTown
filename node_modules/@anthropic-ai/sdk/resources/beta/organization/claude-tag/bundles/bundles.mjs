import { APIResource } from "../../../../../core/resource.mjs";
import * as TargetsAPI from "./targets.mjs";
import { Targets, } from "./targets.mjs";
import { PageCursor } from "../../../../../core/pagination.mjs";
import { buildHeaders } from "../../../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../../../internal/tracing.mjs";
import { path } from "../../../../../internal/utils/path.mjs";
export var Bundles = /* @__PURE__ */ (() => {
    class Bundles extends APIResource {
        constructor() {
            super(...arguments);
            this.targets = new TargetsAPI.Targets(this._client);
        }
        /**
         * Get one Bundle. What the Bundle grants (connectors, repositories and
         * credentials) is never returned.
         *
         * @example
         * ```ts
         * const betaClaudeTagBundle =
         *   await client.beta.organization.claudeTag.bundles.retrieve(
         *     'capp_011CZkZjLP1cWxj5EtMmdgbq',
         *   );
         * ```
         */
        retrieve(bundleID, params = {}, options) {
            const { betas } = params ?? {};
            return this._client.get(path `/v1/organizations/claude_tag/bundles/${bundleID}`, {
                ...options,
                headers: buildHeaders([
                    { 'anthropic-beta': [...(betas ?? []), 'experimental-claude-tag-2026-10-21'].toString() },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.organization.claude_tag.bundles.retrieve', options, {
                    route: '/v1/organizations/claude_tag/bundles/{bundle_id}',
                    attributes: { 'anthropic.organization.claude_tag.bundle.id': bundleID },
                }),
            });
        }
        /**
         * List the organization's Bundles, newest first by `created_at`. A Bundle that
         * Claude Tag manages for itself is not listed.
         *
         * @example
         * ```ts
         * // Automatically fetches more pages as needed.
         * for await (const betaClaudeTagBundle of client.beta.organization.claudeTag.bundles.list()) {
         *   // ...
         * }
         * ```
         */
        list(params = {}, options) {
            const { betas, ...query } = params ?? {};
            return this._client.getAPIList('/v1/organizations/claude_tag/bundles', (PageCursor), {
                query,
                ...options,
                headers: buildHeaders([
                    { 'anthropic-beta': [...(betas ?? []), 'experimental-claude-tag-2026-10-21'].toString() },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.organization.claude_tag.bundles.list', options, {
                    route: '/v1/organizations/claude_tag/bundles',
                    queryParams: ['limit', 'page'],
                }),
            });
        }
    }
    Bundles.Targets = Targets;
    return Bundles;
})();
//# sourceMappingURL=bundles.mjs.map