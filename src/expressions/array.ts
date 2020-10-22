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

import {
  EvaluationContext,
  Expression,
  ArrayExpression
} from '../types'

import {
  $$VALUE,
  $value
} from './value'

export const $$INDEX = ['$value', '$$INDEX']
export const $$ARRAY = ['$value', '$$ARRAY']
export const $$ACC = ['$value', '$$ACC']
export const $$SORT_A = ['$value', '$$SORT_A']
export const $$SORT_B = ['$value', '$$SORT_B']

export const $arrayIncludes = (
  context:EvaluationContext,
  valueExp:any,
  arrayExp:any = $$VALUE
):boolean => {
  const value = evaluate(context, valueExp)
  const array = evaluateArray(context, arrayExp)

  return array.includes(value)
}

export const $arrayIncludesAll = (
  context:EvaluationContext,
  valuesExp:any,
  arrayExp:any = $$VALUE
):boolean => {
  const values = evaluateArray(context, valuesExp)
  const array = evaluateArray(context, arrayExp)

  return values.every(value => array.includes(value))
}

export const $arrayIncludesAny = (
  context:EvaluationContext,
  valuesExp:any,
  arrayExp:any = $$VALUE
):boolean => {
  const values = evaluateArray(context, valuesExp)
  const array = evaluateArray(context, arrayExp)

  return values.some(value => array.includes(value))
}

export const $arrayLength = interpreter((
  array:any[]
):number => array.length, [
  evaluateArray
])

export const $arrayReduce = (
  context:EvaluationContext,
  reduceExp:any,
  startExp:any,
  arrayExp:any = $$VALUE
):any => (
  evaluateArray(context, arrayExp)
    .reduce(($$ACC, $$VALUE, $$INDEX, $$ARRAY) => {
      return evaluate({
        ...context,
        data: { $$VALUE, $$INDEX, $$ARRAY, $$ACC }
      }, reduceExp)
    }, evaluate(context, startExp))
)

const _arrayIterator = (method:string) => (
  context:EvaluationContext,
  mapExp:any,
  arrayExp:any = $$VALUE
) => (
  evaluateArray(context, arrayExp)[method](($$VALUE, $$INDEX, $$ARRAY) => {
    return evaluate({
      ...context,
      data: { $$VALUE, $$INDEX, $$ARRAY }
    }, mapExp)
  })
)
export const $arrayMap = _arrayIterator('map')
// export const $arrayEvery = _arrayIterator('every') remove in favor of logical $and
// export const $arraySome = _arrayIterator('some') remove in favor of logical $or
export const $arrayFilter = _arrayIterator('filter')
export const $arrayIndexOf = _arrayIterator('findIndex')
export const $arrayFind = _arrayIterator('find')

export const $arrayReverse = (
  context:EvaluationContext,
  arrayExp:any = $$VALUE
) => {
  const arr = evaluateArray(context, arrayExp).slice()
  arr.reverse()
  return arr
}

export const $arraySort = (
  context:EvaluationContext,
  sortExp:any,
  arrayExp:any = $$VALUE
) => {
  const arr = evaluateArray(context, arrayExp).slice()

  if (sortExp === undefined) {
    arr.sort()
  } else {
    arr.sort(($$SORT_A, $$SORT_B) => evaluateNumber({
      ...context,
      data: { $$SORT_A, $$SORT_B }
    }, sortExp))
  }

  return arr
}

export const $arrayPush = (
  context:EvaluationContext,
  valueExp:any,
  arrayExp:any = $$VALUE
) => ([
  ...evaluateArray(context, arrayExp),
  evaluate(context, valueExp)
])

export const $arrayPop = (
  context:EvaluationContext,
  arrayExp:any = $$VALUE
) => {
  const arr = evaluateArray(context, arrayExp)
  return arr.slice(0, arr.length - 1)
}

export const $arrayUnshift = (
  context:EvaluationContext,
  valueExp:any,
  arrayExp:any = $$VALUE
) => ([
  evaluate(context, valueExp),
  ...evaluateArray(context, arrayExp)
])

export const $arrayShift = (
  context:EvaluationContext,
  arrayExp:any = $$VALUE
) => {
  const arr = evaluateArray(context, arrayExp)
  return arr.slice(1, arr.length)
}

export const $arraySlice = (
  context:EvaluationContext,
  startExp:any,
  endExp:any,
  arrayExp:any = $$VALUE
) => {
  return evaluateArray(context, arrayExp)
    .slice(
      evaluateNumber(context, startExp),
      evaluateNumber(context, endExp)
    )
}

export const $arraySubstitute = (
  context:EvaluationContext,
  startExp:any,
  endExp:any,
  valueExps:any[],
  arrayExp:any = $$VALUE
) => {
  const array = evaluateArray(context, arrayExp)
  const start = evaluateNumber(context, startExp)
  const end = evaluateNumber(context, endExp)

  return [
    ...array.slice(0, start),
    ...valueExps.map(exp => evaluate(context, exp)),
    ...array.slice(end + 1)
  ]
}

export const $arrayAddAt = (
  context:EvaluationContext,
  startExp:any,
  valueExps:any[],
  arrayExp:any = $$VALUE
) => {
  const array = evaluateArray(context, arrayExp)
  const index = evaluateNumber(context, startExp)

  return [
    ...array.slice(0, index),
    ...valueExps.map(exp => evaluate(context, exp)),
    ...array.slice(index + 1)
  ]
}

export const $arrayRemoveAt = (
  context:EvaluationContext,
  indexExp:any,
  countExp:any = 1,
  arrayExp:any = $$VALUE
) => {
  const array = evaluateArray(context, arrayExp)
  const position = evaluateNumber(context, indexExp)
  const count = evaluateNumber(context, countExp)

  return [
    ...array.slice(0, position),
    ...array.slice(position + 1)
  ]
}

export const $arrayJoin = (
  context:EvaluationContext,
  separatorExp:any = ', ',
  arrayExp:any = $$VALUE
) => (
  evaluateArray(context, arrayExp)
    .join(evaluateString(context, separatorExp))
)

export const $arrayAt = (
  context:EvaluationContext,
  indexExp:any,
  arrayExp:ArrayExpression = $$VALUE
) => {
  const array = evaluateArray(context, arrayExp)

  return array[evaluateNumber(context, indexExp)]
}

export const $arrayFormat = (
  context:EvaluationContext,
  formatExp:ArrayExpression,
  sourceExp:Expression = $$VALUE
):any[] => {
  const format = evaluateArray(context, formatExp)
  const source = evaluate(context, sourceExp)

  return format.map(sourcePath => get(source, sourcePath))
}

export {
  $value
}
