import { APIResource } from "../../../../core/resource.mjs";
import * as WorkspacesAPI from "./workspaces.mjs";
import { Workspaces, } from "./workspaces.mjs";
import { PageCursor } from "../../../../core/pagination.mjs";
import { buildHeaders } from "../../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../../internal/tracing.mjs";
import { path } from "../../../../internal/utils/path.mjs";
export var TelemetryDestinations = /* @__PURE__ */ (() => {
    class TelemetryDestinations extends APIResource {
        constructor() {
            super(...arguments);
            this.workspaces = new WorkspacesAPI.Workspaces(this._client);
        }
        /**
         * Register an OpenTelemetry destination for the organization.
         *
         * The destination starts in state `enabled`. An organization can have at most 10
         * destinations, including disabled ones.
         *
         * See the
         * [OpenTelemetry export guide](https://platform.claude.com/docs/en/manage-claude/opentelemetry#add-a-destination)
         * to learn more about adding a destination.
         *
         * @example
         * ```ts
         * const betaTelemetryDestination =
         *   await client.beta.organization.telemetryDestinations.create(
         *     {
         *       endpoint_url: 'x',
         *       workspaces: { type: 'all' },
         *     },
         *   );
         * ```
         */
        create(params, options) {
            const { betas, ...body } = params;
            return this._client.post('/v1/organizations/telemetry_destinations', {
                body,
                ...options,
                headers: buildHeaders([
                    { 'anthropic-beta': [...(betas ?? []), 'telemetry-destinations-2026-08-11'].toString() },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.organization.telemetry_destinations.create', options, {
                    route: '/v1/organizations/telemetry_destinations',
                    createdIDAttribute: 'anthropic.organization.telemetry_destination.id',
                }),
            });
        }
        /**
         * Read a destination's configuration, state, and most recent delivery results.
         *
         * See the
         * [OpenTelemetry export guide](https://platform.claude.com/docs/en/manage-claude/opentelemetry#delivery-and-health)
         * to learn how the API delivers spans and when it disables a destination.
         *
         * @example
         * ```ts
         * const betaTelemetryDestination =
         *   await client.beta.organization.telemetryDestinations.retrieve(
         *     'destination_id',
         *   );
         * ```
         */
        retrieve(destinationID, params = {}, options) {
            const { betas } = params ?? {};
            return this._client.get(path `/v1/organizations/telemetry_destinations/${destinationID}`, {
                ...options,
                headers: buildHeaders([
                    { 'anthropic-beta': [...(betas ?? []), 'telemetry-destinations-2026-08-11'].toString() },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.organization.telemetry_destinations.retrieve', options, {
                    route: '/v1/organizations/telemetry_destinations/{destination_id}',
                    attributes: { 'anthropic.organization.telemetry_destination.id': destinationID },
                }),
            });
        }
        /**
         * Change a telemetry destination's settings, its state, or which workspaces it
         * covers.
         *
         * Send at least one field. Omitted fields keep their stored values, except the
         * registered headers, which a change of the endpoint's hostname or port removes.
         * Only `display_name`, `traces`, `traces.endpoint_url`, `traces.content_mode`,
         * `traces.max_content_bytes`, and individual `headers` values accept `null`.
         *
         * If another request changes the destination while the update runs, the API
         * returns a 409 `conflict_error`. Read the destination again, then retry the
         * update.
         *
         * See the
         * [OpenTelemetry export guide](https://platform.claude.com/docs/en/manage-claude/opentelemetry#delivery-and-health)
         * to learn more about changing a destination.
         *
         * @example
         * ```ts
         * const betaTelemetryDestination =
         *   await client.beta.organization.telemetryDestinations.update(
         *     'destination_id',
         *   );
         * ```
         */
        update(destinationID, params, options) {
            const { betas, ...body } = params;
            return this._client.post(path `/v1/organizations/telemetry_destinations/${destinationID}`, {
                body,
                ...options,
                headers: buildHeaders([
                    { 'anthropic-beta': [...(betas ?? []), 'telemetry-destinations-2026-08-11'].toString() },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.organization.telemetry_destinations.update', options, {
                    route: '/v1/organizations/telemetry_destinations/{destination_id}',
                    attributes: { 'anthropic.organization.telemetry_destination.id': destinationID },
                }),
            });
        }
        /**
         * List the organization's destinations, newest first, optionally only those that
         * cover given workspaces.
         *
         * See the
         * [OpenTelemetry export guide](https://platform.claude.com/docs/en/manage-claude/opentelemetry#set-up-api-tracing)
         * to learn more about destinations.
         *
         * @example
         * ```ts
         * // Automatically fetches more pages as needed.
         * for await (const betaTelemetryDestination of client.beta.organization.telemetryDestinations.list()) {
         *   // ...
         * }
         * ```
         */
        list(params = {}, options) {
            const { betas, ...query } = params ?? {};
            return this._client.getAPIList('/v1/organizations/telemetry_destinations', (PageCursor), {
                query,
                ...options,
                headers: buildHeaders([
                    { 'anthropic-beta': [...(betas ?? []), 'telemetry-destinations-2026-08-11'].toString() },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.organization.telemetry_destinations.list', options, {
                    route: '/v1/organizations/telemetry_destinations',
                    queryParams: ['limit', 'page', 'workspace_ids'],
                }),
            });
        }
        /**
         * Delete a destination and its workspace list.
         *
         * The API stops sending spans to the destination. The spans of the workspaces it
         * covered still go to the other destinations that cover them. A deleted
         * destination can't be read, listed, or restored.
         *
         * See the
         * [OpenTelemetry export guide](https://platform.claude.com/docs/en/manage-claude/opentelemetry#delivery-and-health)
         * to learn more about managing a destination.
         *
         * @example
         * ```ts
         * const betaDeletedTelemetryDestination =
         *   await client.beta.organization.telemetryDestinations.delete(
         *     'destination_id',
         *   );
         * ```
         */
        delete(destinationID, params = {}, options) {
            const { betas } = params ?? {};
            return this._client.delete(path `/v1/organizations/telemetry_destinations/${destinationID}`, {
                ...options,
                headers: buildHeaders([
                    { 'anthropic-beta': [...(betas ?? []), 'telemetry-destinations-2026-08-11'].toString() },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.organization.telemetry_destinations.delete', options, {
                    route: '/v1/organizations/telemetry_destinations/{destination_id}',
                    attributes: { 'anthropic.organization.telemetry_destination.id': destinationID },
                }),
            });
        }
        /**
         * Send one test span, named `anthropic.test`, to the destination with its
         * registered headers, once and without retries, and report the destination's
         * answer. The response is 200 whether or not the destination answered with a 2xx
         * status: its `result` has the type `success`, or the type `failure` and the
         * reason in `error`. The destination's configuration, `state` and
         * `delivery_health` do not change. A disabled destination can be tested too. Wait
         * 10 seconds between tests of one destination; a request that comes sooner may be
         * answered with status 429.
         *
         * @example
         * ```ts
         * const betaTelemetryDestinationTestResponse =
         *   await client.beta.organization.telemetryDestinations.test(
         *     'destination_id',
         *   );
         * ```
         */
        test(destinationID, params = {}, options) {
            const { betas } = params ?? {};
            return this._client.post(path `/v1/organizations/telemetry_destinations/${destinationID}/test`, {
                ...options,
                headers: buildHeaders([
                    { 'anthropic-beta': [...(betas ?? []), 'telemetry-destinations-2026-08-11'].toString() },
                    options?.headers,
                ]),
                __qualifiers: { beta: 'true' },
                __span: startApiCallSpan(this._client, 'anthropic.organization.telemetry_destinations.test', options, {
                    route: '/v1/organizations/telemetry_destinations/{destination_id}/test',
                    attributes: { 'anthropic.organization.telemetry_destination.id': destinationID },
                }),
            });
        }
    }
    TelemetryDestinations.Workspaces = Workspaces;
    return TelemetryDestinations;
})();
//# sourceMappingURL=telemetry-destinations.mjs.map