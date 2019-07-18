import {
  get,
  isPlainObject,
  set
} from 'lodash'

import {
  evaluateString,
  evaluateStringOrRegExp
} from '../'

import {
  evaluate,
  isExpression,
} from '../expression'

const PATH_VARIABLE_RE = /^\$\$.+/

export const $$ROOT = ['$value', '$$ROOT']
export const $$CURRENT = ['$value', null]
export const $$VALUE = $$CURRENT

const $value = (options, pathExp, defaultExp) => {
  const { context } = options

  let path = evaluate(options, pathExp)
  let value

  if (path === null) {
    value = context.$$VALUE
  } else if (typeof path === 'string') {
    value = PATH_VARIABLE_RE.test(path) ?
      get(context, path) :
      get(context, `$$VALUE.${path}`)
  } else {
    throw new Error(`${JSON.stringify(path)} is not a valid path`)
  }

  return value !== undefined ?
    value :
    defaultExp !== undefined ?
      evaluate(options, defaultExp) :
      value
}

const $evaluate = (options, exp) => {
  return evaluate(options, exp)
}

const $regexp = (options, bodyExp, regExpOptionsExp) => {
  const body = evaluateStringOrRegExp(options, bodyExp)
  const regExpOptions = evaluateString.allowUndefined(options, regExpOptionsExp)

  return new RegExp(body, regExpOptions)
}

const $literal = (options, value) => value

const $transform = (options, format) => {
  if (Array.isArray(format)) {
    return format.map(itemExp => evaluate(options, itemExp))
  } else if (isPlainObject(format)) {
    return Object.keys(format).reduce((acc, targetPath) => {
      const targetValue = format[targetPath]
      const targetValueExp = isExpression(options, targetValue) ?
        targetValue :
        ['$value', targetValue]

      set(acc, targetPath, evaluate(options, targetValueExp))

      return acc
    }, {})
  } else {
    throw new Error(`Invalid transform format ${format}`)
  }
}

export const VALUE_EXPRESSIONS = {
  $value,
  $literal,
  $transform,
  $evaluate
}
