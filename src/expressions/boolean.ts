import {
  evaluate
} from '../expression'

import {
  EvaluationContext,
  Expression,
} from '../types'

import { $$VALUE } from './value'

export const $boolean = (
  context:EvaluationContext,
  valueExp:Expression = $$VALUE
) => Boolean(evaluate(context, valueExp))
