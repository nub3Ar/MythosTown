import { APIResource } from "../../../core/resource.mjs";
import { PageCursor } from "../../../core/pagination.mjs";
import { buildHeaders } from "../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../internal/tracing.mjs";
import { multipartFormRequestOptions } from "../../../internal/uploads.mjs";
import { path } from "../../../internal/utils/path.mjs";
export class Versions extends APIResource {
    /**
     * Create Skill Version
     *
     * @example
     * ```ts
     * const betaSkillVersion =
     *   await client.beta.skills.versions.create('skill_id', {
     *     files: [fs.createReadStream('path/to/file')],
     *   });
     * ```
     */
    create(skillID, params, options) {
        const { betas, workspace_id, ...body } = params;
        return this._client.post(path `/v1/skills/${skillID}/versions`, multipartFormRequestOptions({
            body,
            ...options,
            headers: buildHeaders([
                {
                    ...(betas?.toString() != null ? { 'anthropic-beta': betas?.toString() } : undefined),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.skills.versions.create', options, {
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
     * const betaSkillVersion =
     *   await client.beta.skills.versions.retrieve('version', {
     *     skill_id: 'skill_id',
     *   });
     * ```
     */
    retrieve(version, params, options) {
        const { skill_id, betas, workspace_id } = params;
        return this._client.get(path `/v1/skills/${skill_id}/versions/${version}`, {
            ...options,
            headers: buildHeaders([
                {
                    ...(betas?.toString() != null ? { 'anthropic-beta': betas?.toString() } : undefined),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.skills.versions.retrieve', options, {
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
     * for await (const betaSkillVersion of client.beta.skills.versions.list(
     *   'skill_id',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(skillID, params = {}, options) {
        const { betas, workspace_id, ...query } = params ?? {};
        return this._client.getAPIList(path `/v1/skills/${skillID}/versions`, (PageCursor), {
            query,
            ...options,
            headers: buildHeaders([
                {
                    ...(betas?.toString() != null ? { 'anthropic-beta': betas?.toString() } : undefined),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.skills.versions.list', options, {
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
     * const betaDeletedSkillVersion =
     *   await client.beta.skills.versions.delete('version', {
     *     skill_id: 'skill_id',
     *   });
     * ```
     */
    delete(version, params, options) {
        const { skill_id, betas, workspace_id } = params;
        return this._client.delete(path `/v1/skills/${skill_id}/versions/${version}`, {
            ...options,
            headers: buildHeaders([
                {
                    ...(betas?.toString() != null ? { 'anthropic-beta': betas?.toString() } : undefined),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.skills.versions.delete', options, {
                route: '/v1/skills/{skill_id}/versions/{version}',
                attributes: { 'anthropic.skill.id': skill_id, 'anthropic.skill.version.id': version },
            }),
        });
    }
    /**
     * Download a skill version's content as a zip archive.
     *
     * @example
     * ```ts
     * const response = await client.beta.skills.versions.download(
     *   'version',
     *   { skill_id: 'skill_id' },
     * );
     *
     * const content = await response.blob();
     * console.log(content);
     * ```
     */
    download(version, params, options) {
        const { skill_id, betas, workspace_id } = params;
        return this._client.get(path `/v1/skills/${skill_id}/versions/${version}/content`, {
            ...options,
            headers: buildHeaders([
                {
                    Accept: 'application/binary',
                    ...(betas?.toString() != null ? { 'anthropic-beta': betas?.toString() } : undefined),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __binaryResponse: true,
            __span: startApiCallSpan(this._client, 'anthropic.skills.versions.download', options, {
                route: '/v1/skills/{skill_id}/versions/{version}/content',
                attributes: { 'anthropic.skill.id': skill_id, 'anthropic.skill.version.id': version },
            }),
        });
    }
}
//# sourceMappingURL=versions.mjs.map