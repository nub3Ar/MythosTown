"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyQuery = stringifyQuery;
const tslib_1 = require("../tslib.js");
const qs = tslib_1.__importStar(require("../qs/stringify.js"));
function stringifyQuery(query) {
    return qs.stringify(query, { arrayFormat: 'brackets' });
}
//# sourceMappingURL=query.js.map