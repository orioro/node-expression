import { evaluate } from '../evaluate'
import { syncInterpreterList } from '../interpreter/syncInterpreter'
import { asyncInterpreterList } from '../interpreter/asyncInterpreter'
import { $stringSubstr } from './string'
import { $and } from './logical'
import {
  $eq,
  $notEq,
  $in,
  $notIn,
  $gt,
  $gte,
  $lt,
  $lte,
  $matches,
  COMPARISON_EXPRESSIONS,
} from './comparison'
import { $value } from './value'

import { _prepareEvaluateTestCases } from '../../spec/specUtil'

const EXPS = {
  $value,
  $stringSubstr,
  $and,
  ...COMPARISON_EXPRESSIONS,
}

const syncInterpreters = syncInterpreterList(EXPS)
const asyncInterpreters = asyncInterpreterList(EXPS)

const _evTestCases = _prepareEvaluateTestCases({
  syncInterpreters,
  asyncInterpreters,
})

describe('$eq / $notEq', () => {
  describe('string', () => {
    _evTestCases([
      ['SOME_STRING', ['$eq', 'SOME_STRING'], true],
      ['SOME_STRING', ['$notEq', 'SOME_STRING'], false],
      ['SOME_STRING', ['$eq', 'OTHER_STRING'], false],
      ['SOME_STRING', ['$notEq', 'OTHER_STRING'], true],
      [
        'SOME_STRING',
        ['$eq', ['$stringSubstr', 4, 15, 'PRE_SOME_STRING_POS']],
        true,
      ],
    ])
  })
})

describe('$in / $notIn', () => {
  _evTestCases([
    ['C', ['$in', ['A', 'B', 'C']], true],
    ['C', ['$notIn', ['A', 'B', 'C']], false],
    ['C', ['$in', ['X', 'Y', 'Z']], false],
    ['C', ['$notIn', ['X', 'Y', 'Z']], true],
  ])
})

describe('$gt / $gte / $lt / $lte', () => {
  describe('$gt', () => {
    _evTestCases([
      [20, ['$gt', 10], true],
      [20, ['$gt', 20], false],
      [20, ['$gt', 30], false],
    ])
  })

  describe('$gte', () => {
    _evTestCases([
      [20, ['$gte', 10], true],
      [20, ['$gte', 20], true],
      [20, ['$gte', 30], false],
    ])
  })

  describe('$lt', () => {
    _evTestCases([
      [20, ['$lt', 10], false],
      [20, ['$lt', 20], false],
      [20, ['$lt', 30], true],
    ])
  })

  describe('$lte', () => {
    _evTestCases([
      [20, ['$lte', 10], false],
      [20, ['$lte', 20], true],
      [20, ['$lte', 30], true],
    ])
  })
})

describe('$matches', () => {
  _evTestCases([
    [24, ['$matches', { $gt: 20, $lt: 30 }], true],
    [24, ['$matches', { $gt: 20, $lt: 24 }], false],
  ])
})
