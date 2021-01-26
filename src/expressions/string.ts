import {
  evaluate,
  evaluateString,
  evaluateStringOrRegExp,
  evaluateNumber,

  interpreter
} from '../expression'
import { $$VALUE } from './value'
import {
  EvaluationContext,
  Expression,
  StringExpression,
  NumberExpression
} from '../types'

/**
 * @name $string
 * @param {*} [valueExp=$$VALUE]
 * @return {string}
 */
export const $string = (
  context:EvaluationContext,
  valueExp:Expression = $$VALUE
) => {
  const value = evaluate(context, valueExp)

  return typeof value === 'string' ? value : value.toString()
}

/**
 * @name $stringStartsWith
 * @param {string} query
 * @param {string} [strExp=$$VALUE]
 * @return {boolean}
 */
export const $stringStartsWith = interpreter((
  query:string,
  str:string
):boolean => str.startsWith(query), [
  evaluateString,
  evaluateString
])

/**
 * @name $stringLength
 * @param {string} [strExp=$$VALUE]
 * @return {number}
 */
export const $stringLength = interpreter((
  str:string
):number => str.length, [
  evaluateString
])

/**
 * @name $stringSubstr
 * @param {number} startExp
 * @param {number} endExp
 * @param {string} [strExp=$$VALUE]
 */
export const $stringSubstr = (
  context:EvaluationContext,
  startExp:NumberExpression,
  endExp:NumberExpression,
  strExp:StringExpression = $$VALUE
):string => (
  evaluateString(context, strExp)
    .substring(
      evaluateNumber(context, startExp),
      evaluateNumber.allowUndefined(context, endExp)
    )
)

/**
 * @name $stringConcat
 * @param {string} concatExp
 * @param {string} [baseExp=$$VALUE]
 * @return {string}
 */
export const $stringConcat = (
  context:EvaluationContext,
  concatExp:StringExpression,
  baseExp:StringExpression = $$VALUE
):string => (
  evaluateString(context, baseExp)
    .concat(evaluateString(context, concatExp))
)

/**
 * @name $stringTrim
 * @param {string} [strExp=$$VALUE]
 * @return {string}
 */
export const $stringTrim = (
  context:EvaluationContext,
  strExp:StringExpression = $$VALUE
):string => (
  evaluateString(context, strExp).trim()
)

/**
 * @name $stringPadStart
 * @param {number} targetLengthExp
 * @param {string} padStringExp
 * @param {string} [strExp=$$VALUE]
 * @return {string}
 */
export const $stringPadStart = (
  context:EvaluationContext,
  targetLengthExp:NumberExpression,
  padStringExp:StringExpression = ' ',
  strExp:StringExpression = $$VALUE
):string => (
  evaluateString(context, strExp).padStart(
    evaluateNumber(context, targetLengthExp),
    evaluateString(context, padStringExp)
  )
)

/**
 * @name $stringPadEnd
 * @param {number} targetLengthExp
 * @param {string} padStringExp
 * @param {string} [strExp=$$VALUE]
 * @return {string}
 */
export const $stringPadEnd = (
  context:EvaluationContext,
  targetLengthExp:NumberExpression,
  padStringExp:StringExpression = ' ',
  strExp:StringExpression = $$VALUE
):string => (
  evaluateString(context, strExp).padEnd(
    evaluateNumber(context, targetLengthExp),
    evaluateString(context, padStringExp)
  )
)

const _regExp = (
  context:EvaluationContext,
  regExpExp:Expression | RegExp,
  regExpOptionsExp:Expression | String
) => {
  const regExp = evaluateStringOrRegExp(context, regExpExp)
  const regExpOptions = evaluateString.allowUndefined(context, regExpOptionsExp)

  return new RegExp(regExp, regExpOptions)
}

/**
 * @name $stringMatch
 * @param {string} regExpExp
 * @param {string} regExpOptionsExp
 * @param {string} [valueExp=$$VALUE]
 * @return {string[]}
 */
export const $stringMatch = (
  context:EvaluationContext,
  regExpExp:Expression | RegExp,
  regExpOptionsExp:Expression | String,
  valueExp:Expression = $$VALUE
) => {
  const regExp = _regExp(context, regExpExp, regExpOptionsExp)
  const value = evaluateString(context, valueExp)

  const match = value.match(regExp)

  return match === null ? [] : [...match]
}

/**
 * @name $stringTest
 * @param {string} regExpExp
 * @param {string} regExpOptionsExp
 * @param {string} [valueExp=$$VALUE]
 * @return {boolean}
 */
export const $stringTest = (
  context:EvaluationContext,
  regExpExp:Expression | RegExp,
  regExpOptionsExp:Expression | String,
  valueExp:Expression = $$VALUE
) => {
  const regExp = _regExp(context, regExpExp, regExpOptionsExp)
  const value = evaluateString(context, valueExp)

  return regExp.test(value)
}

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
  $stringTest
}
