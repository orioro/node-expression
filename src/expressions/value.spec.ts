import { evaluate } from '../expression'
import { MATH_EXPRESSIONS } from './math'
import { LOGICAL_EXPRESSIONS } from './logical'
import { COMPARISON_EXPRESSIONS } from './comparison'
import { ARRAY_EXPRESSIONS } from './array'
import { VALUE_EXPRESSIONS } from './value'

const interpreters = {
  ...MATH_EXPRESSIONS,
  ...LOGICAL_EXPRESSIONS,
  ...COMPARISON_EXPRESSIONS,
  ...ARRAY_EXPRESSIONS,
  ...VALUE_EXPRESSIONS,
}

describe('$value', () => {
  test('basic', () => {
    const data = {
      key1: 'Value 1',
      key2: 'Value 2',
      key3: {
        key31: 'Value 31',
      },
    }

    const context = {
      interpreters,
      scope: {
        $$VALUE: data,
      },
    }

    expect(evaluate(context, ['$value'])).toEqual(data)
    expect(evaluate(context, ['$value', 'key1'])).toEqual('Value 1')
    expect(evaluate(context, ['$value', 'key3.key31'])).toEqual('Value 31')
  })
})

describe('$evaluate', () => {
  test('basic', () => {
    const check = (value) =>
      evaluate(
        {
          interpreters,
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
      interpreters,
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
