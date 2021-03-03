import { get, set, isPlainObject } from 'lodash'

import { evaluate, isExpression } from '../evaluate'

import { objectDeepApplyDefaults } from '../util/deepApplyDefaults'
import { objectDeepAssign } from '../util/deepAssign'

import {
  EvaluationContext,
  PlainObject,
  ExpressionInterpreterSpec,
} from '../types'

/**
 * @function $objectMatches
 * @param {Object} criteriaByPath
 * @param {Object} [value=$$VALUE]
 * @returns {Boolean} matches
 */
export const $objectMatches: ExpressionInterpreterSpec = [
  (
    criteriaByPath: PlainObject,
    value: PlainObject,
    context: EvaluationContext
  ): boolean => {
    const paths = Object.keys(criteriaByPath)

    if (paths.length === 0) {
      throw new Error(
        `Invalid criteriaByPath: ${JSON.stringify(criteriaByPath)}`
      )
    }

    return paths.every((path) => {
      //
      // pathCriteria is either:
      // - a literal value to be compared against (array, string, number)
      // - or an expression to be evaluated against the value
      //
      const pathCriteria = isPlainObject(criteriaByPath[path])
        ? criteriaByPath[path]
        : { $eq: criteriaByPath[path] }

      return evaluate(
        {
          ...context,
          scope: { $$VALUE: get(value, path) },
        },
        ['$matches', pathCriteria]
      )
    })
  },
  ['object', 'object'],
]

const _formatEvaluate = (context, targetValue, source) => {
  targetValue =
    typeof targetValue === 'string' ? ['$value', targetValue] : targetValue

  if (isExpression(context.interpreters, targetValue)) {
    return evaluate(
      {
        ...context,
        scope: { $$VALUE: source },
      },
      targetValue
    )
  } else if (Array.isArray(targetValue)) {
    return _formatArray(context, targetValue, source)
  } else if (isPlainObject(targetValue)) {
    return _formatObject(context, targetValue, source)
  } else {
    throw `Invalid $objectFormat item: ${targetValue}`
  }
}

const _formatArray = (
  context: EvaluationContext,
  format: any[],
  source: any
): any[] =>
  format.map((targetValue) => _formatEvaluate(context, targetValue, source))

const _formatObject = (
  context: EvaluationContext,
  format: PlainObject,
  source: any
): PlainObject => {
  const targetPaths = Object.keys(format)

  return targetPaths.reduce((acc, targetPath) => {
    set(acc, targetPath, _formatEvaluate(context, format[targetPath], source))

    return acc
  }, {})
}

/**
 * @function $objectFormat
 * @param {Object | Array} format
 * @param {*} [source=$$VALUE]
 * @returns {Object | Array} object
 */
export const $objectFormat: ExpressionInterpreterSpec = [
  (
    format: PlainObject | any[],
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    source: any,
    context: EvaluationContext
  ): PlainObject | any[] => {
    return Array.isArray(format)
      ? _formatArray(context, format, source)
      : _formatObject(context, format, source)
  },
  [['object', 'array'], 'any'],
]

/**
 * @function $objectDefaults
 * @param {Object} defaultValuesExp
 * @param {Object} [base=$$VALUE]
 * @returns {Object}
 */
export const $objectDefaults: ExpressionInterpreterSpec = [
  (defaultValues: PlainObject, base: PlainObject): PlainObject =>
    objectDeepApplyDefaults(base, defaultValues),
  ['object', 'object'],
]

/**
 * @function $objectAssign
 * @param {Object} values
 * @param {Object} [base=$$VALUE]
 * @returns {Object}
 */
export const $objectAssign: ExpressionInterpreterSpec = [
  (values: PlainObject, base: PlainObject): PlainObject =>
    objectDeepAssign(base, values),
  ['object', 'object'],
]

/**
 * @function $objectKeys
 * @param {Object} object
 * @returns {String[]}
 */
export const $objectKeys: ExpressionInterpreterSpec = [
  (obj: PlainObject): string[] => Object.keys(obj),
  ['object'],
]

export const OBJECT_EXPRESSIONS = {
  $objectMatches,
  $objectFormat,
  $objectDefaults,
  $objectAssign,
  $objectKeys,
}
