import { testCases, asyncResult } from '@orioro/jest-util'

import { ALL_EXPRESSIONS } from './'

import { interpreterList } from './interpreter/interpreter'

import { evaluateAsync } from './evaluate'

import { InterpreterSpec } from './types'

const wait = (ms, result) =>
  new Promise((resolve) => setTimeout(resolve.bind(null, result), ms))

const $asyncLoadStr: InterpreterSpec = [() => wait(100, 'async-str'), []]
const $asyncLoadNum: InterpreterSpec = [() => wait(100, 9), []]
const $asyncLoadArr: InterpreterSpec = [
  () => wait(100, ['str-1', 'str-2', 'str-3']),
  [],
]
const $asyncLoadObj: InterpreterSpec = [
  () =>
    wait(100, {
      key1: 'value1',
      key2: 'value2',
    }),
  [],
]
const $asyncLoadTrue: InterpreterSpec = [() => wait(100, true), []]
const $asyncLoadFalse: InterpreterSpec = [() => wait(100, false), []]

const interpreters = interpreterList({
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
      evaluateAsync({ interpreters, scope: { $$VALUE: null } }, [expression])
  )
})

describe('async - nested async expression', () => {
  test('simple scenario - string concat', () => {
    return expect(
      evaluateAsync(
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
      evaluateAsync(
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
