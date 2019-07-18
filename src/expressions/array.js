import { evaluate } from '../expression'
import {
  evaluateArray,
  evaluateNumber
} from '../expression-util'

export const $$IDX = ['$value', '$$IDX']
export const $$ACC = ['$value', '$$ACC']
export const $$ARR = ['$value', '$$ARR']
export const $$SORT_A = ['$value', '$$SORT_A']
export const $$SORT_B = ['$value', '$$SORT_B']

const _iterCtx = (value, idx, arr) => ({
  $$VALUE: value,
  $$IDX: idx,
  $$ARR: arr,
})

/**
 * Array characteristics
 */
const $arrayLength = (options, arrayExp) => {
  return evaluateArray(options, arrayExp).length
}

const $arrayIndexOf = (options, arrayExp, searchExp) => {
  return evaluateArray(options, arrayExp).findIndex((item, idx, arr) => evaluate({
    ...options,
    context: _iterCtx(item, idx, arr)
  }, searchExp))
}

/**
 * Iterators
 */
const $arrayFilter = (options, arrayExp, conditionExp) => {
  return evaluateArray(options, arrayExp).filter((item, idx, arr) => {
    return evaluate({
      ...options,
      context: _iterCtx(item, idx, arr)
    }, conditionExp)
  })
}

const $arrayMap = (options, arrayExp, mapExp) => {
  return evaluateArray(options, arrayExp).map((item, idx, arr) => evaluate({
    ...options,
    context: _iterCtx(item, idx, arr)
  }, mapExp))
}

const $arrayReduce = (options, arrayExp, reducerExp, startExp) => {
  return evaluateArray(options, arrayExp).reduce((acc, item, idx, arr) => {
    return evaluate({
      ...options,
      context: {
        ..._iterCtx(item, idx, arr),
        $$ACC: acc,
      }
    }, reducerExp)
  }, evaluate(options, startExp))
}

const $arrayEvery = (options, arrayExp, conditionExp) => {
  return evaluateArray(arrayExp).every((item, idx, arr) => evaluate({
    ...options,
    context: _iterCtx(item, idx, arr)
  }, conditionExp))
}

const $arraySome = (options, arrayExp, conditionExp) => {
  return evaluateArray(arrayExp).some((item, idx, arr) => evaluate({
    ...options,
    context: _iterCtx(item, idx, arr)
  }, conditionExp))
}

/**
 * Array manipulation
 * @param  {[type]} options  [description]
 * @param  {[type]} arrayExp [description]
 * @return {[type]}          [description]
 */
const $arrayReverse = (options, arrayExp) => {
  const arr = evaluateArray(options, arrayExp).slice()
  arr.reverse()
  return arr
}

const $arraySort = (options, arrayExp, sortExp) => {
  const arr = evaluateArray(options, arrayExp).slice()

  if (sortExp === undefined) {
    arr.sort()
  } else {
    arr.sort((itemA, itemB) => evaluateNumber({
      ...options,
      context: {
        $$SORT_A: itemA,
        $$SORT_B: itemB,
      }
    }, sortExp))
  }

  return arr
}

const $arrayPush = (options, arrayExp, valueExp) => {
  return [...evaluateArray(options, arrayExp), evaluate(options, valueExp)]
}

const $arrayPop = (options, arrayExp) => {
  const arr = evaluateArray(options, arrayExp)
  return arr.slice(0, arr.length - 1)
}

const $arrayUnshift = (options, arrayExp, valueExp) => {
  return [evaluate(options, valueExp), ...evaluateArray(options, arrayExp)]
}

const $arrayShift = (options, arrayExp) => {
  const arr = evaluateArray(options, arrayExp)
  return arr.slice(1, arr.length)
}

const $arraySlice = (options, arrayExp, startExp, endExp) => {
  return evaluateArray(options, arrayExp)
    .slice(
      evaluateNumber(options, startExp),
      evaluateNumber(options, endExp)
    )
}

const $arrayAddAt = (options, arrayExp, indexExp, ...valueExps) => {
  const arr = evaluateArray(options, arrayExp)
  const position = evaluateNumber(options, indexExp)

  return [
    ...arr.slice(0, position),
    ...valueExps.map(exp => evaluate(options, exp)),
    ...arr.slice(position + 1)
  ]
}

const $arrayRemoveAt = (options, arrayExp, indexExp, countExp = 1) => {
  const arr = evaluateArray(options, arrayExp)
  const position = evaluateNumber(options, indexExp)
  const count = evaluateNumber(options, countExp)

  return [
    ...arr.slice(0, position),
    ...arr.slice(position + 1)
  ]
}

const $arrayJoin = (options, arrayExp, separatorExp = ',') => {
  return evaluateArray(options, arrayExp).join(evaluateString(options, separatorExp))
}

const $arrayAt = (options, arrayExp, indexExp) => {
  return evaluateArray(options, arrayExp)[evaluateNumber(options, indexExp)]
}

export const ARRAY_EXPRESSIONS = {
  $arrayLength,
  $arrayMap,
  $arrayFilter,
  $arrayReduce,
  $arrayPush,
  $arrayUnshift,
}
