import { APIResource } from "../../../core/resource.mjs";
import * as MemoriesAPI from "./memories.mjs";
import { Memories, } from "./memories.mjs";
import * as MemoryVersionsAPI from "./memory-versions.mjs";
import { MemoryVersions, } from "./memory-versions.mjs";
import { PageCursor } from "../../../core/pagination.mjs";
import { buildHeaders } from "../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../internal/tracing.mjs";
import { path } from "../../../internal/utils/path.mjs";
export var MemoryStores = /* @__PURE__ */ (() => {
    class MemoryStores extends APIResource {
        constructor() {
            super(...arguments);
            this.memories = new MemoriesAPI.Memories(this._client);
            this.memoryVersions = new MemoryVersionsAPI.MemoryVersions(this._client);
        }
        /**
         * Create a Memory Store
         *
         * @example
         * ```ts
         * const betaManagedAgentsMemoryStore =
         *   await client.beta.memoryStores.create({ name: 'x' });
         * ```
         */
        create(params, options) {
            const { betas, workspace_id, ...body } = params;
            return this._client.post('/v1/memory_stores', {
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
                __span: startApiCallSpan(this._client, 'anthropic.memory_stores.create', options, {
                    route: '/v1/memory_stores',
                    createdIDAttribute: 'gen_ai.memory.store.id',
                }),
            });
        }
        /**
         * Retrieve a Memory Store
         *
         * @example
         * ```ts
         * const betaManagedAgentsMemoryStore =
         *   await client.beta.memoryStores.retrieve(
         *     'memory_store_id',
         *   );
         * ```
         */
        retrieve(memoryStoreID, params = {}, options) {
            const { betas, workspace_id } = params ?? {};
            return this._client.get(path `/v1/memory_stores/${memoryStoreID}`, {
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'agent-memory-2026-07-22'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.memory_stores.retrieve', options, {
                    route: '/v1/memory_stores/{memory_store_id}',
                    attributes: { 'gen_ai.memory.store.id': memoryStoreID },
                }),
            });
        }
        /**
         * Update a Memory Store
         *
         * @example
         * ```ts
         * const betaManagedAgentsMemoryStore =
         *   await client.beta.memoryStores.update('memory_store_id');
         * ```
         */
        update(memoryStoreID, params, options) {
            const { betas, workspace_id, ...body } = params;
            return this._client.post(path `/v1/memory_stores/${memoryStoreID}`, {
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
                __span: startApiCallSpan(this._client, 'anthropic.memory_stores.update', options, {
                    route: '/v1/memory_stores/{memory_store_id}',
                    attributes: { 'gen_ai.memory.store.id': memoryStoreID },
                }),
            });
        }
        /**
         * List Memory Stores
         *
         * @example
         * ```ts
         * // Automatically fetches more pages as needed.
         * for await (const betaManagedAgentsMemoryStore of client.beta.memoryStores.list()) {
         *   // ...
         * }
         * ```
         */
        list(params = {}, options) {
            const { betas, workspace_id, ...query } = params ?? {};
            return this._client.getAPIList('/v1/memory_stores', (PageCursor), {
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
                __span: startApiCallSpan(this._client, 'anthropic.memory_stores.list', options, {
                    route: '/v1/memory_stores',
                    queryParams: ['created_at[gte]', 'created_at[lte]', 'include_archived', 'limit', 'page'],
                }),
            });
        }
        /**
         * Delete a Memory Store
         *
         * @example
         * ```ts
         * const betaManagedAgentsDeletedMemoryStore =
         *   await client.beta.memoryStores.delete('memory_store_id');
         * ```
         */
        delete(memoryStoreID, params = {}, options) {
            const { betas, workspace_id } = params ?? {};
            return this._client.delete(path `/v1/memory_stores/${memoryStoreID}`, {
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'agent-memory-2026-07-22'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.memory_stores.delete', options, {
                    route: '/v1/memory_stores/{memory_store_id}',
                    attributes: { 'gen_ai.memory.store.id': memoryStoreID },
                }),
            });
        }
        /**
         * Archive a Memory Store
         *
         * @example
         * ```ts
         * const betaManagedAgentsMemoryStore =
         *   await client.beta.memoryStores.archive('memory_store_id');
         * ```
         */
        archive(memoryStoreID, params = {}, options) {
            const { betas, workspace_id } = params ?? {};
            return this._client.post(path `/v1/memory_stores/${memoryStoreID}/archive`, {
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'agent-memory-2026-07-22'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.memory_stores.archive', options, {
                    route: '/v1/memory_stores/{memory_store_id}/archive',
                    attributes: { 'gen_ai.memory.store.id': memoryStoreID },
                }),
            });
        }
    }
    MemoryStores.Memories = Memories;
    MemoryStores.MemoryVersions = MemoryVersions;
    return MemoryStores;
})();
//# sourceMappingURL=memory-stores.mjs.map