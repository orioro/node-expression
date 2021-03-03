/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { evaluate } from '../evaluate'
import {
  Expression,
  EvaluationContext,
  PlainObject,
  ExpressionInterpreterSpec,
} from '../types'

/**
 * @function $and
 * @param {Array} expressionsExp
 * @returns {Boolean}
 */
export const $and: ExpressionInterpreterSpec = [
  (expressions: Expression[], context: EvaluationContext): boolean =>
    expressions.every((exp) => Boolean(evaluate(context, exp))),
  [['array', 'undefined']],
]

/**
 * @function $or
 * @param {Array} expressionsExp
 * @returns {Boolean}
 */
export const $or: ExpressionInterpreterSpec = [
  (expressions: Expression[], context: EvaluationContext): boolean =>
    expressions.some((exp) => Boolean(evaluate(context, exp))),
  [['array', 'undefined']],
]

/**
 * @function $not
 * @param {Array} expressionsExp
 * @returns {Boolean}
 */
export const $not: ExpressionInterpreterSpec = [
  (value: any): boolean => !value,
  ['any'],
]

/**
 * @function $nor
 * @param {Array} expressionsExp
 * @returns {Boolean}
 */
export const $nor: ExpressionInterpreterSpec = [
  (expressions: Expression[], context: EvaluationContext): boolean =>
    expressions.every((exp) => !evaluate(context, exp)),
  ['array'],
]

/**
 * @function $xor
 * @param {Boolean} expressionA
 * @param {Boolean} expressionB
 * @returns {Boolean}
 */
export const $xor: ExpressionInterpreterSpec = [
  (valueA: any, valueB: any): boolean => Boolean(valueA) !== Boolean(valueB),
  ['any', 'any'],
]

/**
 * @function $if
 * @param {Boolean} conditionExp
 * @param {Expression} thenExp
 * @param {Expression} elseExp
 * @returns {*} result
 */
export const $if: ExpressionInterpreterSpec = [
  (
    condition: any,
    thenExp: Expression,
    elseExp: Expression,
    context: EvaluationContext
  ): any =>
    condition ? evaluate(context, thenExp) : evaluate(context, elseExp),
  [
    'any',
    null, // Only evaluate if condition is satisfied
    null, // Only evaluate if condition is not satisfied
  ],
]

type Case = [Expression, Expression]

/**
 * @function $switch
 * @param {Array} cases
 * @param {Expression} defaultExp
 * @returns {*} result
 */
export const $switch: ExpressionInterpreterSpec = [
  (cases: Case[], defaultExp: Expression, context: EvaluationContext): any => {
    const correspondingCase = cases.find(([conditionExp]) =>
      Boolean(evaluate(context, conditionExp))
    )

    return correspondingCase
      ? evaluate(context, correspondingCase[1])
      : evaluate(context, defaultExp)
  },
  ['array', null],
  {
    defaultParam: -1,
  },
]

/**
 * @function $switchKey
 * @param {Cases[]} cases
 * @param {String} cases[].0 Case key
 * @param {*} cases[].1 Case value
 * @param {*} defaultExp
 * @param {String} ValueExp
 * @returns {*}
 */
export const $switchKey: ExpressionInterpreterSpec = [
  (
    cases: PlainObject,
    defaultExp: Expression | undefined = undefined,
    value: any,
    context: EvaluationContext
  ): any => {
    const correspondingCase = cases[value]

    return correspondingCase !== undefined
      ? evaluate(context, correspondingCase)
      : evaluate(context, defaultExp)
  },
  ['object', null, 'any'],
]

export const LOGICAL_EXPRESSIONS = {
  $and,
  $or,
  $not,
  $nor,
  $xor,
  $if,
  $switch,
  $switchKey,
}
