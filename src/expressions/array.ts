/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { evaluate, evaluateTyped, isExpression } from '../evaluate'
import {
  EvaluationContext,
  Expression,
  InterpreterSpec,
  InterpreterSpecSingle,
} from '../types'
import { validateType, anyType } from '@orioro/typing'

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
export const $arrayIncludes: InterpreterSpec = [
  (search: any, array: any[]): boolean => array.includes(search),
  ['any', 'array'],
]

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
export const $arrayIncludesAll: InterpreterSpec = [
  (search: any[], array: any[]): boolean =>
    search.every((value) => array.includes(value)),
  ['array', 'array'],
]

/**
 * Similar to `$arrayIncludes`, but returns true if
 * any of the searched values is in the array.
 *
 * @function $arrayIncludesAny
 * @param {Array} searchValue
 * @param {Array} [array=$$VALUE]
 * @returns {Boolean} includesAny
 */
export const $arrayIncludesAny: InterpreterSpec = [
  (search: any[], array: any[]): boolean =>
    search.some((value) => array.includes(value)),
  ['array', 'array'],
]

/**
 * @function $arrayLength
 * @param {Array} [array=$$VALUE]
 * @returns {Number} length
 */
export const $arrayLength: InterpreterSpec = [
  (array: any[]): number => array.length,
  ['array'],
]

/**
 * @function $arrayReduce
 * @param {Expression} reduceExp An expression that returns the
 *                               result of reduction. Has access to:
 *                               `$$PARENT_SCOPE`, `$$VALUE`, `$$INDEX`,
 *                               `$$ARRAY`, `$$ACC`
 * @param {*} start
 * @param {Array} [array=$$VALUE]
 */
export const $arrayReduce: InterpreterSpec = [
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
  [anyType({ delayEvaluation: true }), 'any', 'array'],
]

const _iteratorContext = (
  parentContext: EvaluationContext,
  $$VALUE: any,
  $$INDEX: number,
  $$ARRAY: any[]
): EvaluationContext => ({
  ...parentContext,
  scope: {
    $$PARENT_SCOPE: parentContext.scope,
    $$VALUE,
    $$INDEX,
    $$ARRAY,
  },
})

const _arraySyncIterator = (method: string): InterpreterSpecSingle => [
  (iteratorExp: Expression, array: any[], context: EvaluationContext): any =>
    array[method](($$VALUE, $$INDEX, $$ARRAY) =>
      evaluate(
        _iteratorContext(context, $$VALUE, $$INDEX, $$ARRAY),
        iteratorExp
      )
    ),
  [anyType({ delayEvaluation: true }), 'array'],
]

/**
 * @function $arrayMap
 * @param {Expression} mapExp Expression to be evaluated for each
 *                            item and which return value will be
 *                            available in the resulting array. Has
 *                            access to: `$$PARENT_SCOPE`, `$$VALUE`,
 *                            `$$INDEX`, `$$ARRAY`, `$$ACC`
 * @param {Array} [array=$$VALUE]
 */
export const $arrayMap: InterpreterSpec = {
  sync: _arraySyncIterator('map'),
  async: [
    (
      iteratorExp: Expression,
      array: any[],
      context: EvaluationContext
    ): Promise<any[]> =>
      Promise.all(
        array.map(($$VALUE, $$INDEX, $$ARRAY) =>
          evaluate(
            _iteratorContext(context, $$VALUE, $$INDEX, $$ARRAY),
            iteratorExp
          )
        )
      ),
    [anyType({ delayEvaluation: true }), 'array'],
  ],
}

/**
 * `Array.prototype.every`
 *
 * Result is similar to logical operator `$and`. Main difference
 * (and reason for existence as isolate expression) is that
 * $arrayEvery exposes array iteration variables:
 * `$$PARENT_SCOPE`, `$$VALUE`, `$$INDEX`, `$$ARRAY`
 *
 * @todo array $arrayEvery write tests with async conditions
 * @function $arrayEvery
 * @param {Expression} testExp
 * @param {Array} [array=$$VALUE]
 */
