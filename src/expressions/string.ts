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
) => evaluateString(context, valueExp).length

export const $stringSubstr = (
  context:EvaluationContext,
  startExp:NumberExpression,
  endExp:NumberExpression,
  valueExp:StringExpression = $$VALUE
) => (
  evaluateString(context, valueExp)
    .substring(
      evaluateNumber(context, startExp),
      evaluateNumber.allowUndefined(context, endExp)
    )
)

export {
  $value
}
