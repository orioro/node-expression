import {
  evaluateNumber,
} from '../expression'

import {
  Expression,
  EvaluationContext,
  NumberExpression
} from '../types'

import { $$VALUE } from './value'

const mathOperation = (op:(base:number, operator:number) => number) => (
  context:EvaluationContext,
  operatorExp:NumberExpression,
  baseExp:NumberExpression = $$VALUE
):number => op(
  evaluateNumber(context, baseExp),
  evaluateNumber(context, operatorExp)
)

export const $mathSum = mathOperation((base, sum) => base + sum)
export const $mathSub = mathOperation((base, sub) => base - sub)
export const $mathMult = mathOperation((base, mult) => base * mult)
export const $mathDiv = mathOperation((dividend, divisor) => dividend / divisor)
export const $mathMod = mathOperation((dividend, divisor) => dividend % divisor)
export const $mathPow = mathOperation((base, exponent) => Math.pow(base, exponent))

export const $mathAbs = (
  context:EvaluationContext,
  valueExp:NumberExpression = $$VALUE
) => Math.abs(evaluateNumber(context, valueExp))

export const $mathMax = (
  context:EvaluationContext,
  otherValueExp:NumberExpression,
  valueExp:NumberExpression = $$VALUE
) => Math.max(
  evaluateNumber(context, otherValueExp),
  evaluateNumber(context, valueExp)
)

export const $mathMin = (
  context:EvaluationContext,
  otherValueExp:NumberExpression,
  valueExp:NumberExpression = $$VALUE
) => Math.min(
  evaluateNumber(context, otherValueExp),
  evaluateNumber(context, valueExp)
)

export const $mathRound = (
  context:EvaluationContext,
  valueExp:NumberExpression = $$VALUE
) => Math.round(evaluateNumber(context, valueExp))

export const $mathFloor = (
  context:EvaluationContext,
  valueExp:NumberExpression = $$VALUE
) => Math.floor(evaluateNumber(context, valueExp))

export const $mathCeil = (
  context:EvaluationContext,
  valueExp:NumberExpression = $$VALUE
) => Math.ceil(evaluateNumber(context, valueExp))

export const MATH_EXPRESSIONS = {
  $mathSum,
  $mathSub,
  $mathMult,
  $mathDiv,
  $mathMod,
  $mathPow,
  $mathAbs,
  $mathMax,
  $mathMin,
  $mathRound,
  $mathFloor,
  $mathCeil
}
