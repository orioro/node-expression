import {
  isPlainObject,
  isArray,
  isString,
  isBoolean,
  isRegExp,
  isDate
} from 'lodash'

export const isValidNumber = value => {
  return typeof value === 'number' && value !== NaN
}

const mightBeExpression = (value:any) => (
  Array.isArray(value) &&
  typeof value[0] === 'string' &&
  value[0].startsWith('$')
)

const validateType = (typeName, test) => {
  const validate = value => {
    if (!test(value)) {
      throw new TypeError(`Evaluated invalid ${typeName}: ${JSON.stringify(value)}`)
    }
  }

  validate.allowUndefined = value => {
    if (value !== undefined && !test(value)) {
      throw new TypeError(`Evaluated invalid ${typeName}: ${JSON.stringify(value)}`)
    }
  }

  return validate
}

export const validateNumber = validateType('valid_number', isValidNumber)
export const validateArray = validateType('array', isArray)
export const validateString = validateType('string', isString)
export const validatePlainObject = validateType('plain object', isPlainObject)
export const validateBoolean = validateType('boolean', isBoolean)
export const validateRegExp = validateType('regexp', isRegExp)
export const validateNotObject = validateType('not object', value => {
  return typeof value !== 'object' || isArray(value)
})
export const validatePlainObjectOrArray = validateType('plain_object_or_array', value => {
  return isPlainObject(value) || isArray(value)
})
export const validateStringOrRegExp = validateType('string_or_regexp', value => {
  return isString(value) || isRegExp(value)
})
export const validateDate = validateType('date', isDate)
