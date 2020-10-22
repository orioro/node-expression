import {
  evaluate,
  evaluateString,
  evaluateNumber,

  interpreter
} from '../expression'
import { $$VALUE, $value } from './value'
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

export {
  $value
}
