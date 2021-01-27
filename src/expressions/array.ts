import {
  get
} from 'lodash'

import {
  interpreter,
  evaluate,
  evaluateArray,
  evaluateNumber,
  evaluateString
} from '../expression'

import { formatParseItem } from '../util/formatParseItem'
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
 * @name $arrayIncludes
 * @param {*} searchValueExp
 * @param {Array} [arrayExp=$$VALUE]
 * @return {boolean} includes
 */
export const $arrayIncludes = (
  context:EvaluationContext,
  searchValueExp:any,
  arrayExp:ArrayExpression = $$VALUE
):boolean => {
  const value = evaluate(context, searchValueExp)
  const array = evaluateArray(context, arrayExp)

  return array.includes(value)
}

/**
 * Similar to `$arrayIncludes`, but receives an array
 * of values to be searched for and returns whether the
 * context array contains all of the searched values.
 *
 * @name $arrayIncludesAll
 * @param {Array} searchValuesExp
 * @param {Array} [arrayExp=$$VALUE]
 * @return {boolean} includesAll
 */
export const $arrayIncludesAll = (
  context:EvaluationContext,
  searchValuesExp:any,
  arrayExp:ArrayExpression = $$VALUE
):boolean => {
  const values = evaluateArray(context, searchValuesExp)
  const array = evaluateArray(context, arrayExp)

  return values.every(value => array.includes(value))
}

/**
 * Similar to `$arrayIncludes`, but returns true if
 * any of the searched values is in the array.
 *
 * @name $arrayIncludesAny
 * @param {Array} searchValueExp
 * @param {Array} [arrayExp=$$VALUE]
 * @return {boolean} includesAny
 */
export const $arrayIncludesAny = (
  context:EvaluationContext,
  searchValuesExp:any,
  arrayExp:ArrayExpression = $$VALUE
):boolean => {
  const values = evaluateArray(context, searchValuesExp)
  const array = evaluateArray(context, arrayExp)

  return values.some(value => array.includes(value))
}

/**
 * @name $arrayLength
 * @param {Array} [arrayExp=$$VALUE]
 * @return {number} length
 */
export const $arrayLength = interpreter((
  array:any[]
):number => array.length, [
  evaluateArray
])

/**
 * @name $arrayReduce
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
  evaluateArray(context, arrayExp)
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
  evaluateArray(context, arrayExp)[method](($$VALUE, $$INDEX, $$ARRAY) => {
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
 * @name $arrayMap
 * @param {Expression} mapExp Expression to be evaluated for each
 *                            item and which return value will be
 *                            available in the resulting array. Has
 *                            access to: `$$PARENT_SCOPE`, `$$VALUE`,
 *                            `$$INDEX`, `$$ARRAY`, `$$ACC`
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arrayMap = _arrayIterator('map')
// export const $arrayEvery = _arrayIterator('every') remove in favor of logical $and
// export const $arraySome = _arrayIterator('some') remove in favor of logical $or

/**
 * @name $arrayFilter
 * @param {BooleanExpression} queryExp
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arrayFilter = _arrayIterator('filter')

/**
 * @name $arrayIndexOf
 * @param {BooleanExpression} queryExp
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arrayIndexOf = _arrayIterator('findIndex')

/**
 * @name $arrayFind
 * @param {BooleanExpression} queryExp
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arrayFind = _arrayIterator('find')

/**
 * @name $arrayReverse
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arrayReverse = (
  context:EvaluationContext,
  arrayExp:ArrayExpression = $$VALUE
) => {
  const arr = evaluateArray(context, arrayExp).slice()
  arr.reverse()
  return arr
}

/**
 * @name $arraySort
 * @param {number} sortExp
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arraySort = (
  context:EvaluationContext,
  sortExp:any,
  arrayExp:ArrayExpression = $$VALUE
) => {
  const arr = evaluateArray(context, arrayExp).slice()

  if (sortExp === undefined) {
    arr.sort()
  } else {
    arr.sort(($$SORT_A, $$SORT_B) => evaluateNumber({
      ...context,
      scope: { $$SORT_A, $$SORT_B }
    }, sortExp))
  }

  return arr
}

/**
 * @name $arrayPush
 * @param {*} valueExp
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arrayPush = (
  context:EvaluationContext,
  valueExp:any,
  arrayExp:ArrayExpression = $$VALUE
) => ([
  ...evaluateArray(context, arrayExp),
  evaluate(context, valueExp)
])

/**
 * @name $arrayPush
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arrayPop = (
  context:EvaluationContext,
  arrayExp:ArrayExpression = $$VALUE
) => {
  const arr = evaluateArray(context, arrayExp)
  return arr.slice(0, arr.length - 1)
}

/**
 * @name $arrayUnshift
 * @param {*} valueExp
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arrayUnshift = (
  context:EvaluationContext,
  valueExp:any,
  arrayExp:ArrayExpression = $$VALUE
) => ([
  evaluate(context, valueExp),
  ...evaluateArray(context, arrayExp)
])

/**
 * @name $arrayShift
 * @param {Array} [arrayExp=$$VALUE]
 */
