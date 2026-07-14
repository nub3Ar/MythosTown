import { APIResource } from "../../../core/resource.mjs";
import { PageCursor } from "../../../core/pagination.mjs";
import { startApiCallSpan } from "../../../internal/tracing.mjs";
import { path } from "../../../internal/utils/path.mjs";
export class Issuers extends APIResource {
    /**
     * **Requires an OAuth access token with the `org:admin` scope**, from
     * `ant auth login --scope org:admin` or a workload identity federation rule; Admin
     * API keys are not accepted. See
     * [Manage WIF with the Admin API](/docs/en/manage-claude/wif-admin-api).
     *
     * Register an OIDC issuer that Anthropic will trust for workload identity
     * federation in your organization.
     *
     * The `jwks` field controls how the issuer's signing keys are obtained and takes
     * one of three shapes selected by `type`: `discovery` (resolve keys through OIDC
     * discovery), `explicit_url` (fetch keys from a fixed JWKS URL), or `inline`
     * (provide a static key set). When `jwks.type` is `discovery` and no
     * `discovery_base` is set, the issuer URL must be publicly reachable over HTTPS so
     * Anthropic can fetch the discovery document; for `explicit_url` and `inline`
     * modes the issuer URL is only matched as the JWT's `iss` claim and is not
     * fetched.
     *
     * @example
     * ```ts
     * const federationIssuer =
     *   await client.organization.federation.issuers.create({
     *     issuer_url: 'x',
     *     name: 'x',
     *   });
     * ```
     */
    create(body, options) {
        return this._client.post('/v1/organizations/federation_issuers', {
            body,
            ...options,
            __span: startApiCallSpan(this._client, 'anthropic.organization.federation.issuers.create', options, {
                route: '/v1/organizations/federation_issuers',
                createdIDAttribute: 'anthropic.organization.federation_issuer.id',
            }),
        });
    }
    /**
     * **Requires an OAuth access token with the `org:admin` scope**, from
     * `ant auth login --scope org:admin` or a workload identity federation rule; Admin
     * API keys are not accepted. See
     * [Manage WIF with the Admin API](/docs/en/manage-claude/wif-admin-api).
     *
     * Retrieve a federation issuer by its ID (`fdis_...`).
     *
     * @example
     * ```ts
     * const federationIssuer =
     *   await client.organization.federation.issuers.retrieve(
     *     'federation_issuer_id',
     *   );
     * ```
     */
    retrieve(federationIssuerID, options) {
        return this._client.get(path `/v1/organizations/federation_issuers/${federationIssuerID}`, {
            ...options,
            __span: startApiCallSpan(this._client, 'anthropic.organization.federation.issuers.retrieve', options, {
                route: '/v1/organizations/federation_issuers/{federation_issuer_id}',
                attributes: { 'anthropic.organization.federation_issuer.id': federationIssuerID },
            }),
        });
    }
    /**
     * **Requires an OAuth access token with the `org:admin` scope**, from
     * `ant auth login --scope org:admin` or a workload identity federation rule; Admin
     * API keys are not accepted. See
     * [Manage WIF with the Admin API](/docs/en/manage-claude/wif-admin-api).
     *
     * Partially update a federation issuer.
     *
     * Setting `jwks` replaces the full JWKS shape at once. Archived issuers cannot be
     * updated; this returns 400. Create a new issuer instead.
     *
     * Updating an issuer that backs a rule with a scope outside `workspace:developer`
     * or `workspace:inference` requires a Console session.
     *
     * @example
     * ```ts
     * const federationIssuer =
     *   await client.organization.federation.issuers.update(
     *     'federation_issuer_id',
     *   );
     * ```
     */
    update(federationIssuerID, body, options) {
        return this._client.post(path `/v1/organizations/federation_issuers/${federationIssuerID}`, {
            body,
            ...options,
            __span: startApiCallSpan(this._client, 'anthropic.organization.federation.issuers.update', options, {
                route: '/v1/organizations/federation_issuers/{federation_issuer_id}',
                attributes: { 'anthropic.organization.federation_issuer.id': federationIssuerID },
            }),
        });
    }
    /**
     * **Requires an OAuth access token with the `org:admin` scope**, from
     * `ant auth login --scope org:admin` or a workload identity federation rule; Admin
     * API keys are not accepted. See
     * [Manage WIF with the Admin API](/docs/en/manage-claude/wif-admin-api).
     *
     * List federation issuers in your organization.
     *
     * Archived issuers are excluded unless `include_archived=true`.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const federationIssuer of client.organization.federation.issuers.list()) {
     *   // ...
     * }
     * ```
     */
    list(query = {}, options) {
        return this._client.getAPIList('/v1/organizations/federation_issuers', (PageCursor), {
            query,
            ...options,
            __span: startApiCallSpan(this._client, 'anthropic.organization.federation.issuers.list', options, {
                route: '/v1/organizations/federation_issuers',
                queryParams: ['include_archived', 'limit', 'page'],
            }),
        });
    }
    /**
     * **Requires an OAuth access token with the `org:admin` scope**, from
     * `ant auth login --scope org:admin` or a workload identity federation rule; Admin
     * API keys are not accepted. See
     * [Manage WIF with the Admin API](/docs/en/manage-claude/wif-admin-api).
     *
     * Archive a federation issuer.
     *
     * Idempotent; re-archiving returns the issuer with its original `archived_at`.
     * Rejected with 400 if any live (non-archived) federation rule still references
     * the issuer; archive those rules first (a rule's issuer cannot be changed), or
     * recreate them against another issuer.
     *
     * @example
     * ```ts
     * const federationIssuer =
     *   await client.organization.federation.issuers.archive(
     *     'federation_issuer_id',
     *   );
     * ```
     */
    archive(federationIssuerID, options) {
        return this._client.post(path `/v1/organizations/federation_issuers/${federationIssuerID}/archive`, {
            ...options,
            __span: startApiCallSpan(this._client, 'anthropic.organization.federation.issuers.archive', options, {
                route: '/v1/organizations/federation_issuers/{federation_issuer_id}/archive',
                attributes: { 'anthropic.organization.federation_issuer.id': federationIssuerID },
            }),
        });
    }
}
//# sourceMappingURL=issuers.mjs.map