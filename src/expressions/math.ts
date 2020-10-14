import {
  evaluateNumber,
} from '../expression'

import {
  Expression,
  EvaluationContext,
  NumberExpression
} from '../types'

import {
  $$VALUE,
  $value
} from './value'

export const $mathSum = (
  context:EvaluationContext,
  sumExp:NumberExpression,
  baseExp:NumberExpression | undefined = $$VALUE
):number => (
  evaluateNumber(context, baseExp) + evaluateNumber(context, sumExp)
)

export const $mathSubtract = (
  context:EvaluationContext,
  subtractExp:NumberExpression,
  baseExp:NumberExpression | undefined = $$VALUE
):number => (
  evaluateNumber(context, baseExp) - evaluateNumber(context, subtractExp)
)

export const $mathMod = (
  context:EvaluationContext,
  divisorExp:NumberExpression,
  dividendExp:NumberExpression | undefined = $$VALUE
):number => (
  evaluateNumber(context, dividendExp) % evaluateNumber(context, divisorExp)
)

export const $mathAbs = (
  context:EvaluationContext,
  valueExp:NumberExpression | undefined = $$VALUE
) => Math.abs(evaluateNumber(context, valueExp))

export const $mathMax = (
  context:EvaluationContext,
  otherValueExp:NumberExpression,
  valueExp:NumberExpression | undefined = $$VALUE
) => Math.max(
  evaluateNumber(context, otherValueExp),
  evaluateNumber(context, valueExp)
)

export const $mathMin = (
  context:EvaluationContext,
  otherValueExp:NumberExpression,
  valueExp:NumberExpression | undefined = $$VALUE
) => Math.min(
  evaluateNumber(context, otherValueExp),
  evaluateNumber(context, valueExp)
)

export const $mathRound = (
  context:EvaluationContext,
  valueExp:NumberExpression | undefined = $$VALUE
) => Math.round(evaluateNumber(context, valueExp))

export const $mathFloor = (
  context:EvaluationContext,
  valueExp:NumberExpression | undefined = $$VALUE
) => Math.floor(evaluateNumber(context, valueExp))

export const $mathCeil = (
  context:EvaluationContext,
  valueExp:NumberExpression | undefined = $$VALUE
) => Math.ceil(evaluateNumber(context, valueExp))

export {
  $value
}
