/**
 * `params` split into the runner's own settings, the `thread` choice, and the params of the thread it runs over. Throws
 * on a `thread` the params type leaves out.
 */
export function splitToolRunnerParams(params) {
    const { stream, max_iterations, runToolsEagerly, thread, ...threadParams } = params;
    if (thread !== undefined && thread !== false) {
        throw new TypeError('`thread` cannot be set in the params of a tool runner. The runner sets it for each request itself. ' +
            'To run without a message thread, pass `thread: false`.');
    }
    return { settings: { stream, max_iterations, runToolsEagerly }, thread, threadParams };
}
//# sourceMappingURL=tool-runner-params.mjs.map