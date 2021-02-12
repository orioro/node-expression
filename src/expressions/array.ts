import {
  get
} from 'lodash'

import {
  interpreter,
  evaluate,
  evaluateTyped
} from '../expression'

import { arrayDeepApplyDefaults } from '../util/deepApplyDefaults'

import {
  EvaluationContext,
  Expression,
  ArrayExpression,
  NumberExpression,
  StringExpression
} from '../types'

import {
  $$VALUE
} from './value'

export const $$INDEX = ['$value', '$$INDEX']
export const $$ARRAY = ['$value', '$$ARRAY']
export const $$ACC = ['$value', '$$ACC']
export const $$SORT_A = ['$value', '$$SORT_A']
export const $$SORT_B = ['$value', '$$SORT_B']

/**
 * Equivalent of `Array.prototype.includes`.
 * 
 * @function $arrayIncludes
 * @param {*} searchValueExp
 * @param {Array} [arrayExp=$$VALUE]
 * @returns {boolean} includes
 */
export const $arrayIncludes = (
  context:EvaluationContext,
  searchValueExp:any,
  arrayExp:ArrayExpression = $$VALUE
):boolean => {
  const value = evaluate(context, searchValueExp)
  const array = evaluateTyped('array', context, arrayExp)

  return array.includes(value)
}

/**
 * Similar to `$arrayIncludes`, but receives an array
 * of values to be searched for and returns whether the
 * context array contains all of the searched values.
 *
 * @function $arrayIncludesAll
 * @param {Array} searchValuesExp
 * @param {Array} [arrayExp=$$VALUE]
 * @returns {boolean} includesAll
 */
export const $arrayIncludesAll = (
  context:EvaluationContext,
  searchValuesExp:any,
  arrayExp:ArrayExpression = $$VALUE
):boolean => {
  const values = evaluateTyped('array', context, searchValuesExp)
  const array = evaluateTyped('array', context, arrayExp)

  return values.every(value => array.includes(value))
}

/**
 * Similar to `$arrayIncludes`, but returns true if
 * any of the searched values is in the array.
 *
 * @function $arrayIncludesAny
 * @param {Array} searchValueExp
 * @param {Array} [arrayExp=$$VALUE]
 * @returns {boolean} includesAny
 */
export const $arrayIncludesAny = (
  context:EvaluationContext,
  searchValuesExp:any,
  arrayExp:ArrayExpression = $$VALUE
):boolean => {
  const values = evaluateTyped('array', context, searchValuesExp)
  const array = evaluateTyped('array', context, arrayExp)

  return values.some(value => array.includes(value))
}

/**
 * @function $arrayLength
 * @param {Array} [arrayExp=$$VALUE]
 * @returns {number} length
 */
export const $arrayLength = interpreter((
  array:any[]
):number => array.length, [
  evaluateTyped.bind(null, 'array')
])

