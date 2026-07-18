import { APIResource } from "../../../core/resource.mjs";
import { PageCursor } from "../../../core/pagination.mjs";
import { buildHeaders } from "../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../internal/tracing.mjs";
import { path } from "../../../internal/utils/path.mjs";
import { WorkPoller, } from "../../../lib/environments/poller.mjs";
import { EnvironmentWorker, } from "../../../lib/environments/worker.mjs";
export var Work = /* @__PURE__ */ (() => {
    class Work extends APIResource {
        /**
         * Note: these endpoints are called automatically by the pre-built environment
         * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
         * sandbox environments. They are included here as a reference; you do not need to
         * invoke them directly.
         *
         * Retrieve detailed information about a specific work item.
         *
         * @example
         * ```ts
         * const betaSelfHostedWork =
         *   await client.beta.environments.work.retrieve('work_id', {
         *     environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW',
         *   });
         * ```
         */
        retrieve(workID, params, options) {
            const { environment_id, betas, workspace_id } = params;
            return this._client.get(path `/v1/environments/${environment_id}/work/${workID}`, {
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.environments.work.retrieve', options, {
                    route: '/v1/environments/{environment_id}/work/{work_id}',
                    attributes: { 'anthropic.environment.id': environment_id, 'anthropic.environment.work.id': workID },
                }),
            });
        }
        /**
         * Note: these endpoints are called automatically by the pre-built environment
         * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
         * sandbox environments. They are included here as a reference; you do not need to
         * invoke them directly.
         *
         * Update work item metadata with merge semantics.
         *
         * @example
         * ```ts
         * const betaSelfHostedWork =
         *   await client.beta.environments.work.update('work_id', {
         *     environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW',
         *     metadata: { foo: 'string' },
         *   });
         * ```
         */
        update(workID, params, options) {
            const { environment_id, betas, workspace_id, ...body } = params;
            return this._client.post(path `/v1/environments/${environment_id}/work/${workID}`, {
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
                __span: startApiCallSpan(this._client, 'anthropic.environments.work.update', options, {
                    route: '/v1/environments/{environment_id}/work/{work_id}',
                    attributes: { 'anthropic.environment.id': environment_id, 'anthropic.environment.work.id': workID },
                }),
            });
        }
        /**
         * Note: these endpoints are called automatically by the pre-built environment
         * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
         * sandbox environments. They are included here as a reference; you do not need to
         * invoke them directly.
         *
         * List work items in an environment.
         *
         * @example
         * ```ts
         * // Automatically fetches more pages as needed.
         * for await (const betaSelfHostedWork of client.beta.environments.work.list(
         *   'env_011CZkZ9X2dpNyB7HsEFoRfW',
         * )) {
         *   // ...
         * }
         * ```
         */
        list(environmentID, params = {}, options) {
            const { betas, ...query } = params ?? {};
            return this._client.getAPIList(path `/v1/environments/${environmentID}/work`, (PageCursor), {
                query,
                ...options,
                headers: buildHeaders([
                    { 'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString() },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.environments.work.list', options, {
                    route: '/v1/environments/{environment_id}/work',
                    queryParams: ['limit', 'page'],
                    attributes: { 'anthropic.environment.id': environmentID },
                }),
            });
        }
        /**
         * Note: these endpoints are called automatically by the pre-built environment
         * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
         * sandbox environments. They are included here as a reference; you do not need to
         * invoke them directly.
         *
         * Acknowledge receipt of a work item, transitioning it from 'queued' to 'starting'
         * and removing it from the queue.
         *
         * @example
         * ```ts
         * const betaSelfHostedWork =
         *   await client.beta.environments.work.ack('work_id', {
         *     environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW',
         *   });
         * ```
         */
        ack(workID, params, options) {
            const { environment_id, betas } = params;
            return this._client.post(path `/v1/environments/${environment_id}/work/${workID}/ack`, {
                ...options,
                headers: buildHeaders([
                    { 'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString() },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.environments.work.ack', options, {
                    route: '/v1/environments/{environment_id}/work/{work_id}/ack',
                    attributes: { 'anthropic.environment.id': environment_id, 'anthropic.environment.work.id': workID },
                }),
            });
        }
        /**
         * Note: these endpoints are called automatically by the pre-built environment
         * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
         * sandbox environments. They are included here as a reference; you do not need to
         * invoke them directly.
         *
         * Record a heartbeat for a work item to maintain the lease.
         *
         * @example
         * ```ts
         * const betaSelfHostedWorkHeartbeatResponse =
         *   await client.beta.environments.work.heartbeat('work_id', {
         *     environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW',
         *   });
         * ```
         */
        heartbeat(workID, params, options) {
            const { environment_id, desired_ttl_seconds, expected_last_heartbeat, betas } = params;
            return this._client.post(path `/v1/environments/${environment_id}/work/${workID}/heartbeat`, {
                query: { desired_ttl_seconds, expected_last_heartbeat },
                ...options,
                headers: buildHeaders([
                    { 'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString() },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.environments.work.heartbeat', options, {
                    route: '/v1/environments/{environment_id}/work/{work_id}/heartbeat',
                    queryParams: ['desired_ttl_seconds', 'expected_last_heartbeat'],
                    attributes: { 'anthropic.environment.id': environment_id, 'anthropic.environment.work.id': workID },
                }),
            });
        }
        /**
         * Note: these endpoints are called automatically by the pre-built environment
         * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
         * sandbox environments. They are included here as a reference; you do not need to
         * invoke them directly.
         *
         * Long poll for work items in the queue.
         *
         * @example
         * ```ts
         * const betaSelfHostedWork =
         *   await client.beta.environments.work.poll(
         *     'env_011CZkZ9X2dpNyB7HsEFoRfW',
         *   );
         * ```
         */
        poll(environmentID, params = {}, options) {
            const { betas, 'Anthropic-Worker-ID': anthropicWorkerID, ...query } = params ?? {};
            return this._client.get(path `/v1/environments/${environmentID}/work/poll`, {
                query,
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                        ...(anthropicWorkerID != null ? { 'Anthropic-Worker-ID': anthropicWorkerID } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.environments.work.poll', options, {
                    route: '/v1/environments/{environment_id}/work/poll',
                    queryParams: ['block_ms', 'reclaim_older_than_ms'],
                    attributes: { 'anthropic.environment.id': environmentID },
                }),
            });
        }
        /**
         * Get statistics about the work queue for an environment.
         *
         * @example
         * ```ts
         * const betaSelfHostedWorkQueueStats =
         *   await client.beta.environments.work.stats(
         *     'env_011CZkZ9X2dpNyB7HsEFoRfW',
         *   );
         * ```
         */
        stats(environmentID, params = {}, options) {
            const { betas, workspace_id } = params ?? {};
            return this._client.get(path `/v1/environments/${environmentID}/work/stats`, {
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.environments.work.stats', options, {
                    route: '/v1/environments/{environment_id}/work/stats',
                    attributes: { 'anthropic.environment.id': environmentID },
                }),
            });
        }
        /**
         * Note: these endpoints are called automatically by the pre-built environment
         * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
         * sandbox environments. They are included here as a reference; you do not need to
         * invoke them directly.
         *
         * Stop a work item, initiating graceful or forced shutdown.
         *
         * @example
         * ```ts
         * const betaSelfHostedWork =
         *   await client.beta.environments.work.stop('work_id', {
         *     environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW',
         *   });
         * ```
         */
        stop(workID, params, options) {
            const { environment_id, betas, workspace_id, ...body } = params;
            return this._client.post(path `/v1/environments/${environment_id}/work/${workID}/stop`, {
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
                __span: startApiCallSpan(this._client, 'anthropic.environments.work.stop', options, {
                    route: '/v1/environments/{environment_id}/work/{work_id}/stop',
                    attributes: { 'anthropic.environment.id': environment_id, 'anthropic.environment.work.id': workID },
                }),
            });
        }
        /**
         * Continuously claim work from a self-hosted environment, ack each item,
         * and yield it. Posts `stop` automatically when the consumer's loop body
         * returns or when iteration ends.
         *
         * @example
         * ```ts
         * for await (const work of client.beta.environments.work.poller({
         *   environmentId,
         *   environmentKey,
         * })) {
         *   if (work.data.type !== 'session') continue;
         *   // ...service the work...
         * }
         * ```
         */
        poller(opts) {
            return new WorkPoller({ ...opts, client: this._client });
        }
        worker(opts) {
            return new EnvironmentWorker({ ...opts, client: this._client });
        }
    }
    Work.WorkPoller = WorkPoller;
    Work.EnvironmentWorker = EnvironmentWorker;
    return Work;
})();
export { WorkPoller } from "../../../lib/environments/poller.mjs";
export { EnvironmentWorker } from "../../../lib/environments/worker.mjs";
//# sourceMappingURL=work.mjs.map