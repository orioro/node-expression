import { isPlainObject } from 'lodash'
import { PlainObject } from '../types'

export const objectDeepAssign = (
  base: PlainObject = {},
  assign: PlainObject
): PlainObject => {
  return Object.keys(assign).reduce((acc, key) => {
    if (isPlainObject(assign[key]) && isPlainObject(acc[key])) {
      return {
        ...acc,
        [key]: objectDeepAssign(acc[key], assign[key]),
      }
    } else {
      return {
        ...acc,
        [key]: isPlainObject(assign[key])
          ? Object.assign({}, assign[key])
          : Array.isArray(assign[key])
          ? [...assign[key]]
          : assign[key],
      }
    }
  }, base)
}
