import { get } from 'lodash'

import { evaluate } from '../expression'

import {
  Expression,
  EvaluationContext,
  StringExpression
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
    ? get(context.data, path)
    : get(context.data, `$$VALUE.${path}`)

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

// const $value = (
//   options:EvaluateOptions,
//   pathExp:Expression,
//   defaultExp:Expression
// ) => {
//   const { context } = options

//   let path = evaluate(options, pathExp)
//   let value

//   if (path === null) {
//     value = context.$$VALUE
//   } else if (typeof path === 'string') {
//     value = PATH_VARIABLE_RE.test(path) ?
//       get(context, path) :
//       get(context, `$$VALUE.${path}`)
//   } else {
//     throw new Error(`${JSON.stringify(path)} is not a valid path`)
//   }

//   return value !== undefined ?
//     value :
//     defaultExp !== undefined ?
//       evaluate(options, defaultExp) :
//       value
// }

