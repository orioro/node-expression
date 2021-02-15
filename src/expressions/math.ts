import { interpreter } from '../expression'

/**
 * @function $mathSum
 * @param {Number} sum
 * @param {Number} [base=$$VALUE]
 * @returns {Number} result
 */
export const $mathSum = interpreter(
  (sum: number, base: number): number => base + sum,
  ['number', 'number']
)

/**
 * @function $mathSub
 * @param {Number} subtract
 * @param {Number} [base=$$VALUE]
 * @returns {Number} result
 */
export const $mathSub = interpreter(
  (sub: number, base: number): number => base - sub,
  ['number', 'number']
)

/**
 * @function $mathMult
 * @param {Number} multiplier
 * @param {Number} [base=$$VALUE]
 * @returns {Number} result
 */
export const $mathMult = interpreter(
  (mult: number, base: number): number => base * mult,
  ['number', 'number']
)

/**
 * @function $mathDiv
 * @param {Number} divisor
 * @param {Number} dividend
 * @returns {Number} result
 */
export const $mathDiv = interpreter(
  (divisor: number, dividend: number): number => dividend / divisor,
  ['number', 'number']
)

/**
 * @function $mathMod
 * @param {Number} divisor
 * @param {Number} dividend
 * @returns {Number} result
 */
export const $mathMod = interpreter(
  (divisor: number, dividend: number): number => dividend % divisor,
  ['number', 'number']
)

/**
 * @function $mathPow
 * @param {Number} exponent
 * @param {Number} [base=$$VALUE]
 * @returns {Number} result
 */
export const $mathPow = interpreter(
  (exponent: number, base: number): number => Math.pow(base, exponent),
  ['number', 'number']
)

/**
 * @function $mathAbs
 * @param {Number} [value=$$VALUE]
 * @returns {Number} result
 */
export const $mathAbs = interpreter(
  (value: number): number => Math.abs(value),
  ['number']
)

/**
 * @function $mathMax
 * @param {Number | Number[]} otherValue
 * @param {Number} [value=$$VALUE]
 * @returns {Number} result
 */
export const $mathMax = interpreter(
  (otherValue: number | number[], value: number): number =>
    Array.isArray(otherValue)
      ? Math.max(value, ...otherValue)
      : Math.max(value, otherValue),
  [['number', 'array'], 'number']
)

/**
 * @function $mathMin
 * @param {Number | Number[]} otherValue
 * @param {Number} [value=$$VALUE]
 * @returns {Number} result
 */
export const $mathMin = interpreter(
  (otherValue: number | number[], value: number): number =>
    Array.isArray(otherValue)
      ? Math.min(value, ...otherValue)
      : Math.min(value, otherValue),
  [['number', 'array'], 'number']
)

/**
 * @function $mathRound
 * @param {Number} [value=$$VALUE]
 * @returns {Number} result
 */
export const $mathRound = interpreter(
  (value: number): number => Math.round(value),
  ['number']
)

/**
 * @function $mathFloor
 * @param {Number} [value=$$VALUE]
 * @returns {Number} result
 */
export const $mathFloor = interpreter(
  (value: number): number => Math.floor(value),
  ['number']
)
/**
 * @function $mathCeil
 * @param {Number} [value=$$VALUE]
 * @returns {Number} result
 */
export const $mathCeil = interpreter(
  (value: number): number => Math.ceil(value),
  ['number']
)

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
  $mathCeil,
}
