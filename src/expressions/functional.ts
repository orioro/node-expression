import {
  EvaluationContext,
  Expression,
  InterpreterSpec,
} from '../types'

import { evaluate } from '../evaluate'

/**
 * @function $pipe
 * @param {Expression[]} expressions
 * @returns {*} pipeResult
 */
export const $pipe: InterpreterSpec = [
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
