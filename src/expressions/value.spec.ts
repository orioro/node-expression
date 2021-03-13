import { evaluate } from '../evaluate'
import { syncInterpreterList } from '../interpreter/syncInterpreter'
import { asyncInterpreterList } from '../interpreter/asyncInterpreter'
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

const syncInterpreters = syncInterpreterList(EXP)
const asyncInterpreters = asyncInterpreterList(EXP)

const _evTestCases = _prepareEvaluateTestCases({
  syncInterpreters,
  asyncInterpreters,
})

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
      [data, ['$value', 'key3.key31'], 'Value 31']
    ])
  })

  describe("[['$value']]", () => {
    _evTestCases([
      ['TEST', ['$value'], 'TEST'],
      ['TEST', [['$value']], [['$value']]]
    ])
  })

  // test("[['$value']]", () => {
  //   expect(
  //     evaluate(
  //       {
  //         interpreters: syncInterpreters,
  //         scope: {
  //           $$VALUE: 'TEST',
  //         },
  //       },
  //       ['$value']
  //     )
  //   ).toEqual('TEST')

  //   expect(
  //     evaluate(
  //       {
  //         interpreters: syncInterpreters,
  //         scope: {
  //           $$VALUE: 'TEST',
  //         },
  //       },
  //       [['$value']]
  //     )
  //   ).toEqual([['$value']])
  // })
})

describe('$evaluate', () => {
  test('basic', () => {
    const check = (value) =>
      evaluate(
        {
          interpreters: syncInterpreters,
          scope: {
            $$VALUE: value,
          },
        },
        [
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
      )

    expect(check(6)).toEqual(['-', 'EVEN', '-'])
    expect(check(5)).toEqual(['-', '-', 'ODD'])
    expect(check(11)).toEqual(['>10', '-', 'ODD'])
    expect(check(12)).toEqual(['>10', 'EVEN', '-'])
  })
})

describe('$literal', () => {
  test('basic', () => {
    const context = {
      interpreters: syncInterpreters,
      scope: {
        $$VALUE: 'SOME_VALUE',
      },
    }

    expect(evaluate(context, ['$value', '$$VALUE'])).toEqual('SOME_VALUE')
    expect(evaluate(context, ['$literal', ['$value', '$$VALUE']])).toEqual([
      '$value',
      '$$VALUE',
    ])
  })
})
