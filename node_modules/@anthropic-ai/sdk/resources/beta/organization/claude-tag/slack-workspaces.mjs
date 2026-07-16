import { APIResource } from "../../../../core/resource.mjs";
import { PageCursor } from "../../../../core/pagination.mjs";
import { buildHeaders } from "../../../../internal/headers.mjs";
import { startApiCallSpan } from "../../../../internal/tracing.mjs";
import { path } from "../../../../internal/utils/path.mjs";
export class SlackWorkspaces extends APIResource {
    /**
     * Get one Slack workspace and its settings. By default `settings` holds what the
     * workspace itself stores: a setting that is null there is not set on the
     * workspace and is inherited. With `include_inherited=true`, `settings` holds what
     * applies in the workspace once the organization's Slack defaults are taken into
     * account, and the request fails with 503 rather than resolve against a settings
     * level that could not be read. Either way `sources` names the settings level each
     * value comes from.
     *
     * @example
     * ```ts
     * const betaClaudeTagSlackWorkspace =
     *   await client.beta.organization.claudeTag.slackWorkspaces.retrieve(
     *     'slws_01Hq8TzW5mKc2YbX7vNd4RfJ',
     *   );
     * ```
     */
    retrieve(id, params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.get(path `/v1/organizations/claude_tag/slack_workspaces/${id}`, {
            query,
            ...options,
            headers: buildHeaders([
                { 'anthropic-beta': [...(betas ?? []), 'experimental-claude-tag-2026-10-21'].toString() },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.organization.claude_tag.slack_workspaces.retrieve', options, {
                route: '/v1/organizations/claude_tag/slack_workspaces/{id}',
                queryParams: ['include_inherited'],
                attributes: { 'anthropic.organization.claude_tag.slack_workspace.id': id },
            }),
        });
    }
    /**
     * Change the settings a Slack workspace stores. The update is partial: a setting
     * left out is unchanged, and a setting sent as null is cleared, so the workspace
     * inherits it. If any value is refused, no setting in the request is stored.
     *
     * @example
     * ```ts
     * const betaClaudeTagSlackWorkspace =
     *   await client.beta.organization.claudeTag.slackWorkspaces.update(
     *     'slws_01Hq8TzW5mKc2YbX7vNd4RfJ',
     *     { settings: {} },
     *   );
     * ```
     */
    update(id, params, options) {
        const { betas, ...body } = params;
        return this._client.post(path `/v1/organizations/claude_tag/slack_workspaces/${id}`, {
            body,
            ...options,
            headers: buildHeaders([
                { 'anthropic-beta': [...(betas ?? []), 'experimental-claude-tag-2026-10-21'].toString() },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.organization.claude_tag.slack_workspaces.update', options, {
                route: '/v1/organizations/claude_tag/slack_workspaces/{id}',
                attributes: { 'anthropic.organization.claude_tag.slack_workspace.id': id },
            }),
        });
    }
    /**
     * List the set-up Slack workspaces the organization owns, newest first by
     * `created_at`. Pass `slack_workspace_id` to look one workspace up by its Slack
     * identifier: `data` then holds that workspace, or is empty when it is not set up.
     * A workspace of a Slack Enterprise Grid the organization has connected returns
     * 404 until it is set up. With `include_inherited=true` each workspace's
     * `settings` holds what applies in it, and the request fails with 503 rather than
     * resolve against a settings level that could not be read. A `page` cursor resumes
     * only a request with the same `include_inherited`.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const betaClaudeTagSlackWorkspace of client.beta.organization.claudeTag.slackWorkspaces.list()) {
     *   // ...
     * }
     * ```
     */
    list(params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.getAPIList('/v1/organizations/claude_tag/slack_workspaces', (PageCursor), {
            query,
            ...options,
            headers: buildHeaders([
                { 'anthropic-beta': [...(betas ?? []), 'experimental-claude-tag-2026-10-21'].toString() },
                options?.headers,
            ]),
            __qualifiers: { beta: 'true' },
            __span: startApiCallSpan(this._client, 'anthropic.organization.claude_tag.slack_workspaces.list', options, {
                route: '/v1/organizations/claude_tag/slack_workspaces',
                queryParams: ['include_inherited', 'limit', 'page', 'slack_workspace_id'],
            }),
        });
    }
}
//# sourceMappingURL=slack-workspaces.mjs.map