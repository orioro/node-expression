import {
  validateNumber,
  validateArray
} from '../util'

import { evaluate } from '../expression'

import { evaluateNumber } from '../expression-util'

const $mathSum = (options, ...valuesExps) => {
  return valuesExps.reduce((res, valueExp) => {
    return res + evaluateNumber(options, valueExp)
  }, 0)
}

const $mathSubtract = (options, startExp, ...valueExps) => {
  return valueExps.reduce((res, valueExp) => {
    return res - evaluateNumber(options, valueExp)
  }, evaluateNumber(options, startExp))
}

const $mathMod = (options, dividendExp, divisorExp) => {
  return evaluateNumber(options, dividendExp) % evaluateNumber(options, divisorExp)
}

const $mathAbs = (options, valueExp) => {
  return Math.abs(evaluateNumber(options, valueExp))
}

const $mathAvg = (options, ...valueExps) => {
  validateArray(valueExps)
  if (valueExps.length === 0) {
    throw new Error(`Average requires at least one value`)
  }

  return $mathSum(options, ...valueExps) / valueExps.length
}

const $mathMax = (options, ...valueExps) => {
  return Math.max(...valueExps.map(exp => evaluate(options, exp)))
}

const $mathMin = (options, ...valueExps) => {
  return Math.min(...valueExps.map(exp => evaluate(options, exp)))
}

export const MATH_EXPRESSIONS = {
  $mathSum,
  $mathSubtract,
  $mathMod,
  $mathAvg,
}
