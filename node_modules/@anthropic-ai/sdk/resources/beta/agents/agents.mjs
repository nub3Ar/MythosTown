import { APIResource } from "../../../core/resource.mjs";
import * as VersionsAPI from "./versions.mjs";
import { Versions } from "./versions.mjs";
import { PageCursor } from "../../../core/pagination.mjs";
import { buildHeaders } from "../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../internal/tracing.mjs";
import { path } from "../../../internal/utils/path.mjs";
export var Agents = /* @__PURE__ */ (() => {
    class Agents extends APIResource {
        constructor() {
            super(...arguments);
            this.versions = new VersionsAPI.Versions(this._client);
        }
        /**
         * Create Agent
         *
         * @example
         * ```ts
         * const betaManagedAgentsAgent =
         *   await client.beta.agents.create({
         *     model: 'claude-opus-5-5',
         *     name: 'My First Agent',
         *   });
         * ```
         */
        create(params, options) {
            const { betas, workspace_id, ...body } = params;
            return this._client.post('/v1/agents', {
                body,
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.agents.create', options, {
                    route: '/v1/agents',
                    createdIDAttribute: 'gen_ai.agent.id',
                }),
            });
        }
        /**
         * Get Agent
         *
         * @example
         * ```ts
         * const betaManagedAgentsAgent =
         *   await client.beta.agents.retrieve(
         *     'agent_011CZkYpogX7uDKUyvBTophP',
         *   );
         * ```
         */
        retrieve(agentID, params = {}, options) {
            const { betas, workspace_id, ...query } = params ?? {};
            return this._client.get(path `/v1/agents/${agentID}`, {
                query,
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.agents.retrieve', options, {
                    route: '/v1/agents/{agent_id}',
                    queryParams: ['version'],
                    attributes: { 'gen_ai.agent.id': agentID },
                }),
            });
        }
        /**
         * Update Agent
         *
         * @example
         * ```ts
         * const betaManagedAgentsAgent =
         *   await client.beta.agents.update(
         *     'agent_011CZkYpogX7uDKUyvBTophP',
         *     { description: 'updated' },
         *   );
         * ```
         */
        update(agentID, params, options) {
            const { betas, workspace_id, ...body } = params;
            return this._client.post(path `/v1/agents/${agentID}`, {
                body,
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.agents.update', options, {
                    route: '/v1/agents/{agent_id}',
                    attributes: { 'gen_ai.agent.id': agentID },
                }),
            });
        }
        /**
         * List Agents
         *
         * @example
         * ```ts
         * // Automatically fetches more pages as needed.
         * for await (const betaManagedAgentsAgent of client.beta.agents.list()) {
         *   // ...
         * }
         * ```
         */
        list(params = {}, options) {
            const { betas, workspace_id, ...query } = params ?? {};
            return this._client.getAPIList('/v1/agents', (PageCursor), {
                query,
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.agents.list', options, {
                    route: '/v1/agents',
                    queryParams: ['created_at[gte]', 'created_at[lte]', 'include_archived', 'limit', 'page'],
                }),
            });
        }
        /**
         * Archive Agent
         *
         * @example
         * ```ts
         * const betaManagedAgentsAgent =
         *   await client.beta.agents.archive(
         *     'agent_011CZkYpogX7uDKUyvBTophP',
         *   );
         * ```
         */
        archive(agentID, params = {}, options) {
            const { betas, workspace_id } = params ?? {};
            return this._client.post(path `/v1/agents/${agentID}/archive`, {
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.agents.archive', options, {
                    route: '/v1/agents/{agent_id}/archive',
                    attributes: { 'gen_ai.agent.id': agentID },
                }),
            });
        }
    }
    Agents.Versions = Versions;
    return Agents;
})();
//# sourceMappingURL=agents.mjs.map