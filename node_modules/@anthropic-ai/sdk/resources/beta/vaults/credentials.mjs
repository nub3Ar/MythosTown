import { APIResource } from "../../../core/resource.mjs";
import { PageCursor } from "../../../core/pagination.mjs";
import { buildHeaders } from "../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../internal/tracing.mjs";
import { path } from "../../../internal/utils/path.mjs";
export class Credentials extends APIResource {
    /**
     * Create a Credential
     *
     * @example
     * ```ts
     * const betaManagedAgentsCredential =
     *   await client.beta.vaults.credentials.create(
     *     'vlt_011CZkZDLs7fYzm1hXNPeRjv',
     *     {
     *       auth: {
     *         token: 'bearer_exampletoken',
     *         mcp_server_url:
     *           'https://example-server.modelcontextprotocol.io/sse',
     *         type: 'static_bearer',
     *       },
     *     },
     *   );
     * ```
     */
    create(vaultID, params, options) {
        const { betas, workspace_id, ...body } = params;
        return this._client.post(path `/v1/vaults/${vaultID}/credentials`, {
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
            __span: startApiCallSpan(this._client, 'anthropic.vaults.credentials.create', options, {
                route: '/v1/vaults/{vault_id}/credentials',
                attributes: { 'anthropic.vault.id': vaultID },
                createdIDAttribute: 'anthropic.vault.credential.id',
            }),
        });
    }
    /**
     * Retrieve a Credential
     *
     * @example
     * ```ts
     * const betaManagedAgentsCredential =
     *   await client.beta.vaults.credentials.retrieve(
     *     'vcrd_011CZkZEMt8gZan2iYPQfSkw',
     *     { vault_id: 'vlt_011CZkZDLs7fYzm1hXNPeRjv' },
     *   );
     * ```
     */
    retrieve(credentialID, params, options) {
        const { vault_id, betas, workspace_id } = params;
        return this._client.get(path `/v1/vaults/${vault_id}/credentials/${credentialID}`, {
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.vaults.credentials.retrieve', options, {
                route: '/v1/vaults/{vault_id}/credentials/{credential_id}',
                attributes: { 'anthropic.vault.id': vault_id, 'anthropic.vault.credential.id': credentialID },
            }),
        });
    }
    /**
     * Update a Credential
     *
     * @example
     * ```ts
     * const betaManagedAgentsCredential =
     *   await client.beta.vaults.credentials.update(
     *     'vcrd_011CZkZEMt8gZan2iYPQfSkw',
     *     { vault_id: 'vlt_011CZkZDLs7fYzm1hXNPeRjv' },
     *   );
     * ```
     */
    update(credentialID, params, options) {
        const { vault_id, betas, workspace_id, ...body } = params;
        return this._client.post(path `/v1/vaults/${vault_id}/credentials/${credentialID}`, {
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
            __span: startApiCallSpan(this._client, 'anthropic.vaults.credentials.update', options, {
                route: '/v1/vaults/{vault_id}/credentials/{credential_id}',
                attributes: { 'anthropic.vault.id': vault_id, 'anthropic.vault.credential.id': credentialID },
            }),
        });
    }
    /**
     * List Credentials
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const betaManagedAgentsCredential of client.beta.vaults.credentials.list(
     *   'vlt_011CZkZDLs7fYzm1hXNPeRjv',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(vaultID, params = {}, options) {
        const { betas, workspace_id, ...query } = params ?? {};
        return this._client.getAPIList(path `/v1/vaults/${vaultID}/credentials`, (PageCursor), {
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
            __span: startApiCallSpan(this._client, 'anthropic.vaults.credentials.list', options, {
                route: '/v1/vaults/{vault_id}/credentials',
                queryParams: ['include_archived', 'limit', 'page'],
                attributes: { 'anthropic.vault.id': vaultID },
            }),
        });
    }
    /**
     * Delete a Credential
     *
     * @example
     * ```ts
     * const betaManagedAgentsDeletedCredential =
     *   await client.beta.vaults.credentials.delete(
     *     'vcrd_011CZkZEMt8gZan2iYPQfSkw',
     *     { vault_id: 'vlt_011CZkZDLs7fYzm1hXNPeRjv' },
     *   );
     * ```
     */
    delete(credentialID, params, options) {
        const { vault_id, betas, workspace_id } = params;
        return this._client.delete(path `/v1/vaults/${vault_id}/credentials/${credentialID}`, {
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.vaults.credentials.delete', options, {
                route: '/v1/vaults/{vault_id}/credentials/{credential_id}',
                attributes: { 'anthropic.vault.id': vault_id, 'anthropic.vault.credential.id': credentialID },
            }),
        });
    }
    /**
     * Archive a Credential
     *
     * @example
     * ```ts
     * const betaManagedAgentsCredential =
     *   await client.beta.vaults.credentials.archive(
     *     'vcrd_011CZkZEMt8gZan2iYPQfSkw',
     *     { vault_id: 'vlt_011CZkZDLs7fYzm1hXNPeRjv' },
     *   );
     * ```
     */
    archive(credentialID, params, options) {
        const { vault_id, betas, workspace_id } = params;
        return this._client.post(path `/v1/vaults/${vault_id}/credentials/${credentialID}/archive`, {
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.vaults.credentials.archive', options, {
                route: '/v1/vaults/{vault_id}/credentials/{credential_id}/archive',
                attributes: { 'anthropic.vault.id': vault_id, 'anthropic.vault.credential.id': credentialID },
            }),
        });
    }
    /**
     * Validate an MCP OAuth Credential
     *
     * @example
     * ```ts
     * const betaManagedAgentsCredentialValidation =
     *   await client.beta.vaults.credentials.mcpOAuthValidate(
     *     'vcrd_011CZkZEMt8gZan2iYPQfSkw',
     *     { vault_id: 'vlt_011CZkZDLs7fYzm1hXNPeRjv' },
     *   );
     * ```
     */
    mcpOAuthValidate(credentialID, params, options) {
        const { vault_id, betas, workspace_id } = params;
        return this._client.post(path `/v1/vaults/${vault_id}/credentials/${credentialID}/mcp_oauth_validate`, {
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.vaults.credentials.mcp_oauth_validate', options, {
                route: '/v1/vaults/{vault_id}/credentials/{credential_id}/mcp_oauth_validate',
                attributes: { 'anthropic.vault.id': vault_id, 'anthropic.vault.credential.id': credentialID },
            }),
        });
    }
}
//# sourceMappingURL=credentials.mjs.map