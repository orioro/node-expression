export const $exists = (exists, value) => {
  return exists ? value !== undefined : value === undefined
}

export const $type = (type, value) => {
  switch (type) {
    case 'number':
      return typeof value === 'number'
    case 'string':
      return typeof value === 'string'
    case 'bool':
      return typeof value === 'boolean'
    case 'array':
      return Array.isArray(value)
    case 'object':
      return isPlainObject(value)
    case 'date':
      return value instanceof Date
    case 'null':
      return value === null
    case 'regexp':
      return value instanceof RegExp
    default:
      throw new Error(`Unknown type ${type}`)
  }
}
