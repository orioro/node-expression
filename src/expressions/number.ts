import { InterpreterSpec } from '../types'

/**
 * @function $numberInt
 * @param {Number} radix
 * @param {*} value
 * @returns {Number}
 */
export const $numberInt: InterpreterSpec = [
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  (radix: number = 10, value: any): number => parseInt(value, radix),
  [
    ['number', 'undefined'],
    ['string', 'number'],
  ],
]

/**
 * @function $numberFloat
 * @param {*} value
 * @returns {Number}
 */
export const $numberFloat: InterpreterSpec = [
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  (value: any): number => {
    if (typeof value === 'number') {
      return value
    } else if (typeof value === 'string') {
      return parseFloat(value)
    } else {
      throw new TypeError(`Invalid value ${JSON.stringify(value)}`)
    }
  },
  ['any'],
]

export const NUMBER_EXPRESSIONS = {
  $numberInt,
  $numberFloat,
}
