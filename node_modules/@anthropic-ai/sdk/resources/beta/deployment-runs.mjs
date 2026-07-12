import { APIResource } from "../../core/resource.mjs";
import { PageCursor } from "../../core/pagination.mjs";
import { buildHeaders } from "../../internal/headers.mjs";
import { startApiCallSpan } from "../../internal/tracing.mjs";
import { path } from "../../internal/utils/path.mjs";
export class DeploymentRuns extends APIResource {
    /**
     * Get Deployment Run
     *
     * @example
     * ```ts
     * const betaManagedAgentsDeploymentRun =
     *   await client.beta.deploymentRuns.retrieve(
     *     'deployment_run_id',
     *   );
     * ```
     */
    retrieve(deploymentRunID, params = {}, options) {
        const { betas, workspace_id } = params ?? {};
        return this._client.get(path `/v1/deployment_runs/${deploymentRunID}`, {
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.deployment_runs.retrieve', options, {
                route: '/v1/deployment_runs/{deployment_run_id}',
                attributes: { 'anthropic.deployment_run.id': deploymentRunID },
            }),
        });
    }
    /**
     * List Deployment Runs
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const betaManagedAgentsDeploymentRun of client.beta.deploymentRuns.list()) {
     *   // ...
     * }
     * ```
     */
    list(params = {}, options) {
        const { betas, workspace_id, ...query } = params ?? {};
        return this._client.getAPIList('/v1/deployment_runs', (PageCursor), {
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
            __span: startApiCallSpan(this._client, 'anthropic.deployment_runs.list', options, {
                route: '/v1/deployment_runs',
                queryParams: [
                    'created_at[gt]',
                    'created_at[gte]',
                    'created_at[lt]',
                    'created_at[lte]',
                    'deployment_id',
                    'has_error',
                    'limit',
                    'page',
                    'trigger_type',
                ],
            }),
        });
    }
}
//# sourceMappingURL=deployment-runs.mjs.map