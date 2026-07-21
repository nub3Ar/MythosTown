import { APIResource } from "../../../core/resource.mjs";
import * as WorkspacesAPI from "./workspaces.mjs";
import { WorkspaceMembersPage } from "./workspaces.mjs";
import { APIPromise } from "../../../core/api-promise.mjs";
import { type PageParams, PagePromise } from "../../../core/pagination.mjs";
import { RequestOptions } from "../../../internal/request-options.mjs";
export declare class Members extends APIResource {
    /**
     * Get Workspace Member
     *
     * @example
     * ```ts
     * const workspaceMember =
     *   await client.organization.workspaces.members.retrieve(
     *     'user_id',
     *     { workspace_id: 'workspace_id' },
     *   );
     * ```
     */
    retrieve(userID: string, params: MemberRetrieveParams, options?: RequestOptions): APIPromise<WorkspacesAPI.WorkspaceMember>;
    /**
     * Update Workspace Member
     *
     * @example
     * ```ts
     * const workspaceMember =
     *   await client.organization.workspaces.members.update(
     *     'user_id',
     *     {
     *       workspace_id: 'workspace_id',
     *       workspace_role: 'workspace_admin',
     *     },
     *   );
     * ```
     */
    update(userID: string, params: MemberUpdateParams, options?: RequestOptions): APIPromise<WorkspacesAPI.WorkspaceMember>;
    /**
     * List Workspace Members
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const workspaceMember of client.organization.workspaces.members.list(
     *   'workspace_id',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(workspaceID: string, query?: MemberListParams | null | undefined, options?: RequestOptions): PagePromise<WorkspaceMembersPage, WorkspacesAPI.WorkspaceMember>;
    /**
     * Create Workspace Member
     *
     * @example
     * ```ts
     * const workspaceMember =
     *   await client.organization.workspaces.members.add(
     *     'workspace_id',
     *     {
     *       user_id: 'user_01WCz1FkmYMm4gnmykNKUu3Q',
     *       workspace_role: 'workspace_admin',
     *     },
     *   );
     * ```
     */
    add(workspaceID: string, body: MemberAddParams, options?: RequestOptions): APIPromise<WorkspacesAPI.WorkspaceMember>;
    /**
     * Delete Workspace Member
     *
     * @example
     * ```ts
     * const member =
     *   await client.organization.workspaces.members.remove(
     *     'user_id',
     *     { workspace_id: 'workspace_id' },
     *   );
     * ```
     */
    remove(userID: string, params: MemberRemoveParams, options?: RequestOptions): APIPromise<MemberRemoveResponse>;
}
export interface MemberRemoveResponse {
    /**
     * Deleted object type.
     *
     * For Workspace Members, this is always `"workspace_member_deleted"`.
     */
    type: 'workspace_member_deleted';
    /**
     * ID of the User.
     */
    user_id: string;
    /**
     * ID of the Workspace.
     */
    workspace_id: string;
}
export interface MemberRetrieveParams {
    /**
     * ID of the Workspace.
     */
    workspace_id: string;
}
export interface MemberUpdateParams {
    /**
     * Path param: ID of the Workspace.
     */
    workspace_id: string;
    /**
     * Body param: New workspace role for the User.
     */
    workspace_role: WorkspacesAPI.WorkspaceRole;
}
export interface MemberListParams extends PageParams {
}
export interface MemberAddParams {
    /**
     * ID of the User.
     */
    user_id: string;
    /**
     * Role of the new Workspace Member. Cannot be `workspace_billing`.
     */
    workspace_role: WorkspacesAPI.NoBillingWorkspaceRole;
}
export interface MemberRemoveParams {
    /**
     * ID of the Workspace.
     */
    workspace_id: string;
}
export declare namespace Members {
    export { type MemberRemoveResponse as MemberRemoveResponse, type MemberRetrieveParams as MemberRetrieveParams, type MemberUpdateParams as MemberUpdateParams, type MemberListParams as MemberListParams, type MemberAddParams as MemberAddParams, type MemberRemoveParams as MemberRemoveParams, };
}
export { type WorkspaceMembersPage };
//# sourceMappingURL=members.d.mts.map