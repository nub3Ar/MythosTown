/**
 * The toolset families the SDK runs, and how a `tools[]` entry maps to one.
 */
import type { BetaRunnableToolset, BetaToolsetParam } from "../../tools/BetaRunnableToolset.js";
import type { BetaToolRunnerParams } from "../../tools/BetaToolRunner.js";
export type ToolsetFamily = 'browser' | 'computer';
/** Dated `tools[]` entry `type` → the family stamped on member blocks. */
export declare const TOOLSET_TYPE_TO_FAMILY: {
    readonly browser_toolset_20260801: "browser";
    readonly computer_toolset_20260801: "computer";
};
export declare function toolsetFamily(toolset: BetaToolsetParam): ToolsetFamily;
/** Whether a `tools` entry is a toolset the runner can execute locally. */
export declare function isRunnableToolset(t: BetaToolRunnerParams['tools'][number]): t is BetaRunnableToolset;
//# sourceMappingURL=family.d.ts.map