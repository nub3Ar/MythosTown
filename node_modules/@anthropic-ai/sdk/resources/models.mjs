import { APIResource } from "../core/resource.mjs";
import { Page } from "../core/pagination.mjs";
import { buildHeaders } from "../internal/headers.mjs";
import { startApiCallSpan } from "../internal/tracing.mjs";
import { path } from "../internal/utils/path.mjs";
export class Models extends APIResource {
    /**
     * Get a specific model.
     *
     * The Models API response can be used to determine information about a specific
     * model or resolve a model alias to a model ID.
     *
     * @example
     * ```ts
     * const modelInfo = await client.models.retrieve('model_id');
     * ```
     */
    retrieve(modelID, params = {}, options) {
        const { workspace_id } = params ?? {};
        return this._client.get(path `/v1/models/${modelID}`, {
            ...options,
            headers: buildHeaders([
                { ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined) },
                options?.headers,
            ]),
            __span: startApiCallSpan(this._client, 'anthropic.models.retrieve', options, {
                route: '/v1/models/{model_id}',
                attributes: { 'anthropic.model.id': modelID },
            }),
        });
    }
    /**
     * List available models.
     *
     * The Models API response can be used to determine which models are available for
     * use in the API. More recently released models are listed first.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const modelInfo of client.models.list()) {
     *   // ...
     * }
     * ```
     */
    list(params = {}, options) {
        const { workspace_id, ...query } = params ?? {};
        return this._client.getAPIList('/v1/models', (Page), {
            query,
            ...options,
            headers: buildHeaders([
                { ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined) },
                options?.headers,
            ]),
            __span: startApiCallSpan(this._client, 'anthropic.models.list', options, {
                route: '/v1/models',
                queryParams: ['after_id', 'before_id', 'lifecycle', 'limit'],
            }),
        });
    }
}
//# sourceMappingURL=models.mjs.map