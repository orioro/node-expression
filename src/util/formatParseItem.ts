import { isPlainObject } from 'lodash'
import { isExpression } from '../expression'

export const formatParseItem = (interpreters, exp) => {
  if (typeof exp === 'string') {
    return ['$value', exp]
  } else if (Array.isArray(exp)) {
    return isExpression(interpreters, exp)
      ? exp
      : ['$arrayFormat', exp]
  } else if (isPlainObject(exp)) {
    return ['$objectFormat', exp]
  } else {
    throw `Invalid $arrayFormat item: ${exp}`
  }
}
