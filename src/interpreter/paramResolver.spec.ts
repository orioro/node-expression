import { testCases, asyncResult } from '@orioro/jest-util'

import { ALL_EXPRESSIONS } from '../'
import {
  castTypeSpec,
  anyType,
  tupleType,
  indefiniteArrayOfType,
  indefiniteObjectOfType,
  stringifyTypeSpec,
} from '@orioro/typing'
import { interpreterList } from './interpreter'
import { syncParamResolver } from './syncParamResolver'
import { asyncParamResolver } from './asyncParamResolver'

const interpreters = interpreterList(ALL_EXPRESSIONS)

const _resolverTestCases = (cases, paramSpec) => {
  paramSpec = castTypeSpec(paramSpec)

  const syncResolver = syncParamResolver(paramSpec)
  const asyncResolver = asyncParamResolver(paramSpec)

  testCases(
    cases,
    (scopeValue, valueToResolve) => {
      return syncResolver(
        {
          interpreters,
          scope: {
            $$VALUE: scopeValue,
          },
        },
        valueToResolve
      )
    },
    () => `sync - ${stringifyTypeSpec(paramSpec)}`
  )

  testCases(
    cases.map((_case) => {
      const args = _case.slice(0, -1)
      const result = _case[_case.length - 1]

      return [...args, asyncResult(result)]
    }),
    (scopeValue, valueToResolve) => {
      return asyncResolver(
        {
          interpreters,
          scope: {
            $$VALUE: scopeValue,
          },
        },
        valueToResolve
      )
    },
    () => `async - ${stringifyTypeSpec(paramSpec)}`
  )
}

describe('anyType()', () => {
  _resolverTestCases(
    [
      [10, 'value-b', 'value-b'],
      [10, ['$value'], 10],
      [10, ['$mathSum', 5], 15],
    ],
    'any'
  )
})

describe('anyType({ skipEvaluation: true })', () => {
  _resolverTestCases(
    [
      [10, 'value-b', 'value-b'],
      [10, ['$value'], ['$value']],
      [10, ['$mathSum', 5], ['$mathSum', 5]],
    ],
    anyType({ skipEvaluation: true })
  )
})

describe('singleType(string)', () => {
  _resolverTestCases(
    [
      ['some-str', 'value-b', 'value-b'],
      ['some-str', ['$value'], 'some-str'],
      ['some-str', 7, TypeError],
    ],
    'string'
  )
})

describe('oneOfTypes([string, number])', () => {
  _resolverTestCases(
    [
      ['some-str', 'value-b', 'value-b'],
      ['some-str', ['$value'], 'some-str'],
      ['some-str', 7, 7],
      ['some-str', true, TypeError],
    ],
    ['string', 'number']
  )
})

describe('oneOfTypes([string, tupleType([string, number]))', () => {
  _resolverTestCases(
    [
      ['some-str', 'value-b', 'value-b'],
      ['some-str', ['$value'], 'some-str'],
      ['some-str', [['$value'], 7], ['some-str', 7]],
      ['some-str', true, TypeError],
    ],
    ['string', tupleType(['string', 'number'])]
  )
})

describe('tupleType([string, number])', () => {
  _resolverTestCases(
    [
      [['some-str', 20], ['$value'], ['some-str', 20]],
      [
        ['some-str', 20],
        ['some-other-str', 15],
        ['some-other-str', 15],
      ],
      [['some-str', 20], 'value-b', TypeError],
      [['some-str', 20], 7, TypeError],
      [['some-str', 20], [1, 2], TypeError],
      [['some-str', 20], ['some-str', 20, 30], TypeError],
    ],
    tupleType(['string', 'number'])
  )
})

describe('indefiniteArrayOfType([string, number])', () => {
  _resolverTestCases(
    [
      [['some-str', 20], ['$value'], ['some-str', 20]],
      [
        ['some-str', 20],
        ['some-other-str', 15],
        ['some-other-str', 15],
      ],
      [
        ['some-str', 20],
        [1, 2],
        [1, 2],
      ],
      [
        ['some-str', 20],
        ['some-str', 20, 30],
        ['some-str', 20, 30],
      ],
      [['some-str', 20], 'value-b', TypeError],
      [['some-str', 20], 7, TypeError],
    ],
    indefiniteArrayOfType(['string', 'number'])
  )
})

describe('objectType(obj)', () => {
  const type = {
    key1: 'string',
    key2: indefiniteArrayOfType(['string', 'number']),
  }

  _resolverTestCases(
    [
      [
        'some-str',
        { key1: 'LITERAL-STR-1', key2: ['LITERAL-STR-2', 'LITERAL-STR-3'] },
        { key1: 'LITERAL-STR-1', key2: ['LITERAL-STR-2', 'LITERAL-STR-3'] },
      ],
      [
        'some-str',
        { key1: ['$value'], key2: [['$value'], 'LITERAL-STR-1'] },
        { key1: 'some-str', key2: ['some-str', 'LITERAL-STR-1'] },
      ],
      ['some-str', { key1: ['$value'], key2: ['$value'] }, TypeError],
      ['some-str', ['$value'], TypeError],
    ],
    type
  )
})

describe('indefiniteObjectOfType(type)', () => {
  _resolverTestCases(
    [
      [
        '10.1',
        {
          key1: [9, ['$value']],
          key2: [10, 'LITERAL-STR-1'],
          key3: [['$numberFloat'], ['$value']],
        },
        {
          key1: [9, '10.1'],
          key2: [10, 'LITERAL-STR-1'],
          key3: [10.1, '10.1'],
        },
      ],
      [
        '10.1',
        {
          key1: [['$value'], ['$value']],
        },
        TypeError,
      ],
    ],
    indefiniteObjectOfType(tupleType(['number', 'string']))
  )
})
