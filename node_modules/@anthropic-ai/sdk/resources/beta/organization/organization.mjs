import { APIResource } from "../../../core/resource.mjs";
import * as APIKeysAPI from "./api-keys.mjs";
import { APIKeys, } from "./api-keys.mjs";
import * as ComplianceSettingsAPI from "./compliance-settings.mjs";
import { ComplianceSettings, } from "./compliance-settings.mjs";
import * as ExternalKeysAPI from "./external-keys.mjs";
import { ExternalKeys, } from "./external-keys.mjs";
import * as InvitesAPI from "./invites.mjs";
import { Invites, } from "./invites.mjs";
import * as PluginMarketplacesAPI from "./plugin-marketplaces.mjs";
import { PluginMarketplaces, } from "./plugin-marketplaces.mjs";
import * as RateLimitsAPI from "./rate-limits.mjs";
import { RateLimits, } from "./rate-limits.mjs";
import * as UsersAPI from "./users.mjs";
import { Users, } from "./users.mjs";
import * as WebhooksAPI from "./webhooks.mjs";
import { Webhooks, } from "./webhooks.mjs";
import * as AnalyticsAPI from "./analytics/analytics.mjs";
import { Analytics, } from "./analytics/analytics.mjs";
import * as ClaudeTagAPI from "./claude-tag/claude-tag.mjs";
import { ClaudeTag, } from "./claude-tag/claude-tag.mjs";
import * as FederationAPI from "./federation/federation.mjs";
import { Federation } from "./federation/federation.mjs";
import * as PluginsAPI from "./plugins/plugins.mjs";
import { Plugins, } from "./plugins/plugins.mjs";
import * as RBACGroupsAPI from "./rbac-groups/rbac-groups.mjs";
import { RBACGroups, } from "./rbac-groups/rbac-groups.mjs";
import * as RBACRolesAPI from "./rbac-roles/rbac-roles.mjs";
import { RBACRoles, } from "./rbac-roles/rbac-roles.mjs";
import * as ServiceAccountsAPI from "./service-accounts/service-accounts.mjs";
import { ServiceAccounts, } from "./service-accounts/service-accounts.mjs";
import * as SpendLimitsAPI from "./spend-limits/spend-limits.mjs";
import { SpendLimits, } from "./spend-limits/spend-limits.mjs";
import * as TelemetryDestinationsAPI from "./telemetry-destinations/telemetry-destinations.mjs";
import { TelemetryDestinations, } from "./telemetry-destinations/telemetry-destinations.mjs";
import * as WorkspacesAPI from "./workspaces/workspaces.mjs";
import { Workspaces, } from "./workspaces/workspaces.mjs";
import { startApiCallSpan } from "../../../internal/tracing.mjs";
export var Organization = /* @__PURE__ */ (() => {
    class Organization extends APIResource {
        constructor() {
            super(...arguments);
            this.apiKeys = new APIKeysAPI.APIKeys(this._client);
            this.externalKeys = new ExternalKeysAPI.ExternalKeys(this._client);
            this.federation = new FederationAPI.Federation(this._client);
            this.invites = new InvitesAPI.Invites(this._client);
            this.serviceAccounts = new ServiceAccountsAPI.ServiceAccounts(this._client);
            this.users = new UsersAPI.Users(this._client);
            this.workspaces = new WorkspacesAPI.Workspaces(this._client);
            this.rateLimits = new RateLimitsAPI.RateLimits(this._client);
            this.complianceSettings = new ComplianceSettingsAPI.ComplianceSettings(this._client);
            this.analytics = new AnalyticsAPI.Analytics(this._client);
            this.spendLimits = new SpendLimitsAPI.SpendLimits(this._client);
            this.rbacGroups = new RBACGroupsAPI.RBACGroups(this._client);
            this.rbacRoles = new RBACRolesAPI.RBACRoles(this._client);
            this.plugins = new PluginsAPI.Plugins(this._client);
            this.pluginMarketplaces = new PluginMarketplacesAPI.PluginMarketplaces(this._client);
            this.telemetryDestinations = new TelemetryDestinationsAPI.TelemetryDestinations(this._client);
            this.webhooks = new WebhooksAPI.Webhooks(this._client);
            this.claudeTag = new ClaudeTagAPI.ClaudeTag(this._client);
        }
        /**
         * Retrieve information about the organization associated with the authenticated
         * API key.
         *
         * @example
         * ```ts
         * const betaOrganization =
         *   await client.beta.organization.retrieve();
         * ```
         */
        retrieve(options) {
            return this._client.get('/v1/organizations/me', {
                ...options,
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.organization.retrieve', options, {
                    route: '/v1/organizations/me',
                }),
            });
        }
    }
    Organization.APIKeys = APIKeys;
    Organization.ExternalKeys = ExternalKeys;
    Organization.Federation = Federation;
    Organization.Invites = Invites;
    Organization.ServiceAccounts = ServiceAccounts;
    Organization.Users = Users;
    Organization.Workspaces = Workspaces;
    Organization.RateLimits = RateLimits;
    Organization.ComplianceSettings = ComplianceSettings;
    Organization.Analytics = Analytics;
    Organization.SpendLimits = SpendLimits;
    Organization.RBACGroups = RBACGroups;
    Organization.RBACRoles = RBACRoles;
    Organization.Plugins = Plugins;
    Organization.PluginMarketplaces = PluginMarketplaces;
    Organization.TelemetryDestinations = TelemetryDestinations;
    Organization.Webhooks = Webhooks;
    Organization.ClaudeTag = ClaudeTag;
    return Organization;
})();
//# sourceMappingURL=organization.mjs.map