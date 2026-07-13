import { APIResource } from "../../../core/resource.mjs";
import { PageCursor } from "../../../core/pagination.mjs";
import { startApiCallSpan } from "../../../internal/tracing.mjs";
import { path } from "../../../internal/utils/path.mjs";
export class ExternalKeys extends APIResource {
    /**
     * Create an external key config owned by the caller's organization.
     *
     * @example
     * ```ts
     * const betaExternalKey =
     *   await client.beta.organization.externalKeys.create({
     *     provider_config: {
     *       kms_arn:
     *         'arn:aws:kms:us-east-1:111122223333:key/abcd1234-5678-90ab-cdef-000011112222',
     *       type: 'aws',
     *     },
     *   });
     * ```
     */
    create(body, options) {
        return this._client.post('/v1/organizations/external_keys', {
            body,
            ...options,
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.organization.external_keys.create', options, {
                route: '/v1/organizations/external_keys',
                createdIDAttribute: 'anthropic.organization.external_key.id',
            }),
        });
    }
    /**
     * Retrieve a single external key config in the caller's organization by ID.
     *
     * @example
     * ```ts
     * const betaExternalKey =
     *   await client.beta.organization.externalKeys.retrieve(
     *     'external_key_id',
     *   );
     * ```
     */
    retrieve(externalKeyID, options) {
        return this._client.get(path `/v1/organizations/external_keys/${externalKeyID}`, {
            ...options,
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.organization.external_keys.retrieve', options, {
                route: '/v1/organizations/external_keys/{external_key_id}',
                attributes: { 'anthropic.organization.external_key.id': externalKeyID },
            }),
        });
    }
    /**
     * Partially update an external key config. Omitted fields are left unchanged.
     *
     * `display_name` is always editable. `geo` and `provider_config` cannot be changed
     * once any workspace references this config, because previously encrypted data
     * requires the original key identity to decrypt.
     *
     * @example
     * ```ts
     * const betaExternalKey =
     *   await client.beta.organization.externalKeys.update(
     *     'external_key_id',
     *   );
     * ```
     */
    update(externalKeyID, body, options) {
        return this._client.post(path `/v1/organizations/external_keys/${externalKeyID}`, {
            body,
            ...options,
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.organization.external_keys.update', options, {
                route: '/v1/organizations/external_keys/{external_key_id}',
                attributes: { 'anthropic.organization.external_key.id': externalKeyID },
            }),
        });
    }
    /**
     * List external key configs in the caller's organization.
     *
     * Results are ordered by creation time (newest first). Use the `next_page` cursor
     * from the response to fetch subsequent pages.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const betaExternalKey of client.beta.organization.externalKeys.list()) {
     *   // ...
     * }
     * ```
     */
    list(query = {}, options) {
        return this._client.getAPIList('/v1/organizations/external_keys', (PageCursor), {
            query,
            ...options,
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.organization.external_keys.list', options, {
                route: '/v1/organizations/external_keys',
                queryParams: ['limit', 'page'],
            }),
        });
    }
    /**
     * Delete an external key config.
     *
     * The request is rejected if any workspace still references this config.
     *
     * @example
     * ```ts
     * const externalKey =
     *   await client.beta.organization.externalKeys.delete(
     *     'external_key_id',
     *   );
     * ```
     */
    delete(externalKeyID, options) {
        return this._client.delete(path `/v1/organizations/external_keys/${externalKeyID}`, {
            ...options,
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.organization.external_keys.delete', options, {
                route: '/v1/organizations/external_keys/{external_key_id}',
                attributes: { 'anthropic.organization.external_key.id': externalKeyID },
            }),
        });
    }
    /**
     * Validate an external key config against the customer's KMS.
     *
     * Anthropic performs an encrypt/decrypt roundtrip against the configured KMS key
     * and waits up to 30 seconds for the result. The response status is `success` if
     * the roundtrip succeeded, or `failure` with an error message if it failed or
     * timed out.
     *
     * @example
     * ```ts
     * const response =
     *   await client.beta.organization.externalKeys.validate(
     *     'external_key_id',
     *   );
     * ```
     */
    validate(externalKeyID, options) {
        return this._client.post(path `/v1/organizations/external_keys/${externalKeyID}/validate`, {
            ...options,
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.organization.external_keys.validate', options, {
                route: '/v1/organizations/external_keys/{external_key_id}/validate',
                attributes: { 'anthropic.organization.external_key.id': externalKeyID },
            }),
        });
    }
}
//# sourceMappingURL=external-keys.mjs.map