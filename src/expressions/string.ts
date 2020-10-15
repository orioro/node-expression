import {
  evaluate,
  evaluateString,
  evaluateNumber
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

export const $stringLength = (
  context:EvaluationContext,
  valueExp:StringExpression = $$VALUE
):number => evaluateString(context, valueExp).length

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
