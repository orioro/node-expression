import { get, set, isPlainObject } from 'lodash'

import { evaluate, isExpression } from '../evaluate'

import { $objectFormatSync, $objectFormatAsync } from './object/objectFormat'

import { objectDeepApplyDefaults } from '../util/deepApplyDefaults'
import { objectDeepAssign } from '../util/deepAssign'

import { EvaluationContext, PlainObject, InterpreterSpec } from '../types'

/**
 * @function $objectMatches
 * @param {Object} criteriaByPath
 * @param {Object} [value=$$VALUE]
 * @returns {Boolean} matches
 */
export const $objectMatches: InterpreterSpec = [
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

    return evaluate(context, [
      '$and',
      paths.map((path) => [
        '$matches',
        isPlainObject(criteriaByPath[path])
          ? criteriaByPath[path]
          : { $eq: criteriaByPath[path] },
        get(value, path),
      ]),
    ])

    // return paths.every((path) => {
    //   //
    //   // pathCriteria is either:
    //   // - a literal value to be compared against (array, string, number)
    //   // - or an expression to be evaluated against the value
    //   //
    //   const pathCriteria = isPlainObject(criteriaByPath[path])
    //     ? criteriaByPath[path]
    //     : { $eq: criteriaByPath[path] }

    //   return evaluate(
    //     {
    //       ...context,
    //       scope: { $$VALUE: get(value, path) },
    //     },
    //     ['$matches', pathCriteria]
    //   )
    // })
  },
  ['object', 'object'],
]

/**
 * @function $objectFormat
 * @param {Object | Array} format
 * @param {*} [source=$$VALUE]
 * @returns {Object | Array} object
 */
export const $objectFormat = {
  sync: $objectFormatSync,
  async: $objectFormatAsync,
}

/**
 * @function $objectDefaults
 * @param {Object} defaultValuesExp
 * @param {Object} [base=$$VALUE]
 * @returns {Object}
 */
export const $objectDefaults: InterpreterSpec = [
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
export const $objectAssign: InterpreterSpec = [
  (values: PlainObject, base: PlainObject): PlainObject =>
    objectDeepAssign(base, values),
  ['object', 'object'],
]

/**
 * @function $objectKeys
 * @param {Object} object
 * @returns {String[]}
 */
export const $objectKeys: InterpreterSpec = [
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
