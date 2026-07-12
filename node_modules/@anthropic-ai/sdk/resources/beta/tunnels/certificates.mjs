import { APIResource } from "../../../core/resource.mjs";
import { PageCursor } from "../../../core/pagination.mjs";
import { buildHeaders } from "../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../internal/tracing.mjs";
import { path } from "../../../internal/utils/path.mjs";
export class Certificates extends APIResource {
    /**
     * The Tunnels API is in research preview. It requires the
     * `anthropic-beta: mcp-tunnels-2026-06-22` header and may change without a
     * deprecation period. It supersedes the Admin API endpoints at
     * `/v1/organizations/tunnels`, which remain available during a migration window.
     *
     * Registers a public CA certificate on a tunnel. Anthropic verifies the gateway's
     * server certificate against this CA when it terminates the inner TLS session. A
     * tunnel holds at most two non-archived certificates.
     *
     * @example
     * ```ts
     * const betaTunnelCertificate =
     *   await client.beta.tunnels.certificates.create(
     *     'tunnel_id',
     *     { ca_certificate_pem: 'ca_certificate_pem' },
     *   );
     * ```
     */
    create(tunnelID, params, options) {
        const { betas, workspace_id, ...body } = params;
        return this._client.post(path `/v1/tunnels/${tunnelID}/certificates`, {
            body,
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'mcp-tunnels-2026-06-22'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.tunnels.certificates.create', options, {
                route: '/v1/tunnels/{tunnel_id}/certificates',
                attributes: { 'anthropic.tunnel.id': tunnelID },
                createdIDAttribute: 'anthropic.tunnel.certificate.id',
            }),
        });
    }
    /**
     * The Tunnels API is in research preview. It requires the
     * `anthropic-beta: mcp-tunnels-2026-06-22` header and may change without a
     * deprecation period. It supersedes the Admin API endpoints at
     * `/v1/organizations/tunnels`, which remain available during a migration window.
     *
     * Fetches a tunnel certificate by ID.
     *
     * @example
     * ```ts
     * const betaTunnelCertificate =
     *   await client.beta.tunnels.certificates.retrieve(
     *     'certificate_id',
     *     { tunnel_id: 'tunnel_id' },
     *   );
     * ```
     */
    retrieve(certificateID, params, options) {
        const { tunnel_id, betas, workspace_id } = params;
        return this._client.get(path `/v1/tunnels/${tunnel_id}/certificates/${certificateID}`, {
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'mcp-tunnels-2026-06-22'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.tunnels.certificates.retrieve', options, {
                route: '/v1/tunnels/{tunnel_id}/certificates/{certificate_id}',
                attributes: { 'anthropic.tunnel.id': tunnel_id, 'anthropic.tunnel.certificate.id': certificateID },
            }),
        });
    }
    /**
     * The Tunnels API is in research preview. It requires the
     * `anthropic-beta: mcp-tunnels-2026-06-22` header and may change without a
     * deprecation period. It supersedes the Admin API endpoints at
     * `/v1/organizations/tunnels`, which remain available during a migration window.
     *
     * Lists the certificates registered on a tunnel. Archived certificates are
     * excluded unless include_archived is set.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const betaTunnelCertificate of client.beta.tunnels.certificates.list(
     *   'tunnel_id',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(tunnelID, params = {}, options) {
        const { betas, workspace_id, ...query } = params ?? {};
        return this._client.getAPIList(path `/v1/tunnels/${tunnelID}/certificates`, (PageCursor), {
            query,
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'mcp-tunnels-2026-06-22'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.tunnels.certificates.list', options, {
                route: '/v1/tunnels/{tunnel_id}/certificates',
                queryParams: ['include_archived', 'limit', 'page'],
                attributes: { 'anthropic.tunnel.id': tunnelID },
            }),
        });
    }
    /**
     * The Tunnels API is in research preview. It requires the
     * `anthropic-beta: mcp-tunnels-2026-06-22` header and may change without a
     * deprecation period. It supersedes the Admin API endpoints at
     * `/v1/organizations/tunnels`, which remain available during a migration window.
     *
     * Archives a tunnel certificate, removing it from the set Anthropic trusts for the
     * tunnel. The certificate record is retained. Archiving the last non-archived
     * certificate is permitted; the tunnel rejects MCP traffic until a new certificate
     * is added.
     *
     * @example
     * ```ts
     * const betaTunnelCertificate =
     *   await client.beta.tunnels.certificates.archive(
     *     'certificate_id',
     *     { tunnel_id: 'tunnel_id' },
     *   );
     * ```
     */
    archive(certificateID, params, options) {
        const { tunnel_id, betas, workspace_id } = params;
        return this._client.post(path `/v1/tunnels/${tunnel_id}/certificates/${certificateID}/archive`, {
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'mcp-tunnels-2026-06-22'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.tunnels.certificates.archive', options, {
                route: '/v1/tunnels/{tunnel_id}/certificates/{certificate_id}/archive',
                attributes: { 'anthropic.tunnel.id': tunnel_id, 'anthropic.tunnel.certificate.id': certificateID },
            }),
        });
    }
}
//# sourceMappingURL=certificates.mjs.map