export const $arrayEvery: InterpreterSpec = {
  sync: _arraySyncIterator('every'),
  async: [
    (
      testExp: Expression,
      array: any[],
      context: EvaluationContext
    ): Promise<boolean> =>
      array.reduce((accPromise, $$VALUE, $$INDEX, $$ARRAY) =>
        accPromise.then(acc =>
          acc === true
            ? evaluate(
                _iteratorContext(context, $$VALUE, $$INDEX, $$ARRAY),
                testExp
              ).then((result) => Boolean(result))
            : false
        ),
        Promise.resolve(true)
      ),
    [anyType({ delayEvaluation: true }), 'array'],
  ],
}

/**
 * `Array.prototype.some`
 *
 * @todo array $arraySome write tests with async conditions
 * @function $arraySome
 * @param {Expression} someExp
 * @param {Array} [array=$$VALUE]
 */
export const $arraySome: InterpreterSpec = {
  sync: _arraySyncIterator('some'),
  async: [
    (
      testExp: Expression,
      array: any[],
      context: EvaluationContext
    ): Promise<boolean> =>
      array.reduce((accPromise, $$VALUE, $$INDEX, $$ARRAY) =>
        accPromise.then(acc =>
          acc === false
            ? evaluate(
                _iteratorContext(context, $$VALUE, $$INDEX, $$ARRAY),
                testExp
              ).then((result) => Boolean(result))
            : true
        ),
        Promise.resolve(false)
      ),
    [anyType({ delayEvaluation: true }), 'array'],
  ]
}

// export const $arrayFilterAsyncParallel: InterpreterSpecSingle = [
//   (filterExp: Expression, array: any[], context: EvaluationContext) =>
//     Promise.all(
//       array.map(($$VALUE, $$INDEX, $$ARRAY) =>
//         evaluate(
//           _iteratorContext(context, $$VALUE, $$INDEX, $$ARRAY),
//           filterExp
//         )
//       )
//     ).then((results) =>
//       results.reduce((acc, result, index) => {
//         return Boolean(result) ? [...acc, array[index]] : acc
//       }, [])
//     ),
//   [anyType({ delayEvaluation: true }), 'array'],
// ]

export const $arrayFilterAsyncSerial: InterpreterSpecSingle = [
  (filterExp: Expression, array: any[], context: EvaluationContext) =>
    array.reduce(
      (accPromise, $$VALUE, $$INDEX, $$ARRAY) =>
        accPromise.then((acc) =>
          Promise.resolve(
            evaluate(
              _iteratorContext(context, $$VALUE, $$INDEX, $$ARRAY),
              filterExp
            )
          ).then((itemCondition) =>
            Boolean(itemCondition) ? [...acc, $$VALUE] : acc
          )
        ),
      Promise.resolve([])
    ),
  [anyType({ delayEvaluation: true }), 'array'],
]

/**
 * @function $arrayFilter
 * @param {Boolean} queryExp
 * @param {Array} [array=$$VALUE]
 */
export const $arrayFilter: InterpreterSpec = {
  sync: _arraySyncIterator('filter'),
  async: $arrayFilterAsyncSerial,
}

/**
 * @function $arrayFindIndex
 * @param {Boolean} queryExp
 * @param {Array} [array=$$VALUE]
 */
export const $arrayFindIndex: InterpreterSpec = {
  sync: _arraySyncIterator('findIndex'),
  async: [
    (queryExp: Expression, array: any[], context: EvaluationContext) =>
      array.reduce((accPromise, $$VALUE, $$INDEX, $$ARRAY) => {
        return accPromise.then((acc) => {
          if (acc === undefined) {
            return Promise.resolve(
              evaluate(
                _iteratorContext(context, $$VALUE, $$INDEX, $$ARRAY),
                queryExp
              )
            ).then((matchesQuery) =>
              Boolean(matchesQuery) ? $$INDEX : undefined
            )
          } else {
            return acc
          }
        })
      }, Promise.resolve(undefined)),
    [anyType({ delayEvaluation: true }), 'array'],
  ],
}

/**
 * @function $arrayIndexOf
 * @param {*} value
 * @param {Array} [array=$$VALUE]
 */
export const $arrayIndexOf: InterpreterSpec = [
  (value: any, array: any[]): number => array.indexOf(value),
  ['any', 'array'],
]

