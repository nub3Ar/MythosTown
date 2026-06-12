import { DiagAPI } from "./api/diag.mjs";
//#region src/diag-api.d.ts
/**
 * Entrypoint for Diag API.
 * Defines Diagnostic handler used for internal diagnostic logging operations.
 * The default provides a Noop DiagLogger implementation which may be changed via the
 * diag.setLogger(logger: DiagLogger) function.
 *
 * @since 1.0.0
 */
declare const diag: DiagAPI;
//#endregion
export { diag };
//# sourceMappingURL=diag-api.d.mts.map