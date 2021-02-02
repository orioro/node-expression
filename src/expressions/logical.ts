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

/**
 * @function $and
 * @param {ArrayExpression} expressionsExp
 * @return {boolean}
 */
export const $and = (
  context:EvaluationContext,
  expressionsExp:ArrayExpression = $$VALUE
):boolean => {
  const expressions = evaluateArray(context, expressionsExp)

  return expressions.every(exp => evaluateBoolean(context, exp))
}

/**
 * @function $or
 * @param {ArrayExpression} expressionsExp
 * @return {boolean}
 */
export const $or = (
  context:EvaluationContext,
  expressionsExp:ArrayExpression = $$VALUE
):boolean => {
  const expressions = evaluateArray(context, expressionsExp)

  return expressions.some(exp => evaluateBoolean(context, exp))
}

/**
 * @function $not
 * @param {ArrayExpression} expressionsExp
 * @return {boolean}
 */
export const $not = (
  context:EvaluationContext,
  expression
):boolean => {
  return !evaluateBoolean(context, expression)
}

/**
 * @function $nor
 * @param {ArrayExpression} expressionsExp
 * @return {boolean}
 */
export const $nor = (
  context:EvaluationContext,
  expressionsExp:ArrayExpression = $$VALUE
):boolean => !$or(context, expressionsExp)

/**
 * @function $xor
 * @param {BooleanExpression} expressionA
 * @param {BooleanExpression} expressionB
 * @return {boolean}
 */
export const $xor = (
  context:EvaluationContext,
  expressionA:BooleanExpression,
  expressionB:BooleanExpression
):boolean => (
  evaluateBoolean(context, expressionA) !== evaluateBoolean(context, expressionB)
)

/**
 * @function $if
 * @param {BooleanExpression} conditionExp
 * @param {Expression} thenExp
 * @param {Expression} elseExp
 * @return {*} result
 */
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

/**
 * @function $switch
 * @param {ArrayExpression} casesExp
 * @param {Expression} defaultExp
 * @return {*} result
 */
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

/**
 * @function $switchKey
 * @param {Cases[]} casesExp
 * @param {string} casesExp[].0 Case key
 * @param {*} casesExp[].1 Case value
 * @param {*} defaultExp
 * @param {String} ValueExp
 * @return {*}
 */
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

export const LOGICAL_EXPRESSIONS = {
  $and,
  $or,
  $not,
  $nor,
  $xor,
  $if,
  $switch,
  $switchKey
}
