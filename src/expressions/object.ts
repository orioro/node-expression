import { get, set, isPlainObject } from 'lodash'

import { evaluate, isExpression, interpreter } from '../expression'

import { objectDeepApplyDefaults } from '../util/deepApplyDefaults'
import { objectDeepAssign } from '../util/deepAssign'

import { EvaluationContext, PlainObject } from '../types'

import { $matches } from './comparison'

/**
 * @function $objectMatches
 * @param {Object} criteriaByPath
 * @param {Object} [value=$$VALUE]
 * @returns {Boolean} matches
 */
export const $objectMatches = interpreter(
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

      return $matches(
        {
          ...context,
          scope: { $$VALUE: get(value, path) },
        },
        pathCriteria
      )
    })
  },
  ['object', 'object']
)

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
export const $objectFormat = interpreter(
  (
    format: PlainObject | any[],
    source: any,
    context: EvaluationContext
  ): PlainObject | any[] => {
    return Array.isArray(format)
      ? _formatArray(context, format, source)
      : _formatObject(context, format, source)
  },
  [['object', 'array'], 'any']
)

/**
 * @function $objectDefaults
 * @param {Object} defaultValuesExp
 * @param {Object} [base=$$VALUE]
 * @returns {Object}
 */
export const $objectDefaults = interpreter(
  (defaultValues: PlainObject, base: PlainObject): PlainObject =>
    objectDeepApplyDefaults(base, defaultValues),
  ['object', 'object']
)

/**
 * @function $objectAssign
 * @param {Object} values
 * @param {Object} [base=$$VALUE]
 * @returns {Object}
 */
export const $objectAssign = interpreter(
  (values: PlainObject, base: PlainObject): PlainObject =>
    objectDeepAssign(base, values),
  ['object', 'object']
)

export const OBJECT_EXPRESSIONS = {
  $objectMatches,
  $objectFormat,
  $objectDefaults,
  $objectAssign,
}
