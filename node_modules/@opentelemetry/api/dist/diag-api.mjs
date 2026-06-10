import { DiagAPI } from "./api/diag.mjs";
//#region src/diag-api.ts
/**
* Entrypoint for Diag API.
* Defines Diagnostic handler used for internal diagnostic logging operations.
* The default provides a Noop DiagLogger implementation which may be changed via the
* diag.setLogger(logger: DiagLogger) function.
*
* @since 1.0.0
*/
const diag = DiagAPI.instance();
//#endregion
export { diag };

//# sourceMappingURL=diag-api.mjs.map