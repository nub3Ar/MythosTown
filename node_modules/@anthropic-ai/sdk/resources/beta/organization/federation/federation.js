"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Federation = void 0;
const tslib_1 = require("../../../../internal/tslib.js");
const resource_1 = require("../../../../core/resource.js");
const IssuersAPI = tslib_1.__importStar(require("./issuers.js"));
const issuers_1 = require("./issuers.js");
const RulesAPI = tslib_1.__importStar(require("./rules/rules.js"));
const rules_1 = require("./rules/rules.js");
var Federation = /* @__PURE__ */ (() => {
    class Federation extends resource_1.APIResource {
        constructor() {
            super(...arguments);
            this.issuers = new IssuersAPI.Issuers(this._client);
            this.rules = new RulesAPI.Rules(this._client);
        }
    }
    Federation.Issuers = issuers_1.Issuers;
    Federation.Rules = rules_1.Rules;
    return Federation;
})();
exports.Federation = Federation;
//# sourceMappingURL=federation.js.map