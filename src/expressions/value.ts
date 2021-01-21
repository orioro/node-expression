import { get } from 'lodash'

import { evaluate } from '../expression'

import {
  Expression,
  EvaluationContext,
  StringExpression,
  PlainObjectExpression
} from '../types'

const PATH_VARIABLE_RE = /^\$\$.+/

export const $$VALUE = ['$value', '$$VALUE']

export const $value = (
  context:EvaluationContext,
  pathExp:StringExpression,
  defaultExp:Expression
) => {
  const path = evaluate(context, pathExp) || '$$VALUE'

  if (typeof path !== 'string') {
    throw new TypeError(`${JSON.stringify(path)} is not a valid path - must be string`)
  }

  const value = PATH_VARIABLE_RE.test(path)
    ? get(context.scope, path)
    : get(context.scope, `$$VALUE.${path}`)

  return value !== undefined
    ? value
    : defaultExp !== undefined
      ? evaluate(context, defaultExp)
      : value
}

export const $literal = (
  context:EvaluationContext,
  value:any
) => value

export const $evaluate = (
  context:EvaluationContext,
  expExp:Expression,
  scopeExp:(PlainObjectExpression | null) = null
) => {
  const exp = evaluate(context, expExp)
  const scope = scopeExp === null
    ? context.scope
    : evaluate(context, scopeExp)

  return evaluate({
    ...context,
    scope
  }, exp)
}

export const VALUE_EXPRESSIONS = {
  $value,
  $literal,
  $evaluate
}
