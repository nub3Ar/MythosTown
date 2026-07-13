import { APIResource } from "../../../core/resource.mjs";
import { PageCursor } from "../../../core/pagination.mjs";
import { buildHeaders } from "../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../internal/tracing.mjs";
import { path } from "../../../internal/utils/path.mjs";
import { SessionToolRunner, } from "../../../lib/tools/SessionToolRunner.mjs";
export var Events = /* @__PURE__ */ (() => {
    class Events extends APIResource {
        /**
         * List Events
         *
         * @example
         * ```ts
         * // Automatically fetches more pages as needed.
         * for await (const betaManagedAgentsSessionEvent of client.beta.sessions.events.list(
         *   'sesn_011CZkZAtmR3yMPDzynEDxu7',
         * )) {
         *   // ...
         * }
         * ```
         */
        list(sessionID, params = {}, options) {
            const { betas, workspace_id, ...query } = params ?? {};
            return this._client.getAPIList(path `/v1/sessions/${sessionID}/events`, (PageCursor), {
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
                __span: startApiCallSpan(this._client, 'anthropic.sessions.events.list', options, {
                    route: '/v1/sessions/{session_id}/events',
                    queryParams: [
                        'created_at[gt]',
                        'created_at[gte]',
                        'created_at[lt]',
                        'created_at[lte]',
                        'limit',
                        'order',
                        'page',
                        'types',
                    ],
                    attributes: { 'anthropic.session.id': sessionID },
                }),
            });
        }
        /**
         * Send Events
         *
         * @example
         * ```ts
         * const betaManagedAgentsSendSessionEvents =
         *   await client.beta.sessions.events.send(
         *     'sesn_011CZkZAtmR3yMPDzynEDxu7',
         *     {
         *       events: [
         *         {
         *           content: [
         *             {
         *               text: 'Where is my order #1234?',
         *               type: 'text',
         *             },
         *           ],
         *           type: 'user.message',
         *         },
         *       ],
         *     },
         *   );
         * ```
         */
        send(sessionID, params, options) {
            const { betas, workspace_id, ...body } = params;
            return this._client.post(path `/v1/sessions/${sessionID}/events`, {
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
                __span: startApiCallSpan(this._client, 'anthropic.sessions.events.send', options, {
                    route: '/v1/sessions/{session_id}/events',
                    attributes: { 'anthropic.session.id': sessionID },
                }),
            });
        }
        /**
         * Stream Events
         *
         * @example
         * ```ts
         * const stream = await client.beta.sessions.events.stream(
         *   'sesn_011CZkZAtmR3yMPDzynEDxu7',
         * );
         * for await (const betaManagedAgentsStreamSessionEvents of stream) {
         *   // ...
         * }
         * ```
         */
        stream(sessionID, params = {}, options) {
            const { betas, workspace_id, ...query } = params ?? {};
            return this._client.get(path `/v1/sessions/${sessionID}/events/stream`, {
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
                __span: startApiCallSpan(this._client, 'anthropic.sessions.events.stream', options, {
                    route: '/v1/sessions/{session_id}/events/stream',
                    queryParams: ['event_deltas'],
                    attributes: { 'anthropic.session.id': sessionID },
                }),
            });
        }
        /**
         * Attach to a session and dispatch every incoming `agent.tool_use` and
         * `agent.custom_tool_use` event to a local tool registry, sending the matching
         * result back (`user.tool_result` / `user.custom_tool_result`). The
         * sessions-side counterpart to `client.beta.messages.toolRunner`: yields one
         * entry per completed tool call so callers can observe each dispatch (and
         * `break` to abort cleanly).
         *
         * @example
         * ```ts
         * import { betaAgentToolset20260401 } from '@anthropic-ai/sdk/tools/agent-toolset/node';
         *
         * for await (const call of client.beta.sessions.events.toolRunner(work.data.id, {
         *   tools: [...betaAgentToolset20260401({ workdir }), myTool],
         * })) {
         *   console.log(`${call.name} -> ${call.isError ? 'error' : 'ok'}`);
         * }
         * ```
         */
        toolRunner(sessionID, opts) {
            return new SessionToolRunner(sessionID, { ...opts, client: this._client });
        }
    }
    Events.SessionToolRunner = SessionToolRunner;
    return Events;
})();
export { SessionToolRunner } from "../../../lib/tools/SessionToolRunner.mjs";
//# sourceMappingURL=events.mjs.map