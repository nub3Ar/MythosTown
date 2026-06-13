import { Context } from "../context/types.mjs";
import { LogRecord, SeverityNumber } from "./LogRecord.mjs";
//#region src/logs/Logger.d.ts
interface Logger {
  /**
   * Emit a log record. This method should only be used by log appenders.
   *
   * @param logRecord
   */
  emit(logRecord: LogRecord): void;
  /**
   * Will a log record with the given details get emitted?
   * This can be used to avoid expensive calculation of log record data.
   */
  enabled(options?: {
    context?: Context;
    severityNumber?: SeverityNumber;
    eventName?: string;
  }): boolean;
}
//#endregion
export { Logger };
//# sourceMappingURL=Logger.d.mts.map