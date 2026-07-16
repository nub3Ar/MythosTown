import { APIResource } from "../../../../core/resource.mjs";
import { PageCursor } from "../../../../core/pagination.mjs";
import { buildHeaders } from "../../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../../internal/tracing.mjs";
import { path } from "../../../../internal/utils/path.mjs";
export class Shares extends APIResource {
    /**
     * List the shares the owner of a member-owned Plugin has given — to every member
     * of the organization, to an RBAC Group, or to one member — most recently granted
     * first.
     *
     * Shares are read-only in this API: members give and withdraw them in claude.ai,
     * and who gave a share is recorded on the Compliance API activity feed rather than
     * on the share. An organization-owned Plugin has installation settings instead, so
     * this path returns 404 for one.
     *
     * **Accepted credentials:** an Admin API key with the `read:plugins` or
     * `read:org_audit` scope, or a Compliance Access Key with the
     * `read:compliance_org_data` scope.
     *
     * Every request must include the beta header
     * `anthropic-beta: ce-plugins-2026-09-01`. A request without it returns `404`,
     * exactly as if the endpoint did not exist. The Plugins API is in beta and is
     * available to Claude Enterprise organizations only. It is not available to Claude
     * Platform (Claude Console) organizations, or to organizations with HIPAA
     * readiness enabled.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const betaPluginShare of client.beta.organization.plugins.shares.list(
     *   'plugin_id',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(pluginID, params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.getAPIList(path `/v1/organizations/plugins/${pluginID}/shares`, (PageCursor), {
            query,
            ...options,
            headers: buildHeaders([
                { 'anthropic-beta': [...(betas ?? []), 'ce-plugins-2026-09-01'].toString() },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.organization.plugins.shares.list', options, {
                route: '/v1/organizations/plugins/{plugin_id}/shares',
                queryParams: ['limit', 'organization_id', 'page', 'target_type'],
                attributes: { 'anthropic.organization.plugin.id': pluginID },
            }),
        });
    }
}
//# sourceMappingURL=shares.mjs.map