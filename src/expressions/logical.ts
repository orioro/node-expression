import { validateArray } from '../util/validate'

import {
  evaluate,
  evaluateBoolean,
  evaluateString
} from '../expression'

import {
  Expression,
  EvaluationContext,
  StringExpression,
  BooleanExpression
} from '../types'

export const $and = (
  context:EvaluationContext,
  expressions:Expression[]
):boolean => {
  validateArray(expressions)

  return expressions.every(exp => evaluateBoolean(context, exp))
}

export const $or = (
  context:EvaluationContext,
  expressions:Expression[]
):boolean => {
  validateArray(expressions)

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
  conditionExp,
  thenExp,
  elseExp
) => {
  return evaluateBoolean(context, conditionExp) ?
    evaluate(context, thenExp) :
    evaluate(context, elseExp)
}

export const $switch = (
  context:EvaluationContext,
  cases:[Expression, Expression][],
  defaultExp:Expression = ['$error', 'No default defined', true]
) => {
  const correspondingCase = cases.find(([condition]) => (
    evaluateBoolean(context, condition)
  ))

  return correspondingCase
    ? evaluate(context, correspondingCase[1])
    : evaluate(context, defaultExp)
}

export const $error = (
  context:EvaluationContext,
  nameExp:StringExpression,
  messageExp:StringExpression,
  silentExp:BooleanExpression = true
) => {
  const name = evaluateString(context, nameExp)
  const message = evaluateString.allowUndefined(context, messageExp) || name
  const silent = evaluateBoolean(context, silentExp)

  const error = new Error(message)

  error.name = name

  if (silent) {
    return error
  } else {
    throw error
  }
}
