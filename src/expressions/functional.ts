import {
  EvaluationContext,
  Expression,
  ExpressionInterpreterSpec,
} from '../types'

import { evaluate } from '../evaluate'

/**
 * @function $pipe
 * @param {Expression[]} expressions
 * @returns {*} pipeResult
 */
export const $pipe: ExpressionInterpreterSpec = [
  (expressions: Expression[], context: EvaluationContext): any =>
    expressions.reduce((acc, expression) => {
      return evaluate(
        {
          ...context,
          scope: { $$VALUE: acc },
        },
        expression
      )
    }, context.scope.$$VALUE),
  ['array'],
]

export const FUNCTIONAL_EXPRESSIONS = {
  $pipe,
}
