export const promiseResolveObject = (object, resolver) => {
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
