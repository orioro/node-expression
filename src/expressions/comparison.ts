/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { isEqual } from 'lodash'

import { evaluate, evaluateTyped } from '../evaluate'

import {
  EvaluationContext,
  PlainObject,
  ExpressionInterpreterSpec,
} from '../types'

import { $$VALUE } from './value'

/**
 * Checks if the two values
 *
 * @function $eq
 * @param {*} referenceExp Value to be compared to.
 * @param {*} valueExp Value being compared.
 * @returns {Boolean}
 */
export const $eq: ExpressionInterpreterSpec = [
  (valueB: any, valueA: any): boolean => isEqual(valueA, valueB),
  ['any', 'any'],
]

/**
 * @function $notEq
 * @param {*} referenceExp Value to be compared to.
 * @param {*} valueExp Value being compared.
 * @returns {Boolean}
 */
export const $notEq: ExpressionInterpreterSpec = [
  (valueB: any, valueA: any): boolean => !isEqual(valueA, valueB),
  ['any', 'any'],
]

/**
 * Checks whether the value is in the given array.
 *
 * @function $in
 * @param {Array} arrayExp
 * @param {*} valueExp
 * @returns {Boolean}
 */
export const $in: ExpressionInterpreterSpec = [
  (array: any[], value: any): boolean =>
    array.some((item) => isEqual(item, value)),
  ['array', 'any'],
]

/**
 * Checks whether the value is **not** in the given array.
 *
 * @function $notIn
 * @param {Array} arrayExp
 * @param {*} valueExp
 * @returns {Boolean}
 */
export const $notIn: ExpressionInterpreterSpec = [
  (array: any[], value: any): boolean =>
    array.every((item) => !isEqual(item, value)),
  ['array', 'any'],
]

/**
 * Greater than `value > threshold`
 *
 * @function $gt
 * @param {Number} referenceExp
 * @param {Number} valueExp
 * @returns {Boolean}
 */
export const $gt: ExpressionInterpreterSpec = [
  (reference: number, value: number): boolean => value > reference,
  ['number', 'number'],
]

/**
 * Greater than or equal `value >= threshold`
 *
 * @function $gte
 * @param {Number} referenceExp
 * @param {Number} valueExp
 * @returns {Boolean}
 */
export const $gte: ExpressionInterpreterSpec = [
  (reference: number, value: number): boolean => value >= reference,
  ['number', 'number'],
]

/**
 * Lesser than `value < threshold`
 *
 * @function $lt
 * @param {Number} referenceExp
 * @param {Number} valueExp
 * @returns {Boolean}
 */
export const $lt: ExpressionInterpreterSpec = [
  (reference: number, value: number): boolean => value < reference,
  ['number', 'number'],
]

/**
 * Lesser than or equal `value <= threshold`
 *
 * @function $lte
 * @param {Number} referenceExp
 * @param {Number} valueExp
 * @returns {Boolean}
 */
export const $lte: ExpressionInterpreterSpec = [
  (reference: number, value: number): boolean => value <= reference,
  ['number', 'number'],
]

/**
 * Checks if the value matches the set of criteria.
 *
 * @function $matches
 * @param {Object} criteriaExp
 * @param {Number} valueExp
 * @returns {Boolean}
 */
export const $matches: ExpressionInterpreterSpec = [
  (criteria: PlainObject, value: any, context: EvaluationContext): boolean => {
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
  ['object', 'any'],
]

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
