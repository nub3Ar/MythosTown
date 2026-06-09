"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skills = void 0;
const tslib_1 = require("../../internal/tslib.js");
const resource_1 = require("../../core/resource.js");
const VersionsAPI = tslib_1.__importStar(require("./versions.js"));
const versions_1 = require("./versions.js");
const pagination_1 = require("../../core/pagination.js");
const headers_1 = require("../../internal/headers.js");
const tracing_1 = require("../../internal/tracing.js");
const uploads_1 = require("../../internal/uploads.js");
const path_1 = require("../../internal/utils/path.js");
var Skills = /* @__PURE__ */ (() => {
    class Skills extends resource_1.APIResource {
        constructor() {
            super(...arguments);
            this.versions = new VersionsAPI.Versions(this._client);
        }
        /**
         * Create Skill
         *
         * @example
         * ```ts
         * const skill = await client.skills.create({
         *   files: [fs.createReadStream('path/to/file')],
         * });
         * ```
         */
        create(params, options) {
            const { workspace_id, ...body } = params;
            return this._client.post('/v1/skills', (0, uploads_1.multipartFormRequestOptions)({
                body,
                ...options,
                headers: (0, headers_1.buildHeaders)([
                    { ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined) },
                    options?.headers,
                ]),
                __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.skills.create', options, {
                    route: '/v1/skills',
                    createdIDAttribute: 'anthropic.skill.id',
                }),
            }, this._client, false));
        }
        /**
         * Get Skill
         *
         * @example
         * ```ts
         * const skill = await client.skills.retrieve('skill_id');
         * ```
         */
        retrieve(skillID, params = {}, options) {
            const { workspace_id } = params ?? {};
            return this._client.get((0, path_1.path) `/v1/skills/${skillID}`, {
                ...options,
                headers: (0, headers_1.buildHeaders)([
                    { ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined) },
                    options?.headers,
                ]),
                __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.skills.retrieve', options, {
                    route: '/v1/skills/{skill_id}',
                    attributes: { 'anthropic.skill.id': skillID },
                }),
            });
        }
        /**
         * List Skills
         *
         * @example
         * ```ts
         * // Automatically fetches more pages as needed.
         * for await (const skill of client.skills.list()) {
         *   // ...
         * }
         * ```
         */
        list(params = {}, options) {
            const { workspace_id, ...query } = params ?? {};
            return this._client.getAPIList('/v1/skills', (pagination_1.PageCursor), {
                query,
                ...options,
                headers: (0, headers_1.buildHeaders)([
                    { ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined) },
                    options?.headers,
                ]),
                __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.skills.list', options, {
                    route: '/v1/skills',
                    queryParams: ['limit', 'page', 'source'],
                }),
            });
        }
        /**
         * Delete Skill
         *
         * @example
         * ```ts
         * const deletedSkill = await client.skills.delete('skill_id');
         * ```
         */
        delete(skillID, params = {}, options) {
            const { workspace_id } = params ?? {};
            return this._client.delete((0, path_1.path) `/v1/skills/${skillID}`, {
                ...options,
                headers: (0, headers_1.buildHeaders)([
                    { ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined) },
                    options?.headers,
                ]),
                __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.skills.delete', options, {
                    route: '/v1/skills/{skill_id}',
                    attributes: { 'anthropic.skill.id': skillID },
                }),
            });
        }
    }
    Skills.Versions = versions_1.Versions;
    return Skills;
})();
exports.Skills = Skills;
//# sourceMappingURL=skills.js.map