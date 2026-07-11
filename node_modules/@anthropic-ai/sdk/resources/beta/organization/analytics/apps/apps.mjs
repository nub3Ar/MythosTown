import { APIResource } from "../../../../../core/resource.mjs";
import * as ChatAPI from "./chat/chat.mjs";
import { Chat } from "./chat/chat.mjs";
export var Apps = /* @__PURE__ */ (() => {
    class Apps extends APIResource {
        constructor() {
            super(...arguments);
            this.chat = new ChatAPI.Chat(this._client);
        }
    }
    Apps.Chat = Chat;
    return Apps;
})();
//# sourceMappingURL=apps.mjs.map