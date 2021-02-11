import {
  validateArray,
  validateNumber,
  validateString,
  validateRegExp,
  validateStringOrRegExp,
  validateStringOrArray,
  validatePlainObject,
  validateBoolean,
  validateNotObject,
  validatePlainObjectOrArray,
  validateDate
} from './util/validate'

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

const _prepEvAndValidate = (validate) => {
  const evaluateAndValidate = (options, exp) => {
    const value = evaluate(options, exp)
    validate(value)

    return value
  }

  evaluateAndValidate.allowUndefined = (options, exp) => {
    const value = evaluate(options, exp)
    validate.allowUndefined(value)

    return value
  }

  return evaluateAndValidate
}

export const validateExpresion = (options, value) => {
  if (!isExpression(options, value)) {
    throw new Error(`${value} is not an expression`)
  }
}

export const evaluateArray = _prepEvAndValidate(validateArray)
export const evaluateNumber = _prepEvAndValidate(validateNumber)
export const evaluatePlainObject = _prepEvAndValidate(validatePlainObject)
export const evaluateString = _prepEvAndValidate(validateString)
export const evaluateBoolean = _prepEvAndValidate(validateBoolean)
export const evaluateNotObject = _prepEvAndValidate(validateNotObject)
export const evaluatePlainObjectOrArray = _prepEvAndValidate(validatePlainObjectOrArray)
export const evaluateStringOrRegExp = _prepEvAndValidate(validateStringOrRegExp)
export const evaluateStringOrArray = _prepEvAndValidate(validateStringOrArray)
export const evaluateDate = _prepEvAndValidate(validateDate)

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
