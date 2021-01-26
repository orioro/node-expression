import {
  EvaluationContext,
  ArrayExpression
} from '../types'

import {
  evaluate,
  evaluateArray
} from '../expression'

/**
 * @name $pipe
 * @param {ArrayExpression} expressionsExp
 * @return {*} pipeResult
 */
export const $pipe = (
  context:EvaluationContext,
  expressionsExp:ArrayExpression
) => {
  const expressions = evaluateArray(context, expressionsExp)

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