/**
 * @function $arrayFind
 * @param {Boolean} queryExp
 * @param {Array} [array=$$VALUE]
 */
export const $arrayFind: InterpreterSpec = _arraySyncIterator('find')

/**
 * @function $arrayReverse
 * @param {Array} [array=$$VALUE]
 */
export const $arrayReverse: InterpreterSpec = [
  (array: any[]): any[] => {
    const arr = array.slice()
    arr.reverse()
    return arr
  },
  ['array'],
]

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
 * @todo array Make it possible for the same set of expression interpreters
 *             to be called synchronously or asynchronously. E.g. sort comparator
 *             expression should only support Synchronous
 * @function $arraySort
 * @param {String | Expression | [Expression, string]} sort
 * @param {Array} [array=$$VALUE]
 */
export const $arraySort: InterpreterSpec = [
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
  [anyType({ delayEvaluation: true }), 'array'],
]

/**
 * @function $arrayPush
 * @param {*} valueExp
 * @param {Array} [array=$$VALUE]
 */
export const $arrayPush: InterpreterSpec = [
  (value: any, array: any[]): any[] => [...array, value],
  ['any', 'array'],
]

/**
 * @function $arrayPop
 * @param {Array} [array=$$VALUE]
 */
export const $arrayPop: InterpreterSpec = [
  (array: any[]) => array.slice(0, array.length - 1),
  ['array'],
]

/**
 * @function $arrayUnshift
 * @param {*} valueExp
 * @param {Array} [array=$$VALUE]
 */
export const $arrayUnshift: InterpreterSpec = [
  (value: any, array: any[]): any[] => [value, ...array],
  ['any', 'array'],
]

/**
 * @function $arrayShift
 * @param {Array} [array=$$VALUE]
 */
export const $arrayShift: InterpreterSpec = [
  (array: any[]): any[] => array.slice(1, array.length),
  ['array'],
]

/**
 * @function $arraySlice
 * @param {Number} start
 * @param {Number} end
 * @param {Array} [array=$$VALUE]
 * @returns {Array}
 */
export const $arraySlice: InterpreterSpec = [
  (start: number, end: number, array: any[]): any[] => array.slice(start, end),
  ['number', 'number', 'array'],
]

/**
 * @function $arrayReplace
 * @param {Number | [Number, Number]} indexOrRange
 * @param {Array} values
 * @param {Array} [array=$$VALUE]
 * @returns {Array}
 */
export const $arrayReplace: InterpreterSpec = [
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
  [['number', 'array'], 'any', 'array'],
]

/**
 * Adds items at the given position.
 *
 * @function $arrayAddAt
 * @param {Number} index
 * @param {* | Array} values
 * @param {Array} [array=$$VALUE]
 * @returns {Array} resultingArray The array with items added at position
 */
export const $arrayAddAt: InterpreterSpec = [
  (index: number, values: any[], array: any[]) => {
    const head = array.slice(0, index)
    const tail = array.slice(index)

    return Array.isArray(values)
      ? [...head, ...values, ...tail]
      : [...head, values, ...tail]
  },
  ['number', 'any', 'array'],
]

/**
 * @function $arrayRemoveAt
 * @param {Number} index
 * @param {Number} [countExp=1]
 * @param {Array} [array=$$VALUE]
 * @returns {Array} resultingArray The array without the removed item
 */
export const $arrayRemoveAt: InterpreterSpec = [
  (position: number, count: number = 1, array: any[]): any[] => [
    ...array.slice(0, position),
    ...array.slice(position + count),
  ],
  ['number', ['number', 'undefined'], 'array'],
]

/**
 * @function $arrayJoin
 * @param {String} separator
 * @param {Array} [array=$$VALUE]
 * @returns {String}
 */
export const $arrayJoin: InterpreterSpec = [
  (separator: string = '', array: any[]): string => array.join(separator),
  [['string', 'undefined'], 'array'],
]

/**
 * @function $arrayAt
 * @param {Number} index
 * @param {Array} [array=$$VALUE]
 * @returns {*} value
 */
export const $arrayAt: InterpreterSpec = [
  (index: number, array: any[]): any => array[index],
  ['number', 'array'],
]

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
