import { type Context, type Span } from '@opentelemetry/api';
import type { BaseAnthropic } from "../../../client.mjs";
import type { BetaRunnableTool, BetaToolUse } from "../../tools/BetaRunnableTool.mjs";
import type { BetaRunnableToolset } from "../../tools/BetaRunnableToolset.mjs";
import type { MessageCreateParams as BetaMessageCreateParams } from "../../../resources/beta/messages/messages.mjs";
import type { AnyToolResultContent } from "./types.mjs";
/**
 * Starts the `anthropic.messages.tool_runner` span of one loop of the Messages tool runner, as a
 * child of the current span. The runner sets its status and ends it.
 */
export declare function startToolRunnerSpan(client: BaseAnthropic, params: Pick<BetaMessageCreateParams, 'model' | 'output_config' | 'output_format'>, conversationId: string | undefined): Span | undefined;
/** What a tool runner says of itself for the spans of the tools it runs. */
export interface ToolUseSpanOptions {
    /** The application's abort signal: a run that it aborts is canceled, not failed. */
    signal?: AbortSignal | null | undefined;
    /**
     * The conversation ID that the application set on the tool runner. Without one, the Sessions
     * tool runner gives the ID of the Session thread that the tool call belongs to, when it knows it.
     */
    conversationId?: string | undefined;
    /** For the Sessions tool runner, the ID of the Session that the tool call belongs to. */
    sessionID?: string | undefined;
    /**
     * The span's parent, which the tool runner holds because a context manager that does not follow
     * promises has lost it by the time a tool runs. The default is the current context.
     */
    parentContext?: Context | undefined;
}
/** What a tool runner sends back for a tool run. */
interface ToolUseResult {
    content: NonNullable<AnyToolResultContent>;
    isError: boolean;
}
/**
 * Runs `run`, one client tool run of a tool runner, with the run's span current, and returns its
 * result. An error result fails the span with `tool_error`, unless the application has aborted
 * `signal`: a canceled run gets no status and no result.
 */
export declare function withToolUseSpan<Result extends ToolUseResult>(client: BaseAnthropic, tool: BetaRunnableTool | BetaRunnableToolset, toolUse: BetaToolUse, options: ToolUseSpanOptions, run: () => Promise<Result>): Promise<Result>;
export {};
//# sourceMappingURL=tools.d.mts.map