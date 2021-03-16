import { typing, CORE_TYPES } from '@orioro/typing'
import { _maybeExpression } from './util/misc'

const {
  isType,
  // getType,
  validateType,
} = typing({
  ...CORE_TYPES,
  // Low priority type
  expression: _maybeExpression,
})

export {
  isType,
  // getType,
  validateType,
}
