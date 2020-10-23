import * as ARRAY_EXPRESSIONS from './expressions/array'
import * as BOOLEAN_EXPRESSIONS from './expressions/boolean'
import * as COMPARISON_EXPRESSIONS from './expressions/comparison'
import * as DATE_EXPRESSIONS from './expressions/date'
import * as ERROR_EXPRESSIONS from './expressions/error'
import * as LOGICAL_EXPRESSIONS from './expressions/logical'
import * as MATH_EXPRESSIONS from './expressions/math'
import * as NUMBER_EXPRESSIONS from './expressions/number'
import * as OBJECT_EXPRESSIONS from './expressions/object'
import * as REGEXP_EXPRESSIONS from './expressions/regexp'
import * as STRING_EXPRESSIONS from './expressions/string'
import * as TYPE_EXPRESSIONS from './expressions/type'
import * as valueModule from './expressions/value'

const {
  $$VALUE,
  ...VALUE_EXPRESSIONS
} = valueModule

export const ALL_EXPRESSIONS = {
  ...ARRAY_EXPRESSIONS,
  ...BOOLEAN_EXPRESSIONS,
  ...COMPARISON_EXPRESSIONS,
  ...DATE_EXPRESSIONS,
  ...ERROR_EXPRESSIONS,
  ...LOGICAL_EXPRESSIONS,
  ...MATH_EXPRESSIONS,
  ...NUMBER_EXPRESSIONS,
  ...OBJECT_EXPRESSIONS,
  ...REGEXP_EXPRESSIONS,
  ...STRING_EXPRESSIONS,
  ...TYPE_EXPRESSIONS,
  ...VALUE_EXPRESSIONS,
}

export * from './expression'
export * from './expressions/array'
export * from './expressions/boolean'
export * from './expressions/comparison'
export * from './expressions/date'
export * from './expressions/error'
export * from './expressions/logical'
export * from './expressions/math'
export * from './expressions/number'
export * from './expressions/object'
export * from './expressions/regexp'
export * from './expressions/string'
export * from './expressions/type'
export * from './expressions/value'

export {
  ARRAY_EXPRESSIONS,
  BOOLEAN_EXPRESSIONS,
  COMPARISON_EXPRESSIONS,
  DATE_EXPRESSIONS,
  ERROR_EXPRESSIONS,
  LOGICAL_EXPRESSIONS,
  MATH_EXPRESSIONS,
  NUMBER_EXPRESSIONS,
  OBJECT_EXPRESSIONS,
  REGEXP_EXPRESSIONS,
  STRING_EXPRESSIONS,
  TYPE_EXPRESSIONS,
  VALUE_EXPRESSIONS,
}
