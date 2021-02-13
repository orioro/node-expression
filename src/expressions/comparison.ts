import { isEqual } from 'lodash'

import { evaluate, evaluateTyped, interpreter } from '../expression'

import { EvaluationContext } from '../types'

import { $$VALUE } from './value'

const _negation = (fn) => (...args): boolean => !fn(...args)

/**
 * Checks if the two values
 *
 * @function $eq
 * @param {*} referenceExp Value to be compared to.
 * @param {*} valueExp Value being compared.
 * @returns {boolean}
 */
export const $eq = interpreter(
  (valueB: any, valueA: any): boolean => isEqual(valueA, valueB),
  ['any', 'any']
)

/**
 * @function $notEq
 * @param {*} referenceExp Value to be compared to.
 * @param {*} valueExp Value being compared.
 * @returns {boolean}
 */
export const $notEq = _negation($eq)

/**
 * Checks whether the value is in the given array.
 *
 * @function $in
 * @param {Array} arrayExp
 * @param {*} valueExp
 * @returns {boolean}
 */
export const $in = interpreter(
  (array: any[], value: any): boolean =>
    array.some((item) => isEqual(item, value)),
  ['array', 'any']
)

/**
 * Checks whether the value is **not** in the given array.
 *
 * @function $notIn
 * @param {Array} arrayExp
 * @param {*} valueExp
 * @returns {boolean}
 */
export const $notIn = _negation($in)

/**
 * Greater than `value > threshold`
 *
 * @function $gt
 * @param {number} referenceExp
 * @param {number} valueExp
 * @returns {boolean}
 */
export const $gt = interpreter(
  (reference: number, value: number): boolean => value > reference,
  ['number', 'number']
)

/**
 * Greater than or equal `value >= threshold`
 *
 * @function $gte
 * @param {number} referenceExp
 * @param {number} valueExp
 * @returns {boolean}
 */
export const $gte = interpreter(
  (reference: number, value: number): boolean => value >= reference,
  ['number', 'number']
)

/**
 * Lesser than `value < threshold`
 *
 * @function $lt
 * @param {number} referenceExp
 * @param {number} valueExp
 * @returns {boolean}
 */
export const $lt = interpreter(
  (reference: number, value: number): boolean => value < reference,
  ['number', 'number']
)

/**
 * Lesser than or equal `value <= threshold`
 *
 * @function $lte
 * @param {number} referenceExp
 * @param {number} valueExp
 * @returns {boolean}
 */
export const $lte = interpreter(
  (reference: number, value: number): boolean => value <= reference,
  ['number', 'number']
)

/**
 * Checks if the value matches the set of criteria.
 *
 * @function $matches
 * @param {Object} criteriaExp
 * @param {number} valueExp
 * @returns {boolean}
 */
export const $matches = interpreter(
  (
    criteria: { [key: string]: any },
    value: any,
    context: EvaluationContext
  ): boolean => {
    const criteriaKeys = Object.keys(criteria)

    if (criteriaKeys.length === 0) {
      throw new Error(`Invalid criteria: ${JSON.stringify(criteria)}`)
    }

    return criteriaKeys.every((criteriaKey) => {
      //
      // Criteria value may be an expression.
      // Evaluate the expression against the original context, not
      // against the value
      //
      const criteriaValue = evaluate(context, criteria[criteriaKey])

      return evaluateTyped(
        'boolean',
        {
          ...context,
          scope: {
            ...context.scope,
            $$VALUE: value,
          },
        },
        [criteriaKey, criteriaValue, $$VALUE]
      )
    })
  },
  ['object', 'any']
)

export const COMPARISON_EXPRESSIONS = {
  $eq,
  $notEq,
  $in,
  $notIn,
  $gt,
  $gte,
  $lt,
  $lte,
  $matches,
}
