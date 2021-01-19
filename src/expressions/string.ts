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

export const $string = (
  context:EvaluationContext,
  valueExp:Expression = $$VALUE
) => {
  const value = evaluate(context, valueExp)

  return typeof value === 'string' ? value : value.toString()
}

export const $stringStartsWith = interpreter((
  start:string,
  str:string
):boolean => str.startsWith(start), [
  evaluateString,
  evaluateString
])

export const $stringLength = interpreter((
  str:string
):number => str.length, [
  evaluateString
])

export const $stringSubstr = (
  context:EvaluationContext,
  startExp:NumberExpression,
  endExp:NumberExpression,
  valueExp:StringExpression = $$VALUE
):string => (
  evaluateString(context, valueExp)
    .substring(
      evaluateNumber(context, startExp),
      evaluateNumber.allowUndefined(context, endExp)
    )
)

export const $stringConcat = (
  context:EvaluationContext,
  concatExp:StringExpression,
  baseExp:StringExpression = $$VALUE
):string => (
  evaluateString(context, baseExp)
    .concat(evaluateString(context, concatExp))
)

export const $stringTrim = (
  context:EvaluationContext,
  baseExp:StringExpression = $$VALUE
):string => (
  evaluateString(context, baseExp).trim()
)

export const $stringPadStart = (
  context:EvaluationContext,
  targetLengthExp:NumberExpression,
  padStringExp:StringExpression = ' ',
  baseExp:StringExpression = $$VALUE
):string => (
  evaluateString(context, baseExp).padStart(
    evaluateNumber(context, targetLengthExp),
    evaluateString(context, padStringExp)
  )
)

export const $stringPadEnd = (
  context:EvaluationContext,
  targetLengthExp:NumberExpression,
  padStringExp:StringExpression = ' ',
  baseExp:StringExpression = $$VALUE
):string => (
  evaluateString(context, baseExp).padEnd(
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
