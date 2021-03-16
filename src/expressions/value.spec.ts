import { MATH_EXPRESSIONS } from './math'
import { LOGICAL_EXPRESSIONS } from './logical'
import { COMPARISON_EXPRESSIONS } from './comparison'
import { ARRAY_EXPRESSIONS } from './array'
import { VALUE_EXPRESSIONS } from './value'
import { _prepareEvaluateTestCases } from '../../spec/specUtil'

const EXP = {
  ...MATH_EXPRESSIONS,
  ...LOGICAL_EXPRESSIONS,
  ...COMPARISON_EXPRESSIONS,
  ...ARRAY_EXPRESSIONS,
  ...VALUE_EXPRESSIONS,
}

const _evTestCases = _prepareEvaluateTestCases(EXP)

describe('$value', () => {
  describe('basic', () => {
    const data = {
      key1: 'Value 1',
      key2: 'Value 2',
      key3: {
        key31: 'Value 31',
      },
    }

    _evTestCases([
      [data, ['$value'], data],
      [data, ['$value', 'key1'], 'Value 1'],
      [data, ['$value', 'key3.key31'], 'Value 31'],
    ])
  })

  describe("[['$value']]", () => {
    _evTestCases([
      ['TEST', ['$value'], 'TEST'],
      ['TEST', [['$value']], [['$value']]],
    ])
  })
})

describe('$evaluate', () => {
  const EXP = [
    '$arrayMap',
    [
      '$if',
      ['$evaluate', ['$value', '0'], ['$value', '$$PARENT_SCOPE']],
      ['$value', '1'],
      '-',
    ],
    [
      [['$gte', 10], '>10'],
      [['$eq', 0, ['$mathMod', 2]], 'EVEN'],
      [['$notEq', 0, ['$mathMod', 2]], 'ODD'],
    ],
  ]

  _evTestCases([
    [6, EXP, ['-', 'EVEN', '-']],
    [5, EXP, ['-', '-', 'ODD']],
    [11, EXP, ['>10', '-', 'ODD']],
    [12, EXP, ['>10', 'EVEN', '-']],
  ])

  describe('invalid expressions to be evaluated', () => {
    _evTestCases([
      ['any-value', ['$evaluate', 10, {}], TypeError], // 10 is not an expression
    ])
  })
})

describe('$literal', () => {
  _evTestCases([
    ['SOME_VALUE', ['$value', '$$VALUE'], 'SOME_VALUE'],
    ['SOME_VALUE', ['$literal', ['$value', '$$VALUE']], ['$value', '$$VALUE']],
  ])
})
