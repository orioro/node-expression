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

import { ParamResolver, TypeSpec } from '../types'

import { evaluate, evaluateTyped } from '../evaluate'

const _syncParamResolver = (typeSpec: TypeSpec): ParamResolver => {
  const expectedType = castTypeSpec(typeSpec)

  if (expectedType === null) {
    throw new TypeError(`Invalid typeSpec: ${JSON.stringify(typeSpec)}`)
  }

  if (expectedType.skipEvaluation) {
    return (context, value) => value
  }

  switch (expectedType.specType) {
    case ANY_TYPE:
    case SINGLE_TYPE:
    case ONE_OF_TYPES:
    case ENUM_TYPE:
      return evaluate
    case TUPLE_TYPE: {
      const itemParamResolvers = expectedType.items.map((itemResolver) =>
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
    case INDEFINITE_ARRAY_OF_TYPE: {
      const itemParamResolver = _syncParamResolver(expectedType.itemType)

      return (context, value) => {
        const array = evaluateTyped('array', context, value).map((item) =>
          itemParamResolver(context, item)
        )

        return array
      }
    }
    case OBJECT_TYPE: {
      const propertyParamResolvers = Object.keys(
        expectedType.properties
      ).reduce(
        (acc, key) => ({
          ...acc,
          [key]: _syncParamResolver(expectedType.properties[key]),
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
    case INDEFINITE_OBJECT_OF_TYPE:
      return (context, value) => {
        const propertyParamResolver = _syncParamResolver(
          expectedType.propertyType
        )

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

/**
 * @function syncParamResolver
 * @private
 * @param {TypeSpec} typeSpec
 * @returns {ParamResolver}
 */
export const syncParamResolver = (typeSpec: TypeSpec): ParamResolver => {
  const _paramResolver = _syncParamResolver(typeSpec)

  return (context, value) => {
    const param = _paramResolver(context, value)

    validateType(typeSpec, param)

    return param
  }
}
