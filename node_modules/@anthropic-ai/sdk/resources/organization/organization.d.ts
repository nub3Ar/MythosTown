import { APIResource } from "../../core/resource.js";
import * as APIKeysAPI from "./api-keys.js";
import { APIKey, APIKeyCreatedBy, APIKeyListParams, APIKeyOrganizationScope, APIKeyServiceAccountActor, APIKeyUpdateParams, APIKeyUserActor, APIKeyWorkspaceScope, APIKeys, APIKeysPage } from "./api-keys.js";
import * as ComplianceSettingsAPI from "./compliance-settings.js";
import { ComplianceSettingUpdateParams, ComplianceSettings, ComplianceSettingsState, ComplianceSettingsStateDisabled, ComplianceSettingsStateDisabledParam, ComplianceSettingsStateEnabled, ComplianceSettingsStateEnabledParam, ComplianceSettingsStateParam, OrganizationComplianceSettings } from "./compliance-settings.js";
import * as ExternalKeysAPI from "./external-keys.js";
import { AWSExternalKeyConfig, AzureExternalKeyConfig, AzureExternalKeyConfigParam, ExternalKey, ExternalKeyAttachedAttachment, ExternalKeyCreateParams, ExternalKeyDeleteResponse, ExternalKeyListParams, ExternalKeyUnattachedAttachment, ExternalKeyUpdateParams, ExternalKeyValidateResponse, ExternalKeys, ExternalKeysPageCursor, GCPExternalKeyConfig } from "./external-keys.js";
import * as InvitesAPI from "./invites.js";
import { InviteCreateParams, InviteDeleteResponse, InviteListParams, Invites, OrganizationInvite, OrganizationInvitesPage } from "./invites.js";
import * as RateLimitsAPI from "./rate-limits.js";
import { OrganizationRateLimit, OrganizationRateLimitBatchGroup, OrganizationRateLimitFilesGroup, OrganizationRateLimitModelGroup, OrganizationRateLimitSkillsGroup, OrganizationRateLimitTokenCountGroup, OrganizationRateLimitValue, OrganizationRateLimitWebSearchGroup, OrganizationRateLimitsPageCursor, RateLimitListParams, RateLimits } from "./rate-limits.js";
import * as UsersAPI from "./users.js";
import { OrganizationUser, OrganizationUsersPage, UserListParams, UserRemoveResponse, UserUpdateParams, Users } from "./users.js";
import * as FederationAPI from "./federation/federation.js";
import { Federation } from "./federation/federation.js";
import * as ServiceAccountsAPI from "./service-accounts/service-accounts.js";
import { ServiceAccount, ServiceAccountCreateParams, ServiceAccountListParams, ServiceAccountUpdateParams, ServiceAccountWorkspaceMember, ServiceAccounts, ServiceAccountsPageCursor } from "./service-accounts/service-accounts.js";
import * as WorkspacesAPI from "./workspaces/workspaces.js";
import { AllowedInferenceGeo, DataResidency, DataResidencyCreateConfig, DataResidencyUpdateConfig, NoBillingWorkspaceRole, Workspace, WorkspaceCreateParams, WorkspaceListParams, WorkspaceMember, WorkspaceRole, WorkspaceUpdateParams, Workspaces, WorkspacesPage } from "./workspaces/workspaces.js";
import { APIPromise } from "../../core/api-promise.js";
import { RequestOptions } from "../../internal/request-options.js";
export declare class Organization extends APIResource {
    apiKeys: APIKeysAPI.APIKeys;
    externalKeys: ExternalKeysAPI.ExternalKeys;
    federation: FederationAPI.Federation;
    invites: InvitesAPI.Invites;
    serviceAccounts: ServiceAccountsAPI.ServiceAccounts;
    users: UsersAPI.Users;
    workspaces: WorkspacesAPI.Workspaces;
    rateLimits: RateLimitsAPI.RateLimits;
    complianceSettings: ComplianceSettingsAPI.ComplianceSettings;
    /**
     * Retrieve information about the organization associated with the authenticated
     * API key.
     *
     * @example
     * ```ts
     * const organizationInfo =
     *   await client.organization.retrieve();
     * ```
     */
    retrieve(options?: RequestOptions): APIPromise<OrganizationInfo>;
}
export interface OrganizationInfo {
    /**
     * ID of the Organization.
     */
    id: string;
    /**
     * Name of the Organization.
     */
    name: string;
    /**
     * Object type.
     *
     * For Organizations, this is always `"organization"`.
     */
    type: 'organization';
}
export type OrganizationRole = 'admin' | 'billing' | 'claude_code_user' | 'developer' | 'managed' | 'membership_admin' | 'owner' | 'primary_owner' | 'user';
export declare namespace Organization {
    export { type OrganizationInfo as OrganizationInfo, type OrganizationRole as OrganizationRole };
    export { APIKeys as APIKeys, type APIKey as APIKey, type APIKeyCreatedBy as APIKeyCreatedBy, type APIKeyOrganizationScope as APIKeyOrganizationScope, type APIKeyServiceAccountActor as APIKeyServiceAccountActor, type APIKeyUserActor as APIKeyUserActor, type APIKeyWorkspaceScope as APIKeyWorkspaceScope, type APIKeysPage as APIKeysPage, type APIKeyUpdateParams as APIKeyUpdateParams, type APIKeyListParams as APIKeyListParams, };
    export { ExternalKeys as ExternalKeys, type AWSExternalKeyConfig as AWSExternalKeyConfig, type AzureExternalKeyConfig as AzureExternalKeyConfig, type AzureExternalKeyConfigParam as AzureExternalKeyConfigParam, type ExternalKey as ExternalKey, type ExternalKeyAttachedAttachment as ExternalKeyAttachedAttachment, type ExternalKeyUnattachedAttachment as ExternalKeyUnattachedAttachment, type GCPExternalKeyConfig as GCPExternalKeyConfig, type ExternalKeyDeleteResponse as ExternalKeyDeleteResponse, type ExternalKeyValidateResponse as ExternalKeyValidateResponse, type ExternalKeysPageCursor as ExternalKeysPageCursor, type ExternalKeyCreateParams as ExternalKeyCreateParams, type ExternalKeyUpdateParams as ExternalKeyUpdateParams, type ExternalKeyListParams as ExternalKeyListParams, };
    export { Federation as Federation };
    export { Invites as Invites, type OrganizationInvite as OrganizationInvite, type InviteDeleteResponse as InviteDeleteResponse, type OrganizationInvitesPage as OrganizationInvitesPage, type InviteCreateParams as InviteCreateParams, type InviteListParams as InviteListParams, };
    export { ServiceAccounts as ServiceAccounts, type ServiceAccount as ServiceAccount, type ServiceAccountWorkspaceMember as ServiceAccountWorkspaceMember, type ServiceAccountsPageCursor as ServiceAccountsPageCursor, type ServiceAccountCreateParams as ServiceAccountCreateParams, type ServiceAccountUpdateParams as ServiceAccountUpdateParams, type ServiceAccountListParams as ServiceAccountListParams, };
    export { Users as Users, type OrganizationUser as OrganizationUser, type UserRemoveResponse as UserRemoveResponse, type OrganizationUsersPage as OrganizationUsersPage, type UserUpdateParams as UserUpdateParams, type UserListParams as UserListParams, };
    export { Workspaces as Workspaces, type AllowedInferenceGeo as AllowedInferenceGeo, type DataResidency as DataResidency, type DataResidencyCreateConfig as DataResidencyCreateConfig, type DataResidencyUpdateConfig as DataResidencyUpdateConfig, type NoBillingWorkspaceRole as NoBillingWorkspaceRole, type Workspace as Workspace, type WorkspaceMember as WorkspaceMember, type WorkspaceRole as WorkspaceRole, type WorkspacesPage as WorkspacesPage, type WorkspaceCreateParams as WorkspaceCreateParams, type WorkspaceUpdateParams as WorkspaceUpdateParams, type WorkspaceListParams as WorkspaceListParams, };
    export { RateLimits as RateLimits, type OrganizationRateLimit as OrganizationRateLimit, type OrganizationRateLimitBatchGroup as OrganizationRateLimitBatchGroup, type OrganizationRateLimitFilesGroup as OrganizationRateLimitFilesGroup, type OrganizationRateLimitModelGroup as OrganizationRateLimitModelGroup, type OrganizationRateLimitSkillsGroup as OrganizationRateLimitSkillsGroup, type OrganizationRateLimitTokenCountGroup as OrganizationRateLimitTokenCountGroup, type OrganizationRateLimitValue as OrganizationRateLimitValue, type OrganizationRateLimitWebSearchGroup as OrganizationRateLimitWebSearchGroup, type OrganizationRateLimitsPageCursor as OrganizationRateLimitsPageCursor, type RateLimitListParams as RateLimitListParams, };
    export { ComplianceSettings as ComplianceSettings, type ComplianceSettingsState as ComplianceSettingsState, type ComplianceSettingsStateDisabled as ComplianceSettingsStateDisabled, type ComplianceSettingsStateDisabledParam as ComplianceSettingsStateDisabledParam, type ComplianceSettingsStateEnabled as ComplianceSettingsStateEnabled, type ComplianceSettingsStateEnabledParam as ComplianceSettingsStateEnabledParam, type ComplianceSettingsStateParam as ComplianceSettingsStateParam, type OrganizationComplianceSettings as OrganizationComplianceSettings, type ComplianceSettingUpdateParams as ComplianceSettingUpdateParams, };
}
//# sourceMappingURL=organization.d.ts.map