import { APIResource } from "../../../../core/resource.mjs";
import * as InstallationSettingsAPI from "./installation-settings.mjs";
import { InstallationSettings, } from "./installation-settings.mjs";
import * as SharesAPI from "./shares.mjs";
import { Shares } from "./shares.mjs";
import * as VersionsAPI from "./versions.mjs";
import { Versions, } from "./versions.mjs";
import { PageCursor } from "../../../../core/pagination.mjs";
import { buildHeaders } from "../../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../../internal/tracing.mjs";
import { multipartFormRequestOptions } from "../../../../internal/uploads.mjs";
import { path } from "../../../../internal/utils/path.mjs";
export var Plugins = /* @__PURE__ */ (() => {
    class Plugins extends APIResource {
        constructor() {
            super(...arguments);
            this.versions = new VersionsAPI.Versions(this._client);
            this.installationSettings = new InstallationSettingsAPI.InstallationSettings(this._client);
            this.shares = new SharesAPI.Shares(this._client);
        }
        /**
         * Create an organization-owned Plugin and its first version by uploading the
         * version's files.
         *
         * The upload is `multipart/form-data`: the version's files (`files`, each part
         * sent as `files[]`), with an optional `marketplace_id` and `release_notes`. The
         * manifest's `name` becomes the Plugin's `name`, and `display_name`, `description`
         * and `manifest_version` come from the manifest too.
         *
         * `name` may contain lowercase letters (from any alphabet), digits, and hyphens,
         * up to 64 characters. Uppercase letters, spaces, underscores, and other
         * punctuation are rejected.
         *
         * The `name` must be unique within the marketplace: a name already taken returns a
         * 409 with `error_code` `plugin_name_taken` and, when a Plugin holds it, that
         * Plugin's ID in `details.plugin_id`. A Plugin going into the organization's
         * library marketplace is also refused with a 409 when one of its skills has the
         * name of an organization skill (a skill an administrator uploaded for the whole
         * organization in claude.ai): `error_code` `skill_name_taken`, with that name in
         * `details.skill_name`; rename the skill, or remove the organization skill in
         * claude.ai. A 503 with `error_code` `registration_pending` means the Plugin and
         * its version were stored (their IDs are in `details`) but are not yet usable in
         * claude.ai: do not retry the create (the retry would return `plugin_name_taken`);
         * create a version on the stored Plugin instead, which completes it.
         *
         * For a worked example, see
         * [Create a plugin](/docs/en/manage-claude/plugins-api#create-a-plugin) in the
         * Plugins API guide.
         *
         * **Accepted credentials:** an Admin API key with the `write:plugins` scope.
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
         * const betaPlugin =
         *   await client.beta.organization.plugins.create({
         *     files: [fs.createReadStream('path/to/file')],
         *   });
         * ```
         */
        create(params, options) {
            const { betas, ...body } = params;
            return this._client.post('/v1/organizations/plugins', multipartFormRequestOptions({
                body,
                ...options,
                headers: buildHeaders([
                    { 'anthropic-beta': [...(betas ?? []), 'ce-plugins-2026-09-01'].toString() },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.organization.plugins.create', options, {
                    route: '/v1/organizations/plugins',
                    createdIDAttribute: 'anthropic.organization.plugin.id',
                }),
            }, this._client));
        }
        /**
         * Retrieve a Plugin by ID.
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
         * const betaPlugin =
         *   await client.beta.organization.plugins.retrieve(
         *     'plugin_id',
         *   );
         * ```
         */
        retrieve(pluginID, params = {}, options) {
            const { betas, ...query } = params ?? {};
            return this._client.get(path `/v1/organizations/plugins/${pluginID}`, {
                query,
                ...options,
                headers: buildHeaders([
                    { 'anthropic-beta': [...(betas ?? []), 'ce-plugins-2026-09-01'].toString() },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.organization.plugins.retrieve', options, {
                    route: '/v1/organizations/plugins/{plugin_id}',
                    queryParams: ['organization_id'],
                    attributes: { 'anthropic.organization.plugin.id': pluginID },
                }),
            });
        }
        /**
         * Change which stored version of an organization-owned Plugin is served to
         * members, for example to roll back to an earlier one. This pins the served
         * version: later uploads are stored but no longer change what is served, and
         * pinning cannot currently be undone, here or in claude.ai.
         *
         * Pass the version as `served_version_id`: an earlier one to roll back, a later
         * one to start serving a version that was stored without being served, or the one
         * already served to pin it without changing what is served. No new version is
         * created.
         *
         * When the organization has content scanning enabled, a version whose
         * `content_scan.status` is `processing` is refused with a 409 (`error_code`
         * `scan_pending`; retry once the scan finishes). A version whose
         * `content_scan.status` is `errored`, or whose `content_scan.assessment` is `fail`
         * or `unknown`, is refused with a 400 (`error_code` `scan_failed`); a `warn` is
         * accepted. If the scan outcome cannot be read at that moment, the request fails
         * with a retryable 503 instead. When the Plugin is in the organization's library
         * marketplace, a version other than the one served is also refused with a 409 when
         * one of its skills has a name that an organization skill (one an administrator
         * uploaded for the whole organization in claude.ai) has since taken: `error_code`
         * `skill_name_taken`, with that name in `details.skill_name`. A member-owned
         * Plugin cannot be updated here (403).
         *
         * This endpoint does not write installation settings; they are written at
         * `/v1/organizations/plugins/{plugin_id}/installation_settings/{target}`.
         *
         * **Accepted credentials:** an Admin API key with the `write:plugins` scope.
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
         * const betaPlugin =
         *   await client.beta.organization.plugins.update(
         *     'plugin_id',
         *     {
         *       served_version_id:
         *         'pluginver_01KaZmQpRsTuVwXyZ2b4c6d8',
         *     },
         *   );
         * ```
         */
        update(pluginID, params, options) {
            const { betas, ...body } = params;
            return this._client.post(path `/v1/organizations/plugins/${pluginID}`, {
                body,
                ...options,
                headers: buildHeaders([
                    { 'anthropic-beta': [...(betas ?? []), 'ce-plugins-2026-09-01'].toString() },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.organization.plugins.update', options, {
                    route: '/v1/organizations/plugins/{plugin_id}',
                    attributes: { 'anthropic.organization.plugin.id': pluginID },
                }),
            });
        }
        /**
         * List the Plugins created under the organization, newest first: those in the
         * organization's own plugin marketplaces and those in members' personal plugin
         * marketplaces.
         *
         * Plugins in members' personal marketplaces are listed with the same detail as the
         * organization's own, and their files can be downloaded through the version
         * archive endpoint, which records each such download on the Compliance API
         * activity feed.
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
         * for await (const betaPlugin of client.beta.organization.plugins.list()) {
         *   // ...
         * }
         * ```
         */
        list(params = {}, options) {
            const { betas, ...query } = params ?? {};
            return this._client.getAPIList('/v1/organizations/plugins', (PageCursor), {
                query,
                ...options,
                headers: buildHeaders([
                    { 'anthropic-beta': [...(betas ?? []), 'ce-plugins-2026-09-01'].toString() },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.organization.plugins.list', options, {
                    route: '/v1/organizations/plugins',
                    queryParams: [
                        'created_at[gt]',
                        'created_at[gte]',
                        'created_at[lt]',
                        'created_at[lte]',
                        'limit',
                        'marketplace_id',
                        'organization_id',
                        'owner_type',
                        'owner_user_id',
                        'page',
                    ],
                }),
            });
        }
        /**
         * Permanently delete a Plugin and every version it holds, exactly as when an
         * administrator deletes it in claude.ai. The Plugin may belong to the organization
         * or to a member, including a member who has since left the organization.
         *
         * An organization-owned Plugin's installation settings go with it; a member-owned
         * Plugin's shares are withdrawn and its owner no longer has it.
         *
         * To take an organization-owned Plugin out of use reversibly, set its
         * organization-wide installation setting to `not_available` instead (and remove or
         * change any group settings, which override it for their members). Only a Plugin
         * in a `manual` marketplace can be deleted here; one synchronized from a
         * repository is removed by removing it from the repository (400).
         *
         * **Accepted credentials:** an Admin API key with the `write:plugins` scope.
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
         * const betaDeletedPlugin =
         *   await client.beta.organization.plugins.delete(
         *     'plugin_id',
         *   );
         * ```
         */
        delete(pluginID, params = {}, options) {
            const { betas } = params ?? {};
            return this._client.delete(path `/v1/organizations/plugins/${pluginID}`, {
                ...options,
                headers: buildHeaders([
                    { 'anthropic-beta': [...(betas ?? []), 'ce-plugins-2026-09-01'].toString() },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.organization.plugins.delete', options, {
                    route: '/v1/organizations/plugins/{plugin_id}',
                    attributes: { 'anthropic.organization.plugin.id': pluginID },
                }),
            });
        }
    }
    Plugins.Versions = Versions;
    Plugins.InstallationSettings = InstallationSettings;
    Plugins.Shares = Shares;
    return Plugins;
})();
//# sourceMappingURL=plugins.mjs.map