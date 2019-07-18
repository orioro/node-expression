import {
  curry
} from 'lodash'

import {
  evaluate,
  isExpression
} from './expression'

import {
  validateArray,
  validateNumber,
  validateString,
  validateRegExp,
  validateStringOrRegExp,
  validatePlainObject,
  validateBoolean,
  validateNotObject,
  validatePlainObjectOrArray
} from './util'

const _evaluate = (validate) => {
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

export const evaluateArray = _evaluate(validateArray)
export const evaluateNumber = _evaluate(validateNumber)
export const evaluatePlainObject = _evaluate(validatePlainObject)
export const evaluateString = _evaluate(validateString)
export const evaluateBoolean = _evaluate(validateBoolean)
export const evaluateNotObject = _evaluate(validateNotObject)
export const evaluatePlainObjectOrArray = _evaluate(validatePlainObjectOrArray)
export const evaluateStringOrRegExp = _evaluate(validateStringOrRegExp)
