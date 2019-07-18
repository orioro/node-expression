import {
  isEqual,
  isPlainObject
} from 'lodash'

import {
  isValidNumber,
  validateNumber,
  validateArray,
  validatePlainObject
} from '../util'

import { evaluate } from '../expression'
import {
  evaluateArray,
  evaluateNumber
} from '../expression-util'

const _negate = (fn) => (...args) => {
  return !fn(...args)
}

/**
 * Value equals to target value
 */
const $compareEq = (options, referenceExp, valueExp) => {
  return isEqual(
    evaluate(options, referenceExp),
    evaluate(options, valueExp)
  )
}
const $eq = $compareEq

const $compareNotEq = _negate($eq)
const $notEq = $compareNotEq

/**
 * Value (any) is in reference array of options
 */
const $compareIn = (options, referenceExp, valueExp) => {
  const value = evaluate(options, valueExp)
  return evaluateArray(options, referenceExp).some(item => item === value)
}
const $in = $compareIn

const $compareNotIn = _negate($compareIn)
const $nin = $compareNotIn

/**
 * Value (array) contains the reference value (any)
 */
const $compareContains = (options, referenceExp, valueExp) => {
  const reference = evaluate(options, referenceExp)
  return evaluateArray(options, valueExp).some(item => item === reference)
}
const $contains = $compareContains

const $compareNotContains = _negate($compareContains)
const $notContains = $compareNotContains

/**
 * Value (array) contains all of the reference (array) value's items
 */
const $compareContainsAll = (options, referenceExp, valueExp) => {
  const reference = evaluateArray(options, referenceExp)
  const value = evaluateArray(options, valueExp)

  return reference.every(referenceValue => value.includes(referenceValue))
}
const $containsAll = $compareContainsAll

const $compareNotContainsAll = _negate($compareContainsAll)
const $notContainsAll = $compareNotContainsAll

/**
 * Value (array) contains any of the reference (array) value's items
 */
const $compareContainsAny = (options, referenceExp, valueExp) => {
  const reference = evaluateArray(options, referenceExp)
  const value = evaluateArray(options, valueExp)

  return reference.some(referenceValue => value.includes(referenceValue))
}
const $containsAny = $compareContainsAny

const $compareNotContainsAny = _negate($compareContainsAny)
const $notContainsAny = $compareNotContainsAny

/**
 * Value (number) is greater than threshold (number)
 */
const $compareGt = (options, referenceExp, valueExp) => {
  const threshold = evaluateNumber(options, referenceExp)
  const value = evaluate(options, valueExp)
  return isValidNumber(value) && value > threshold
}
const $gt = $compareGt

/**
 * Value (number) is greater or equal than threshold (number)
 */
const $compareGte = (options, referenceExp, valueExp) => {
  const threshold = evaluateNumber(options, referenceExp)
  const value = evaluate(options, valueExp)
  return isValidNumber(value) && value >= threshold
}
const $gte = $compareGte

/**
 * Value (number) is lesser than threshold (number)
 */
const $compareLt = (options, referenceExp, valueExp) => !$gte(options, referenceExp, valueExp)
const $lt = $compareLt

/**
 * Value (number) is lesser or equal than threshold (number)
 */
const $compareLte = (options, referenceExp, valueExp) => !$gt(options, referenceExp, valueExp)
const $lte = $compareLte

/**
 * Value (string) matches reference (RegExp)
 */
const $compareRegExp = (options, referenceExp, valueExp) => {
  const regExp = evaluateRegExp(options, referenceExp)
  const value = evaluateString(options, valueExp)

  return regExp.test(value)
}

export const COMPARISON_EXPRESSIONS = {
  $eq,
  $notEq,
  $in,
  $nin,
  $contains,
  $notContains,
  $containsAny,
  $notContainsAny,
  $containsAll,
  $notContainsAll,
  $gt,
  $gte,
  $lt,
  $lte,
  $compareRegExp,
}
