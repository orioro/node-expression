import { evaluate, interpreter } from '../expression'
import { Expression, EvaluationContext, PlainObject } from '../types'

/**
 * @function $and
 * @param {Array} expressionsExp
 * @returns {Boolean}
 */
export const $and = interpreter(
  (expressions: Expression[], context: EvaluationContext): boolean =>
    expressions.every((exp) => Boolean(evaluate(context, exp))),
  [['array', 'undefined']]
)

/**
 * @function $or
 * @param {Array} expressionsExp
 * @returns {Boolean}
 */
export const $or = interpreter(
  (expressions: Expression[], context: EvaluationContext): boolean =>
    expressions.some((exp) => Boolean(evaluate(context, exp))),
  [['array', 'undefined']]
)

/**
 * @function $not
 * @param {Array} expressionsExp
 * @returns {Boolean}
 */
export const $not = interpreter((value: any): boolean => !value, ['any'])

/**
 * @function $nor
 * @param {Array} expressionsExp
 * @returns {Boolean}
 */
export const $nor = interpreter(
  (expressions: Expression[], context: EvaluationContext): boolean =>
    expressions.every((exp) => !evaluate(context, exp)),
  ['array']
)

/**
 * @function $xor
 * @param {Boolean} expressionA
 * @param {Boolean} expressionB
 * @returns {Boolean}
 */
export const $xor = interpreter(
  (valueA: any, valueB: any): boolean => Boolean(valueA) !== Boolean(valueB),
  ['any', 'any']
)

/**
 * @function $if
 * @param {Boolean} conditionExp
 * @param {Expression} thenExp
 * @param {Expression} elseExp
 * @returns {*} result
 */
export const $if = interpreter(
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
  ]
)

type Case = [Expression, Expression]

/**
 * @function $switch
 * @param {Array} cases
 * @param {Expression} defaultExp
 * @returns {*} result
 */
export const $switch = interpreter(
  (cases: Case[], defaultExp: Expression, context: EvaluationContext): any => {
    const correspondingCase = cases.find(([conditionExp]) =>
      Boolean(evaluate(context, conditionExp))
    )

    return correspondingCase
      ? evaluate(context, correspondingCase[1])
      : evaluate(context, defaultExp)
  },
  ['array', null],
  false
)

/**
 * @function $switchKey
 * @param {Cases[]} cases
 * @param {String} cases[].0 Case key
 * @param {*} cases[].1 Case value
 * @param {*} defaultExp
 * @param {String} ValueExp
 * @returns {*}
 */
export const $switchKey = interpreter(
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
  ['object', null, 'any']
)

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
