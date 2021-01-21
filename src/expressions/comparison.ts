import {
  isEqual,
  isPlainObject
} from 'lodash'

import {
  isValidNumber,
  validateNumber,
  validateArray,
  validatePlainObject
} from '../util/validate'

import {
  evaluate,
  evaluateBoolean,
  evaluatePlainObject,
  evaluateArray,
  evaluateNumber,
  evaluateString
} from '../expression'

import {
  Expression,
  EvaluationContext,
  NumberExpression
} from '../types'

import {
  $$VALUE
} from './value'

const _negation = fn => (...args):boolean => !fn(...args)

export const $eq = (
  context:EvaluationContext,
  criteriaExp:Expression,
  valueExp:Expression = $$VALUE
) => isEqual(
  evaluate(context, criteriaExp),
  evaluate(context, valueExp)
)

export const $notEq = _negation($eq)

export const $in = (
  context:EvaluationContext,
  arrayExp:Expression,
  valueExp:Expression = $$VALUE
) => {
  const value = evaluate(context, valueExp)
  return evaluateArray(context, arrayExp).some(item => isEqual(item, value))
}
export const $notIn = _negation($in)

export const $gt = (
  context:EvaluationContext,
  thresholdExp:NumberExpression,
  valueExp:NumberExpression = $$VALUE
) => evaluateNumber(context, valueExp) > evaluateNumber(context, thresholdExp)

export const $gte = (
  context:EvaluationContext,
  thresholdExp:NumberExpression,
  valueExp:NumberExpression = $$VALUE
) => evaluateNumber(context, valueExp) >= evaluateNumber(context, thresholdExp)

export const $lt = (
  context:EvaluationContext,
  thresholdExp:NumberExpression,
  valueExp:NumberExpression = $$VALUE
) => evaluateNumber(context, valueExp) < evaluateNumber(context, thresholdExp)

export const $lte = (
  context:EvaluationContext,
  thresholdExp:NumberExpression,
  valueExp:NumberExpression = $$VALUE
) => evaluateNumber(context, valueExp) <= evaluateNumber(context, thresholdExp)

export const $matches = (
  context:EvaluationContext,
  criteriaExp:Expression,
  valueExp:Expression = $$VALUE
) => {
  const criteria = evaluatePlainObject(context, criteriaExp)
  const value = evaluate(context, valueExp)

  const criteriaKeys = Object.keys(criteria)

  if (criteriaKeys.length === 0) {
    throw new Error(`Invalid criteria: ${JSON.stringify(criteria)}`)
  }

  return criteriaKeys.every(criteriaKey => {
    //
    // Criteria value may be an expression.
    // Evaluate the expression against the original context, not
    // against the value
    //
    const criteriaValue = evaluate(context, criteria[criteriaKey])

    return evaluateBoolean(
      {
        ...context,
        scope: {
          ...context.data,
          $$VALUE: value
        }
      },
      [criteriaKey, criteriaValue, $$VALUE]
    )
  })
}

export const COMPARISON_EXPRESSIONS = {
  $eq,
  $notEq,
  $in,
  $notIn,
  $gt,
  $gte,
  $lt,
  $lte,
  $matches
}
