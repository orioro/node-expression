import {
  isPlainObject
} from 'lodash'

import { validateArray } from '../util'

import { evaluate } from '../expression'

const $and = (options, ...expressions) => {
  validateArray(expressions)

  return expressions.every(exp => evaluate(options, exp))
}

const $or = (options, ...expressions) => {
  validateArray(expressions)

  return expressions.some(exp => evaluate(options, exp))
}

const $not = (options, expression) => {
  return !evaluate(options, expression)
}

const $nor = (options, ...expressions) => !$or(options, ...expressions)

const $if = (options, conditionExp, thenExp, elseExp) => {
  return evaluate(options, conditionExp) ?
    evaluate(options, thenExp) :
    evaluate(options, elseExp)
}

export const LOGICAL_EXPRESSIONS = {
  $and,
  $or,
  $not,
  $nor,
  $if
}
