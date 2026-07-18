import { APIResource } from "../../../core/resource.mjs";
import * as CredentialsAPI from "./credentials.mjs";
import { Credentials, } from "./credentials.mjs";
import { PageCursor } from "../../../core/pagination.mjs";
import { buildHeaders } from "../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../internal/tracing.mjs";
import { path } from "../../../internal/utils/path.mjs";
export var Vaults = /* @__PURE__ */ (() => {
    class Vaults extends APIResource {
        constructor() {
            super(...arguments);
            this.credentials = new CredentialsAPI.Credentials(this._client);
        }
        /**
         * Create a Vault
         *
         * @example
         * ```ts
         * const betaManagedAgentsVault =
         *   await client.beta.vaults.create({
         *     display_name: 'Example vault',
         *   });
         * ```
         */
        create(params, options) {
            const { betas, workspace_id, ...body } = params;
            return this._client.post('/v1/vaults', {
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
                __span: startApiCallSpan(this._client, 'anthropic.vaults.create', options, {
                    route: '/v1/vaults',
                    createdIDAttribute: 'anthropic.vault.id',
                }),
            });
        }
        /**
         * Retrieve a Vault
         *
         * @example
         * ```ts
         * const betaManagedAgentsVault =
         *   await client.beta.vaults.retrieve(
         *     'vlt_011CZkZDLs7fYzm1hXNPeRjv',
         *   );
         * ```
         */
        retrieve(vaultID, params = {}, options) {
            const { betas, workspace_id } = params ?? {};
            return this._client.get(path `/v1/vaults/${vaultID}`, {
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.vaults.retrieve', options, {
                    route: '/v1/vaults/{vault_id}',
                    attributes: { 'anthropic.vault.id': vaultID },
                }),
            });
        }
        /**
         * Update a Vault
         *
         * @example
         * ```ts
         * const betaManagedAgentsVault =
         *   await client.beta.vaults.update(
         *     'vlt_011CZkZDLs7fYzm1hXNPeRjv',
         *   );
         * ```
         */
        update(vaultID, params, options) {
            const { betas, workspace_id, ...body } = params;
            return this._client.post(path `/v1/vaults/${vaultID}`, {
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
                __span: startApiCallSpan(this._client, 'anthropic.vaults.update', options, {
                    route: '/v1/vaults/{vault_id}',
                    attributes: { 'anthropic.vault.id': vaultID },
                }),
            });
        }
        /**
         * List Vaults
         *
         * @example
         * ```ts
         * // Automatically fetches more pages as needed.
         * for await (const betaManagedAgentsVault of client.beta.vaults.list()) {
         *   // ...
         * }
         * ```
         */
        list(params = {}, options) {
            const { betas, workspace_id, ...query } = params ?? {};
            return this._client.getAPIList('/v1/vaults', (PageCursor), {
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
                __span: startApiCallSpan(this._client, 'anthropic.vaults.list', options, {
                    route: '/v1/vaults',
                    queryParams: ['include_archived', 'limit', 'page'],
                }),
            });
        }
        /**
         * Delete a Vault
         *
         * @example
         * ```ts
         * const betaManagedAgentsDeletedVault =
         *   await client.beta.vaults.delete(
         *     'vlt_011CZkZDLs7fYzm1hXNPeRjv',
         *   );
         * ```
         */
        delete(vaultID, params = {}, options) {
            const { betas, workspace_id } = params ?? {};
            return this._client.delete(path `/v1/vaults/${vaultID}`, {
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.vaults.delete', options, {
                    route: '/v1/vaults/{vault_id}',
                    attributes: { 'anthropic.vault.id': vaultID },
                }),
            });
        }
        /**
         * Archive a Vault
         *
         * @example
         * ```ts
         * const betaManagedAgentsVault =
         *   await client.beta.vaults.archive(
         *     'vlt_011CZkZDLs7fYzm1hXNPeRjv',
         *   );
         * ```
         */
        archive(vaultID, params = {}, options) {
            const { betas, workspace_id } = params ?? {};
            return this._client.post(path `/v1/vaults/${vaultID}/archive`, {
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.vaults.archive', options, {
                    route: '/v1/vaults/{vault_id}/archive',
                    attributes: { 'anthropic.vault.id': vaultID },
                }),
            });
        }
    }
    Vaults.Credentials = Credentials;
    return Vaults;
})();
//# sourceMappingURL=vaults.mjs.map