import {
  evaluate,
  typedEvaluate
} from '../expression'

import {
  EvaluationContext,
  NumberExpression,
  Expression,
} from '../types'

import { $$VALUE } from './value'

/**
 * @function $numberInt
 * @param {number} radix
 * @param {*} value
 * @returns {number}
 */
export const $numberInt = (
  context:EvaluationContext,
  radixExp:NumberExpression = 10,
  valueExp:Expression = $$VALUE
) => {
  const value = evaluate(context, valueExp)

  if (typeof value === 'number') {
    return value
  } else if (typeof value === 'string') {
    return parseInt(value, typedEvaluate('number', context, radixExp))
  } else {
    throw new TypeError(`Invalid valueExp ${JSON.stringify(valueExp)}`)
  }
}

/**
 * @function $numberFloat
 * @param {*} value
 * @returns {number}
 */
export const $numberFloat = (
  context:EvaluationContext,
  valueExp:Expression = $$VALUE
) => {
  const value = evaluate(context, valueExp)

  if (typeof value === 'number') {
    return value
  } else if (typeof value === 'string') {
    return parseFloat(value)
  } else {
    throw new TypeError(`Invalid valueExp ${JSON.stringify(valueExp)}`)
  }
}

export const NUMBER_EXPRESSIONS = {
  $numberInt,
  $numberFloat
}
