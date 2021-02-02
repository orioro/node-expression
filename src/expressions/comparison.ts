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
 * @function $eq
 * @param {*} referenceExp Value to be compared to.
 * @param {*} valueExp Value being compared.
 * @return {boolean}
 */
export const $eq = (
  context:EvaluationContext,
  referenceExp:Expression,
  valueExp:Expression = $$VALUE
) => isEqual(
  evaluate(context, referenceExp),
  evaluate(context, valueExp)
)

/**
 * @function $notEq
 * @param {*} referenceExp Value to be compared to.
 * @param {*} valueExp Value being compared.
 * @return {boolean}
 */
export const $notEq = _negation($eq)

/**
 * Checks whether the value is in the given array.
 * 
 * @function $in
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
 * @function $notIn
 * @param {Array} arrayExp
 * @param {*} valueExp
 * @return {boolean}
 */
export const $notIn = _negation($in)

/**
 * Greater than `value > threshold`
 * 
 * @function $gt
 * @param {number} referenceExp
 * @param {number} valueExp
 * @return {boolean}
 */
export const $gt = (
  context:EvaluationContext,
  referenceExp:NumberExpression,
  valueExp:NumberExpression = $$VALUE
) => evaluateNumber(context, valueExp) > evaluateNumber(context, referenceExp)

/**
 * Greater than or equal `value >= threshold`
 * 
 * @function $gte
 * @param {number} referenceExp
 * @param {number} valueExp
 * @return {boolean}
 */
export const $gte = (
  context:EvaluationContext,
  referenceExp:NumberExpression,
  valueExp:NumberExpression = $$VALUE
) => evaluateNumber(context, valueExp) >= evaluateNumber(context, referenceExp)

/**
 * Lesser than `value < threshold`
 * 
 * @function $lt
 * @param {number} referenceExp
 * @param {number} valueExp
 * @return {boolean}
 */
export const $lt = (
  context:EvaluationContext,
  referenceExp:NumberExpression,
  valueExp:NumberExpression = $$VALUE
) => evaluateNumber(context, valueExp) < evaluateNumber(context, referenceExp)

/**
 * Lesser than or equal `value <= threshold`
 * 
 * @function $lte
 * @param {number} referenceExp
 * @param {number} valueExp
 * @return {boolean}
 */
export const $lte = (
  context:EvaluationContext,
  referenceExp:NumberExpression,
  valueExp:NumberExpression = $$VALUE
) => evaluateNumber(context, valueExp) <= evaluateNumber(context, referenceExp)

/**
 * Checks if the value matches the set of criteria.
 * 
 * @function $matches
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
