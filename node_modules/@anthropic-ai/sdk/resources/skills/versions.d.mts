import { APIResource } from "../../core/resource.mjs";
import { APIPromise } from "../../core/api-promise.mjs";
import { PageCursor, type PageCursorParams, PagePromise } from "../../core/pagination.mjs";
import { type Uploadable } from "../../core/uploads.mjs";
import { RequestOptions } from "../../internal/request-options.mjs";
export declare class Versions extends APIResource {
    /**
     * Create Skill Version
     *
     * @example
     * ```ts
     * const skillVersion = await client.skills.versions.create(
     *   'skill_id',
     *   { files: [fs.createReadStream('path/to/file')] },
     * );
     * ```
     */
    create(skillID: string, params: VersionCreateParams, options?: RequestOptions): APIPromise<SkillVersion>;
    /**
     * Get Skill Version
     *
     * @example
     * ```ts
     * const skillVersion = await client.skills.versions.retrieve(
     *   'version',
     *   { skill_id: 'skill_id' },
     * );
     * ```
     */
    retrieve(version: string, params: VersionRetrieveParams, options?: RequestOptions): APIPromise<SkillVersion>;
    /**
     * List Skill Versions
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const skillVersion of client.skills.versions.list(
     *   'skill_id',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(skillID: string, params?: VersionListParams | null | undefined, options?: RequestOptions): PagePromise<SkillVersionsPageCursor, SkillVersion>;
    /**
     * Delete Skill Version
     *
     * @example
     * ```ts
     * const deletedSkillVersion =
     *   await client.skills.versions.delete('version', {
     *     skill_id: 'skill_id',
     *   });
     * ```
     */
    delete(version: string, params: VersionDeleteParams, options?: RequestOptions): APIPromise<DeletedSkillVersion>;
}
export type SkillVersionsPageCursor = PageCursor<SkillVersion>;
export interface DeletedSkillVersion {
    /**
     * Unique identifier for this Skill Version. The id addresses the version in paths
     * and pins it in references.
     */
    id: string;
    /**
     * Deleted object type.
     *
     * For Skill Versions, this is always `"skill_version_deleted"`.
     */
    type: 'skill_version_deleted';
}
export interface SkillVersion {
    /**
     * Unique identifier for this Skill Version. The id addresses the version in paths
     * and pins it in references.
     */
    id: string;
    /**
     * ISO 8601 timestamp of when the skill was created.
     */
    created_at: string;
    /**
     * Description of the skill version.
     *
     * This is extracted from the SKILL.md file in the skill upload.
     */
    description: string;
    /**
     * The Skill's immutable kebab-case slug, set at creation from the first upload's
     * SKILL.md frontmatter `name` (or its enclosing directory). Every later upload
     * must resolve to the same value. Also the top-level directory of the Skill's
     * mounted files and the base name of a downloaded archive.
     */
    name: string;
    /**
     * Unique identifier for the skill.
     *
     * The format and length of IDs may change over time.
     */
    skill_id: string;
    /**
     * Object type.
     *
     * For Skill Versions, this is always `"skill_version"`.
     */
    type: 'skill_version';
}
export interface VersionCreateParams {
    /**
     * Body param: Files to upload for the skill.
     *
     * All files must be in the same top-level directory and must include a SKILL.md
     * file at the root of that directory.
     */
    files: Array<Uploadable>;
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
export interface VersionRetrieveParams {
    /**
     * Path param: Unique identifier for the skill.
     *
     * The format and length of IDs may change over time.
     */
    skill_id: string;
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
export interface VersionListParams extends PageCursorParams {
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
export interface VersionDeleteParams {
    /**
     * Path param: Unique identifier for the skill.
     *
     * The format and length of IDs may change over time.
     */
    skill_id: string;
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
    export { type DeletedSkillVersion as DeletedSkillVersion, type SkillVersion as SkillVersion, type SkillVersionsPageCursor as SkillVersionsPageCursor, type VersionCreateParams as VersionCreateParams, type VersionRetrieveParams as VersionRetrieveParams, type VersionListParams as VersionListParams, type VersionDeleteParams as VersionDeleteParams, };
}
//# sourceMappingURL=versions.d.mts.map