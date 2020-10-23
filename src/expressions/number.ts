import {
  evaluate,
  evaluateNumber
} from '../expression'

import {
  EvaluationContext,
  NumberExpression,
  Expression,
} from '../types'

import { $$VALUE } from './value'

export const numberInt = (
  context:EvaluationContext,
  radixExp:NumberExpression = 10,
  valueExp:Expression = $$VALUE
) => {
  const value = evaluate(context, valueExp)

  if (typeof value === 'number') {
    return value
  } else if (typeof value === 'string') {
    return parseInt(value, evaluateNumber(context, radixExp))
  } else {
    throw new TypeError(`Invalid valueExp ${JSON.stringify(valueExp)}`)
  }
}

export const numberFloat = (
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
