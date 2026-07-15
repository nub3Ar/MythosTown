import * as qs from "../qs/stringify.mjs";
export function stringifyQuery(query) {
    return qs.stringify(query, { arrayFormat: 'brackets' });
}
//# sourceMappingURL=query.mjs.map