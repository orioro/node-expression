import {
  evaluate
} from '../expression'

import {
  EvaluationContext,
  Expression
} from '../types'

import { $$VALUE } from './value'

/**
 * @todo Return value for arrays, objects and regexp
 *       (move away from typeof)
 * 
 * @name $type
 * @param {*} valueExp
 * @return {string} type
 */
export const $type = (
  context:EvaluationContext,
  valueExp:Expression = $$VALUE
) => typeof (evaluate(context, valueExp))

export const TYPE_EXPRESSIONS = {
  $type
}
