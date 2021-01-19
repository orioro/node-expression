import { isPlainObject } from 'lodash'

const arrayReplace = (array, index, replacement) => ([
  ...array.slice(0, index),
  replacement,
  ...array.slice(index + 1)
])

export const arrayDeepApplyDefaults = (actualValues = [], defaultValues) => {
  return defaultValues.reduce((acc, dfV, index) => {
    if (Array.isArray(dfV)) {
      return arrayReplace(
        acc,
        index,
        arrayDeepApplyDefaults(acc[index], dfV)
      )
    } else if (isPlainObject(dfV)) {
      return arrayReplace(
        acc,
        index,
        objectDeepApplyDefaults(acc[index], dfV)
      )
    } else {
      return acc[index] === undefined
        ? arrayReplace(acc, index, dfV)
        : acc
    }

  }, actualValues)
}

export const objectDeepApplyDefaults = (actualValues = {}, defaultValues) => {
  return Object.keys(defaultValues).reduce((acc, key) => {

    const dfV = defaultValues[key]

    if (isPlainObject(dfV)) {
      return {
        ...acc,
        [key]: objectDeepApplyDefaults(acc[key], dfV)
      }
    } else if (Array.isArray(dfV)) {
      return {
        ...acc,
        [key]: arrayDeepApplyDefaults(acc[key], dfV)
      }
    } else {
      return acc[key] === undefined
        ? { ...acc, [key]: dfV }
        : acc
    }

  }, actualValues)
}
