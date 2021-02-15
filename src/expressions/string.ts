import { evaluateTyped, interpreter } from '../expression'
import { get } from 'lodash'
import { EvaluationContext, Expression, PlainObject } from '../types'

import { getType } from '@orioro/validate-type'

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
  [evaluateTyped.bind(null, 'string'), evaluateTyped.bind(null, 'string')]
)

/**
 * @function $stringLength
 * @param {String} [str=$$VALUE]
 * @returns {Number}
 */
export const $stringLength = interpreter((str: string): number => str.length, [
  evaluateTyped.bind(null, 'string'),
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

type RegExpTuple = [string, string?]
type RegExpCandidate = string | RegExp | RegExpTuple

const _prepareRegExp = (regExpCandidate: RegExpCandidate): RegExp => {
  switch (getType(regExpCandidate)) {
    case 'string':
      return new RegExp(regExpCandidate as string)
    case 'array':
      return new RegExp(regExpCandidate[0], regExpCandidate[1])
    case 'regexp':
      return regExpCandidate as RegExp
    default:
      throw new TypeError(`Invalid RegExp candidate: ${regExpCandidate}`)
  }
}

/**
 * @todo string $stringMatch is RegExp dependant, which may open vulnerabilities
 *              to RegExp DoS attacks. Might want to move away into non-built in.
 *
 * @function $stringMatch
 * @param {String | [String, String?]} regExp
 * @param {String} [value=$$VALUE]
 * @returns {String[]}
 */
export const $stringMatch = interpreter(
  (regExpCandidate: RegExpCandidate, value: string): string[] => {
    const match = value.match(_prepareRegExp(regExpCandidate))

    return match === null ? [] : [...match]
  },
  [['string', 'regexp', 'array'], 'string']
)

/**
 * @todo string $stringTest is RegExp dependant, which may open vulnerabilities
 *              to RegExp DoS attacks. Might want to move away into non-built in.
 *
 * @function $stringTest
 * @param {String | [String, String?]} regExp
 * @param {String} [value=$$VALUE]
 * @returns {Boolean}
 */
export const $stringTest = interpreter(
  (regExpCandidate: RegExpCandidate, value: string): boolean =>
    _prepareRegExp(regExpCandidate).test(value),
  [['string', 'regexp', 'array'], 'string']
)

/**
 * @todo string $stringReplace is RegExp dependant, which may open vulnerabilities
 *              to RegExp DoS attacks. Might want to move away into non-built in.
 *
 * @function $stringReplace
 * @param {String | [String, String?]} searchExp
 * @param {String} replacementExp
 * @returns {String}
 */
export const $stringReplace = interpreter(
  (
    search: RegExpCandidate,
    replacementExp: Expression,
    value: string,
    context: EvaluationContext
  ): string =>
    value.replace(_prepareRegExp(search), (match) =>
      evaluateTyped(
        'string',
        {
          ...context,
          scope: {
            $$VALUE: match,
            $$PARENT_SCOPE: context.scope,
          },
        },
        replacementExp
      )
    ),
  [['string', 'regexp', 'array'], null, 'string']
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

const INTERPOLATION_RE = /\$\{\s*(.+?)\s*\}/g
const INTERPOLATABLE_TYPES = ['string', 'number']

/**
 * @todo string $stringInterpolate verify if INTERPOLATION_RE is vulnerable to
 *              RegExp DoS attacks.
 *
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
    template.replace(INTERPOLATION_RE, (match, path) => {
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
  $stringMatch,
  $stringTest,
  $stringReplace,
  $stringToUpperCase,
  $stringToLowerCase,
  $stringInterpolate,
}