/**
 * @function $arrayReduce
 * @param {Expression} reduceExp An expression that returns the
 *                               result of reduction. Has access to:
 *                               `$$PARENT_SCOPE`, `$$VALUE`, `$$INDEX`,
 *                               `$$ARRAY`, `$$ACC`
 * @param {*} startExp
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arrayReduce = (
  context:EvaluationContext,
  reduceExp:any,
  startExp:any,
  arrayExp:ArrayExpression = $$VALUE
):any => (
  evaluateTyped('array', context, arrayExp)
    .reduce(($$ACC, $$VALUE, $$INDEX, $$ARRAY) => {
      return evaluate({
        ...context,
        scope: {
          $$PARENT_SCOPE: context.scope,
          $$VALUE,
          $$INDEX,
          $$ARRAY,
          $$ACC
        }
      }, reduceExp)
    }, evaluate(context, startExp))
)

const _arrayIterator = (method:string) => (
  context:EvaluationContext,
  iteratorExp:any,
  arrayExp:ArrayExpression = $$VALUE
) => (
  evaluateTyped('array', context, arrayExp)[method](($$VALUE, $$INDEX, $$ARRAY) => {
    return evaluate({
      ...context,
      scope: {
        $$PARENT_SCOPE: context.scope,
        $$VALUE,
        $$INDEX,
        $$ARRAY
      }
    }, iteratorExp)
  })
)

/**
 * @function $arrayMap
 * @param {Expression} mapExp Expression to be evaluated for each
 *                            item and which return value will be
 *                            available in the resulting array. Has
 *                            access to: `$$PARENT_SCOPE`, `$$VALUE`,
 *                            `$$INDEX`, `$$ARRAY`, `$$ACC`
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arrayMap = _arrayIterator('map')

/**
 * `Array.prototype.every`
 * 
 * Result is similar to logical operator `$and`. Main difference
 * (and reason for existence as isolate expression) is that
 * $arrayEvery exposes array iteration variables:
 * `$$PARENT_SCOPE`, `$$VALUE`, `$$INDEX`, `$$ARRAY`
 * 
 * @function $arrayEvery
 * @param {Expression} everyExp
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arrayEvery = _arrayIterator('every')

/**
 * `Array.prototype.some`
 * 
 * @function $arraySome
 * @param {Expression} someExp
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arraySome = _arrayIterator('some')

/**
 * @function $arrayFilter
 * @param {BooleanExpression} queryExp
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arrayFilter = _arrayIterator('filter')

/**
 * @function $arrayFindIndex
 * @param {BooleanExpression} queryExp
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arrayFindIndex = _arrayIterator('findIndex')

/**
 * @function $arrayIndexOf
 * @param {*} value
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arrayIndexOf = (
  context:EvaluationContext,
  valueExp:Expression,
  arrayExp:ArrayExpression = $$VALUE
):number => evaluateTyped('array', context, arrayExp).indexOf(evaluate(context, valueExp))

/**
 * @function $arrayFind
 * @param {BooleanExpression} queryExp
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arrayFind = _arrayIterator('find')

/**
 * @function $arrayReverse
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arrayReverse = (
  context:EvaluationContext,
  arrayExp:ArrayExpression = $$VALUE
) => {
  const arr = evaluateTyped('array', context, arrayExp).slice()
  arr.reverse()
  return arr
}

/**
 * @todo array Improve ease of use of the sorting comparison expression.
 * 
 * @function $arraySort
 * @param {number} sortExp
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arraySort = (
  context:EvaluationContext,
  sortExp:any,
  arrayExp:ArrayExpression = $$VALUE
) => {
  const arr = evaluateTyped('array', context, arrayExp).slice()

  if (sortExp === undefined) {
    arr.sort()
  } else {
    arr.sort(($$SORT_A, $$SORT_B) => evaluateTyped('number', {
      ...context,
      scope: { $$VALUE: null, $$SORT_A, $$SORT_B }
    }, sortExp))
  }

  return arr
}

/**
 * @function $arrayPush
 * @param {*} valueExp
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arrayPush = (
  context:EvaluationContext,
  valueExp:any,
  arrayExp:ArrayExpression = $$VALUE
) => ([
  ...evaluateTyped('array', context, arrayExp),
  evaluate(context, valueExp)
])

/**
 * @function $arrayPush
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arrayPop = (
  context:EvaluationContext,
  arrayExp:ArrayExpression = $$VALUE
) => {
  const arr = evaluateTyped('array', context, arrayExp)
  return arr.slice(0, arr.length - 1)
}

/**
 * @function $arrayUnshift
 * @param {*} valueExp
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arrayUnshift = (
  context:EvaluationContext,
  valueExp:any,
  arrayExp:ArrayExpression = $$VALUE
) => ([
  evaluate(context, valueExp),
  ...evaluateTyped('array', context, arrayExp)
])

/**
 * @function $arrayShift
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arrayShift = (
  context:EvaluationContext,
  arrayExp:ArrayExpression = $$VALUE
) => {
  const arr = evaluateTyped('array', context, arrayExp)
  return arr.slice(1, arr.length)
}

/**
 * @function $arraySlice
 * @param {number} startExp
 * @param {number} endExp
 * @param {Array} [arrayExp=$$VALUE]
 * @returns {Array}
 */
