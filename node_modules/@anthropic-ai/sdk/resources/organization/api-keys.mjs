import { APIResource } from "../../core/resource.mjs";
import { Page } from "../../core/pagination.mjs";
import { startApiCallSpan } from "../../internal/tracing.mjs";
import { path } from "../../internal/utils/path.mjs";
export class APIKeys extends APIResource {
    /**
     * Get API Key
     *
     * @example
     * ```ts
     * const apiKey = await client.organization.apiKeys.retrieve(
     *   'api_key_id',
     * );
     * ```
     */
    retrieve(apiKeyID, options) {
        return this._client.get(path `/v1/organizations/api_keys/${apiKeyID}`, {
            ...options,
            __span: startApiCallSpan(this._client, 'anthropic.organization.api_keys.retrieve', options, {
                route: '/v1/organizations/api_keys/{api_key_id}',
                attributes: { 'anthropic.organization.api_key.id': apiKeyID },
            }),
        });
    }
    /**
     * Update API Key
     *
     * @example
     * ```ts
     * const apiKey = await client.organization.apiKeys.update(
     *   'api_key_id',
     * );
     * ```
     */
    update(apiKeyID, body, options) {
        return this._client.post(path `/v1/organizations/api_keys/${apiKeyID}`, {
            body,
            ...options,
            __span: startApiCallSpan(this._client, 'anthropic.organization.api_keys.update', options, {
                route: '/v1/organizations/api_keys/{api_key_id}',
                attributes: { 'anthropic.organization.api_key.id': apiKeyID },
            }),
        });
    }
    /**
     * List API Keys
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const apiKey of client.organization.apiKeys.list()) {
     *   // ...
     * }
     * ```
     */
    list(query = {}, options) {
        return this._client.getAPIList('/v1/organizations/api_keys', (Page), {
            query,
            ...options,
            __span: startApiCallSpan(this._client, 'anthropic.organization.api_keys.list', options, {
                route: '/v1/organizations/api_keys',
                queryParams: ['after_id', 'before_id', 'created_by_user_id', 'limit', 'status', 'workspace_id'],
            }),
        });
    }
}
//# sourceMappingURL=api-keys.mjs.map