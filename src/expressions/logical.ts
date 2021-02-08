import { validateArray } from '../util/validate'

import {
  evaluate,
  evaluateArray,
  evaluatePlainObject
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
 * @returns {boolean}
 */
export const $and = (
  context:EvaluationContext,
  expressionsExp:ArrayExpression = $$VALUE
):boolean => (
  evaluateArray(context, expressionsExp)
    .every(exp => Boolean(evaluate(context, exp)))
)

/**
 * @function $or
 * @param {ArrayExpression} expressionsExp
 * @returns {boolean}
 */
export const $or = (
  context:EvaluationContext,
  expressionsExp:ArrayExpression = $$VALUE
):boolean => (
  evaluateArray(context, expressionsExp)
    .some(exp => Boolean(evaluate(context, exp)))
)

/**
 * @function $not
 * @param {ArrayExpression} expressionsExp
 * @returns {boolean}
 */
export const $not = (
  context:EvaluationContext,
  expression:Expression = $$VALUE
):boolean => !Boolean(evaluate(context, expression))

/**
 * @function $nor
 * @param {ArrayExpression} expressionsExp
 * @returns {boolean}
 */
export const $nor = (
  context:EvaluationContext,
  expressionsExp:ArrayExpression = $$VALUE
):boolean => !$or(context, expressionsExp)

/**
 * @function $xor
 * @param {BooleanExpression} expressionA
 * @param {BooleanExpression} expressionB
 * @returns {boolean}
 */
export const $xor = (
  context:EvaluationContext,
  expressionA:BooleanExpression,
  expressionB:BooleanExpression
):boolean => (
  Boolean(evaluate(context, expressionA)) !== Boolean(evaluate(context, expressionB))
)

/**
 * @function $if
 * @param {BooleanExpression} conditionExp
 * @param {Expression} thenExp
 * @param {Expression} elseExp
 * @returns {*} result
 */
export const $if = (
  context:EvaluationContext,
  conditionExp:BooleanExpression,
  thenExp:Expression,
  elseExp:Expression
) => (
  Boolean(evaluate(context, conditionExp))
    ? evaluate(context, thenExp)
    : evaluate(context, elseExp)
)

type Case = [BooleanExpression, Expression]

/**
 * @function $switch
 * @param {ArrayExpression} casesExp
 * @param {Expression} defaultExp
 * @returns {*} result
 */
export const $switch = (
  context:EvaluationContext,
  casesExp:ArrayExpression | Case[],
  defaultExp:AnyExpression = undefined
) => {
  const cases = evaluateArray(context, casesExp)
  const correspondingCase = cases.find(([condition]) => (
    Boolean(evaluate(context, condition))
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
 * @returns {*}
 */
export const $switchKey = (
  context:EvaluationContext,
  casesExp:PlainObjectExpression | { [key: string]: AnyExpression },
  defaultExp:AnyExpression = undefined,
  valueExp:StringExpression = $$VALUE
) => {
  const cases = evaluatePlainObject(context, casesExp)
  const correspondingCase = cases[evaluate(context, valueExp)]

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