export const $arraySlice = (
  context:EvaluationContext,
  startExp:NumberExpression,
  endExp:NumberExpression,
  arrayExp:ArrayExpression = $$VALUE
) => {
  return evaluateTyped('array', context, arrayExp)
    .slice(
      evaluateTyped('number', context, startExp),
      evaluateTyped('number', context, endExp)
    )
}

/**
 * @function $arraySubstitute
 * @param {number} startExp
 * @param {number} endExp
 * @param {Array} valuesExp
 * @param {Array} [arrayExp=$$VALUE]
 * @returns {Array}
 */
export const $arraySubstitute = (
  context:EvaluationContext,
  startExp:any,
  endExp:any,
  valuesExp:ArrayExpression,
  arrayExp:ArrayExpression = $$VALUE
) => {
  const array = evaluateTyped('array', context, arrayExp)
  const start = evaluateTyped('number', context, startExp)
  const end = evaluateTyped('number', context, endExp)
  const values = evaluateTyped('array', context, valuesExp)

  return [
    ...array.slice(0, start),
    ...values,
    ...array.slice(end)
  ]
}

/**
 * Adds items at the given position.
 * 
 * @function $arrayAddAt
 * @param {number} indexExp
 * @param {Array} valuesExp
 * @param {Array} [arrayExp=$$VALUE]
 * @returns {Array} resultingArray The array with items added at position
 */
export const $arrayAddAt = (
  context:EvaluationContext,
  indexExp:any,
  valuesExp:any,
  arrayExp:ArrayExpression = $$VALUE
) => {
  const array = evaluateTyped('array', context, arrayExp)
  const index = evaluateTyped('number', context, indexExp)
  const values = evaluateTyped('array', context, valuesExp)

  return [
    ...array.slice(0, index),
    ...values,
    ...array.slice(index)
  ]
}

/**
 * @function $arrayRemoveAt
 * @param {number} indexExp
 * @param {number} [countExp=1]
 * @param {Array} [arrayExp=$$VALUE]
 * @returns {Array} resultingArray The array without the removed item
 */
export const $arrayRemoveAt = (
  context:EvaluationContext,
  indexExp:any,
  countExp:any = 1,
  arrayExp:ArrayExpression = $$VALUE
) => {
  const array = evaluateTyped('array', context, arrayExp)
  const position = evaluateTyped('number', context, indexExp)
  const count = evaluateTyped('number', context, countExp)

  return [
    ...array.slice(0, position),
    ...array.slice(position + count)
  ]
}

/**
 * @function $arrayJoin
 * @param {StringExpression} separatorExp
 * @param {Array} [arrayExp=$$VALUE]
 * @returns {string}
 */
export const $arrayJoin = (
  context:EvaluationContext,
  separatorExp:any = '',
  arrayExp:ArrayExpression = $$VALUE
) => (
  evaluateTyped('array', context, arrayExp)
    .join(evaluateTyped('string', context, separatorExp))
)

/**
 * @function $arrayAt
 * @param {number} indexExp
 * @param {Array} [arrayExp=$$VALUE]
 * @returns {*} value
 */
export const $arrayAt = (
  context:EvaluationContext,
  indexExp:NumberExpression,
  arrayExp:ArrayExpression = $$VALUE
) => {
  const array = evaluateTyped('array', context, arrayExp)

  return array[evaluateTyped('number', context, indexExp)]
}

export const ARRAY_EXPRESSIONS = {
  $arrayIncludes,
  $arrayIncludesAll,
  $arrayIncludesAny,
  $arrayLength,
  $arrayReduce,
  $arrayMap,
  $arrayEvery,
  $arraySome,
  $arrayFilter,
  $arrayFindIndex,
  $arrayIndexOf,
  $arrayFind,
  $arrayReverse,
  $arraySort,
  $arrayPush,
  $arrayPop,
  $arrayUnshift,
  $arrayShift,
  $arraySlice,
  $arraySubstitute,
  $arrayAddAt,
  $arrayRemoveAt,
  $arrayJoin,
  $arrayAt
}
