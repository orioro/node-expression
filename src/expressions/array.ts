import {
  interpreter,
  evaluate,
  evaluateTyped,
  isExpression,
} from '../expression'
import { EvaluationContext, Expression } from '../types'
import { validateType } from '@orioro/validate-type'

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
 * @returns {Boolean} includes
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
 * @returns {Boolean} includesAll
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
 * @returns {Boolean} includesAny
 */
export const $arrayIncludesAny = interpreter(
  (search: any[], array: any[]): boolean =>
    search.some((value) => array.includes(value)),
  ['array', 'array']
)

/**
 * @function $arrayLength
 * @param {Array} [array=$$VALUE]
 * @returns {Number} length
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
 * @param {Boolean} queryExp
 * @param {Array} [array=$$VALUE]
 */
export const $arrayFilter = _arrayIterator('filter')

/**
 * @function $arrayFindIndex
 * @param {Boolean} queryExp
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
 * @param {Boolean} queryExp
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

const _sortDefault = (a, b) => {
  if (a === undefined) {
    return 1
  } else if (b === undefined) {
    return -1
  } else {
    a = String(a)
    b = String(b)
    return a < b ? -1 : a === b ? 0 : 1
  }
}

/**
 * @function $arraySort
 * @param {String | Expression | [Expression, string]} sort
 * @param {Array} [array=$$VALUE]
 */
export const $arraySort = interpreter(
  (
    sort: string | Expression | [Expression, string] = 'ASC',
    array: any[],
    context: EvaluationContext
  ): any => {
    const [sortExp, order = 'ASC'] = isExpression(context.interpreters, sort)
      ? [sort, 'ASC']
      : typeof sort === 'string'
      ? [undefined, sort]
      : sort

    validateType(['array', 'undefined'], sortExp)
    validateType('string', order)

    const sortFn =
      sortExp === undefined
        ? _sortDefault
        : ($$SORT_A, $$SORT_B) =>
            evaluateTyped(
              'number',
              {
                ...context,
                scope: { $$VALUE: null, $$SORT_A, $$SORT_B },
              },
              sortExp
            )

    return array
      .slice()
      .sort(order === 'DESC' ? (a, b) => -1 * sortFn(a, b) : sortFn)
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
 * @param {Number} start
 * @param {Number} end
 * @param {Array} [array=$$VALUE]
 * @returns {Array}
 */
export const $arraySlice = interpreter(
  (start: number, end: number, array: any[]): any[] => array.slice(start, end),
  ['number', 'number', 'array']
)

/**
 * @function $arrayReplace
 * @param {Number | [Number, Number]} indexOrRange
 * @param {Array} values
 * @param {Array} [array=$$VALUE]
 * @returns {Array}
 */
export const $arrayReplace = interpreter(
  (
    indexOrRange: number | [number, number],
    replacement: any,
    array: any[]
  ): any[] => {
    const [start, end] = Array.isArray(indexOrRange)
      ? indexOrRange
      : [indexOrRange, indexOrRange + 1]

    const head = array.slice(0, start)
    const tail = array.slice(end)

    return Array.isArray(replacement)
      ? [...head, ...replacement, ...tail]
      : [...head, replacement, ...tail]
  },
  [['number', 'array'], 'any', 'array']
)

/**
 * Adds items at the given position.
 *
 * @function $arrayAddAt
 * @param {Number} index
 * @param {* | Array} values
 * @param {Array} [array=$$VALUE]
 * @returns {Array} resultingArray The array with items added at position
 */
export const $arrayAddAt = interpreter(
  (index: number, values: any[], array: any[]) => {
    const head = array.slice(0, index)
    const tail = array.slice(index)

    return Array.isArray(values)
      ? [...head, ...values, ...tail]
      : [...head, values, ...tail]
  },
  ['number', 'any', 'array']
)

/**
 * @function $arrayRemoveAt
 * @param {Number} index
 * @param {Number} [countExp=1]
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
 * @returns {String}
 */
export const $arrayJoin = interpreter(
  (separator: string = '', array: any[]): string => array.join(separator),
  [['string', 'undefined'], 'array']
)

/**
 * @function $arrayAt
 * @param {Number} index
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
  $arrayReplace,
  $arrayAddAt,
  $arrayRemoveAt,
  $arrayJoin,
  $arrayAt,
}
