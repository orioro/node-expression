import {
  evaluate,
  evaluateTyped,
  interpreter
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
 * @todo logical Better handle unknown expressions for boolean logical operators
 *               Uninterpreted expressions are returned as simple arrays, which
 *               in turn return mistaken true results
 * 
 * @function $and
 * @param {ArrayExpression} expressionsExp
 * @returns {boolean}
 */
export const $and = interpreter((
  expressions:Expression[],
  context:EvaluationContext
):boolean => (
  expressions.every(exp => Boolean(evaluate(context, exp)))
), [
  ['array', 'undefined']
])

/**
 * @function $or
 * @param {ArrayExpression} expressionsExp
 * @returns {boolean}
 */
export const $or = interpreter((
  expressions:Expression[],
  context:EvaluationContext
):boolean => (
  expressions.some(exp => Boolean(evaluate(context, exp)))
), [
  ['array', 'undefined']
])

/**
 * @function $not
 * @param {ArrayExpression} expressionsExp
 * @returns {boolean}
 */
export const $not = interpreter((
  value:any
):boolean => !Boolean(value), [
  'any'
])

/**
 * @function $nor
 * @param {ArrayExpression} expressionsExp
 * @returns {boolean}
 */
export const $nor = interpreter((
  expressions:Expression[],
  context:EvaluationContext
):boolean => (
  expressions.every(exp => !Boolean(evaluate(context, exp)))
), [
  'array'
])

/**
 * @function $xor
 * @param {BooleanExpression} expressionA
 * @param {BooleanExpression} expressionB
 * @returns {boolean}
 */
export const $xor = interpreter((
  valueA:any,
  valueB:any
):boolean => (
  Boolean(valueA) !== Boolean(valueB)
), [
  'any',
  'any'
])

/**
 * @function $if
 * @param {BooleanExpression} conditionExp
 * @param {Expression} thenExp
 * @param {Expression} elseExp
 * @returns {*} result
 */
export const $if = interpreter((
  condition:any,
  thenExp:Expression,
  elseExp:Expression,
  context:EvaluationContext
):any => (
  Boolean(condition)
    ? evaluate(context, thenExp)
    : evaluate(context, elseExp)
), [
  'any',
  null, // Only evaluate if condition is satisfied
  null  // Only evaluate if condition is not satisfied
])

type Case = [BooleanExpression, Expression]

/**
 * @function $switch
 * @param {ArrayExpression} casesExp
 * @param {Expression} defaultExp
 * @returns {*} result
 */
export const $switch = interpreter((
  cases:Case[],
  defaultExp:Expression,
  context:EvaluationContext
):any => {
  const correspondingCase = cases.find(([conditionExp]) => (
    Boolean(evaluate(context, conditionExp))
  ))

  return correspondingCase
    ? evaluate(context, correspondingCase[1])
    : evaluate(context, defaultExp)
}, [
  'array',
  null
], false)

/**
 * @function $switchKey
 * @param {Cases[]} casesExp
 * @param {string} casesExp[].0 Case key
 * @param {*} casesExp[].1 Case value
 * @param {*} defaultExp
 * @param {String} ValueExp
 * @returns {*}
 */
export const $switchKey = interpreter((
  cases:{ [key:string]: any },
  defaultExp:(Expression | undefined) = undefined,
  value:any,
  context:EvaluationContext
):any => {
  const correspondingCase = cases[value]

  return correspondingCase !== undefined
    ? evaluate(context, correspondingCase)
    : evaluate(context, defaultExp)
}, [
  'object',
  null,
  'any'
])

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
