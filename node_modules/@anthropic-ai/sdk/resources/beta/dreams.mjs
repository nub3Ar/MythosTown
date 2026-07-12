import { APIResource } from "../../core/resource.mjs";
import { PageCursor } from "../../core/pagination.mjs";
import { buildHeaders } from "../../internal/headers.mjs";
import { startApiCallSpan } from "../../internal/tracing.mjs";
import { path } from "../../internal/utils/path.mjs";
export class Dreams extends APIResource {
    /**
     * Start an asynchronous job that uses past sessions to produce a reorganized
     * version of a memory store and get back the dream to poll for the result.
     *
     * By default the dream writes its result to a new memory store and doesn't change
     * the input memory store. The response has `status` set to `pending` and an empty
     * `outputs` array. Poll the dream until `status` is `completed`, `failed`, or
     * `canceled`.
     *
     * See the
     * [Dreams guide](https://platform.claude.com/docs/en/managed-agents/dreams#create-a-dream)
     * to learn more about creating dreams.
     *
     * @example
     * ```ts
     * const betaDream = await client.beta.dreams.create({
     *   inputs: [{ memory_store_id: 'x', type: 'memory_store' }],
     *   model: 'string',
     * });
     * ```
     */
    create(params, options) {
        const { betas, workspace_id, ...body } = params;
        return this._client.post('/v1/dreams', {
            body,
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'dreaming-2026-04-21'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.dreams.create', options, {
                route: '/v1/dreams',
                createdIDAttribute: 'anthropic.dream.id',
            }),
        });
    }
    /**
     * Get a dream by ID to check its status, output memory store, and token usage.
     *
     * Archived dreams are returned too.
     *
     * See the
     * [Dreams guide](https://platform.claude.com/docs/en/managed-agents/dreams#track-progress)
     * for how to poll a dream and what each status means.
     *
     * @example
     * ```ts
     * const betaDream = await client.beta.dreams.retrieve(
     *   'dream_id',
     * );
     * ```
     */
    retrieve(dreamID, params = {}, options) {
        const { betas, workspace_id } = params ?? {};
        return this._client.get(path `/v1/dreams/${dreamID}`, {
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'dreaming-2026-04-21'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.dreams.retrieve', options, {
                route: '/v1/dreams/{dream_id}',
                attributes: { 'anthropic.dream.id': dreamID },
            }),
        });
    }
    /**
     * List the dreams in the workspace, newest first.
     *
     * Archived dreams are left out unless `include_archived` is `true`.
     *
     * See the
     * [Dreams guide](https://platform.claude.com/docs/en/managed-agents/dreams#list-dreams)
     * for how to page through dreams.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const betaDream of client.beta.dreams.list()) {
     *   // ...
     * }
     * ```
     */
    list(params = {}, options) {
        const { betas, workspace_id, ...query } = params ?? {};
        return this._client.getAPIList('/v1/dreams', (PageCursor), {
            query,
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'dreaming-2026-04-21'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.dreams.list', options, {
                route: '/v1/dreams',
                queryParams: ['created_at[gt]', 'created_at[lt]', 'include_archived', 'limit', 'page', 'statuses'],
            }),
        });
    }
    /**
     * Hide a `completed`, `failed`, or `canceled` dream from the default list of
     * dreams.
     *
     * Archiving a `pending` or `running` dream returns a 400 error, so cancel it
     * first. Archiving an archived dream returns it unchanged. An archived dream can
     * still be fetched by ID. Archiving can't be undone.
     *
     * See the
     * [Dreams guide](https://platform.claude.com/docs/en/managed-agents/dreams#archive-a-dream)
     * to learn more about archiving dreams.
     *
     * @example
     * ```ts
     * const betaDream = await client.beta.dreams.archive(
     *   'dream_id',
     * );
     * ```
     */
    archive(dreamID, params = {}, options) {
        const { betas, workspace_id } = params ?? {};
        return this._client.post(path `/v1/dreams/${dreamID}/archive`, {
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'dreaming-2026-04-21'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.dreams.archive', options, {
                route: '/v1/dreams/{dream_id}/archive',
                attributes: { 'anthropic.dream.id': dreamID },
            }),
        });
    }
    /**
     * Stop a `pending` or `running` dream.
     *
     * The response shows `status` as `canceled`, unless the dream reached `completed`
     * or `failed` first. `usage` can keep changing after the response. Canceling a
     * `canceled` dream returns it unchanged. Canceling a `completed` or `failed` dream
     * returns a 400 error.
     *
     * See the
     * [Dreams guide](https://platform.claude.com/docs/en/managed-agents/dreams#cancel-a-dream)
     * to learn more about canceling dreams.
     *
     * @example
     * ```ts
     * const betaDream = await client.beta.dreams.cancel(
     *   'dream_id',
     * );
     * ```
     */
    cancel(dreamID, params = {}, options) {
        const { betas, workspace_id } = params ?? {};
        return this._client.post(path `/v1/dreams/${dreamID}/cancel`, {
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'dreaming-2026-04-21'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.dreams.cancel', options, {
                route: '/v1/dreams/{dream_id}/cancel',
                attributes: { 'anthropic.dream.id': dreamID },
            }),
        });
    }
}
//# sourceMappingURL=dreams.mjs.map