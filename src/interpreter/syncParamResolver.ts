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

import { evaluate, evaluateTyped } from '../evaluate'

import { _pseudoSymbol } from '../util/misc'

const _NOT_RESOLVED = _pseudoSymbol()

const _syncParamResolverMemoCache = new WeakMap()

const _syncParamResolver = mem(
  (typeSpec: NonShorthandTypeSpec): ParamResolver => {
    if (typeSpec.skipEvaluation) {
      return (context, value) => value
    }

    switch (typeSpec.specType) {
      case ANY_TYPE_SPEC:
      case SINGLE_TYPE_SPEC:
      case ENUM_TYPE_SPEC:
        return evaluate
      case ONE_OF_TYPES_SPEC: {
        const candidateResolverPairs: [
          NonShorthandTypeSpec,
          ParamResolver
        ][] = typeSpec.types.map((type) => [type, _syncParamResolver(type)])

        return (context, value) => {
          const result = candidateResolverPairs.reduce(
            (acc, [candidateType, candidateResolver]) => {
              if (acc !== _NOT_RESOLVED) {
                return acc
              } else {
                const result = candidateResolver(context, value)

                return isType(candidateType, result) ? result : _NOT_RESOLVED
              }
            },
            _NOT_RESOLVED
          )

          return result === _NOT_RESOLVED ? value : result
        }
      }
      case TUPLE_TYPE_SPEC: {
        const itemParamResolvers = typeSpec.items.map((itemResolver) =>
          _syncParamResolver(itemResolver)
        )

        return (context, value) => {
          const array = evaluateTyped(
            'array',
            context,
            value
          ).map((item, index) => itemParamResolvers[index](context, item))

          return array
        }
      }
      case INDEFINITE_ARRAY_OF_TYPE_SPEC: {
        const itemParamResolver = _syncParamResolver(typeSpec.itemType)

        return (context, value) => {
          const array = evaluateTyped('array', context, value).map((item) =>
            itemParamResolver(context, item)
          )

          return array
        }
      }
      case OBJECT_TYPE_SPEC: {
        const propertyParamResolvers = Object.keys(typeSpec.properties).reduce(
          (acc, key) => ({
            ...acc,
            [key]: _syncParamResolver(typeSpec.properties[key]),
          }),
          {}
        )

        return (context, value) => {
          const _object = evaluateTyped('object', context, value)
          const object = Object.keys(_object).reduce(
            (acc, key) => ({
              ...acc,
              [key]: propertyParamResolvers[key](context, _object[key]),
            }),
            {}
          )

          return object
        }
      }
      case INDEFINITE_OBJECT_OF_TYPE_SPEC: {
        const propertyParamResolver = _syncParamResolver(typeSpec.propertyType)

        return (context, value) => {
          const _object = evaluateTyped('object', context, value)
          const object = Object.keys(_object).reduce(
            (acc, key) => ({
              ...acc,
              [key]: propertyParamResolver(context, _object[key]),
            }),
            {}
          )

          return object
        }
      }
    }
  },
  { cache: _syncParamResolverMemoCache }
)

/**
 * @function syncParamResolver
 * @private
 * @param {TypeSpec} typeSpec
 * @returns {ParamResolver}
 */
export const syncParamResolver = (
  typeSpec: NonShorthandTypeSpec
): ParamResolver => {
  const _paramResolver = _syncParamResolver(typeSpec)

  return (context, value) => {
    const param = _paramResolver(context, value)

    validateType(typeSpec, param)

    return param
  }
}
