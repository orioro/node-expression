import { evaluate } from '../evaluate'
import { syncInterpreterList } from '../interpreter/syncInterpreter'
import { asyncInterpreterList } from '../interpreter/asyncInterpreter'

import { COMPARISON_EXPRESSIONS } from './comparison'
import { VALUE_EXPRESSIONS } from './value'
import { FUNCTIONAL_EXPRESSIONS } from './functional'
import { ARRAY_EXPRESSIONS } from './array'
import { MATH_EXPRESSIONS } from './math'
import { STRING_EXPRESSIONS } from './string'

import { _prepareEvaluateTestCases } from '../../spec/specUtil'

const EXPS = {
  ...VALUE_EXPRESSIONS,
  ...COMPARISON_EXPRESSIONS,
  ...FUNCTIONAL_EXPRESSIONS,
  ...ARRAY_EXPRESSIONS,
  ...MATH_EXPRESSIONS,
  ...STRING_EXPRESSIONS,
}

const syncInterpreters = syncInterpreterList(EXPS)
const asyncInterpreters = asyncInterpreterList(EXPS)

const _evTestCases = _prepareEvaluateTestCases({
  syncInterpreters,
  asyncInterpreters,
})

describe('$pipe', () => {
  const SUM_2 = ['$arrayMap', ['$mathSum', 2]]
  const MULT_2 = ['$arrayMap', ['$mathMult', 2]]
  const GREATER_THAN_50 = ['$arrayFilter', ['$gt', 50]]

  const context = {
    interpreters: syncInterpreters,
    scope: { $$VALUE: [10, 20, 30, 40] },
  }

  const VALUE = [10, 20, 30, 40]

  _evTestCases([
    [VALUE, ['$pipe', [SUM_2, MULT_2]], [24, 44, 64, 84]],
    [VALUE, ['$pipe', [SUM_2, MULT_2, GREATER_THAN_50]], [64, 84]],
    [VALUE, ['$pipe', [SUM_2, GREATER_THAN_50]], []]
  ])
})
