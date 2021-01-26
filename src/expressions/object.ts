import { get, set, isPlainObject } from 'lodash'

import {
  evaluate,
  evaluatePlainObject,
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
 * @name $objectMatches
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

/**
 * @name $objectFormat
 * @param {Object} formatExp
 * @param {*} [sourceExp=$$VALUE]
 * @return {Object} object
 */
export const $objectFormat = (
  context:EvaluationContext,
  formatExp:PlainObjectExpression,
  sourceExp:Expression = $$VALUE
):{ [key: string]: any } => {
  const format = evaluatePlainObject(context, formatExp)
  const source = evaluate(context, sourceExp)

  const targetPaths = Object.keys(format)

  return targetPaths.reduce((acc, targetPath) => {
    set(
      acc,
      targetPath,
      evaluate({
        ...context,
        scope: { $$VALUE: source }
      }, formatParseItem(context.interpreters, format[targetPath]))
    )

    return acc
  }, {})
}

/**
 * @name $objectDefaults
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
 * @name $objectAssign
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
