import { evaluate } from '../evaluate'
import { syncInterpreterList } from '../interpreter/syncInterpreter'
import { asyncInterpreterList } from '../interpreter/asyncInterpreter'
import { $value } from './value'
import { TYPE_EXPRESSIONS, typeExpressions } from './type'
import { testCases } from '@orioro/jest-util'
import { _prepareEvaluateTestCases } from '../../spec/specUtil'

const EXP = {
  $value,
  ...TYPE_EXPRESSIONS,
}

const syncInterpreters = syncInterpreterList(EXP)
const asyncInterpreters = asyncInterpreterList(EXP)

const _evTestCases = _prepareEvaluateTestCases({
  syncInterpreters,
  asyncInterpreters,
})

describe('$type', () => {
  _evTestCases([
    ['some string', ['$type'], 'string'],
    [10, ['$type'], 'number'],
    [true, ['$type'], 'boolean'],
    [[], ['$type'], 'array'],
    [{}, ['$type'], 'object'],
    [new Map(), ['$type'], 'map'],
    [new Set(), ['$type'], 'set'],
    [Symbol(), ['$type'], 'symbol'],
  ])
})

describe('$isType', () => {
  _evTestCases([
    ['Some str', ['$isType', 'string'], true],
    [9, ['$isType', 'string'], false],
    [9, ['$isType', 'number'], true],
  ])
})

describe('typeExpressions(types)', () => {
  const [$customType, $customIsType] = typeExpressions({
    numericOnlyString: (value) =>
      typeof value === 'string' && /^[0-9]+$/.test(value),
    alphaOnlyString: (value) =>
      typeof value === 'string' && /^[a-zA-Z]+$/.test(value),
    alphaNumericString: (value) =>
      typeof value === 'string' && /^[a-zA-Z0-9]+$/.test(value),
    normalString: (value) => typeof value === 'string',
  })

  const customTypeExps = {
    $customType,
    $customIsType,
  }

  const _evTestCases = _prepareEvaluateTestCases({
    syncInterpreters: syncInterpreterList({
      ...EXP,
      ...customTypeExps,
    }),
    asyncInterpreters: asyncInterpreterList({
      ...EXP,
      ...customTypeExps,
    }),
  })

  describe('$customType', () => {
    _evTestCases([
      ['abc123', ['$customType'], 'alphaNumericString'],
      ['abc123-', ['$customType'], 'normalString'],
      ['abc', ['$customType'], 'alphaOnlyString'],
      ['abc123', ['$customType'], 'alphaNumericString'],
      ['123', ['$customType'], 'numericOnlyString'],
    ])
  })

  describe('$customIsType', () => {
    _evTestCases([
      ['abc123', ['$customIsType', 'alphaNumericString'], true],
      ['abc123-', ['$customIsType', 'alphaNumericString'], false],
      ['abc', ['$customIsType', 'alphaOnlyString'], true],
      ['abc123', ['$customIsType', 'alphaOnlyString'], false],
      ['123', ['$customIsType', 'numericOnlyString'], true],
      ['abc123', ['$customIsType', 'numericOnlyString'], false],
    ])
  })
})
