import { Context } from "../context/types.mjs";
import { AnyValue } from "../common/AnyValue.mjs";
import { Attributes } from "../common/Attributes.mjs";
import { TimeInput } from "../common/Time.mjs";
//#region src/logs/LogRecord.d.ts
declare enum SeverityNumber {
  UNSPECIFIED = 0,
  TRACE = 1,
  TRACE2 = 2,
  TRACE3 = 3,
  TRACE4 = 4,
  DEBUG = 5,
  DEBUG2 = 6,
  DEBUG3 = 7,
  DEBUG4 = 8,
  INFO = 9,
  INFO2 = 10,
  INFO3 = 11,
  INFO4 = 12,
  WARN = 13,
  WARN2 = 14,
  WARN3 = 15,
  WARN4 = 16,
  ERROR = 17,
  ERROR2 = 18,
  ERROR3 = 19,
  ERROR4 = 20,
  FATAL = 21,
  FATAL2 = 22,
  FATAL3 = 23,
  FATAL4 = 24
}
interface LogRecord {
  /**
   * The unique identifier for the log record.
   */
  eventName?: string;
  /**
   * The time when the log record occurred as UNIX Epoch time in nanoseconds.
   */
  timestamp?: TimeInput;
  /**
   * Time when the event was observed by the collection system.
   */
  observedTimestamp?: TimeInput;
  /**
   * Numerical value of the severity.
   */
  severityNumber?: SeverityNumber;
  /**
   * The severity text.
   */
  severityText?: string;
  /**
   * A value containing the body of the log record.
   */
  body?: AnyValue;
  /**
   * Attributes that define the log record.
   */
  attributes?: Attributes;
  /**
   * An exception (or error) associated with the log record.
   *
   * @experimental
   */
  exception?: unknown;
  /**
   * The Context associated with the LogRecord.
   */
  context?: Context;
}
//#endregion
export { LogRecord, SeverityNumber };
//# sourceMappingURL=LogRecord.d.mts.map