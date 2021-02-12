import { validateType } from '@orioro/validate-type'

import {
  Expression,
  ExpressionInterpreterList,
  EvaluationContext
} from './types'

/**
 * @function isExpression
 * @param {ExpressionInterpreterList}
 */
export const isExpression = (
  interpreters:ExpressionInterpreterList,
  candidateExpression:any
):boolean => (
  Array.isArray(candidateExpression) &&
  typeof interpreters[candidateExpression[0]] === 'function'
)

/**
 * @function evaluate
 * @param {EvaluationContext} context
 * @param {Expression | *} expOrValue
 * @returns {*}
 */
export const evaluate = (
  context:EvaluationContext,
  expOrValue:Expression | any
):any => {
  if (!isExpression(context.interpreters, expOrValue)) {
    return expOrValue
  }

  const [interpreterId, ...interpreterArgs] = expOrValue
  const interpreter = context.interpreters[interpreterId]

  return interpreter(context, ...interpreterArgs)
}

/**
 * @function evaluateTyped
 * @param {string | string[]} expectedTypes
 * @param {EvaluationContext} context
 * @param {Expression | any} expOrValue
 * @returns {*}
 */
export const evaluateTyped = (
  expectedTypes:(string | string[]),
  context:EvaluationContext,
  expOrValue:Expression | any
):any => {
  const value = evaluate(context, expOrValue)
  validateType(expectedTypes, value)
  return value
}

/**
 * @function interpreter
 * @param {Function} fn The function that resolves the expression's value.
 *                      This function receives the resolved parameters.
 * @param {Function[]} argResolvers List of functions that should be called
 *                                  for resolving each of the expression's
 *                                  arguments
 * @returns {ExpressionInterpreter}
 */
export const interpreter = (
  fn:(...args:any[]) => any,
  argResolvers:((context:EvaluationContext, input:any) => any)[] | null = null
) => (
  argResolvers !== null && Array.isArray(argResolvers)
    ? (context:EvaluationContext, ...args) => (
        fn(...argResolvers.map((resolver, index) => {
          // Last arg defaults to $$VALUE
          const arg = (args[index] === undefined && index === argResolvers.length - 1)
            ? ['$value', '$$VALUE']
            : args[index]
          return resolver(context, arg)
        }))
      )
    : (context:EvaluationContext, ...args) => fn(...args)
)
