"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const tslib_1 = require("../../../../../../internal/tslib.js");
const resource_1 = require("../../../../../../core/resource.js");
const ProjectsAPI = tslib_1.__importStar(require("./projects.js"));
const projects_1 = require("./projects.js");
var Chat = /* @__PURE__ */ (() => {
    class Chat extends resource_1.APIResource {
        constructor() {
            super(...arguments);
            this.projects = new ProjectsAPI.Projects(this._client);
        }
    }
    Chat.Projects = projects_1.Projects;
    return Chat;
})();
exports.Chat = Chat;
//# sourceMappingURL=chat.js.map