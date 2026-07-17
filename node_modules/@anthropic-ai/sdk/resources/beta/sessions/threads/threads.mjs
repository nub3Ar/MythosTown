import { APIResource } from "../../../../core/resource.mjs";
import * as ThreadsEventsAPI from "./events.mjs";
import { Events } from "./events.mjs";
import { PageCursor } from "../../../../core/pagination.mjs";
import { buildHeaders } from "../../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../../internal/tracing.mjs";
import { path } from "../../../../internal/utils/path.mjs";
export var Threads = /* @__PURE__ */ (() => {
    class Threads extends APIResource {
        constructor() {
            super(...arguments);
            this.events = new ThreadsEventsAPI.Events(this._client);
        }
        /**
         * Get Session Thread
         *
         * @example
         * ```ts
         * const betaManagedAgentsSessionThread =
         *   await client.beta.sessions.threads.retrieve(
         *     'sthr_011CZkZVWa6oJjw1rgXZpnBt',
         *     { session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7' },
         *   );
         * ```
         */
        retrieve(threadID, params, options) {
            const { session_id, betas, workspace_id } = params;
            return this._client.get(path `/v1/sessions/${session_id}/threads/${threadID}`, {
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.sessions.threads.retrieve', options, {
                    route: '/v1/sessions/{session_id}/threads/{thread_id}',
                    attributes: { 'anthropic.session.id': session_id, 'anthropic.session.thread.id': threadID },
                }),
            });
        }
        /**
         * List Session Threads
         *
         * @example
         * ```ts
         * // Automatically fetches more pages as needed.
         * for await (const betaManagedAgentsSessionThread of client.beta.sessions.threads.list(
         *   'sesn_011CZkZAtmR3yMPDzynEDxu7',
         * )) {
         *   // ...
         * }
         * ```
         */
        list(sessionID, params = {}, options) {
            const { betas, workspace_id, ...query } = params ?? {};
            return this._client.getAPIList(path `/v1/sessions/${sessionID}/threads`, (PageCursor), {
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
                __span: startApiCallSpan(this._client, 'anthropic.sessions.threads.list', options, {
                    route: '/v1/sessions/{session_id}/threads',
                    queryParams: ['limit', 'page', 'statuses'],
                    attributes: { 'anthropic.session.id': sessionID },
                }),
            });
        }
        /**
         * Archive Session Thread
         *
         * @example
         * ```ts
         * const betaManagedAgentsSessionThread =
         *   await client.beta.sessions.threads.archive(
         *     'sthr_011CZkZVWa6oJjw1rgXZpnBt',
         *     { session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7' },
         *   );
         * ```
         */
        archive(threadID, params, options) {
            const { session_id, betas, workspace_id } = params;
            return this._client.post(path `/v1/sessions/${session_id}/threads/${threadID}/archive`, {
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.sessions.threads.archive', options, {
                    route: '/v1/sessions/{session_id}/threads/{thread_id}/archive',
                    attributes: { 'anthropic.session.id': session_id, 'anthropic.session.thread.id': threadID },
                }),
            });
        }
    }
    Threads.Events = Events;
    return Threads;
})();
//# sourceMappingURL=threads.mjs.map