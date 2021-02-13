import { interpreter, evaluate, evaluateTyped } from '../expression'
import { EvaluationContext, Expression } from '../types'

export const $$INDEX = ['$value', '$$INDEX']
export const $$ARRAY = ['$value', '$$ARRAY']
export const $$ACC = ['$value', '$$ACC']
export const $$SORT_A = ['$value', '$$SORT_A']
export const $$SORT_B = ['$value', '$$SORT_B']

/**
 * Equivalent of `Array.prototype.includes`.
 *
 * @function $arrayIncludes
 * @param {*} searchValue
 * @param {Array} [array=$$VALUE]
 * @returns {boolean} includes
 */
export const $arrayIncludes = interpreter(
  (search: any, array: any[]): boolean => array.includes(search),
  ['any', 'array']
)

/**
 * Similar to `$arrayIncludes`, but receives an array
 * of values to be searched for and returns whether the
 * context array contains all of the searched values.
 *
 * @function $arrayIncludesAll
 * @param {Array} searchValues
 * @param {Array} [array=$$VALUE]
 * @returns {boolean} includesAll
 */
export const $arrayIncludesAll = interpreter(
  (search: any[], array: any[]): boolean =>
    search.every((value) => array.includes(value)),
  ['array', 'array']
)

/**
 * Similar to `$arrayIncludes`, but returns true if
 * any of the searched values is in the array.
 *
 * @function $arrayIncludesAny
 * @param {Array} searchValue
 * @param {Array} [array=$$VALUE]
 * @returns {boolean} includesAny
 */
export const $arrayIncludesAny = interpreter(
  (search: any[], array: any[]): boolean =>
    search.some((value) => array.includes(value)),
  ['array', 'array']
)

/**
 * @function $arrayLength
 * @param {Array} [array=$$VALUE]
 * @returns {number} length
 */
export const $arrayLength = interpreter(
  (array: any[]): number => array.length,
  ['array']
)

/**
 * @function $arrayReduce
 * @param {Expression} reduceExp An expression that returns the
 *                               result of reduction. Has access to:
 *                               `$$PARENT_SCOPE`, `$$VALUE`, `$$INDEX`,
 *                               `$$ARRAY`, `$$ACC`
 * @param {*} start
 * @param {Array} [array=$$VALUE]
 */
export const $arrayReduce = interpreter(
  (reduceExp: Expression, start: any, array: any[], context): any =>
    array.reduce(
      ($$ACC, $$VALUE, $$INDEX, $$ARRAY) =>
        evaluate(
          {
            ...context,
            scope: {
              $$PARENT_SCOPE: context.scope,
              $$VALUE,
              $$INDEX,
              $$ARRAY,
              $$ACC,
            },
          },
          reduceExp
        ),
      start
    ),
  [null, 'any', 'array']
)

const _arrayIterator = (method: string) =>
  interpreter(
    (iteratorExp: Expression, array: any[], context: EvaluationContext): any =>
      array[method](($$VALUE, $$INDEX, $$ARRAY) =>
        evaluate(
          {
            ...context,
            scope: {
              $$PARENT_SCOPE: context.scope,
              $$VALUE,
              $$INDEX,
              $$ARRAY,
            },
          },
          iteratorExp
        )
      ),
    [null, 'array']
  )

/**
 * @function $arrayMap
 * @param {Expression} mapExp Expression to be evaluated for each
 *                            item and which return value will be
 *                            available in the resulting array. Has
 *                            access to: `$$PARENT_SCOPE`, `$$VALUE`,
 *                            `$$INDEX`, `$$ARRAY`, `$$ACC`
 * @param {Array} [array=$$VALUE]
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
 * @param {Array} [array=$$VALUE]
 */
export const $arrayEvery = _arrayIterator('every')

/**
 * `Array.prototype.some`
 *
 * @function $arraySome
 * @param {Expression} someExp
 * @param {Array} [array=$$VALUE]
 */
export const $arraySome = _arrayIterator('some')

/**
 * @function $arrayFilter
 * @param {BooleanExpression} queryExp
 * @param {Array} [array=$$VALUE]
 */
export const $arrayFilter = _arrayIterator('filter')

/**
 * @function $arrayFindIndex
 * @param {BooleanExpression} queryExp
 * @param {Array} [array=$$VALUE]
 */
export const $arrayFindIndex = _arrayIterator('findIndex')

/**
 * @function $arrayIndexOf
 * @param {*} value
 * @param {Array} [array=$$VALUE]
 */
