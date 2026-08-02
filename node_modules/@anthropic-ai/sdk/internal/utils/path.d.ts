/**
 * Percent-encode everything that isn't safe to have in a path without encoding safe chars.
 *
 * Taken from https://datatracker.ietf.org/doc/html/rfc3986#section-3.3:
 * > unreserved  = ALPHA / DIGIT / "-" / "." / "_" / "~"
 * > sub-delims  = "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
 * > pchar       = unreserved / pct-encoded / sub-delims / ":" / "@"
 */
export declare function encodeURIPath(str: string): string;
export declare const createPathTagFunction: (pathEncoder?: typeof encodeURIPath) => (statics: readonly string[], ...params: readonly unknown[]) => string;
/**
 * URI-encodes path params and ensures that none before any ? or # is empty and none introduces an unsafe /./ or /../ path segment.
 */
export declare const path: (statics: readonly string[], ...params: readonly unknown[]) => string;
//# sourceMappingURL=path.d.ts.map