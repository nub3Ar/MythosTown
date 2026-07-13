import { APIResource } from "../../core/resource.mjs";
import { PageCursor } from "../../core/pagination.mjs";
import { buildHeaders } from "../../internal/headers.mjs";
import { startApiCallSpan } from "../../internal/tracing.mjs";
import { stainlessHelperHeaderFromFile } from "../../internal/stainless-helper-header.mjs";
import { multipartFormRequestOptions } from "../../internal/uploads.mjs";
import { path } from "../../internal/utils/path.mjs";
export class Files extends APIResource {
    /**
     * List Files
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const betaFileMetadata of client.beta.files.list()) {
     *   // ...
     * }
     * ```
     */
    list(params = {}, options) {
        const { betas, workspace_id, ...query } = params ?? {};
        return this._client.getAPIList('/v1/files', (PageCursor), {
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
            __span: startApiCallSpan(this._client, 'anthropic.files.list', options, {
                route: '/v1/files',
                queryParams: ['ids', 'limit', 'page', 'scope_id'],
            }),
        });
    }
    /**
     * Delete File
     *
     * @example
     * ```ts
     * const betaDeletedFile = await client.beta.files.delete(
     *   'file_id',
     * );
     * ```
     */
    delete(fileID, params = {}, options) {
        const { betas, workspace_id } = params ?? {};
        return this._client.delete(path `/v1/files/${fileID}`, {
            ...options,
            headers: buildHeaders([
                {
                    ...(betas?.toString() != null ? { 'anthropic-beta': betas?.toString() } : undefined),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.files.delete', options, {
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
     * const response = await client.beta.files.download(
     *   'file_id',
     * );
     *
     * const content = await response.blob();
     * console.log(content);
     * ```
     */
    download(fileID, params = {}, options) {
        const { betas, workspace_id } = params ?? {};
        return this._client.get(path `/v1/files/${fileID}/content`, {
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
            __span: startApiCallSpan(this._client, 'anthropic.files.download', options, {
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
     * const betaFileMetadata =
     *   await client.beta.files.retrieveMetadata('file_id');
     * ```
     */
    retrieveMetadata(fileID, params = {}, options) {
        const { betas, workspace_id } = params ?? {};
        return this._client.get(path `/v1/files/${fileID}`, {
            ...options,
            headers: buildHeaders([
                {
                    ...(betas?.toString() != null ? { 'anthropic-beta': betas?.toString() } : undefined),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.files.retrieve_metadata', options, {
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
     * const betaFileMetadata = await client.beta.files.upload({
     *   file: fs.createReadStream('path/to/file'),
     * });
     * ```
     */
    upload(params, options) {
        const { betas, workspace_id, ...body } = params;
        return this._client.post('/v1/files', multipartFormRequestOptions({
            body,
            ...options,
            headers: buildHeaders([
                {
                    ...(betas?.toString() != null ? { 'anthropic-beta': betas?.toString() } : undefined),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                stainlessHelperHeaderFromFile(body.file),
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.files.upload', options, {
                route: '/v1/files',
                createdIDAttribute: 'anthropic.file.id',
            }),
        }, this._client));
    }
}
//# sourceMappingURL=files.mjs.map