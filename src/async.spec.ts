import { testCases, asyncResult } from '@orioro/jest-util'
// import { validateType } from '@orioro/typing'

import { ALL_EXPRESSIONS } from './'

import { asyncInterpreterList } from './interpreter/asyncInterpreter'

import { evaluate } from './evaluate'

import { ExpressionInterpreterSpec } from './types'

const wait = (ms, result) =>
  new Promise((resolve) => setTimeout(resolve.bind(null, result), ms))

const $asyncLoadStr: ExpressionInterpreterSpec = [
  () => wait(100, 'async-str'),
  [],
]
const $asyncLoadNum: ExpressionInterpreterSpec = [() => wait(100, 9), []]
const $asyncLoadArr: ExpressionInterpreterSpec = [
  () => wait(100, ['str-1', 'str-2', 'str-3']),
  [],
]
const $asyncLoadObj: ExpressionInterpreterSpec = [
  () =>
    wait(100, {
      key1: 'value1',
      key2: 'value2',
    }),
  [],
]
const $asyncLoadTrue: ExpressionInterpreterSpec = [() => wait(100, true), []]
const $asyncLoadFalse: ExpressionInterpreterSpec = [() => wait(100, false), []]

const interpreters = asyncInterpreterList({
  ...ALL_EXPRESSIONS,
  $asyncLoadStr,
  $asyncLoadNum,
  $asyncLoadArr,
  $asyncLoadObj,
  $asyncLoadTrue,
  $asyncLoadFalse,
})

describe('async - immediate async expression', () => {
  testCases(
    [
      ['$asyncLoadStr', asyncResult('async-str')],
      ['$asyncLoadNum', asyncResult(9)],
      ['$asyncLoadArr', asyncResult(['str-1', 'str-2', 'str-3'])],
      ['$asyncLoadObj', asyncResult({ key1: 'value1', key2: 'value2' })],
      ['$asyncLoadTrue', asyncResult(true)],
      ['$asyncLoadFalse', asyncResult(false)],
    ],
    (expression) =>
      evaluate({ interpreters, scope: { $$VALUE: null } }, [expression])
  )
})

describe('async - nested async expression', () => {
  test('simple scenario - string concat', () => {
    return expect(
      evaluate(
        {
          interpreters,
          scope: {
            $$VALUE: 'value-',
          },
        },
        ['$stringConcat', ['$asyncLoadStr']]
      )
    ).resolves.toEqual('value-async-str')
  })
})

describe('async - syncronous expressions only get converted to async as well', () => {
  test('simple scenario - string concat', () => {
    return expect(
      evaluate(
        {
          interpreters,
          scope: {
            $$VALUE: 'value-',
          },
        },
        ['$stringConcat', 'sync-value']
      )
    ).resolves.toEqual('value-sync-value')
  })
})
