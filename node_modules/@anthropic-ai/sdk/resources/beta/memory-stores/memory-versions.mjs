import { APIResource } from "../../../core/resource.mjs";
import { PageCursor } from "../../../core/pagination.mjs";
import { buildHeaders } from "../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../internal/tracing.mjs";
import { path } from "../../../internal/utils/path.mjs";
export class MemoryVersions extends APIResource {
    /**
     * Retrieve a Memory Version
     *
     * @example
     * ```ts
     * const betaManagedAgentsMemoryVersion =
     *   await client.beta.memoryStores.memoryVersions.retrieve(
     *     'memory_version_id',
     *     { memory_store_id: 'memory_store_id' },
     *   );
     * ```
     */
    retrieve(memoryVersionID, params, options) {
        const { memory_store_id, betas, workspace_id, ...query } = params;
        return this._client.get(path `/v1/memory_stores/${memory_store_id}/memory_versions/${memoryVersionID}`, {
            query,
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'agent-memory-2026-07-22'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.memory_stores.memory_versions.retrieve', options, {
                route: '/v1/memory_stores/{memory_store_id}/memory_versions/{memory_version_id}',
                queryParams: ['view'],
                attributes: {
                    'gen_ai.memory.store.id': memory_store_id,
                    'anthropic.memory_store.memory_version.id': memoryVersionID,
                },
            }),
        });
    }
    /**
     * List Memory Versions
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const betaManagedAgentsMemoryVersion of client.beta.memoryStores.memoryVersions.list(
     *   'memory_store_id',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(memoryStoreID, params = {}, options) {
        const { betas, workspace_id, ...query } = params ?? {};
        return this._client.getAPIList(path `/v1/memory_stores/${memoryStoreID}/memory_versions`, (PageCursor), {
            query,
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'agent-memory-2026-07-22'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.memory_stores.memory_versions.list', options, {
                route: '/v1/memory_stores/{memory_store_id}/memory_versions',
                queryParams: [
                    'api_key_id',
                    'created_at[gte]',
                    'created_at[lte]',
                    'limit',
                    'memory_id',
                    'operation',
                    'page',
                    'service_account_id',
                    'session_id',
                    'view',
                ],
                attributes: { 'gen_ai.memory.store.id': memoryStoreID },
            }),
        });
    }
    /**
     * Redact a Memory Version
     *
     * @example
     * ```ts
     * const betaManagedAgentsMemoryVersion =
     *   await client.beta.memoryStores.memoryVersions.redact(
     *     'memory_version_id',
     *     { memory_store_id: 'memory_store_id' },
     *   );
     * ```
     */
    redact(memoryVersionID, params, options) {
        const { memory_store_id, betas, workspace_id } = params;
        return this._client.post(path `/v1/memory_stores/${memory_store_id}/memory_versions/${memoryVersionID}/redact`, {
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'agent-memory-2026-07-22'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.memory_stores.memory_versions.redact', options, {
                route: '/v1/memory_stores/{memory_store_id}/memory_versions/{memory_version_id}/redact',
                attributes: {
                    'gen_ai.memory.store.id': memory_store_id,
                    'anthropic.memory_store.memory_version.id': memoryVersionID,
                },
            }),
        });
    }
}
//# sourceMappingURL=memory-versions.mjs.map