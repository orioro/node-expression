import { isPlainObject } from 'lodash'

export const objectDeepAssign = (base = {}, assign) => {
  return Object.keys(assign).reduce((acc, key) => {
    if (isPlainObject(assign[key]) &&
        isPlainObject(acc[key])) {
      return {
        ...acc,
        [key]: objectDeepAssign(acc[key], assign[key])
      }
    } else {
      return {
        ...acc,
        [key]: isPlainObject(assign[key])
          ? Object.assign({}, assign[key])
          : Array.isArray(assign[key])
            ? [...assign[key]]
            : assign[key]
      }
    }
  }, base)
}
