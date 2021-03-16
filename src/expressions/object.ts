import { get, isPlainObject } from 'lodash'

import { evaluate } from '../evaluate'

import { $objectFormatSync, $objectFormatAsync } from './object/objectFormat'

import { objectDeepApplyDefaults } from '../util/deepApplyDefaults'
import { objectDeepAssign } from '../util/deepAssign'

import { EvaluationContext, PlainObject, InterpreterSpec } from '../types'

import { indefiniteObjectOfType } from '@orioro/typing'

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
  },
  [indefiniteObjectOfType('any'), indefiniteObjectOfType('any')],
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
  [indefiniteObjectOfType('any'), indefiniteObjectOfType('any')],
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
  [indefiniteObjectOfType('any'), indefiniteObjectOfType('any')],
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
