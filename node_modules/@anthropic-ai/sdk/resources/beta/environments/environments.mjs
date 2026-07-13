import { APIResource } from "../../../core/resource.mjs";
import * as WorkAPI from "./work.mjs";
import { Work, } from "./work.mjs";
import { PageCursor } from "../../../core/pagination.mjs";
import { buildHeaders } from "../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../internal/tracing.mjs";
import { path } from "../../../internal/utils/path.mjs";
export var Environments = /* @__PURE__ */ (() => {
    class Environments extends APIResource {
        constructor() {
            super(...arguments);
            this.work = new WorkAPI.Work(this._client);
        }
        /**
         * Create a new environment with the specified configuration.
         *
         * @example
         * ```ts
         * const betaEnvironment =
         *   await client.beta.environments.create({
         *     name: 'python-data-analysis',
         *   });
         * ```
         */
        create(params, options) {
            const { betas, workspace_id, ...body } = params;
            return this._client.post('/v1/environments', {
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
                __span: startApiCallSpan(this._client, 'anthropic.environments.create', options, {
                    route: '/v1/environments',
                    createdIDAttribute: 'anthropic.environment.id',
                }),
            });
        }
        /**
         * Retrieve a specific environment by ID.
         *
         * @example
         * ```ts
         * const betaEnvironment =
         *   await client.beta.environments.retrieve(
         *     'env_011CZkZ9X2dpNyB7HsEFoRfW',
         *   );
         * ```
         */
        retrieve(environmentID, params = {}, options) {
            const { betas, workspace_id } = params ?? {};
            return this._client.get(path `/v1/environments/${environmentID}`, {
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.environments.retrieve', options, {
                    route: '/v1/environments/{environment_id}',
                    attributes: { 'anthropic.environment.id': environmentID },
                }),
            });
        }
        /**
         * Update an existing environment's configuration.
         *
         * @example
         * ```ts
         * const betaEnvironment =
         *   await client.beta.environments.update(
         *     'env_011CZkZ9X2dpNyB7HsEFoRfW',
         *   );
         * ```
         */
        update(environmentID, params, options) {
            const { betas, workspace_id, ...body } = params;
            return this._client.post(path `/v1/environments/${environmentID}`, {
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
                __span: startApiCallSpan(this._client, 'anthropic.environments.update', options, {
                    route: '/v1/environments/{environment_id}',
                    attributes: { 'anthropic.environment.id': environmentID },
                }),
            });
        }
        /**
         * List environments with pagination support.
         *
         * @example
         * ```ts
         * // Automatically fetches more pages as needed.
         * for await (const betaEnvironment of client.beta.environments.list()) {
         *   // ...
         * }
         * ```
         */
        list(params = {}, options) {
            const { betas, workspace_id, ...query } = params ?? {};
            return this._client.getAPIList('/v1/environments', (PageCursor), {
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
                __span: startApiCallSpan(this._client, 'anthropic.environments.list', options, {
                    route: '/v1/environments',
                    queryParams: ['include_archived', 'limit', 'page'],
                }),
            });
        }
        /**
         * Delete an environment by ID. Returns a confirmation of the deletion.
         *
         * @example
         * ```ts
         * const betaEnvironmentDeleteResponse =
         *   await client.beta.environments.delete(
         *     'env_011CZkZ9X2dpNyB7HsEFoRfW',
         *   );
         * ```
         */
        delete(environmentID, params = {}, options) {
            const { betas, workspace_id } = params ?? {};
            return this._client.delete(path `/v1/environments/${environmentID}`, {
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.environments.delete', options, {
                    route: '/v1/environments/{environment_id}',
                    attributes: { 'anthropic.environment.id': environmentID },
                }),
            });
        }
        /**
         * Archive an environment by ID. Archived environments cannot be used to create new
         * sessions.
         *
         * @example
         * ```ts
         * const betaEnvironment =
         *   await client.beta.environments.archive(
         *     'env_011CZkZ9X2dpNyB7HsEFoRfW',
         *   );
         * ```
         */
        archive(environmentID, params = {}, options) {
            const { betas, workspace_id } = params ?? {};
            return this._client.post(path `/v1/environments/${environmentID}/archive`, {
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.environments.archive', options, {
                    route: '/v1/environments/{environment_id}/archive',
                    attributes: { 'anthropic.environment.id': environmentID },
                }),
            });
        }
    }
    Environments.Work = Work;
    return Environments;
})();
//# sourceMappingURL=environments.mjs.map