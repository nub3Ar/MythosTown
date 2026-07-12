import { APIResource } from "../../core/resource.mjs";
import { PageCursor } from "../../core/pagination.mjs";
import { buildHeaders } from "../../internal/headers.mjs";
import { startApiCallSpan } from "../../internal/tracing.mjs";
import { path } from "../../internal/utils/path.mjs";
export class Deployments extends APIResource {
    /**
     * Create Deployment
     *
     * @example
     * ```ts
     * const betaManagedAgentsDeployment =
     *   await client.beta.deployments.create({
     *     agent: 'string',
     *     environment_id: 'x',
     *     initial_events: [
     *       {
     *         content: [
     *           {
     *             text: 'Where is my order #1234?',
     *             type: 'text',
     *           },
     *         ],
     *         type: 'user.message',
     *       },
     *     ],
     *     name: 'x',
     *   });
     * ```
     */
    create(params, options) {
        const { betas, workspace_id, ...body } = params;
        return this._client.post('/v1/deployments', {
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
            __span: startApiCallSpan(this._client, 'anthropic.deployments.create', options, {
                route: '/v1/deployments',
                createdIDAttribute: 'anthropic.deployment.id',
            }),
        });
    }
    /**
     * Get Deployment
     *
     * @example
     * ```ts
     * const betaManagedAgentsDeployment =
     *   await client.beta.deployments.retrieve(
     *     'depl_011CZkZcDH3vPqd7xnEfwTai',
     *   );
     * ```
     */
    retrieve(deploymentID, params = {}, options) {
        const { betas, workspace_id } = params ?? {};
        return this._client.get(path `/v1/deployments/${deploymentID}`, {
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.deployments.retrieve', options, {
                route: '/v1/deployments/{deployment_id}',
                attributes: { 'anthropic.deployment.id': deploymentID },
            }),
        });
    }
    /**
     * Update Deployment
     *
     * @example
     * ```ts
     * const betaManagedAgentsDeployment =
     *   await client.beta.deployments.update(
     *     'depl_011CZkZcDH3vPqd7xnEfwTai',
     *   );
     * ```
     */
    update(deploymentID, params, options) {
        const { betas, workspace_id, ...body } = params;
        return this._client.post(path `/v1/deployments/${deploymentID}`, {
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
            __span: startApiCallSpan(this._client, 'anthropic.deployments.update', options, {
                route: '/v1/deployments/{deployment_id}',
                attributes: { 'anthropic.deployment.id': deploymentID },
            }),
        });
    }
    /**
     * List Deployments
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const betaManagedAgentsDeployment of client.beta.deployments.list()) {
     *   // ...
     * }
     * ```
     */
    list(params = {}, options) {
        const { betas, workspace_id, ...query } = params ?? {};
        return this._client.getAPIList('/v1/deployments', (PageCursor), {
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
            __span: startApiCallSpan(this._client, 'anthropic.deployments.list', options, {
                route: '/v1/deployments',
                queryParams: [
                    'agent_id',
                    'created_at[gte]',
                    'created_at[lte]',
                    'include_archived',
                    'limit',
                    'page',
                    'status',
                ],
            }),
        });
    }
    /**
     * Archive Deployment
     *
     * @example
     * ```ts
     * const betaManagedAgentsDeployment =
     *   await client.beta.deployments.archive(
     *     'depl_011CZkZcDH3vPqd7xnEfwTai',
     *   );
     * ```
     */
    archive(deploymentID, params = {}, options) {
        const { betas, workspace_id } = params ?? {};
        return this._client.post(path `/v1/deployments/${deploymentID}/archive`, {
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.deployments.archive', options, {
                route: '/v1/deployments/{deployment_id}/archive',
                attributes: { 'anthropic.deployment.id': deploymentID },
            }),
        });
    }
    /**
     * Pause Deployment
     *
     * @example
     * ```ts
     * const betaManagedAgentsDeployment =
     *   await client.beta.deployments.pause(
     *     'depl_011CZkZcDH3vPqd7xnEfwTai',
     *   );
     * ```
     */
    pause(deploymentID, params = {}, options) {
        const { betas, workspace_id } = params ?? {};
        return this._client.post(path `/v1/deployments/${deploymentID}/pause`, {
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.deployments.pause', options, {
                route: '/v1/deployments/{deployment_id}/pause',
                attributes: { 'anthropic.deployment.id': deploymentID },
            }),
        });
    }
    /**
     * Run Deployment Now
     *
     * @example
     * ```ts
     * const betaManagedAgentsDeploymentRun =
     *   await client.beta.deployments.run(
     *     'depl_011CZkZcDH3vPqd7xnEfwTai',
     *   );
     * ```
     */
    run(deploymentID, params = {}, options) {
        const { betas, workspace_id } = params ?? {};
        return this._client.post(path `/v1/deployments/${deploymentID}/run`, {
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.deployments.run', options, {
                route: '/v1/deployments/{deployment_id}/run',
                attributes: { 'anthropic.deployment.id': deploymentID },
            }),
        });
    }
    /**
     * Unpause Deployment
     *
     * @example
     * ```ts
     * const betaManagedAgentsDeployment =
     *   await client.beta.deployments.unpause(
     *     'depl_011CZkZcDH3vPqd7xnEfwTai',
     *   );
     * ```
     */
    unpause(deploymentID, params = {}, options) {
        const { betas, workspace_id } = params ?? {};
        return this._client.post(path `/v1/deployments/${deploymentID}/unpause`, {
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.deployments.unpause', options, {
                route: '/v1/deployments/{deployment_id}/unpause',
                attributes: { 'anthropic.deployment.id': deploymentID },
            }),
        });
    }
}
//# sourceMappingURL=deployments.mjs.map