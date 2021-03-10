import { PlainObject } from '../types'

type PropertyResolverFunction = (value: any, key: string) => any

const _defaulrPropertyResolver: PropertyResolverFunction = (value) => value

export const promiseResolveObject = (
  object: PlainObject,
  resolver: PropertyResolverFunction = _defaulrPropertyResolver
): Promise<PlainObject> => {
  const keys = Object.keys(object)

  return Promise.all(keys.map((key) => resolver(object[key], key))).then(
    (values) =>
      values.reduce((acc, value, index) => {
        const key = keys[index]

        return {
          ...acc,
          [key]: value,
        }
      }, {})
  )
}
