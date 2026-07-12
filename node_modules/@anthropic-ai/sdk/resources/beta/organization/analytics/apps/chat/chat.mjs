import { APIResource } from "../../../../../../core/resource.mjs";
import * as ProjectsAPI from "./projects.mjs";
import { Projects } from "./projects.mjs";
export var Chat = /* @__PURE__ */ (() => {
    class Chat extends APIResource {
        constructor() {
            super(...arguments);
            this.projects = new ProjectsAPI.Projects(this._client);
        }
    }
    Chat.Projects = Projects;
    return Chat;
})();
//# sourceMappingURL=chat.mjs.map