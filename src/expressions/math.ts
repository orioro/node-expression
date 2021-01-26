import {
  evaluateNumber,
} from '../expression'

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
  evaluateNumber(context, baseExp),
  evaluateNumber(context, operatorExp)
)

/**
 * @name $mathSum
 * @param {number} sum
 * @param {number} [base=$$VALUE]
 * @return {number} result
 */
export const $mathSum = mathOperation((base, sum) => base + sum)

/**
 * @name $mathSub
 * @param {number} subtract
 * @param {number} [base=$$VALUE]
 * @return {number} result
 */
export const $mathSub = mathOperation((base, sub) => base - sub)

/**
 * @name $mathMult
 * @param {number} multiplier
 * @param {number} [base=$$VALUE]
 * @return {number} result
 */
export const $mathMult = mathOperation((base, mult) => base * mult)

/**
 * @name $mathDiv
 * @param {number} divisor
 * @param {number} dividend
 * @return {number} result
 */
export const $mathDiv = mathOperation((dividend, divisor) => dividend / divisor)

/**
 * @name $mathMod
 * @param {number} divisor
 * @param {number} dividend
 * @return {number} result
 */
export const $mathMod = mathOperation((dividend, divisor) => dividend % divisor)

/**
 * @name $mathPow
 * @param {number} exponent
 * @param {number} [base=$$VALUE]
 * @return {number} result
 */
export const $mathPow = mathOperation((base, exponent) => Math.pow(base, exponent))

/**
 * @name $mathAbs
 * @param {number} [value=$$VALUE]
 * @return {number} result
 */
export const $mathAbs = (
  context:EvaluationContext,
  valueExp:NumberExpression = $$VALUE
) => Math.abs(evaluateNumber(context, valueExp))

/**
 * @name $mathMax
 * @param {number} otherValue
 * @param {number} [value=$$VALUE]
 * @return {number} result
 */
export const $mathMax = (
  context:EvaluationContext,
  otherValueExp:NumberExpression,
  valueExp:NumberExpression = $$VALUE
) => Math.max(
  evaluateNumber(context, otherValueExp),
  evaluateNumber(context, valueExp)
)

/**
 * @name $mathMin
 * @param {number} otherValue
 * @param {number} [value=$$VALUE]
 * @return {number} result
 */
export const $mathMin = (
  context:EvaluationContext,
  otherValueExp:NumberExpression,
  valueExp:NumberExpression = $$VALUE
) => Math.min(
  evaluateNumber(context, otherValueExp),
  evaluateNumber(context, valueExp)
)

/**
 * @name $mathRound
 * @param {number} [value=$$VALUE]
 * @return {number} result
 */
export const $mathRound = (
  context:EvaluationContext,
  valueExp:NumberExpression = $$VALUE
) => Math.round(evaluateNumber(context, valueExp))

/**
 * @name $mathFloor
 * @param {number} [value=$$VALUE]
 * @return {number} result
 */
export const $mathFloor = (
  context:EvaluationContext,
  valueExp:NumberExpression = $$VALUE
) => Math.floor(evaluateNumber(context, valueExp))

/**
 * @name $mathCeil
 * @param {number} [value=$$VALUE]
 * @return {number} result
 */
export const $mathCeil = (
  context:EvaluationContext,
  valueExp:NumberExpression = $$VALUE
) => Math.ceil(evaluateNumber(context, valueExp))

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
