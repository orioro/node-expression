import { get } from 'lodash'

import { evaluate, interpreter } from '../expression'

import { Expression, EvaluationContext } from '../types'

const PATH_VARIABLE_RE = /^\$\$.+/

export const $$VALUE: Expression = ['$value', '$$VALUE']

/**
 * @function $value
 * @param {string} pathExp
 * @param {*} defaultExp
 * @returns {*} value
 */
export const $value = interpreter(
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
  [['string', 'undefined'], null],
  false
)

/**
 * @function $literal
 * @param {*} value
 * @returns {*}
 */
export const $literal = interpreter((value: any): any => value, [null], false)

/**
 * @function $evaluate
 * @param {Expression} expExp
 * @param {Object | null} scopeExp
 * @returns {*}
 */
export const $evaluate = interpreter(
  (expression: Expression, scope, context: EvaluationContext): any =>
    evaluate(
      {
        ...context,
        scope,
      },
      expression
    ),
  [
    (context, expExp) => evaluate(context, expExp),
    (context, scopeExp = null) =>
      scopeExp === null ? context.scope : evaluate(context, scopeExp),
  ],
  false
)

export const VALUE_EXPRESSIONS = {
  $value,
  $literal,
  $evaluate,
}
