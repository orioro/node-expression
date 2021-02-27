import { interpreter } from '../expression'
import { get } from 'lodash'
import { PlainObject } from '../types'

import { getType } from '@orioro/typing'

const stringifyValue = (value) => {
  switch (getType(value)) {
    // Statically locate stringify functions
    case 'string':
      return value
    case 'boolean':
      return Boolean.prototype.toString.call(value)
    case 'number':
      return Number.prototype.toString.call(value)
    case 'bigint':
      return BigInt.prototype.toString.call(value)
    case 'date':
      return Date.prototype.toString.call(value)
    case 'array':
      return Array.prototype.join.call(
        Array.prototype.map.call(value, stringifyValue),
        ', '
      )
    case 'nan':
      return 'NaN'
    case 'null':
      return 'null'
    case 'undefined':
      return 'undefined'
    case 'regexp':
    case 'function':
    case 'object':
    case 'symbol':
    case 'map':
    case 'set':
    case 'weakmap':
    case 'weakset':
    default:
      return Object.prototype.toString.call(value)
  }
}

/**
 * @function $string
 * @param {*} [value=$$VALUE]
 * @returns {String}
 */
export const $string = interpreter(
  (value: any): string => stringifyValue(value),
  ['any']
)

/**
 * @function $stringStartsWith
 * @param {String} query
 * @param {String} [str=$$VALUE]
 * @returns {Boolean}
 */
export const $stringStartsWith = interpreter(
  (query: string, str: string): boolean => str.startsWith(query),
  ['string', 'string']
)

/**
 * @function $stringLength
 * @param {String} [str=$$VALUE]
 * @returns {Number}
 */
export const $stringLength = interpreter((str: string): number => str.length, [
  'string',
])

/**
 * @function $stringSubstr
 * @param {Number} start
 * @param {Number} end
 * @param {String} [str=$$VALUE]
 */
export const $stringSubstr = interpreter(
  (start: number, end: number | undefined, str: string): string =>
    str.substring(start, end),
  ['number', ['number', 'undefined'], 'string']
)

/**
 * @function $stringConcat
 * @param {String | String[]} concat
 * @param {String} [base=$$VALUE]
 * @returns {String}
 */
export const $stringConcat = interpreter(
  (concat: string | string[], base: string): string =>
    Array.isArray(concat) ? base.concat(concat.join('')) : base.concat(concat),
  [['string', 'array'], 'string']
)

/**
 * @function $stringTrim
 * @param {String} [str=$$VALUE]
 * @returns {String}
 */
export const $stringTrim = interpreter((str: string): string => str.trim(), [
  'string',
])

/**
 * @function $stringPadStart
 * @param {Number} targetLengthExp
 * @param {String} padStringExp
 * @param {String} [str=$$VALUE]
 * @returns {String}
 */
export const $stringPadStart = interpreter(
  (targetLength: number, padString: string, str: string): string =>
    str.padStart(targetLength, padString),
  ['number', 'string', 'string']
)

/**
 * @function $stringPadEnd
 * @param {Number} targetLengthExp
 * @param {String} padStringExp
 * @param {String} [str=$$VALUE]
 * @returns {String}
 */
export const $stringPadEnd = interpreter(
  (targetLength: number, padString: string, str: string): string =>
    str.padEnd(targetLength, padString),
  ['number', 'string', 'string']
)

/**
 * @function $stringToUpperCase
 * @param {String} value
 * @returns {String}
 */
export const $stringToUpperCase = interpreter(
  (str: string): string => str.toUpperCase(),
  ['string']
)

/**
 * @function $stringToLowerCase
 * @param {String} value
 * @returns {String}
 */
export const $stringToLowerCase = interpreter(
  (str: string): string => str.toLowerCase(),
  ['string']
)

/**
 * /\$\{\s*([\w$.]+)\s*\}/g
 * ![](docs/resources/interpolation_regexp.png)
 *
 * RegExp used for matching interpolation expressions.
 * Allows a non-interrupted sequence of alphanumeric chars ([A-Za-z0-9_]),
 * dollar signs ($) and dots (.) wrapped in curly braces ({})
 * with or without any number of whitespace chars (' ') between braces and the
 * value identifier.
 *
 * Some resources on RegExp safety concerning RegExp Denial of Service (ReDOS)
 * through Catastrophic backtracking, for future study and reference:
 *
 * - [Catastrophic backtracking](https://www.regular-expressions.info/catastrophic.html)
 * - [Regular expression visualizer](https://github.com/CJex/regulex)
 * - [Validator.js](https://github.com/validatorjs/validator.js)
 * - [Stack Overflow interesting question](https://stackoverflow.com/questions/63127145/safe-regex-patterns-from-redos-attack)
 * - [Catastrophic backtracking - JavaScript Info](https://javascript.info/regexp-catastrophic-backtracking#preventing-backtracking)
 * - [Google re2 library](https://github.com/google/re2)
 * - [Google re2 for Node.js - re2](https://github.com/uhop/node-re2/)
 *
 * @const {RegExp} INTERPOLATION_REGEXP
 */
const INTERPOLATION_REGEXP = /\$\{\s*([\w$.]+)\s*\}/g
const INTERPOLATABLE_TYPES = ['string', 'number']

/**
 * @function $stringInterpolate
 * @param {Object | Array} data Data context to be used for interpolation
 * @param {String} template Basic JS template string like `${value.path}` value
 *                          interpolation. It is possible to access nested properties
 *                          through dot `.` notation. Keywords between braces are
 *                          only interpreted as paths to the value. No logic
 *                          supported: loops, conditionals, etc.
 */
export const $stringInterpolate = interpreter(
  (data: PlainObject | any[], template: string): string =>
    template.replace(INTERPOLATION_REGEXP, (match, path) => {
      const value = get(data, path)

      return INTERPOLATABLE_TYPES.includes(typeof value) ? value : ''
    }),
  [['object', 'array'], 'string']
)

export const STRING_EXPRESSIONS = {
  $string,
  $stringStartsWith,
  $stringLength,
  $stringSubstr,
  $stringConcat,
  $stringTrim,
  $stringPadStart,
  $stringPadEnd,
  $stringToUpperCase,
  $stringToLowerCase,
  $stringInterpolate,
}