export const $arrayShift = (
  context:EvaluationContext,
  arrayExp:ArrayExpression = $$VALUE
) => {
  const arr = evaluateArray(context, arrayExp)
  return arr.slice(1, arr.length)
}

/**
 * @name $arraySlice
 * @param {number} startExp
 * @param {number} endExp
 * @param {Array} [arrayExp=$$VALUE]
 * @return {Array}
 */
export const $arraySlice = (
  context:EvaluationContext,
  startExp:NumberExpression,
  endExp:NumberExpression,
  arrayExp:ArrayExpression = $$VALUE
) => {
  return evaluateArray(context, arrayExp)
    .slice(
      evaluateNumber(context, startExp),
      evaluateNumber(context, endExp)
    )
}

/**
 * @name $arraySubstitute
 * @param {number} startExp
 * @param {number} endExp
 * @param {Array} valuesExp
 * @param {Array} [arrayExp=$$VALUE]
 * @return {Array}
 */
export const $arraySubstitute = (
  context:EvaluationContext,
  startExp:any,
  endExp:any,
  valuesExp:ArrayExpression,
  arrayExp:ArrayExpression = $$VALUE
) => {
  const array = evaluateArray(context, arrayExp)
  const start = evaluateNumber(context, startExp)
  const end = evaluateNumber(context, endExp)
  const values = evaluateArray(context, valuesExp)

  return [
    ...array.slice(0, start),
    ...values,
    ...array.slice(end)
  ]
}

/**
 * Adds items at the given position.
 * 
 * @name $arrayAddAt
 * @param {number} indexExp
 * @param {Array} valuesExp
 * @param {Array} [arrayExp=$$VALUE]
 * @return {Array} resultingArray The array with items added at position
 */
export const $arrayAddAt = (
  context:EvaluationContext,
  indexExp:any,
  valuesExp:any,
  arrayExp:ArrayExpression = $$VALUE
) => {
  const array = evaluateArray(context, arrayExp)
  const index = evaluateNumber(context, indexExp)
  const values = evaluateArray(context, valuesExp)

  return [
    ...array.slice(0, index),
    ...values,
    ...array.slice(index)
  ]
}

/**
 * @name $arrayRemoveAt
 * @param {number} indexExp
 * @param {number} [countExp=1]
 * @param {Array} [arrayExp=$$VALUE]
 * @return {Array} resultingArray The array without the removed item
 */
export const $arrayRemoveAt = (
  context:EvaluationContext,
  indexExp:any,
  countExp:any = 1,
  arrayExp:ArrayExpression = $$VALUE
) => {
  const array = evaluateArray(context, arrayExp)
  const position = evaluateNumber(context, indexExp)
  const count = evaluateNumber(context, countExp)

  return [
    ...array.slice(0, position),
    ...array.slice(position + count)
  ]
}

/**
 * @name $arrayJoin
 * @param {StringExpression} separatorExp
 * @param {Array} [arrayExp=$$VALUE]
 * @return {string}
 */
export const $arrayJoin = (
  context:EvaluationContext,
  separatorExp:any = '',
  arrayExp:ArrayExpression = $$VALUE
) => (
  evaluateArray(context, arrayExp)
    .join(evaluateString(context, separatorExp))
)

/**
 * @name $arrayAt
 * @param {number} indexExp
 * @param {Array} [arrayExp=$$VALUE]
 * @return {*} value
 */
export const $arrayAt = (
  context:EvaluationContext,
  indexExp:NumberExpression,
  arrayExp:ArrayExpression = $$VALUE
) => {
  const array = evaluateArray(context, arrayExp)

  return array[evaluateNumber(context, indexExp)]
}

export const ARRAY_EXPRESSIONS = {
  $arrayIncludes,
  $arrayIncludesAll,
  $arrayIncludesAny,
  $arrayLength,
  $arrayReduce,
  $arrayMap,
  $arrayFilter,
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
