import { evaluateTyped, interpreter } from '../expression'

import {
  Expression,
  ExpressionInterpreter,
  EvaluationContext,
  NumberExpression
} from '../types'

import { $$VALUE } from './value'

/**
 * @function $mathSum
 * @param {number} sum
 * @param {number} [base=$$VALUE]
 * @returns {number} result
 */
export const $mathSum = interpreter((
  sum:number,
  base:number
):number => base + sum, [
  'number',
  'number'
])

/**
 * @function $mathSub
 * @param {number} subtract
 * @param {number} [base=$$VALUE]
 * @returns {number} result
 */
export const $mathSub = interpreter((
  sub:number,
  base:number
):number => base - sub, [
  'number',
  'number'
])

/**
 * @function $mathMult
 * @param {number} multiplier
 * @param {number} [base=$$VALUE]
 * @returns {number} result
 */
export const $mathMult = interpreter((
  mult:number,
  base:number
):number => base * mult, [
  'number',
  'number'
])

/**
 * @function $mathDiv
 * @param {number} divisor
 * @param {number} dividend
 * @returns {number} result
 */
export const $mathDiv = interpreter((
  divisor:number,
  dividend:number
):number => dividend / divisor, [
  'number',
  'number'
])

/**
 * @function $mathMod
 * @param {number} divisor
 * @param {number} dividend
 * @returns {number} result
 */
export const $mathMod = interpreter((
  divisor:number,
  dividend:number
):number => dividend % divisor, [
  'number',
  'number'
])

/**
 * @function $mathPow
 * @param {number} exponent
 * @param {number} [base=$$VALUE]
 * @returns {number} result
 */
export const $mathPow = interpreter((
  exponent:number,
  base:number
):number => Math.pow(base, exponent), [
  'number',
  'number'
])

/**
 * @function $mathAbs
 * @param {number} [value=$$VALUE]
 * @returns {number} result
 */
export const $mathAbs = interpreter((
  value:number
):number => Math.abs(value), [
  'number'
])

/**
 * @todo math Modify interface: take in array of numberExpressions to allow for multi comparison
 * 
 * @function $mathMax
 * @param {number} otherValue
 * @param {number} [value=$$VALUE]
 * @returns {number} result
 */
export const $mathMax = interpreter((
  otherValue:number,
  value:number
):number => Math.max(otherValue, value), [
  'number',
  'number'
])

/**
 * @function $mathMin
 * @param {number} otherValue
 * @param {number} [value=$$VALUE]
 * @returns {number} result
 */
export const $mathMin = interpreter((
  otherValue:number,
  value:number
):number => Math.min(otherValue, value), [
  'number',
  'number'
])

/**
 * @function $mathRound
 * @param {number} [value=$$VALUE]
 * @returns {number} result
 */
export const $mathRound = interpreter((
  value:number
):number => Math.round(value), [
  'number'
])

/**
 * @function $mathFloor
 * @param {number} [value=$$VALUE]
 * @returns {number} result
 */
export const $mathFloor = interpreter((
  value:number
):number => Math.floor(value), [
  'number'
])
/**
 * @function $mathCeil
 * @param {number} [value=$$VALUE]
 * @returns {number} result
 */
export const $mathCeil = interpreter((
  value:number
):number => Math.ceil(value), [
  'number'
])

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
