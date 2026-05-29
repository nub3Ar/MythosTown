"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Apps = void 0;
const tslib_1 = require("../../../../../internal/tslib.js");
const resource_1 = require("../../../../../core/resource.js");
const ChatAPI = tslib_1.__importStar(require("./chat/chat.js"));
const chat_1 = require("./chat/chat.js");
var Apps = /* @__PURE__ */ (() => {
    class Apps extends resource_1.APIResource {
        constructor() {
            super(...arguments);
            this.chat = new ChatAPI.Chat(this._client);
        }
    }
    Apps.Chat = chat_1.Chat;
    return Apps;
})();
exports.Apps = Apps;
//# sourceMappingURL=apps.js.map