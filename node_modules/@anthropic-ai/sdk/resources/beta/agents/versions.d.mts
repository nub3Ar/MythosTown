import { APIResource } from "../../../core/resource.mjs";
import * as BetaAPI from "../beta.mjs";
import * as AgentsAPI from "./agents.mjs";
import { BetaManagedAgentsAgentsPageCursor } from "./agents.mjs";
import { type PageCursorParams, PagePromise } from "../../../core/pagination.mjs";
import { RequestOptions } from "../../../internal/request-options.mjs";
export declare class Versions extends APIResource {
    /**
     * List Agent Versions
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const betaManagedAgentsAgent of client.beta.agents.versions.list(
     *   'agent_011CZkYpogX7uDKUyvBTophP',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(agentID: string, params?: VersionListParams | null | undefined, options?: RequestOptions): PagePromise<BetaManagedAgentsAgentsPageCursor, AgentsAPI.BetaManagedAgentsAgent>;
}
export interface VersionListParams extends PageCursorParams {
    /**
     * Header param: This endpoint is in beta: requests must send
     * `managed-agents-2026-04-01` in this header.
     */
    betas?: Array<BetaAPI.AnthropicBeta>;
    /**
     * Header param: Optional header to select the Workspace for this request. The
     * value is a Workspace ID (for example, `wrkspc_011CZkZaBF1tNoB5wlCeusgy`).
     *
     * Only needed for credentials that can act on more than one Workspace. A
     * credential that belongs to a specific Workspace may omit it; if sent, it must
     * match that Workspace.
     */
    workspace_id?: string;
}
export declare namespace Versions {
    export { type VersionListParams as VersionListParams };
}
export { type BetaManagedAgentsAgentsPageCursor };
//# sourceMappingURL=versions.d.mts.map