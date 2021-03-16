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

import { ParamResolver, TypeSpec } from '../types'

import { evaluate, evaluateTyped } from '../evaluate'

/**
 * @todo syncInterpreter Study better ways at validating evlauation results for
 *                       tupleType and indefiniteArrayOfType. Currently validation is highly redundant.
 * @function syncParamResolver
 * @private
 * @param {TypeSpec} typeSpec
 * @returns {ParamResolver}
 */
export const syncParamResolver = (typeSpec: TypeSpec): ParamResolver => {
  const expectedType = castTypeSpec(typeSpec)

  if (expectedType === null) {
    throw new TypeError(`Invalid typeSpec: ${JSON.stringify(typeSpec)}`)
  }

  switch (expectedType.specType) {
    case ANY_TYPE:
      return expectedType.delayEvaluation ? (context, value) => value : evaluate
    case SINGLE_TYPE:
    case ONE_OF_TYPES:
    case ENUM_TYPE:
      return evaluateTyped.bind(null, expectedType)
    case TUPLE_TYPE: {
      const itemParamResolvers = expectedType.items.map((itemResolver) =>
        syncParamResolver(itemResolver)
      )

      return (context, value) => {
        const array = evaluateTyped(
          'array',
          context,
          value
        ).map((item, index) => itemParamResolvers[index](context, item))

        validateType(expectedType, array)

        return array
      }
    }
    case INDEFINITE_ARRAY_OF_TYPE: {
      const itemParamResolver = syncParamResolver(expectedType.itemType)

      return (context, value) => {
        const array = evaluateTyped('array', context, value).map((item) =>
          itemParamResolver(context, item)
        )

        validateType(expectedType, array)

        return array
      }
    }
    case OBJECT_TYPE: {
      const propertyParamResolvers = Object.keys(
        expectedType.properties
      ).reduce(
        (acc, key) => ({
          ...acc,
          [key]: syncParamResolver(expectedType.properties[key]),
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

        validateType(expectedType, object)

        return object
      }
    }
    case INDEFINITE_OBJECT_OF_TYPE:
      return (context, value) => {
        const propertyParamResolver = syncParamResolver(
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

        validateType(expectedType, object)

        return object
      }
  }
}
