import { APIResource } from "../../../core/resource.mjs";
import { PageCursor } from "../../../core/pagination.mjs";
import { buildHeaders } from "../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../internal/tracing.mjs";
import { path } from "../../../internal/utils/path.mjs";
export class Memories extends APIResource {
    /**
     * Create a Memory
     *
     * @example
     * ```ts
     * const betaManagedAgentsMemory =
     *   await client.beta.memoryStores.memories.create(
     *     'memory_store_id',
     *     { content: 'content', path: 'xx' },
     *   );
     * ```
     */
    create(memoryStoreID, params, options) {
        const { view, betas, workspace_id, ...body } = params;
        return this._client.post(path `/v1/memory_stores/${memoryStoreID}/memories`, {
            query: { view },
            body,
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'agent-memory-2026-07-22'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.memory_stores.memories.create', options, {
                route: '/v1/memory_stores/{memory_store_id}/memories',
                queryParams: ['view'],
                attributes: { 'gen_ai.memory.store.id': memoryStoreID },
                createdIDAttribute: 'gen_ai.memory.record.id',
            }),
        });
    }
    /**
     * Retrieve a Memory
     *
     * @example
     * ```ts
     * const betaManagedAgentsMemory =
     *   await client.beta.memoryStores.memories.retrieve(
     *     'memory_id',
     *     { memory_store_id: 'memory_store_id' },
     *   );
     * ```
     */
    retrieve(memoryID, params, options) {
        const { memory_store_id, betas, workspace_id, ...query } = params;
        return this._client.get(path `/v1/memory_stores/${memory_store_id}/memories/${memoryID}`, {
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
            __span: startApiCallSpan(this._client, 'anthropic.memory_stores.memories.retrieve', options, {
                route: '/v1/memory_stores/{memory_store_id}/memories/{memory_id}',
                queryParams: ['view'],
                attributes: { 'gen_ai.memory.store.id': memory_store_id, 'gen_ai.memory.record.id': memoryID },
            }),
        });
    }
    /**
     * Update a Memory
     *
     * @example
     * ```ts
     * const betaManagedAgentsMemory =
     *   await client.beta.memoryStores.memories.update(
     *     'memory_id',
     *     { memory_store_id: 'memory_store_id' },
     *   );
     * ```
     */
    update(memoryID, params, options) {
        const { memory_store_id, view, betas, workspace_id, ...body } = params;
        return this._client.post(path `/v1/memory_stores/${memory_store_id}/memories/${memoryID}`, {
            query: { view },
            body,
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'agent-memory-2026-07-22'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.memory_stores.memories.update', options, {
                route: '/v1/memory_stores/{memory_store_id}/memories/{memory_id}',
                queryParams: ['view'],
                attributes: { 'gen_ai.memory.store.id': memory_store_id, 'gen_ai.memory.record.id': memoryID },
            }),
        });
    }
    /**
     * List Memories
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const betaManagedAgentsMemoryListItem of client.beta.memoryStores.memories.list(
     *   'memory_store_id',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(memoryStoreID, params = {}, options) {
        const { betas, workspace_id, ...query } = params ?? {};
        return this._client.getAPIList(path `/v1/memory_stores/${memoryStoreID}/memories`, (PageCursor), {
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
            __span: startApiCallSpan(this._client, 'anthropic.memory_stores.memories.list', options, {
                route: '/v1/memory_stores/{memory_store_id}/memories',
                queryParams: ['depth', 'limit', 'page', 'path_prefix', 'view'],
                contentQueryParams: ['page'],
                attributes: { 'gen_ai.memory.store.id': memoryStoreID },
            }),
        });
    }
    /**
     * Delete a Memory
     *
     * @example
     * ```ts
     * const betaManagedAgentsDeletedMemory =
     *   await client.beta.memoryStores.memories.delete(
     *     'memory_id',
     *     { memory_store_id: 'memory_store_id' },
     *   );
     * ```
     */
    delete(memoryID, params, options) {
        const { memory_store_id, expected_content_sha256, betas, workspace_id } = params;
        return this._client.delete(path `/v1/memory_stores/${memory_store_id}/memories/${memoryID}`, {
            query: { expected_content_sha256 },
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'agent-memory-2026-07-22'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.memory_stores.memories.delete', options, {
                route: '/v1/memory_stores/{memory_store_id}/memories/{memory_id}',
                queryParams: ['expected_content_sha256'],
                attributes: { 'gen_ai.memory.store.id': memory_store_id, 'gen_ai.memory.record.id': memoryID },
            }),
        });
    }
}
//# sourceMappingURL=memories.mjs.map