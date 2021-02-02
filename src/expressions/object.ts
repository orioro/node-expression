import { get, set, isPlainObject } from 'lodash'

import {
  evaluate,
  evaluatePlainObject,
  evaluatePlainObjectOrArray,
  evaluateString,
  evaluateArray,
  isExpression
} from '../expression'

import { formatParseItem } from '../util/formatParseItem'
import { objectDeepApplyDefaults } from '../util/deepApplyDefaults'
import { objectDeepAssign } from '../util/deepAssign'

import {
  Expression,
  EvaluationContext,
  PlainObjectExpression,
  ArrayExpression,
  StringExpression
} from '../types'

import { $$VALUE } from './value'

import {
  $matches
} from './comparison'

/**
 * @function $objectMatches
 * @param {Object} criteriaByPathExp
 * @param {Object} [valueExp=$$VALUE]
 * @return {boolean} matches
 */
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
      scope: { $$VALUE: get(value, path) }
    }, pathCriteria)
  })
}

const _formatEvaluate = (context, targetValue, source) => {
  targetValue = typeof targetValue === 'string'
    ? ['$value', targetValue]
    : targetValue

  if (isExpression(context.interpreters, targetValue)) {
    return evaluate({
      ...context,
      scope: { $$VALUE: source }
    }, targetValue)
  } else if (Array.isArray(targetValue)) {
    return _formatArray(context, targetValue, source)
  } else if (isPlainObject(targetValue)) {
    return _formatObject(context, targetValue, source)
  } else {
    throw `Invalid $objectFormat item: ${targetValue}`
  }
}

const _formatArray = (
  context:EvaluationContext,
  format:any[],
  source:any
):any[] => format.map(targetValue => _formatEvaluate(
  context,
  targetValue,
  source
))

type PlainObject = { [key:string]: any }

const _formatObject = (
  context:EvaluationContext,
  format:PlainObject,
  source:any
):PlainObject => {
  const targetPaths = Object.keys(format)

  return targetPaths.reduce((acc, targetPath) => {
    set(
      acc,
      targetPath,
      _formatEvaluate(context, format[targetPath], source)
    )

    return acc
  }, {})
}

/**
 * @function $objectFormat
 * @param {Object | Array} formatExp
 * @param {*} [sourceExp=$$VALUE]
 * @return {Object | Array} object
 */
export const $objectFormat = (
  context:EvaluationContext,
  formatExp:(PlainObjectExpression | ArrayExpression),
  sourceExp:Expression = $$VALUE
):(PlainObject | any[]) => {
  const format = evaluatePlainObjectOrArray(context, formatExp)
  const source = evaluate(context, sourceExp)

  return Array.isArray(format)
    ? _formatArray(context, format, source)
    : _formatObject(context, format, source)
}

/**
 * @function $objectDefaults
 * @param {Object} defaultValuesExp
 * @param {Object} [baseExp=$$VALUE]
 * @return {Object}
 */
export const $objectDefaults = (
  context:EvaluationContext,
  defaultValuesExp:PlainObjectExpression,
  baseExp:PlainObjectExpression = $$VALUE
):{ [key: string]: any } => {
  const defaultValues = evaluatePlainObject(context, defaultValuesExp)
  const base = evaluatePlainObject(context, baseExp)

  return objectDeepApplyDefaults(base, defaultValues)
}

/**
 * @function $objectAssign
 * @param {Object} valuesExp
 * @param {Object} [baseExp=$$VALUE]
 * @return {Object}
 */
export const $objectAssign = (
  context:EvaluationContext,
  valuesExp:PlainObjectExpression,
  baseExp:PlainObjectExpression = $$VALUE
):{ [key: string]: any } => {
  const values = evaluatePlainObject(context, valuesExp)
  const base = evaluatePlainObject(context, baseExp)

  return objectDeepAssign(base, values)
}

export const OBJECT_EXPRESSIONS = {
  $objectMatches,
  $objectFormat,
  $objectDefaults,
  $objectAssign
}
