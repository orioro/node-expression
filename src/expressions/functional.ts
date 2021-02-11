import {
  EvaluationContext,
  ArrayExpression
} from '../types'

import {
  evaluate,
  evaluateTyped
} from '../expression'

/**
 * @function $pipe
 * @param {ArrayExpression} expressionsExp
 * @returns {*} pipeResult
 */
export const $pipe = (
  context:EvaluationContext,
  expressionsExp:ArrayExpression
) => {
  const expressions = evaluateTyped('array', context, expressionsExp)

  return expressions.reduce((acc, expression) => {
    return evaluate({
      ...context,
      scope: { $$VALUE: acc }
    }, expression)
  }, context.scope.$$VALUE)
}

export const FUNCTIONAL_EXPRESSIONS = {
  $pipe
}
