/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { indefiniteArrayOfType, tupleType, anyType } from '@orioro/typing'
import { evaluate, evaluateSync } from '../evaluate'
import {
  Expression,
  EvaluationContext,
  PlainObject,
  InterpreterSpecSingle,
  InterpreterSpec,
} from '../types'
import { _pseudoSymbol } from '../util/misc'

const _UNRESOLVED = _pseudoSymbol()

/**
 * @function $and
 * @param {Array} expressionsExp
 * @returns {Boolean}
 */
export const $and: InterpreterSpec = [
  (values: any[]): boolean => values.every((value) => Boolean(value)),
  [indefiniteArrayOfType('any')],
]

/**
 * @function $or
 * @param {Array} expressionsExp
 * @returns {Boolean}
 */
export const $or: InterpreterSpec = [
  (values: Expression[]): boolean => values.some((value) => Boolean(value)),
  [indefiniteArrayOfType('any')],
]

/**
 * @function $not
 * @param {Array} expressionsExp
 * @returns {Boolean}
 */
export const $not: InterpreterSpec = [(value: any): boolean => !value, ['any']]

/**
 * @function $nor
 * @param {Array} expressionsExp
 * @returns {Boolean}
 */
export const $nor: InterpreterSpec = [
  (values: Expression[]): boolean => values.every((value) => !value),
  [indefiniteArrayOfType('any')],
]

/**
 * @function $xor
 * @param {Boolean} expressionA
 * @param {Boolean} expressionB
 * @returns {Boolean}
 */
export const $xor: InterpreterSpec = [
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
export const $if: InterpreterSpec = [
  (
    condition: any,
    thenExp: Expression,
    elseExp: Expression,
    context: EvaluationContext
  ): any =>
    // Usage of `evaluate` inside the expression does not affect
    // its sync/async usage, as the logic of the expression operation
    // does not depend on any evaluation ran inside itself.
    // For example: condition MUST be evaluated outside expression
    // interpreter logic by the argument resolvers because otherwise
    // the logic for handling promises would have to be inside
    // the expression interpreter.
    // On the other hand, the return value is ignored by the expression interpreter:
    // whether it returns a value or a promise is not important to its logic
    condition ? evaluate(context, thenExp) : evaluate(context, elseExp),
  [
    'any',
    anyType({ skipEvaluation: true }), // Only evaluate if condition is satisfied
    anyType({ skipEvaluation: true }), // Only evaluate if condition is not satisfied
  ],
]

type Case = [Expression, Expression]

const _switchSync: InterpreterSpecSingle = [
  (cases: Case[], defaultExp: Expression, context: EvaluationContext): any => {
    const correspondingCase = cases.find(([condition]) =>
      Boolean(evaluateSync(context, condition))
    )

    return correspondingCase
      ? evaluateSync(context, correspondingCase[1])
      : evaluateSync(context, defaultExp)
  },
  [
    indefiniteArrayOfType(
      tupleType([
        anyType({ skipEvaluation: true }),
        anyType({ skipEvaluation: true }),
      ])
    ),
    anyType({ skipEvaluation: true }),
  ],
  {
    defaultParam: -1,
  },
]

const _switchAsync: InterpreterSpecSingle = [
  (cases: Case[], defaultExp: Expression, context: EvaluationContext): any =>
    cases
      .reduce(
        (accPromise, [conditionExp, valueExp]) =>
          accPromise.then((acc) =>
            acc !== _UNRESOLVED
              ? acc
              : Promise.resolve(
                  evaluate(context, conditionExp)
                ).then((condition) =>
                  condition ? evaluate(context, valueExp) : _UNRESOLVED
                )
          ),
        Promise.resolve(_UNRESOLVED)
      )
      .then((result) =>
        result === _UNRESOLVED ? evaluate(context, defaultExp) : result
      ),
  [
    indefiniteArrayOfType(
      tupleType([
        anyType({ skipEvaluation: true }),
        anyType({ skipEvaluation: true }),
      ])
    ),
    anyType({ skipEvaluation: true }),
  ],
  {
    defaultParam: -1,
  },
]

/**
 * @function $switch
 * @param {Array} cases
 * @param {Expression} defaultExp
 * @returns {*} result
 */
export const $switch: InterpreterSpec = {
  sync: _switchSync,
  async: _switchAsync,
}

/**
 * @function $switchKey
 * @param {Cases[]} cases
 * @param {String} cases[].0 Case key
 * @param {*} cases[].1 Case value
 * @param {*} defaultExp
 * @param {String} ValueExp
 * @returns {*}
 */
export const $switchKey: InterpreterSpec = [
  (
    cases: PlainObject,
    defaultExp: Expression,
    value: any,
    context: EvaluationContext
  ): any => {
    const correspondingCase = cases[value]

    return correspondingCase !== undefined
      ? evaluate(context, correspondingCase)
      : evaluate(context, defaultExp)
  },
  ['object', anyType({ skipEvaluation: true }), 'any'],
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
