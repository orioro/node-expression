import { evaluate } from '../expression'
import { getType } from '@orioro/validate-type'

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
 * @returns {string} type Possible values:
 *   - string
 *   - regexp
 *   - number
 *   - bigint
 *   - nan
 *   - null
 *   - undefined
 *   - boolean
 *   - function
 *   - object
 *   - array
 *   - date
 *   - symbol
 *   - map
 *   - set
 *   - weakmap
 *   - weakset
 */
export const $type = (
  context:EvaluationContext,
  valueExp:Expression = $$VALUE
) => getType(evaluate(context, valueExp))

export const TYPE_EXPRESSIONS = {
  $type
}
