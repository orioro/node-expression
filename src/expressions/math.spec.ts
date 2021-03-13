import { evaluate } from '../evaluate'
import { syncInterpreterList } from '../interpreter/syncInterpreter'
import { asyncInterpreterList } from '../interpreter/asyncInterpreter'
import { VALUE_EXPRESSIONS } from './value'
import { MATH_EXPRESSIONS } from './math'
import { _prepareEvaluateTestCases } from '../../spec/specUtil'

const EXP = {
  ...VALUE_EXPRESSIONS,
  ...MATH_EXPRESSIONS,
}

const syncInterpreters = syncInterpreterList(EXP)
const asyncInterpreters = asyncInterpreterList(EXP)

const _evTestCases = _prepareEvaluateTestCases({
  syncInterpreters,
  asyncInterpreters,
})

describe('operations', () => {
  _evTestCases([
    [10, ['$mathSum', 5], 15],
    [10, ['$mathSub', 5], 5],
    [10, ['$mathMult', 5], 50],
    [10, ['$mathDiv', 5], 2],
    [10, ['$mathMod', 3], 1],
    [10, ['$mathPow', 3], 1000],
  ])
})

describe('$mathAbs', () => {
  _evTestCases([
    [10, ['$mathAbs'], 10],
    [-10, ['$mathAbs'], 10],
  ])
})

describe('$mathMax', () => {
  describe('single value', () => {
    _evTestCases([
      [10, ['$mathMax', 5], 10],
      [10, ['$mathMax', 15], 15],
    ])
  })

  describe('array of values', () => {
    _evTestCases([
      [10, ['$mathMax', []], 10],
      [10, ['$mathMax', [0, 5]], 10],
      [10, ['$mathMax', [5, 15]], 15],
    ])
  })
})

describe('$mathMin', () => {
  describe('single value', () => {
    _evTestCases([
      [10, ['$mathMin', 5], 5],
      [10, ['$mathMin', 15], 10],
    ])
  })

  describe('array of values', () => {
    _evTestCases([
      [10, ['$mathMin', []], 10],
      [10, ['$mathMin', [0, 5]], 0],
      [10, ['$mathMin', [5, 15]], 5],
      [10, ['$mathMin', [25, 15]], 10],
    ])
  })
})

describe('$mathRound', () => {
  _evTestCases([
    [10.1, ['$mathRound'], 10],
  ])
})

describe('$mathFloor', () => {
  _evTestCases([
    [10.1, ['$mathFloor'], 10],
  ])
})

describe('$mathCeil', () => {
  _evTestCases([
    [10.1, ['$mathCeil'], 11],
  ])
})
