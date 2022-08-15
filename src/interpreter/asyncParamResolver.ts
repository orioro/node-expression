const mem = require('mem') // eslint-disable-line @typescript-eslint/no-var-requires

import {
  ANY_TYPE_SPEC,
  SINGLE_TYPE_SPEC,
  ONE_OF_TYPES_SPEC,
  ENUM_TYPE_SPEC,
  INDEFINITE_ARRAY_OF_TYPE_SPEC,
  INDEFINITE_OBJECT_OF_TYPE_SPEC,
  TUPLE_TYPE_SPEC,
  OBJECT_TYPE_SPEC,
  NonShorthandTypeSpec,
} from '@orioro/typing'

import { validateType, isType } from '../typing'

import { ParamResolver } from '../types'

import { evaluate, evaluateTypedAsync } from '../evaluate'
import { promiseResolveObject } from '../util/promiseResolveObject'

import { _pseudoSymbol } from '../util/misc'

const _NOT_RESOLVED = _pseudoSymbol()

const _asyncParamResolverMemoCache = new WeakMap()

const _asyncParamResolver = mem(
  (typeSpec: NonShorthandTypeSpec): ParamResolver => {
    if (typeSpec.skipEvaluation) {
      return (context, value) => Promise.resolve(value)
    }

    switch (typeSpec.specType) {
      case ANY_TYPE_SPEC:
      case SINGLE_TYPE_SPEC:
      case ENUM_TYPE_SPEC:
        return (context, value) => Promise.resolve(evaluate(context, value))
      case ONE_OF_TYPES_SPEC: {
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
      case TUPLE_TYPE_SPEC: {
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
      case INDEFINITE_ARRAY_OF_TYPE_SPEC: {
        const itemParamResolver = _asyncParamResolver(typeSpec.itemType)

        return (context, value) => {
          return evaluateTypedAsync('array', context, value).then((array) => {
            return Promise.all(
              array.map((item) => itemParamResolver(context, item))
            )
          })
        }
      }
      case OBJECT_TYPE_SPEC: {
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
      case INDEFINITE_OBJECT_OF_TYPE_SPEC: {
        const propertyParamResolver = _asyncParamResolver(typeSpec.propertyType)

        return (context, value) =>
          evaluateTypedAsync('object', context, value).then((object) =>
            promiseResolveObject(object, (propertyValue) =>
              propertyParamResolver(context, propertyValue)
            )
          )
      }
    }
  },
  { cache: _asyncParamResolverMemoCache }
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
