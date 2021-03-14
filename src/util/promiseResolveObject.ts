type PropertyResolverFunction = (value: any, key: string) => any

export const promiseResolveObject = (
  object,
  resolver: PropertyResolverFunction = (value) => value
) => {
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
