import { get } from 'lodash'

import { evaluate } from '../evaluate'
import { anyType } from '@orioro/typing'

import {
  Expression,
  EvaluationContext,
  EvaluationScope,
  ExpressionInterpreterSpec,
} from '../types'

const PATH_VARIABLE_RE = /^\$\$.+/

export const $$VALUE: Expression = ['$value', '$$VALUE']

/**
 * @function $value
 * @param {String} pathExp
 * @param {*} defaultExp
 * @returns {*} value
 */
export const $value: ExpressionInterpreterSpec = [
  (
    path: string = '$$VALUE',
    defaultExp: Expression,
    context: EvaluationContext
  ): any => {
    const value = PATH_VARIABLE_RE.test(path)
      ? get(context.scope, path)
      : get(context.scope, `$$VALUE.${path}`)

    return value !== undefined
      ? value
      : defaultExp !== undefined
      ? evaluate(context, defaultExp)
      : value
  },
  [['string', 'undefined'], anyType({ delayEvaluation: true })],
  {
    defaultParam: -1,
  },
]

/**
 * @function $literal
 * @param {*} value
 * @returns {*}
 */
export const $literal: ExpressionInterpreterSpec = [
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  (value: any): any => value,
  [anyType({ delayEvaluation: true })],
  { defaultParam: -1 },
]

/**
 * @function $evaluate
 * @param {Expression} expExp
 * @param {Object | null} scopeExp
 * @returns {*}
 */
export const $evaluate: ExpressionInterpreterSpec = [
  (
    expression: Expression,
    scope: EvaluationScope,
    context: EvaluationContext
  ): any =>
    evaluate(
      {
        ...context,
        scope,
      },
      expression
    ),
  [
    (context: EvaluationContext, expExp: Expression | any): Expression =>
      evaluate(context, expExp),
    (
      context: EvaluationContext,
      scopeExp: Expression | null = null
    ): EvaluationScope =>
      scopeExp === null ? context.scope : evaluate(context, scopeExp),
  ],
  { defaultParam: -1 },
]

export const VALUE_EXPRESSIONS = {
  $value,
  $literal,
  $evaluate,
}
