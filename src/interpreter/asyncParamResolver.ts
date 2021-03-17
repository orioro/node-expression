import memoize from 'memoizee/weak'

import {
  ANY_TYPE,
  SINGLE_TYPE,
  ONE_OF_TYPES,
  ENUM_TYPE,
  INDEFINITE_ARRAY_OF_TYPE,
  INDEFINITE_OBJECT_OF_TYPE,
  TUPLE_TYPE,
  OBJECT_TYPE,
  NonShorthandTypeSpec,
} from '@orioro/typing'

import { validateType, isType } from '../typing'

import { ParamResolver } from '../types'

import { evaluate, evaluateTypedAsync } from '../evaluate'
import { promiseResolveObject } from '../util/promiseResolveObject'

import { _pseudoSymbol } from '../util/misc'

const _NOT_RESOLVED = _pseudoSymbol()

const _asyncParamResolver = memoize(
  (typeSpec: NonShorthandTypeSpec): ParamResolver => {
    if (typeSpec.skipEvaluation) {
      return (context, value) => Promise.resolve(value)
    }

    switch (typeSpec.specType) {
      case ANY_TYPE:
      case SINGLE_TYPE:
      case ENUM_TYPE:
        return (context, value) => Promise.resolve(evaluate(context, value))
      case ONE_OF_TYPES: {
        // This resolver is quite costly: it attempts to resolve
        // against each of the listed possible types
        const candidateResolverPairs: [
          NonShorthandTypeSpec,
          ParamResolver
        ][] = typeSpec.types.map((type) => [type, _asyncParamResolver(type)])

        return (context, value) => {
          return candidateResolverPairs
            .reduce((accPromise, [candidateType, candidateResolver]) => {
              return accPromise.then((acc) => {
                if (acc !== _NOT_RESOLVED) {
                  return acc
                } else {
                  return candidateResolver(context, value).then((result) => {
                    return isType(candidateType, result)
                      ? result
                      : _NOT_RESOLVED
                  })
                }
              })
            }, Promise.resolve(_NOT_RESOLVED))
            .then((result) => (result === _NOT_RESOLVED ? value : result))
        }
      }
      case TUPLE_TYPE: {
        const itemParamResolvers = typeSpec.items.map((itemResolver) =>
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
        const itemParamResolver = _asyncParamResolver(typeSpec.itemType)

        return (context, value) => {
          return evaluateTypedAsync('array', context, value).then((array) => {
            return Promise.all(
              array.map((item) => itemParamResolver(context, item))
            )
          })
        }
      }
      case OBJECT_TYPE: {
        const propertyParamResolvers = Object.keys(typeSpec.properties).reduce(
          (acc, key) => ({
            ...acc,
            [key]: _asyncParamResolver(typeSpec.properties[key]),
          }),
          {}
        )

        return (context, value) =>
          evaluateTypedAsync(
            'object',
            context,
            value
          ).then((unresolvedObject) =>
            promiseResolveObject(
              unresolvedObject,
              (propertyValue, propertyKey) =>
                propertyParamResolvers[propertyKey](context, propertyValue)
            )
          )
      }
      case INDEFINITE_OBJECT_OF_TYPE: {
        const propertyParamResolver = _asyncParamResolver(typeSpec.propertyType)

        return (context, value) =>
          evaluateTypedAsync('object', context, value).then((object) =>
            promiseResolveObject(object, (propertyValue) =>
              propertyParamResolver(context, propertyValue)
            )
          )
      }
    }
  }
)

/**
 * @function asyncParamResolver
 */
export const asyncParamResolver = (
  typeSpec: NonShorthandTypeSpec
): ParamResolver => {
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
