"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Files = void 0;
const resource_1 = require("../core/resource.js");
const pagination_1 = require("../core/pagination.js");
const headers_1 = require("../internal/headers.js");
const tracing_1 = require("../internal/tracing.js");
const stainless_helper_header_1 = require("../internal/stainless-helper-header.js");
const uploads_1 = require("../internal/uploads.js");
const path_1 = require("../internal/utils/path.js");
class Files extends resource_1.APIResource {
    /**
     * List Files
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const fileMetadata of client.files.list()) {
     *   // ...
     * }
     * ```
     */
    list(params = {}, options) {
        const { workspace_id, ...query } = params ?? {};
        return this._client.getAPIList('/v1/files', (pagination_1.PageCursor), {
            query,
            ...options,
            headers: (0, headers_1.buildHeaders)([
                { ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined) },
                options?.headers,
            ]),
            __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.files.list', options, {
                route: '/v1/files',
                queryParams: ['ids', 'limit', 'page'],
            }),
        });
    }
    /**
     * Delete File
     *
     * @example
     * ```ts
     * const deletedFile = await client.files.delete('file_id');
     * ```
     */
    delete(fileID, params = {}, options) {
        const { workspace_id } = params ?? {};
        return this._client.delete((0, path_1.path) `/v1/files/${fileID}`, {
            ...options,
            headers: (0, headers_1.buildHeaders)([
                { ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined) },
                options?.headers,
            ]),
            __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.files.delete', options, {
                route: '/v1/files/{file_id}',
                attributes: { 'anthropic.file.id': fileID },
            }),
        });
    }
    /**
     * Download File
     *
     * @example
     * ```ts
     * const response = await client.files.download('file_id');
     *
     * const content = await response.blob();
     * console.log(content);
     * ```
     */
    download(fileID, params = {}, options) {
        const { workspace_id } = params ?? {};
        return this._client.get((0, path_1.path) `/v1/files/${fileID}/content`, {
            ...options,
            headers: (0, headers_1.buildHeaders)([
                {
                    Accept: 'application/binary',
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __binaryResponse: true,
            __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.files.download', options, {
                route: '/v1/files/{file_id}/content',
                attributes: { 'anthropic.file.id': fileID },
            }),
        });
    }
    /**
     * Get File Metadata
     *
     * @example
     * ```ts
     * const fileMetadata = await client.files.retrieveMetadata(
     *   'file_id',
     * );
     * ```
     */
    retrieveMetadata(fileID, params = {}, options) {
        const { workspace_id } = params ?? {};
        return this._client.get((0, path_1.path) `/v1/files/${fileID}`, {
            ...options,
            headers: (0, headers_1.buildHeaders)([
                { ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined) },
                options?.headers,
            ]),
            __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.files.retrieve_metadata', options, {
                route: '/v1/files/{file_id}',
                attributes: { 'anthropic.file.id': fileID },
            }),
        });
    }
    /**
     * Upload File
     *
     * @example
     * ```ts
     * const fileMetadata = await client.files.upload({
     *   file: fs.createReadStream('path/to/file'),
     * });
     * ```
     */
    upload(params, options) {
        const { workspace_id, ...body } = params;
        return this._client.post('/v1/files', (0, uploads_1.multipartFormRequestOptions)({
            body,
            ...options,
            headers: (0, headers_1.buildHeaders)([
                { ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined) },
                (0, stainless_helper_header_1.stainlessHelperHeaderFromFile)(body.file),
                options?.headers,
            ]),
            __span: (0, tracing_1.startApiCallSpan)(this._client, 'anthropic.files.upload', options, {
                route: '/v1/files',
                createdIDAttribute: 'anthropic.file.id',
            }),
        }, this._client));
    }
}
exports.Files = Files;
//# sourceMappingURL=files.js.map