export const $arrayIndexOf = interpreter(
  (value: any, array: any[]): number => array.indexOf(value),
  ['any', 'array']
)

/**
 * @function $arrayFind
 * @param {BooleanExpression} queryExp
 * @param {Array} [array=$$VALUE]
 */
export const $arrayFind = _arrayIterator('find')

/**
 * @function $arrayReverse
 * @param {Array} [array=$$VALUE]
 */
export const $arrayReverse = interpreter(
  (array: any[]): any[] => {
    const arr = array.slice()
    arr.reverse()
    return arr
  },
  ['array']
)

/**
 * @todo array Improve ease of use of the sorting comparison expression.
 *
 * @function $arraySort
 * @param {number} sortExp
 * @param {Array} [array=$$VALUE]
 */
export const $arraySort = interpreter(
  (sortExp: Expression, array: any[], context): any[] => {
    const arr = array.slice()

    if (sortExp === undefined) {
      arr.sort()
    } else {
      arr.sort(($$SORT_A, $$SORT_B) =>
        evaluateTyped(
          'number',
          {
            ...context,
            scope: { $$VALUE: null, $$SORT_A, $$SORT_B },
          },
          sortExp
        )
      )
    }

    return arr
  },
  [null, 'array']
)

/**
 * @function $arrayPush
 * @param {*} valueExp
 * @param {Array} [array=$$VALUE]
 */
export const $arrayPush = interpreter(
  (value: any, array: any[]): any[] => [...array, value],
  ['any', 'array']
)

/**
 * @function $arrayPop
 * @param {Array} [array=$$VALUE]
 */
export const $arrayPop = interpreter(
  (array: any[]) => array.slice(0, array.length - 1),
  ['array']
)

/**
 * @function $arrayUnshift
 * @param {*} valueExp
 * @param {Array} [array=$$VALUE]
 */
export const $arrayUnshift = interpreter(
  (value: any, array: any[]): any[] => [value, ...array],
  ['any', 'array']
)

/**
 * @function $arrayShift
 * @param {Array} [array=$$VALUE]
 */
export const $arrayShift = interpreter(
  (array: any[]): any[] => array.slice(1, array.length),
  ['array']
)

/**
 * @function $arraySlice
 * @param {number} start
 * @param {number} end
 * @param {Array} [array=$$VALUE]
 * @returns {Array}
 */
export const $arraySlice = interpreter(
  (start: number, end: number, array: any[]): any[] => array.slice(start, end),
  ['number', 'number', 'array']
)

/**
 * @function $arraySubstitute
 * @param {number} start
 * @param {number} end
 * @param {Array} values
 * @param {Array} [array=$$VALUE]
 * @returns {Array}
 */
export const $arraySubstitute = interpreter(
  (start: number, end: number, insertValues: any[], array: any[]): any[] => [
    ...array.slice(0, start),
    ...insertValues,
    ...array.slice(end),
  ],
  ['number', 'number', 'array', 'array']
)

/**
 * Adds items at the given position.
 *
 * @todo array Merge with $arraySubstitute, overloading index parameter: number or [number, number]
 *
 * @function $arrayAddAt
 * @param {number} index
 * @param {Array} values
 * @param {Array} [array=$$VALUE]
 * @returns {Array} resultingArray The array with items added at position
 */
export const $arrayAddAt = interpreter(
  (index: number, values: any[], array: any[]) => [
    ...array.slice(0, index),
    ...values,
    ...array.slice(index),
  ],
  ['number', 'array', 'array']
)

/**
 * @todo array Merge with $arraySubstitue and $arrayAddAt
 *
 * @function $arrayRemoveAt
 * @param {number} index
 * @param {number} [countExp=1]
 * @param {Array} [array=$$VALUE]
 * @returns {Array} resultingArray The array without the removed item
 */
export const $arrayRemoveAt = interpreter(
  (position: number, count: number = 1, array: any[]): any[] => [
    ...array.slice(0, position),
    ...array.slice(position + count),
  ],
  ['number', ['number', 'undefined'], 'array']
)

/**
 * @function $arrayJoin
 * @param {String} separator
 * @param {Array} [array=$$VALUE]
 * @returns {string}
 */
export const $arrayJoin = interpreter(
  (separator: string = '', array: any[]): string => array.join(separator),
  [['string', 'undefined'], 'array']
)

/**
 * @function $arrayAt
 * @param {number} index
 * @param {Array} [array=$$VALUE]
 * @returns {*} value
 */
export const $arrayAt = interpreter(
  (index: number, array: any[]): any => array[index],
  ['number', 'array']
)

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
  $arrayAt,
}
