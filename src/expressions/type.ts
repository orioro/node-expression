import {
  evaluate
} from '../expression'

import {
  EvaluationContext,
  Expression
} from '../types'

import { $$VALUE, $value } from './value'

export const $typeOf = (
  context:EvaluationContext,
  valueExp:Expression = $$VALUE
) => typeof (evaluate(context, valueExp))

export {
  $value
}
