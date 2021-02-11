import {
  evaluate
} from '../expression'

import {
  EvaluationContext,
  Expression
} from '../types'

import { $$VALUE } from './value'

/**
 * @todo $type Return value for arrays, objects and regexp (move away from typeof)
 * 
 * @function $type
 * @param {*} valueExp
 * @returns {string} type
 */
export const $type = (
  context:EvaluationContext,
  valueExp:Expression = $$VALUE
) => typeof (evaluate(context, valueExp))

export const TYPE_EXPRESSIONS = {
  $type
}