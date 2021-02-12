import {
  evaluate,
  evaluateTyped,

  interpreter
} from '../expression'
import { get } from 'lodash'
import { $$VALUE } from './value'
import {
  EvaluationContext,
  Expression,
  StringExpression,
  NumberExpression
} from '../types'

import { getType } from '@orioro/validate-type'

const stringifyValue = value => {
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
 * @returns {string}
 */
export const $string = interpreter((
  value:any
):string => stringifyValue(value), [
  'any'
])

/**
 * @function $stringStartsWith
 * @param {string} query
 * @param {string} [strExp=$$VALUE]
 * @returns {boolean}
 */
export const $stringStartsWith = interpreter((
  query:string,
  str:string
):boolean => str.startsWith(query), [
  evaluateTyped.bind(null, 'string'),
  evaluateTyped.bind(null, 'string')
])

/**
 * @function $stringLength
 * @param {string} [strExp=$$VALUE]
 * @returns {number}
 */
export const $stringLength = interpreter((
  str:string
):number => str.length, [
  evaluateTyped.bind(null, 'string')
])

/**
 * @function $stringSubstr
 * @param {number} startExp
 * @param {number} endExp
 * @param {string} [strExp=$$VALUE]
 */
export const $stringSubstr = interpreter((
  start:number,
  end:(number | undefined),
  str:string
):string => (
  str.substring(start, end)
), [
  'number',
  ['number', 'undefined'],
  'string'
])

/**
 * @todo string Modify interface to allow for concatenating multiple strings at once
 * @function $stringConcat
 * @param {string} concatExp
 * @param {string} [baseExp=$$VALUE]
 * @returns {string}
 */
export const $stringConcat = interpreter((
  concat:string,
  base:string
):string => base.concat(concat), [
  'string',
  'string'
])

/**
 * @function $stringTrim
 * @param {string} [strExp=$$VALUE]
 * @returns {string}
 */
export const $stringTrim = interpreter((
  str:string
):string => str.trim(), [
  'string'
])

/**
 * @function $stringPadStart
 * @param {number} targetLengthExp
 * @param {string} padStringExp
 * @param {string} [strExp=$$VALUE]
 * @returns {string}
 */
export const $stringPadStart = interpreter((
  targetLength:number,
  padString:string,
  str:string
):string => str.padStart(targetLength, padString), [
  'number',
  'string',
  'string'
])

/**
 * @function $stringPadEnd
 * @param {number} targetLengthExp
 * @param {string} padStringExp
 * @param {string} [strExp=$$VALUE]
 * @returns {string}
 */
export const $stringPadEnd = interpreter((
  targetLength:number,
  padString:string,
  str:string
):string => str.padEnd(targetLength, padString), [
  'number',
  'string',
  'string'
])

type RegExpTuple = [string, string]

const _prepareRegExp = regExpCandidate => {
  switch (getType(regExpCandidate)) {
    case 'string':
      return new RegExp(regExpCandidate)
    case 'array':
      return new RegExp(regExpCandidate[0], regExpCandidate[1])
    case 'regexp':
      return regExpCandidate
    default:
      throw new TypeError(`Invalid RegExp candidate: ${regExpCandidate}`)   
  }
}

/**
 * @todo string $stringMatch is RegExp dependant, which may open vulnerabilities
 *              to RegExp DoS attacks. Might want to move away into non-built in.
 * 
 * @function $stringMatch
 * @param {string} regExpExp
 * @param {string} [valueExp=$$VALUE]
 * @returns {string[]}
 */
export const $stringMatch = interpreter((
  regExpCandidate:(RegExp | string | [string, string?]),
  value:string
):string[] => {
  const match = value.match(_prepareRegExp(regExpCandidate))

  return match === null ? [] : [...match]
}, [
  ['string', 'regexp', 'array'],
  'string'
])

/**
 * @todo string $stringTest is RegExp dependant, which may open vulnerabilities
 *              to RegExp DoS attacks. Might want to move away into non-built in.
 * 
 * @function $stringTest
 * @param {string} regExpExp
 * @param {string} [valueExp=$$VALUE]
 * @returns {boolean}
 */
export const $stringTest = interpreter((
  regExpCandidate:(RegExp | string | [string, string?]),
  value:string
):string[] => _prepareRegExp(regExpCandidate).test(value), [
  ['string', 'regexp', 'array'],
  'string'
])

/**
 * @todo string $stringReplace is RegExp dependant, which may open vulnerabilities
 *              to RegExp DoS attacks. Might want to move away into non-built in.
 * 
 * @function $stringReplace
 * @param {string | [string, string?]} searchExp
 * @param {string | StringExpression} replacementExp
 * @returns {string}
 */
export const $stringReplace = interpreter((
  search:(RegExp | string | [string, string?]),
  replacementExp:Expression,
  value:string,
  context:EvaluationContext
):string => (
  value.replace(_prepareRegExp(search), match => evaluateTyped('string', {
    ...context,
    scope: {
      $$VALUE: match,
      $$PARENT_SCOPE: context.scope,
    }
  }, replacementExp))
), [
  ['string', 'regexp', 'array'],
  null,
  'string'
])

/**
 * @function $stringToUpperCase
 * @param {string} valueExp
 * @returns {string}
 */
export const $stringToUpperCase = interpreter((
  str:string
):string => str.toUpperCase(), [
  'string'
])

/**
 * @function $stringToLowerCase
 * @param {string} valueExp
 * @returns {string}
 */
export const $stringToLowerCase = interpreter((
  str:string
):string => str.toLowerCase(), [
  'string'
])

const INTERPOLATION_RE = /\$\{\s*(.+?)\s*\}/g
const INTERPOLATABLE_TYPES = ['string', 'number']

/**
 * @todo string $stringInterpolate verify if INTERPOLATION_RE is vulnerable to
 *              RegExp DoS attacks.
 * 
 * @function $stringInterpolate
 * @param {object | array} data Data context to be used for interpolation
 * @param {string} template Basic JS template string like `${value.path}` value
 *                          interpolation. It is possible to access nested properties
 *                          through dot `.` notation. Keywords between braces are
 *                          only interpreted as paths to the value. No logic
 *                          supported: loops, conditionals, etc.
 */
export const $stringInterpolate = interpreter((
  data:({ [key:string]: any } | any[]),
  template:string
):string => (
  template.replace(INTERPOLATION_RE, (match, path) => {
    const value = get(data, path)

    return INTERPOLATABLE_TYPES.includes(typeof value)
      ? value
      : ''
  })
), [
  ['object', 'array'],
  'string',
])

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
  $stringInterpolate
}
