"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Versions = void 0;
const resource_1 = require("../../core/resource.js");
const pagination_1 = require("../../core/pagination.js");
const headers_1 = require("../../internal/headers.js");
const tracing_1 = require("../../internal/tracing.js");
const uploads_1 = require("../../internal/uploads.js");
const path_1 = require("../../internal/utils/path.js");
class Versions extends resource_1.APIResource {
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
    create(skillID, params, options) {
        const { workspace_id, ...body } = params;
        return this._client.post((0, path_1.path) `/v1/skills/${skillID}/versions`, (0, uploads_1.multipartFormRequestOptions)({
            body,
            ...options,
            headers: (0, headers_1.buildHeaders)([
                { ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined) },
                options?.headers,
            ]),
            __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.skills.versions.create', options, {
                route: '/v1/skills/{skill_id}/versions',
                attributes: { 'anthropic.skill.id': skillID },
                createdIDAttribute: 'anthropic.skill.version.id',
            }),
        }, this._client, false));
    }
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
    retrieve(version, params, options) {
        const { skill_id, workspace_id } = params;
        return this._client.get((0, path_1.path) `/v1/skills/${skill_id}/versions/${version}`, {
            ...options,
            headers: (0, headers_1.buildHeaders)([
                { ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined) },
                options?.headers,
            ]),
            __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.skills.versions.retrieve', options, {
                route: '/v1/skills/{skill_id}/versions/{version}',
                attributes: { 'anthropic.skill.id': skill_id, 'anthropic.skill.version.id': version },
            }),
        });
    }
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
    list(skillID, params = {}, options) {
        const { workspace_id, ...query } = params ?? {};
        return this._client.getAPIList((0, path_1.path) `/v1/skills/${skillID}/versions`, (pagination_1.PageCursor), {
            query,
            ...options,
            headers: (0, headers_1.buildHeaders)([
                { ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined) },
                options?.headers,
            ]),
            __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.skills.versions.list', options, {
                route: '/v1/skills/{skill_id}/versions',
                queryParams: ['limit', 'page'],
                attributes: { 'anthropic.skill.id': skillID },
            }),
        });
    }
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
    delete(version, params, options) {
        const { skill_id, workspace_id } = params;
        return this._client.delete((0, path_1.path) `/v1/skills/${skill_id}/versions/${version}`, {
            ...options,
            headers: (0, headers_1.buildHeaders)([
                { ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined) },
                options?.headers,
            ]),
            __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.skills.versions.delete', options, {
                route: '/v1/skills/{skill_id}/versions/{version}',
                attributes: { 'anthropic.skill.id': skill_id, 'anthropic.skill.version.id': version },
            }),
        });
    }
}
exports.Versions = Versions;
//# sourceMappingURL=versions.js.map