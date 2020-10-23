import { validateArray } from '../util/validate'

import {
  evaluate,
  evaluateArray,
  evaluatePlainObject,
  evaluateBoolean,
  evaluateString
} from '../expression'

import { $$VALUE } from './value'

import {
  ArrayExpression,
  PlainObjectExpression,
  AnyExpression,
  Expression,
  EvaluationContext,
  StringExpression,
  BooleanExpression
} from '../types'

export const $and = (
  context:EvaluationContext,
  expressionsExp:ArrayExpression = $$VALUE
):boolean => {
  const expressions = evaluateArray(context, expressionsExp)

  return expressions.every(exp => evaluateBoolean(context, exp))
}

export const $or = (
  context:EvaluationContext,
  expressionsExp:ArrayExpression = $$VALUE
):boolean => {
  const expressions = evaluateArray(context, expressionsExp)

  return expressions.some(exp => evaluateBoolean(context, exp))
}

export const $not = (
  context:EvaluationContext,
  expression
):boolean => {
  return !evaluateBoolean(context, expression)
}

export const $nor = (
  context:EvaluationContext,
  expressions:any[]
):boolean => !$or(context, expressions)

export const $xor = (
  context:EvaluationContext,
  expressionA:BooleanExpression,
  expressionB:BooleanExpression
):boolean => (
  evaluateBoolean(context, expressionA) !== evaluateBoolean(context, expressionB)
)

export const $if = (
  context:EvaluationContext,
  conditionExp:BooleanExpression,
  thenExp:Expression,
  elseExp:Expression
) => {
  return evaluateBoolean(context, conditionExp) ?
    evaluate(context, thenExp) :
    evaluate(context, elseExp)
}

type Case = [BooleanExpression, Expression]

export const $switch = (
  context:EvaluationContext,
  casesExp:ArrayExpression | Case[],
  defaultExp:Expression = ['$error', 'No default defined', true]
) => {
  const cases = evaluateArray(context, casesExp)
  const correspondingCase = cases.find(([condition]) => (
    evaluateBoolean(context, condition)
  ))

  return correspondingCase
    ? evaluate(context, correspondingCase[1])
    : evaluate(context, defaultExp)
}

export const $switchKey = (
  context:EvaluationContext,
  casesExp:PlainObjectExpression | { [key: string]: AnyExpression },
  defaultExp:AnyExpression = ['$error', 'No default defined', true],
  valueExp:StringExpression = $$VALUE
) => {
  const cases = evaluatePlainObject(context, casesExp)
  const correspondingCase = cases[evaluateString(context, valueExp)]

  return correspondingCase
    ? evaluate(context, correspondingCase)
    : evaluate(context, defaultExp)
}
