import {
  evaluate
} from '../expression'

import {
  EvaluationContext,
  Expression
} from '../types'

import { $$VALUE } from './value'

export const $type = (
  context:EvaluationContext,
  valueExp:Expression = $$VALUE
) => typeof (evaluate(context, valueExp))
