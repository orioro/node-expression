import { evaluateTyped } from '../expression'

import {
  Expression,
  EvaluationContext,
  NumberExpression
} from '../types'

import { $$VALUE } from './value'

const mathOperation = (op:(base:number, operator:number) => number) => (
  context:EvaluationContext,
  operatorExp:NumberExpression,
  baseExp:NumberExpression = $$VALUE
):number => op(
  evaluateTyped('number', context, baseExp),
  evaluateTyped('number', context, operatorExp)
)

/**
 * @function $mathSum
 * @param {number} sum
 * @param {number} [base=$$VALUE]
 * @returns {number} result
 */
export const $mathSum = mathOperation((base, sum) => base + sum)

/**
 * @function $mathSub
 * @param {number} subtract
 * @param {number} [base=$$VALUE]
 * @returns {number} result
 */
export const $mathSub = mathOperation((base, sub) => base - sub)

/**
 * @function $mathMult
 * @param {number} multiplier
 * @param {number} [base=$$VALUE]
 * @returns {number} result
 */
export const $mathMult = mathOperation((base, mult) => base * mult)

/**
 * @function $mathDiv
 * @param {number} divisor
 * @param {number} dividend
 * @returns {number} result
 */
export const $mathDiv = mathOperation((dividend, divisor) => dividend / divisor)

/**
 * @function $mathMod
 * @param {number} divisor
 * @param {number} dividend
 * @returns {number} result
 */
export const $mathMod = mathOperation((dividend, divisor) => dividend % divisor)

/**
 * @function $mathPow
 * @param {number} exponent
 * @param {number} [base=$$VALUE]
 * @returns {number} result
 */
export const $mathPow = mathOperation((base, exponent) => Math.pow(base, exponent))

/**
 * @function $mathAbs
 * @param {number} [value=$$VALUE]
 * @returns {number} result
 */
export const $mathAbs = (
  context:EvaluationContext,
  valueExp:NumberExpression = $$VALUE
) => Math.abs(evaluateTyped('number', context, valueExp))

/**
 * @function $mathMax
 * @param {number} otherValue
 * @param {number} [value=$$VALUE]
 * @returns {number} result
 */
export const $mathMax = (
  context:EvaluationContext,
  otherValueExp:NumberExpression,
  valueExp:NumberExpression = $$VALUE
) => Math.max(
  evaluateTyped('number', context, otherValueExp),
  evaluateTyped('number', context, valueExp)
)

/**
 * @function $mathMin
 * @param {number} otherValue
 * @param {number} [value=$$VALUE]
 * @returns {number} result
 */
export const $mathMin = (
  context:EvaluationContext,
  otherValueExp:NumberExpression,
  valueExp:NumberExpression = $$VALUE
) => Math.min(
  evaluateTyped('number', context, otherValueExp),
  evaluateTyped('number', context, valueExp)
)

/**
 * @function $mathRound
 * @param {number} [value=$$VALUE]
 * @returns {number} result
 */
export const $mathRound = (
  context:EvaluationContext,
  valueExp:NumberExpression = $$VALUE
) => Math.round(evaluateTyped('number', context, valueExp))

/**
 * @function $mathFloor
 * @param {number} [value=$$VALUE]
 * @returns {number} result
 */
export const $mathFloor = (
  context:EvaluationContext,
  valueExp:NumberExpression = $$VALUE
) => Math.floor(evaluateTyped('number', context, valueExp))

/**
 * @function $mathCeil
 * @param {number} [value=$$VALUE]
 * @returns {number} result
 */
export const $mathCeil = (
  context:EvaluationContext,
  valueExp:NumberExpression = $$VALUE
) => Math.ceil(evaluateTyped('number', context, valueExp))

export const MATH_EXPRESSIONS = {
  $mathSum,
  $mathSub,
  $mathMult,
  $mathDiv,
  $mathMod,
  $mathPow,
  $mathAbs,
  $mathMax,
  $mathMin,
  $mathRound,
  $mathFloor,
  $mathCeil
}
