// import { OBJECT_EXPRESSIONS } from './expressions/object'

import { VALUE_EXPRESSIONS, $$VALUE, $$ROOT } from './expressions/value'
import { COMPARISON_EXPRESSIONS } from './expressions/comparison'
import { LOGICAL_EXPRESSIONS } from './expressions/logical'
import { ARRAY_EXPRESSIONS, $$ARR, $$IDX, $$ACC } from './expressions/array'
import { MATH_EXPRESSIONS } from './expressions/math'
import { MATCH_EXPRESSIONS } from './expressions/match'

export * from './expression'

export const ALL_EXPRESSIONS = {
  ...VALUE_EXPRESSIONS,
  ...COMPARISON_EXPRESSIONS,
  ...LOGICAL_EXPRESSIONS,
  ...ARRAY_EXPRESSIONS,
  ...MATH_EXPRESSIONS,
  ...MATCH_EXPRESSIONS,
  // ...OBJECT_EXPRESSIONS,
}

export {
  VALUE_EXPRESSIONS,
  $$ROOT,
  $$VALUE,

  COMPARISON_EXPRESSIONS,

  LOGICAL_EXPRESSIONS,

  ARRAY_EXPRESSIONS,
  $$ARR,
  $$IDX,
  $$ACC,

  MATH_EXPRESSIONS,

  MATCH_EXPRESSIONS
  // OBJECT_EXPRESSIONS,
}
