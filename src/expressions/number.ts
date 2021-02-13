import { interpreter } from '../expression'

/**
 * @function $numberInt
 * @param {Number} radix
 * @param {*} value
 * @returns {Number}
 */
export const $numberInt = interpreter(
  (radix: number = 10, value: any): number => {
    if (typeof value === 'number') {
      return value
    } else if (typeof value === 'string') {
      return parseInt(value, radix)
    } else {
      throw new TypeError(`Invalid value ${JSON.stringify(value)}`)
    }
  },
  [['number', 'undefined'], 'any']
)

/**
 * @function $numberFloat
 * @param {*} value
 * @returns {Number}
 */
export const $numberFloat = interpreter(
  (value: any): number => {
    if (typeof value === 'number') {
      return value
    } else if (typeof value === 'string') {
      return parseFloat(value)
    } else {
      throw new TypeError(`Invalid value ${JSON.stringify(value)}`)
    }
  },
  ['any']
)

export const NUMBER_EXPRESSIONS = {
  $numberInt,
  $numberFloat,
}
