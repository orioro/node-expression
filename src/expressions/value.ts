import { get } from 'lodash'

import { evaluate } from '../evaluate'
import { anyType } from '@orioro/typing'

import {
  Expression,
  EvaluationContext,
  EvaluationScope,
  InterpreterSpec,
} from '../types'

const PATH_VARIABLE_RE = /^\$\$.+/

export const $$VALUE: Expression = ['$value', '$$VALUE']

/**
 * @function $value
 * @param {String} path
 * @param {*} defaultExp
 * @returns {*} value
 */
export const $value: InterpreterSpec = [
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
export const $literal: InterpreterSpec = [
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  (value: any): any => value,
  [anyType({ delayEvaluation: true })],
  { defaultParam: -1 },
]

/**
 * @todo value Consider adding 'expression' type
 *
 * @function $evaluate
 * @param {Expression} expression
 * @param {Object} scope
 * @returns {*}
 */
export const $evaluate: InterpreterSpec = [
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
  ['any', 'object'],
  { defaultParam: -1 },
]

export const VALUE_EXPRESSIONS = {
  $value,
  $literal,
  $evaluate,
}
