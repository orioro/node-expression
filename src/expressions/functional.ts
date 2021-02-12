import {
  EvaluationContext,
  Expression,
  ArrayExpression
} from '../types'

import {
  evaluate,
  interpreter,
  evaluateTyped
} from '../expression'

/**
 * @function $pipe
 * @param {Expression[]} expressions
 * @returns {*} pipeResult
 */
export const $pipe = interpreter((
  expressions:Expression[],
  context:EvaluationContext
):any => (
  expressions.reduce((acc, expression) => {
    return evaluate({
      ...context,
      scope: { $$VALUE: acc }
    }, expression)
  }, context.scope.$$VALUE)
), [
  'array'
])

export const FUNCTIONAL_EXPRESSIONS = {
  $pipe
}
