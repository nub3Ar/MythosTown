import { APIResource } from "../../../../core/resource.mjs";
import { PageCursor } from "../../../../core/pagination.mjs";
import { buildHeaders } from "../../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../../internal/tracing.mjs";
import { path } from "../../../../internal/utils/path.mjs";
export class Events extends APIResource {
    /**
     * List Session Thread Events
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const betaManagedAgentsSessionEvent of client.beta.sessions.threads.events.list(
     *   'sthr_011CZkZVWa6oJjw1rgXZpnBt',
     *   { session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7' },
     * )) {
     *   // ...
     * }
     * ```
     */
    list(threadID, params, options) {
        const { session_id, betas, workspace_id, ...query } = params;
        return this._client.getAPIList(path `/v1/sessions/${session_id}/threads/${threadID}/events`, (PageCursor), {
            query,
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.sessions.threads.events.list', options, {
                route: '/v1/sessions/{session_id}/threads/{thread_id}/events',
                queryParams: ['limit', 'page'],
                attributes: { 'anthropic.session.id': session_id, 'anthropic.session.thread.id': threadID },
            }),
        });
    }
    /**
     * Stream Session Thread Events
     *
     * @example
     * ```ts
     * const stream =
     *   await client.beta.sessions.threads.events.stream(
     *     'sthr_011CZkZVWa6oJjw1rgXZpnBt',
     *     { session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7' },
     *   );
     * for await (const betaManagedAgentsStreamSessionThreadEvents of stream) {
     *   // ...
     * }
     * ```
     */
    stream(threadID, params, options) {
        const { session_id, betas, workspace_id, ...query } = params;
        return this._client.get(path `/v1/sessions/${session_id}/threads/${threadID}/stream`, {
            query,
            ...options,
            headers: buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]),
            stream: true,
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.sessions.threads.events.stream', options, {
                route: '/v1/sessions/{session_id}/threads/{thread_id}/stream',
                queryParams: ['event_deltas'],
                attributes: { 'anthropic.session.id': session_id, 'anthropic.session.thread.id': threadID },
            }),
        });
    }
}
//# sourceMappingURL=events.mjs.map