import { validateType } from '@orioro/validate-type'

import {
  Expression,
  EvaluationContext
} from './types'

export const isExpression = (interpreters, candidateExpression) => (
  Array.isArray(candidateExpression) &&
  typeof interpreters[candidateExpression[0]] === 'function'
)
export const evaluate = (
  context:EvaluationContext,
  expOrValue:Expression | any
) => {
  if (!isExpression(context.interpreters, expOrValue)) {
    return expOrValue
  }

  const [interpreterId, ...interpreterArgs] = expOrValue
  const interpreter = context.interpreters[interpreterId]

  return interpreter(context, ...interpreterArgs)
}

export const typedEvaluate = (
  expectedTypes:(string | string[]),
  context:EvaluationContext,
  expOrValue:Expression | any
):any => {
  const value = evaluate(context, expOrValue)
  validateType(expectedTypes, value)
  return value
}

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
