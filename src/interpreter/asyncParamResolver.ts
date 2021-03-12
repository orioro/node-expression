import {
  validateType,
  castTypeSpec,
  ANY_TYPE,
  SINGLE_TYPE,
  ONE_OF_TYPES,
  ENUM_TYPE,
  INDEFINITE_ARRAY_OF_TYPE,
  INDEFINITE_OBJECT_OF_TYPE,
  TUPLE_TYPE,
  OBJECT_TYPE,
} from '@orioro/typing'

import { TypeSpec, ParamResolver } from '../types'

import { evaluate, evaluateTypedAsync } from '../evaluate'
import { promiseResolveObject } from '../util/promiseResolveObject'

export const asyncParamResolver = (typeSpec: TypeSpec): ParamResolver => {
  const expectedType = castTypeSpec(typeSpec)

  if (expectedType === null) {
    throw new TypeError(`Invalid typeSpec: ${JSON.stringify(typeSpec)}`)
  }

  switch (expectedType.specType) {
    case ANY_TYPE:
      return expectedType.delayEvaluation
        ? (context, value) => Promise.resolve(value)
        : (context, value) => Promise.resolve(evaluate(context, value))
    case SINGLE_TYPE:
    case ONE_OF_TYPES:
    case ENUM_TYPE:
      return evaluateTypedAsync.bind(null, expectedType)
    case TUPLE_TYPE: {
      const itemParamResolvers = expectedType.items.map((itemResolver) =>
        asyncParamResolver(itemResolver)
      )

      return (context, value) => {
        return evaluateTypedAsync('array', context, value).then((array) => {
          return Promise.all(
            array.map((item, index) => {
              return itemParamResolvers[index](context, item)
            })
          )
        })
      }
    }
    case INDEFINITE_ARRAY_OF_TYPE: {
      const itemParamResolver = asyncParamResolver(expectedType.itemType)

      return (context, value) => {
        return evaluateTypedAsync('array', context, value).then((array) => {
          return Promise.all(
            array.map((item) => itemParamResolver(context, item))
          )
        })
      }
    }
    case OBJECT_TYPE: {
      const propertyParamResolvers = Object.keys(
        expectedType.properties
      ).reduce(
        (acc, key) => ({
          ...acc,
          [key]: asyncParamResolver(expectedType.properties[key]),
        }),
        {}
      )

      return (context, value) =>
        evaluateTypedAsync('object', context, value)
          .then((unresolvedObject) =>
            promiseResolveObject(unresolvedObject, (propertyValue, propertyKey) =>
              propertyParamResolvers[propertyKey](context, propertyValue)
            )
          )
          .then((resolvedObject) => {
            validateType(expectedType, resolvedObject)

            return resolvedObject
          })
    }
    case INDEFINITE_OBJECT_OF_TYPE: {
      const propertyParamResolver = asyncParamResolver(
        expectedType.propertyType
      )

      return (context, value) =>
        evaluateTypedAsync('object', context, value)
          .then((object) =>
            promiseResolveObject(object, (propertyValue) =>
              propertyParamResolver(context, propertyValue)
            )
          )
          .then((finalObject) => {
            validateType(expectedType, finalObject)

            return finalObject
          })
    }
  }
}
