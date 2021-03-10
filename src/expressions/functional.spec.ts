import { evaluate } from '../evaluate'
import { syncInterpreterList } from '../syncInterpreter'

import { COMPARISON_EXPRESSIONS } from './comparison'
import { VALUE_EXPRESSIONS } from './value'
import { FUNCTIONAL_EXPRESSIONS } from './functional'
import { ARRAY_EXPRESSIONS } from './array'
import { MATH_EXPRESSIONS } from './math'
import { STRING_EXPRESSIONS } from './string'

const interpreters = syncInterpreterList({
  ...VALUE_EXPRESSIONS,
  ...COMPARISON_EXPRESSIONS,
  ...FUNCTIONAL_EXPRESSIONS,
  ...ARRAY_EXPRESSIONS,
  ...MATH_EXPRESSIONS,
  ...STRING_EXPRESSIONS,
})

test('$pipe', () => {
  const SUM_2 = ['$arrayMap', ['$mathSum', 2]]
  const MULT_2 = ['$arrayMap', ['$mathMult', 2]]
  const GREATER_THAN_50 = ['$arrayFilter', ['$gt', 50]]

  const context = {
    interpreters,
    scope: { $$VALUE: [10, 20, 30, 40] },
  }

  expect(evaluate(context, ['$pipe', [SUM_2, MULT_2]])).toEqual([
    24,
    44,
    64,
    84,
  ])

  expect(
    evaluate(context, ['$pipe', [SUM_2, MULT_2, GREATER_THAN_50]])
  ).toEqual([64, 84])

  expect(evaluate(context, ['$pipe', [SUM_2, GREATER_THAN_50]])).toEqual([])
})
