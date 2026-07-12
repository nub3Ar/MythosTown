import { APIResource } from "../../../../core/resource.mjs";
import * as SlackChannelsAPI from "./slack-channels.mjs";
import { SlackChannels, } from "./slack-channels.mjs";
import * as SlackWorkspacesAPI from "./slack-workspaces.mjs";
import { SlackWorkspaces, } from "./slack-workspaces.mjs";
import * as BundlesAPI from "./bundles/bundles.mjs";
import { Bundles, } from "./bundles/bundles.mjs";
export var ClaudeTag = /* @__PURE__ */ (() => {
    class ClaudeTag extends APIResource {
        constructor() {
            super(...arguments);
            this.slackChannels = new SlackChannelsAPI.SlackChannels(this._client);
            this.slackWorkspaces = new SlackWorkspacesAPI.SlackWorkspaces(this._client);
            this.bundles = new BundlesAPI.Bundles(this._client);
        }
    }
    ClaudeTag.SlackChannels = SlackChannels;
    ClaudeTag.SlackWorkspaces = SlackWorkspaces;
    ClaudeTag.Bundles = Bundles;
    return ClaudeTag;
})();
//# sourceMappingURL=claude-tag.mjs.map