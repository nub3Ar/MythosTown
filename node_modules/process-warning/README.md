# process-warning

[![CI](https://github.com/fastify/process-warning/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/fastify/process-warning/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/process-warning.svg?style=flat)](https://www.npmjs.com/package/process-warning)
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-brightgreen?style=flat)](https://github.com/neostandard/neostandard)

A small utility for generating consistent [warning objects](https://nodejs.org/api/process.html#event-warning) across a codebase.
It also exposes a utility for emitting those warnings, guaranteeing that they are issued only once (unless configured otherwise).

_This module is used by the [Fastify](https://fastify.dev) framework, and it was called `fastify-warning` prior to version 1.0.0._

## Install

```
npm i process-warning
```

## Usage

The module exports two builder functions for creating warnings.

```js
const {
  createWarning,
  createDeprecation
} = require('process-warning')

const warning = createWarning({
  name: 'ExampleWarning',
  code: 'EXP_WRN_001',
  message: 'Hello %s',
  unlimited: true
})
const emitted = warning('world')
```

### Methods

#### `createWarning({name, code, message[, unlimited]})`

- `name` (`string`, required) - The error name, accessible through
`error.name`. For consistency, prefix module error names with
`{ModuleName}Warning`.
- `code` (`string`, required) - The warning code, accessible through
`error.code`. For consistency, prefix plugin error codes with
`{ThreeLetterModuleName}_`, e.g. `FST_`. Note: Codes should be all uppercase.
- `message` (`string`, required) - The warning message. Interpolated strings
can also be used to format the message.
- `options` (`object`, optional) - Optional options with the following
properties:
  + `unlimited` (`boolean`, optional) - Should the warning be emitted more than
  once? Defaults to `false`.

#### `createDeprecation({ code, message[, options] })`

This is a wrapper for `createWarning`. It is equivalent to invoking
`createWarning` with the `name` parameter set to `"DeprecationWarning"`.

Deprecation warnings have extended support for the Node.js CLI options:
`--throw-deprecation`, `--no-deprecation`, and `--trace-deprecation`.

#### `warning([, a [, b [, c]]])`

The returned `warning` function can be used to emit warnings.
A warning is guaranteed to be emitted at least once.

- `[, a [, b [, c]]]` (`any`, optional) - Parameters for string interpolation.

```js
const { createWarning } = require('process-warning')
const FST_ERROR_CODE = createWarning({ name: 'MyAppWarning', code: 'FST_ERROR_CODE', message: 'message' })
FST_ERROR_CODE()
```

Using an interpolated string:

```js
const { createWarning } = require('process-warning')
const FST_ERROR_CODE = createWarning({ name: 'MyAppWarning', code: 'FST_ERROR_CODE', message: 'Hello %s'})
FST_ERROR_CODE('world')
```

The `warning` object has methods and properties for managing the warning's state. These are useful for testing.

```js
const { createWarning } = require('process-warning')
const FST_ERROR_CODE = createWarning({ name: 'MyAppWarning', code: 'FST_ERROR_CODE', message: 'Hello %s'})
console.log(FST_ERROR_CODE.emitted) // false
FST_ERROR_CODE('world')
console.log(FST_ERROR_CODE.emitted) // true

const FST_ERROR_CODE_2 = createWarning('MyAppWarning', 'FST_ERROR_CODE_2', 'Hello %s')
FST_ERROR_CODE_2.emitted = true
FST_ERROR_CODE_2('world') // Will not be emitted because it is not unlimited
```

Using an unlimited warning:

```js
const { createWarning } = require('process-warning')
const FST_ERROR_CODE = createWarning({ name: 'MyAppWarning', code: 'FST_ERROR_CODE', message: 'Hello %s', unlimited: true })
FST_ERROR_CODE('world') // Will be emitted
FST_ERROR_CODE('world') // Will be emitted again
```

#### `spyWarning(warning)`

Spy on the created warning function for testing purposes.

```js
const { test } = require('node:test')
const { createWarning, spyWarning } = require('process-warning')
const FST_ERROR_CODE = createWarning({ name: 'MyAppWarning', code: 'FST_ERROR_CODE', message: 'Hello %s' })

test('spy warning', t => {
  const spyData = spyWarning(FST_ERROR_CODE)

  // Call after spying
  const emitted = FST_ERROR_CODE('world')
  t.assert.strictEqual(emitted, true)

  // Restore the warning function
  // This must be called when spying is no longer required
  // Otherwise, the call data will accumulate
  t.after(() => spyData.restore())

  t.assert.strictEqual(FST_ERROR_CODE.emitted, true)
  // `calls` contains the arguments and results
  // `result` indicates whether the warning was emitted through `process.emitWarning`
  console.log(spyData.calls) // [{ arguments: ['world'], result: true }]
  t.assert.deepStrictEqual(spyData.calls[0].arguments, ['world'])
  t.assert.strictEqual(spyData.calls[0].result, true)
  // Number of times the function was called
  console.log(spyData.callCount()) // 1
  t.assert.strictEqual(spyData.callCount(), 1)

  // Reset the spy statistics and warning state
  spyData.reset()
  t.assert.strictEqual(FST_ERROR_CODE.emitted, false)
  t.assert.deepStrictEqual(spyData.calls, [])
  t.assert.strictEqual(spyData.callCount(), 0)
})
```

### Suppressing warnings

Warnings can be suppressed by using one of Node.js's built-in warning suppression mechanisms:

- Setting the `NODE_NO_WARNINGS` environment variable to `1`
- Passing the `--no-warnings` flag to the Node.js process
- Setting `--no-warnings` in the `NODE_OPTIONS` environment variable

For more information, see the [Node.js documentation](https://nodejs.org/api/cli.html).

## License

Licensed under [MIT](./LICENSE).