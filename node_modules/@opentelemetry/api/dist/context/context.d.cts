import { Context } from "./types.cjs";
//#region src/context/context.d.ts
/**
 * Get a key to uniquely identify a context value
 *
 * @since 1.0.0
 */
declare function createContextKey(description: string): symbol;
/**
 * The root context is used as the default parent context when there is no active context
 *
 * @since 1.0.0
 */
declare const ROOT_CONTEXT: Context;
//#endregion
export { ROOT_CONTEXT, createContextKey };
//# sourceMappingURL=context.d.cts.map