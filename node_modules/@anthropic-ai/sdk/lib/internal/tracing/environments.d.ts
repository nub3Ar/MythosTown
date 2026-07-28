import { type Context, type Span } from '@opentelemetry/api';
import type { BaseAnthropic } from "../../../client.js";
import type { BetaSelfHostedWork } from "../../../resources/beta/environments/work.js";
/**
 * Starts the span of `work`, a Work item that the work poller just claimed, under `parentContext`:
 * the context of whoever asked the poller for the item.
 */
export declare function startEnvironmentWorkSpan(client: BaseAnthropic, work: BetaSelfHostedWork, parentContext: Context): Span | undefined;
/**
 * Ends the span of a Work item that is finished with as `OK`. The status stays unset when `signal`,
 * the work poller's, was aborted first: the item was then neither finished with nor failed.
 */
export declare function endEnvironmentWorkSpan(span: Span | undefined, signal: AbortSignal): void;
/**
 * Ends the span of a Work item whose handling failed with `error`. The status stays unset when
 * `signal`, the work poller's, was aborted first, or `error` is such an abort.
 */
export declare function failEnvironmentWorkSpan(span: Span | undefined, signal: AbortSignal, error: unknown): void;
/**
 * Runs `handle`, the environment worker's handling of a Work item, with the item's span current,
 * and ends the span with how that went.
 */
export declare function withEnvironmentWorkSpan(client: BaseAnthropic, span: Span | undefined, signal: AbortSignal, handle: () => Promise<void>): Promise<void>;
//# sourceMappingURL=environments.d.ts.map