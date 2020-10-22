import { get, set, isPlainObject } from 'lodash'

import {
  evaluate,
  evaluatePlainObject,
  evaluateString,
  evaluateArray
} from '../expression'

import {
  Expression,
  EvaluationContext,
  PlainObjectExpression,
  ArrayExpression,
  StringExpression
} from '../types'

import {
  $$VALUE,
  $value
} from './value'

import {
  $matches
} from './comparison'

export const $objectMatches = (
  context:EvaluationContext,
  criteriaByPathExp:PlainObjectExpression,
  valueExp:PlainObjectExpression = $$VALUE
):boolean => {
  const value = evaluatePlainObject(context, valueExp)
  const criteriaByPath = evaluatePlainObject(context, criteriaByPathExp)

  const paths = Object.keys(criteriaByPath)

  if (paths.length === 0) {
    throw new Error(`Invalid criteriaByPathExp: ${JSON.stringify(criteriaByPathExp)}`)
  }

  return paths.every(path => {
    //
    // pathCriteria is either:
    // - a literal value to be compared against (array, string, number)
    // - or an expression to be evaluated against the value
    //
    const pathCriteria = isPlainObject(criteriaByPath[path])
      ? criteriaByPath[path]
      : { $eq: criteriaByPath[path] }

    return $matches({
      ...context,
      data: { $$VALUE: get(value, path) }
    }, pathCriteria)
  })
}

export const $objectKeyValue = (
  context:EvaluationContext,
  objectExp:PlainObjectExpression,
  pathExp:StringExpression = $$VALUE
):any => get(
  evaluatePlainObject(context, objectExp),
  evaluateString(context, pathExp)
)

export const $objectFormat = (
  context:EvaluationContext,
  formatExp:PlainObjectExpression,
  sourceExp:Expression = $$VALUE
):{ [key: string]: any } => {
  const format = evaluatePlainObject(context, formatExp)
  const source = evaluate(context, sourceExp)

  const targetPaths = Object.keys(format)

  return targetPaths.reduce((acc, targetPath) => {
    set(acc, targetPath, get(source, format[targetPath]))

    return acc
  }, {})
}

export const $objectDefault = (
  context:EvaluationContext,
  defaultExp:PlainObjectExpression,
  sourceExp:PlainObjectExpression = $$VALUE
):{ [key: string]: any } => {
  const defaultValue = evaluatePlainObject(context, defaultExp)
  const source = evaluatePlainObject(context, sourceExp)

  return {
    ...defaultValue,
    ...source
  }
}

export const $objectExtend = (
  context:EvaluationContext,
  extensionExp:PlainObjectExpression,
  sourceExp:PlainObjectExpression = $$VALUE
):{ [key: string]: any } => {
  const extension = evaluatePlainObject(context, extensionExp)
  const source = evaluatePlainObject(context, sourceExp)

  return {
    ...source,
    ...extension
  }
}

export {
  $value
}
