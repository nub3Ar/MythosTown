import { APIResource } from "../../../core/resource.mjs";
import * as EventsAPI from "./events.mjs";
import { Events, } from "./events.mjs";
import * as ResourcesAPI from "./resources.mjs";
import { Resources, } from "./resources.mjs";
import * as ThreadsAPI from "./threads/threads.mjs";
import { Threads, } from "./threads/threads.mjs";
import { BidirectionalPageCursor, } from "../../../core/pagination.mjs";
import { buildHeaders } from "../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../internal/tracing.mjs";
import { recordSessionsCreateResponse } from "../../../lib/internal/tracing.mjs";
import { path } from "../../../internal/utils/path.mjs";
export var Sessions = /* @__PURE__ */ (() => {
    class Sessions extends APIResource {
        constructor() {
            super(...arguments);
            this.events = new EventsAPI.Events(this._client);
            this.resources = new ResourcesAPI.Resources(this._client);
            this.threads = new ThreadsAPI.Threads(this._client);
        }
        /**
         * Create Session
         *
         * @example
         * ```ts
         * const betaManagedAgentsSession =
         *   await client.beta.sessions.create({
         *     agent: 'agent_011CZkYpogX7uDKUyvBTophP',
         *     environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW',
         *     initial_events: [
         *       {
         *         type: 'user.message',
         *         content: [
         *           {
         *             type: 'text',
         *             text: 'Where is my order #1234?',
         *           },
         *         ],
         *       },
         *     ],
         *   });
         * ```
         */
        create(params, options) {
            const { betas, workspace_id, ...body } = params;
            const headers = buildHeaders([
                {
                    'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                    ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                },
                options?.headers,
            ]);
            const call = startApiCallSpan(this._client, 'anthropic.sessions.create', options, {
                route: '/v1/sessions',
                attributes: {
                    // An `agent` that is no agent is for the API to refuse, not for this line to throw on.
                    'gen_ai.agent.id': typeof body.agent === 'object' ? body.agent?.id : body.agent,
                    'anthropic.session.environment.id': body.environment_id,
                },
                createdIDAttribute: 'anthropic.session.id',
            });
            const request = this._client.post('/v1/sessions', {
                body,
                ...options,
                headers,
                __qualifiers: { beta: 'true' },
                __span: call,
            });
            // Only a request with a span has a response to record.
            return call ?
                request._thenUnwrap((session) => {
                    recordSessionsCreateResponse(this._client, call, session);
                    return session;
                })
                : request;
        }
        /**
         * Get Session
         *
         * @example
         * ```ts
         * const betaManagedAgentsSession =
         *   await client.beta.sessions.retrieve(
         *     'sesn_011CZkZAtmR3yMPDzynEDxu7',
         *   );
         * ```
         */
        retrieve(sessionID, params = {}, options) {
            const { betas, workspace_id } = params ?? {};
            return this._client.get(path `/v1/sessions/${sessionID}`, {
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.sessions.retrieve', options, {
                    route: '/v1/sessions/{session_id}',
                    attributes: { 'anthropic.session.id': sessionID },
                }),
            });
        }
        /**
         * Update Session
         *
         * @example
         * ```ts
         * const betaManagedAgentsSession =
         *   await client.beta.sessions.update(
         *     'sesn_011CZkZAtmR3yMPDzynEDxu7',
         *   );
         * ```
         */
        update(sessionID, params, options) {
            const { betas, workspace_id, ...body } = params;
            return this._client.post(path `/v1/sessions/${sessionID}`, {
                body,
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.sessions.update', options, {
                    route: '/v1/sessions/{session_id}',
                    attributes: { 'anthropic.session.id': sessionID },
                }),
            });
        }
        /**
         * List Sessions
         *
         * @example
         * ```ts
         * // Automatically fetches more pages as needed.
         * for await (const betaManagedAgentsSession of client.beta.sessions.list()) {
         *   // ...
         * }
         * ```
         */
        list(params = {}, options) {
            const { betas, workspace_id, ...query } = params ?? {};
            return this._client.getAPIList('/v1/sessions', (BidirectionalPageCursor), {
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
                __span: startApiCallSpan(this._client, 'anthropic.sessions.list', options, {
                    route: '/v1/sessions',
                    queryParams: [
                        'agent_id',
                        'agent_version',
                        'created_at[gt]',
                        'created_at[gte]',
                        'created_at[lt]',
                        'created_at[lte]',
                        'deployment_id',
                        'include_archived',
                        'limit',
                        'memory_store_id',
                        'order',
                        'page',
                        'statuses',
                    ],
                }),
            });
        }
        /**
         * Delete Session
         *
         * @example
         * ```ts
         * const betaManagedAgentsDeletedSession =
         *   await client.beta.sessions.delete(
         *     'sesn_011CZkZAtmR3yMPDzynEDxu7',
         *   );
         * ```
         */
        delete(sessionID, params = {}, options) {
            const { betas, workspace_id } = params ?? {};
            return this._client.delete(path `/v1/sessions/${sessionID}`, {
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.sessions.delete', options, {
                    route: '/v1/sessions/{session_id}',
                    attributes: { 'anthropic.session.id': sessionID },
                }),
            });
        }
        /**
         * Archive Session
         *
         * @example
         * ```ts
         * const betaManagedAgentsSession =
         *   await client.beta.sessions.archive(
         *     'sesn_011CZkZAtmR3yMPDzynEDxu7',
         *   );
         * ```
         */
        archive(sessionID, params = {}, options) {
            const { betas, workspace_id } = params ?? {};
            return this._client.post(path `/v1/sessions/${sessionID}/archive`, {
                ...options,
                headers: buildHeaders([
                    {
                        'anthropic-beta': [...(betas ?? []), 'managed-agents-2026-04-01'].toString(),
                        ...(workspace_id != null ? { 'anthropic-workspace-id': workspace_id } : undefined),
                    },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.sessions.archive', options, {
                    route: '/v1/sessions/{session_id}/archive',
                    attributes: { 'anthropic.session.id': sessionID },
                }),
            });
        }
    }
    Sessions.Events = Events;
    Sessions.Resources = Resources;
    Sessions.Threads = Threads;
    return Sessions;
})();
//# sourceMappingURL=sessions.mjs.map