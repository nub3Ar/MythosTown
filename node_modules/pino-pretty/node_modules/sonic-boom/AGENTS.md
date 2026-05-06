This file provides guidance to AI coding agents like Claude Code (claude.ai/code), Cursor AI, Codex, Gemini CLI, GitHub Copilot, and other AI coding assistants when working with code in this repository.

## Project at a glance
- `sonic-boom` is a small Node.js library implementing a high-performance writable stream abstraction for file descriptors/files.
- Runtime implementation is almost entirely in `index.js`.
- Type declarations are in `types/index.d.ts` and are validated by `tsd`.
- Behavior is validated by `tap` tests in `test/*.test.js`, usually exercised in both async and sync modes.

## Common commands
- Install deps:
  - `npm install`
- Full CI-equivalent local checks:
  - `npm test`
- Lint only:
  - `npx standard`
- Runtime tests only:
  - `npm run test:unit`
- Type checks + type tests:
  - `npm run test:types`
- Run one test file:
  - `npm run test:unit -- test/reopen.test.js`
- Run a single test by name pattern:
  - `npm run test:unit -- test/reopen.test.js -g "reopen with file"`
- Run benchmarks:
  - `node bench.js`

## Architecture and code structure
### 1) Core implementation (`index.js`)
- `SonicBoom` is an `EventEmitter` with explicit internal state for buffered writes and lifecycle transitions.
- Constructor supports `fd` or `dest` (`opts.fd`/`opts.dest`) and configures behavior flags (`sync`, `minLength`, `maxLength`, `maxWrite`, `periodicFlush`, `fsync`, `mkdir`, `append`, `mode`, `retryEAGAIN`, `contentMode`).
- `contentMode` switches implementation strategy at construction time:
  - `utf8` mode uses string buffers and `write`/`flush`/`flushSync` variants for strings.
  - `buffer` mode uses array-of-buffer chunks (`_bufs` + `_lens`) and dedicated buffer write/flush paths.

### 2) Write pipeline and backpressure
- Writes append to in-memory buffers (`_bufs`) and track total queued bytes in `_len`.
- Actual disk writes are serialized through `_actualWrite`/`_actualWriteBuffer` and completion callback `release`.
- `releaseWritingBuf()` handles partial writes and multi-byte UTF-8 boundaries correctly (important for string mode correctness).
- Backpressure signal is based on `_hwm` (`Math.max(minLength || 0, 16387)`), while flush triggering is controlled by `minLength`.

### 3) Lifecycle/state transitions
- File opening is centralized in `openFile()`, including async/sync open, optional `mkdir`, and `ready` emission semantics.
- `reopen()` supports log rotation by swapping file handles after pending writes complete.
- `end()` drains buffered data then closes; `destroy()` closes immediately.
- `actualClose()` handles final fsync/close and emits `finish`/`close` in the expected order.

### 4) Error/retry model
- EAGAIN/EBUSY handling is centralized in `release`; retries are controlled by user-provided `retryEAGAIN(err, writeBufferLen, remainingBufferLen)`.
- If retry callback returns `false`, errors are emitted/thrown depending on call path (async write, sync write, or `flushSync`).
- Sync and async paths are both first-class and intentionally tested for parity.

## Test suite organization
- `test/helper.js` defines `runTests(buildTests)` which runs many test groups twice (`sync: false` and `sync: true`).
- Most behavior tests assert event ordering and write correctness under buffering, reopen, flush, destroy/end, fsync, periodic flush, retry conditions, and partial-write scenarios.
- Several tests use `proxyquire` to stub `fs` behavior; preserve this style when validating edge conditions.

## Change guidance specific to this repo
- Keep string-mode and buffer-mode code paths behaviorally aligned when touching write/flush/release logic.
- When changing lifecycle behavior, verify both `ready`/`drain` semantics and `finish`/`close` ordering in async and sync modes.
- When changing retry/partial-write logic, run `test/retry.test.js`, `test/sync.test.js`, and `test/flush-sync.test.js` in addition to `npm test`.
- If public options/events/method semantics change, update both `README.md` and `types/index.d.ts` in the same change.
