import 'regenerator-runtime/runtime'
import { testCases, fnCallLabel, variableName } from '@orioro/jest-util'
import {
  evaluate,
  // evaluateSync,
  // evaluateAsync,
  evaluateTyped,
  // evaluateTypedSync,
  // evaluateTypedAsync,
} from './evaluate'

import { ALL_EXPRESSIONS } from './'

import { SyncModePromiseUnsupportedError } from './errors'

import { interpreterList } from './interpreter/interpreter'

import { _prepareEvaluateTestCases } from '../spec/specUtil'

const delay = (value, ms = 100) =>
  new Promise((resolve) => setTimeout(resolve.bind(null, value), ms))

const _evTestCases = _prepareEvaluateTestCases({
  ...ALL_EXPRESSIONS,
  $asyncEcho: async (context, value) => delay(value),
})

describe('evaluate(context, value)', () => {
  test('possible unknown expression warning', () => {
    const _warn = console.warn
    console.warn = jest.fn()

    expect(
      evaluate(
        {
          interpreters: {},
          scope: { $$VALUE: 'aa' },
        },
        ['$someUnknownExpression']
      )
    ).toEqual(['$someUnknownExpression'])

    expect(console.warn).toHaveBeenCalledWith(
      'Possible missing expression error: ["$someUnknownExpression"]. ' +
        "No interpreter was found for '$someUnknownExpression'"
    )
    console.warn = _warn
  })
})

describe('evaluateSync(context, expression)', () => {
  _evTestCases.testSyncCases([
    [
      'any-value',
      Promise.resolve(10),
      new SyncModePromiseUnsupportedError('LITERAL_VALUE'),
    ],
    [
      'any-value',
      new Promise(() => {}), // eslint-disable-line @typescript-eslint/no-empty-function
      new SyncModePromiseUnsupportedError('LITERAL_VALUE'),
    ],
    [
      'any-value',
      ['$asyncEcho', 'Some async value'],
      new SyncModePromiseUnsupportedError('$asyncEcho'),
    ],
  ])
})

describe('evaluateAsync(context, expression)', () => {
  _evTestCases.testAsyncCases([
    ['any-value', 10, 10],
    ['any-value', Promise.resolve(10), 10],
    ['any-value', ['$asyncEcho', 'Some async value'], 'Some async value'],
  ])
})

describe('evaluateTyped(expectedTypes, context, expression)', () => {
  testCases(
    [
      ['string', ['$getStrExp'], 'some_string'],
      ['string', 'some_other_string', 'some_other_string'],
      ['string', 1, TypeError],
      ['number', 1, 1],
      ['number', '1', TypeError],
      ['array', ['1', 1], ['1', 1]],
      ['array', '1', TypeError],
      ['array', ['$getStrExp'], TypeError],
      ['array', ['$getArrExp'], ['item-1', 'item-2']],
    ],
    (type, expression) =>
      evaluateTyped(
        type,
        {
          interpreters: interpreterList({
            $getStrExp: () => 'some_string',
            $getArrExp: () => ['item-1', 'item-2'],
          }),
          scope: { $$VALUE: 'any-value' },
        },
        expression
      ),
    ([type, expression], result) =>
      fnCallLabel(
        'evaluateTyped',
        [type, variableName('context'), expression],
        result
      )
  )
})
