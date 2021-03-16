import {
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

import { validateType } from '../typing'

import { TypeSpec, ParamResolver } from '../types'

import { evaluate, evaluateTypedAsync } from '../evaluate'
import { promiseResolveObject } from '../util/promiseResolveObject'

const _asyncParamResolver = (typeSpec: TypeSpec): ParamResolver => {
  const expectedType = castTypeSpec(typeSpec)

  if (expectedType === null) {
    throw new TypeError(`Invalid typeSpec: ${JSON.stringify(typeSpec)}`)
  }

  if (expectedType.skipEvaluation) {
    return (context, value) => Promise.resolve(value)
  }

  switch (expectedType.specType) {
    case ANY_TYPE:
    case SINGLE_TYPE:
    case ONE_OF_TYPES:
    case ENUM_TYPE:
      return (context, value) => Promise.resolve(evaluate(context, value))
    case TUPLE_TYPE: {
      const itemParamResolvers = expectedType.items.map((itemResolver) =>
        _asyncParamResolver(itemResolver)
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
      const itemParamResolver = _asyncParamResolver(expectedType.itemType)

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
          [key]: _asyncParamResolver(expectedType.properties[key]),
        }),
        {}
      )

      return (context, value) =>
        evaluateTypedAsync('object', context, value).then((unresolvedObject) =>
          promiseResolveObject(unresolvedObject, (propertyValue, propertyKey) =>
            propertyParamResolvers[propertyKey](context, propertyValue)
          )
        )
    }
    case INDEFINITE_OBJECT_OF_TYPE: {
      const propertyParamResolver = _asyncParamResolver(
        expectedType.propertyType
      )

      return (context, value) =>
        evaluateTypedAsync('object', context, value).then((object) =>
          promiseResolveObject(object, (propertyValue) =>
            propertyParamResolver(context, propertyValue)
          )
        )
    }
  }
}

/**
 * @function asyncParamResolver
 * @todo asyncParamResolver ONE_OF_TYPES: handle complex cases, e.g.
                         oneOfTypes(['string', objectType({ key1: 'string', key2: 'number '})]) (src/interpreter/asyncParamResolver.ts)
 */
export const asyncParamResolver = (typeSpec: TypeSpec): ParamResolver => {
  // `_asyncParamResolver` (private) contains the logic for the resolution itself
  // but does not run any kind of validation
  // validation is executed at `asyncParamResolver` (public)
  const _paramResolver = _asyncParamResolver(typeSpec)

  return (context, value) =>
    _paramResolver(context, value).then((param) => {
      validateType(typeSpec, param)

      return param
    })
}
