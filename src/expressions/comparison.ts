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
  NumberExpression,
  ArrayExpression,
  PlainObjectExpression
} from '../types'

import {
  $$VALUE
} from './value'

const _negation = fn => (...args):boolean => !fn(...args)

/**
 * Checks if the two values
 * 
 * @name $eq
 * @param {*} targetValueExp Value to be compared to.
 * @param {*} valueExp Value being compared.
 * @return {boolean}
 */
export const $eq = (
  context:EvaluationContext,
  targetValueExp:Expression,
  valueExp:Expression = $$VALUE
) => isEqual(
  evaluate(context, targetValueExp),
  evaluate(context, valueExp)
)

/**
 * @name $notEq
 * @param {*} targetValueExp Value to be compared to.
 * @param {*} valueExp Value being compared.
 * @return {boolean}
 */
export const $notEq = _negation($eq)

/**
 * Checks whether the value is in the given array.
 * 
 * @name $in
 * @param {Array} arrayExp
 * @param {*} valueExp
 * @return {boolean}
 */
export const $in = (
  context:EvaluationContext,
  arrayExp:ArrayExpression,
  valueExp:Expression = $$VALUE
) => {
  const value = evaluate(context, valueExp)
  return evaluateArray(context, arrayExp).some(item => isEqual(item, value))
}

/**
 * Checks whether the value is **not** in the given array.
 * 
 * @name $notIn
 * @param {Array} arrayExp
 * @param {*} valueExp
 * @return {boolean}
 */
export const $notIn = _negation($in)

/**
 * Greater than `value > threshold`
 * 
 * @name $gt
 * @param {number} thresholdExp
 * @param {number} valueExp
 * @return {boolean}
 */
export const $gt = (
  context:EvaluationContext,
  thresholdExp:NumberExpression,
  valueExp:NumberExpression = $$VALUE
) => evaluateNumber(context, valueExp) > evaluateNumber(context, thresholdExp)

/**
 * Greater than or equal `value >= threshold`
 * 
 * @name $gte
 * @param {number} thresholdExp
 * @param {number} valueExp
 * @return {boolean}
 */
export const $gte = (
  context:EvaluationContext,
  thresholdExp:NumberExpression,
  valueExp:NumberExpression = $$VALUE
) => evaluateNumber(context, valueExp) >= evaluateNumber(context, thresholdExp)

/**
 * Lesser than `value < threshold`
 * 
 * @name $lt
 * @param {number} thresholdExp
 * @param {number} valueExp
 * @return {boolean}
 */
export const $lt = (
  context:EvaluationContext,
  thresholdExp:NumberExpression,
  valueExp:NumberExpression = $$VALUE
) => evaluateNumber(context, valueExp) < evaluateNumber(context, thresholdExp)

/**
 * Lesser than or equal `value <= threshold`
 * 
 * @name $lte
 * @param {number} thresholdExp
 * @param {number} valueExp
 * @return {boolean}
 */
export const $lte = (
  context:EvaluationContext,
  thresholdExp:NumberExpression,
  valueExp:NumberExpression = $$VALUE
) => evaluateNumber(context, valueExp) <= evaluateNumber(context, thresholdExp)

/**
 * Checks if the value matches the set of criteria.
 * 
 * @name $matches
 * @param {Object} criteriaExp
 * @param {number} valueExp
 * @return {boolean}
 */
export const $matches = (
  context:EvaluationContext,
  criteriaExp:PlainObjectExpression,
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
          ...context.scope,
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
