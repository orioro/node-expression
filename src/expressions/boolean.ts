import {
  evaluate
} from '../expression'

import {
  EvaluationContext,
  Expression,
} from '../types'

import { $$VALUE } from './value'

/**
 * @name $boolean
 * @param {*} valueExp
 * @return {boolean}
 */
export const $boolean = (
  context:EvaluationContext,
  valueExp:Expression = $$VALUE
) => Boolean(evaluate(context, valueExp))

export const BOOLEAN_EXPRESSIONS = {
  $boolean
}
