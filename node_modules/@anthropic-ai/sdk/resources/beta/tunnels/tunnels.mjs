import { APIResource } from "../../../core/resource.mjs";
import * as CertificatesAPI from "./certificates.mjs";
import { Certificates, } from "./certificates.mjs";
import { PageCursor } from "../../../core/pagination.mjs";
import { buildHeaders } from "../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../internal/tracing.mjs";
import { path } from "../../../internal/utils/path.mjs";
export var Tunnels = /* @__PURE__ */ (() => {
    class Tunnels extends APIResource {
        constructor() {
            super(...arguments);
            this.certificates = new CertificatesAPI.Certificates(this._client);
        }
        /**
         * The Tunnels API is in research preview. It requires the
         * `anthropic-beta: mcp-tunnels-2026-06-22` header and may change without a
         * deprecation period. It supersedes the Admin API endpoints at
         * `/v1/organizations/tunnels`, which remain available during a migration window.
         *
         * Creates a tunnel. Creation allocates a fresh hostname and provisions the tunnel;
         * it is not idempotent. The new tunnel rejects MCP traffic until at least one CA
         * certificate is added.
         *
         * @example
         * ```ts
         * const betaTunnel = await client.beta.tunnels.create();
         * ```
         */
        create(params, options) {
            const { betas, workspace_id, ...body } = params;
            return this._client.post('/v1/tunnels', {
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
                __span: startApiCallSpan(this._client, 'anthropic.tunnels.create', options, {
                    route: '/v1/tunnels',
                    createdIDAttribute: 'anthropic.tunnel.id',
                }),
            });
        }
        /**
         * The Tunnels API is in research preview. It requires the
         * `anthropic-beta: mcp-tunnels-2026-06-22` header and may change without a
         * deprecation period. It supersedes the Admin API endpoints at
         * `/v1/organizations/tunnels`, which remain available during a migration window.
         *
         * Fetches a tunnel by ID.
         *
         * @example
         * ```ts
         * const betaTunnel = await client.beta.tunnels.retrieve(
         *   'tunnel_id',
         * );
         * ```
         */
        retrieve(tunnelID, params = {}, options) {
            const { betas, workspace_id } = params ?? {};
            return this._client.get(path `/v1/tunnels/${tunnelID}`, {
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'mcp-tunnels-2026-06-22'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.tunnels.retrieve', options, {
                    route: '/v1/tunnels/{tunnel_id}',
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
         * Lists tunnels. Results are ordered by creation time, newest first; archived
         * tunnels are excluded unless include_archived is set.
         *
         * @example
         * ```ts
         * // Automatically fetches more pages as needed.
         * for await (const betaTunnel of client.beta.tunnels.list()) {
         *   // ...
         * }
         * ```
         */
        list(params = {}, options) {
            const { betas, workspace_id, ...query } = params ?? {};
            return this._client.getAPIList('/v1/tunnels', (PageCursor), {
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
                __span: startApiCallSpan(this._client, 'anthropic.tunnels.list', options, {
                    route: '/v1/tunnels',
                    queryParams: ['include_archived', 'limit', 'page'],
                }),
            });
        }
        /**
         * The Tunnels API is in research preview. It requires the
         * `anthropic-beta: mcp-tunnels-2026-06-22` header and may change without a
         * deprecation period. It supersedes the Admin API endpoints at
         * `/v1/organizations/tunnels`, which remain available during a migration window.
         *
         * Archives a tunnel. Archival is irreversible: every non-archived certificate on
         * the tunnel is archived in the same operation, the hostname is retired and never
         * re-allocated, and the tunnel token is invalidated. Retrying against an
         * already-archived tunnel returns the existing record unchanged.
         *
         * @example
         * ```ts
         * const betaTunnel = await client.beta.tunnels.archive(
         *   'tunnel_id',
         * );
         * ```
         */
        archive(tunnelID, params = {}, options) {
            const { betas, workspace_id } = params ?? {};
            return this._client.post(path `/v1/tunnels/${tunnelID}/archive`, {
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'mcp-tunnels-2026-06-22'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.tunnels.archive', options, {
                    route: '/v1/tunnels/{tunnel_id}/archive',
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
         * Reveals a tunnel's connector token. The value is fetched live on each call;
         * Anthropic does not store it. Repeated calls return the same value until the
         * token is rotated. Exposed as POST so the token does not appear in intermediary
         * access logs.
         *
         * @example
         * ```ts
         * const betaTunnelToken =
         *   await client.beta.tunnels.revealToken('tunnel_id');
         * ```
         */
        revealToken(tunnelID, params = {}, options) {
            const { betas, workspace_id } = params ?? {};
            return this._client.post(path `/v1/tunnels/${tunnelID}/reveal_token`, {
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'mcp-tunnels-2026-06-22'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.tunnels.reveal_token', options, {
                    route: '/v1/tunnels/{tunnel_id}/reveal_token',
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
         * Rotates a tunnel's connector token. Rotation invalidates the current token for
         * new connections and returns a fresh value; established connections are not
         * severed. A connector restarted after rotation must use the new value.
         *
         * @example
         * ```ts
         * const betaTunnelToken =
         *   await client.beta.tunnels.rotateToken('tunnel_id');
         * ```
         */
        rotateToken(tunnelID, params, options) {
            const { betas, workspace_id, ...body } = params;
            return this._client.post(path `/v1/tunnels/${tunnelID}/rotate_token`, {
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
                __span: startApiCallSpan(this._client, 'anthropic.tunnels.rotate_token', options, {
                    route: '/v1/tunnels/{tunnel_id}/rotate_token',
                    attributes: { 'anthropic.tunnel.id': tunnelID },
                }),
            });
        }
    }
    Tunnels.Certificates = Certificates;
    return Tunnels;
})();
//# sourceMappingURL=tunnels.mjs.map