import {
  evaluate,
  interpreter
} from '../expression'

import {
  EvaluationContext,
  Expression,
} from '../types'

import { $$VALUE } from './value'

/**
 * @function $boolean
 * @param {*} value
 * @returns {boolean}
 */
export const $boolean = interpreter((
  value:any
):boolean => Boolean(value), [
  'any'
])

export const BOOLEAN_EXPRESSIONS = {
  $boolean
}
