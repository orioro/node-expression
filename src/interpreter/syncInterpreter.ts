import { isPlainObject } from 'lodash'

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

import {
  EvaluationContext,
  ExpressionInterpreter,
  ExpressionInterpreterList,
  ExpressionInterpreterFunction,
  ExpressionInterpreterFunctionList,
  ParamResolverFunction,
  TypeSpec,
} from '../types'

import { evaluate, evaluateTyped } from '../evaluate'

/**
 * @todo syncInterpreter Study better ways at validating evlauation results for
 *                       tupleType and indefiniteArrayOfType. Currently validation is highly redundant.
 * @todo syncInterpreter Handle nested object param typeSpec
 * @function _syncParamResolver
 * @private
 * @param {TypeSpec} typeSpec
 * @returns {ParamResolverFunction}
 */
export const _syncParamResolver = (
  typeSpec: TypeSpec
): ParamResolverFunction => {
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
        _syncParamResolver(itemResolver)
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
      const itemParamResolver = _syncParamResolver(expectedType.itemType)

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

        validateType(expectedType, object)

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

        validateType(expectedType, object)

        return object
      }
  }
}

/**
 * @todo syncInterpreter Update ExpressionInterpreter type: remove function
 * @function syncInterpreter
 * @returns {ExpressionInterpreter}
 */
export const syncInterpreter = (
  spec: ExpressionInterpreter
): ExpressionInterpreterFunction => {
  if (typeof spec === 'function') {
    return spec
  }

  const [
    fn,
    paramTypeSpecs,
    { defaultParam = paramTypeSpecs.length - 1 } = {},
  ] = spec

  //
  // Bring all evaluation logic that is possible
  // to outside the returned interperter wrapper function
  // in order to minimize expression evaluation performance
  //
  const _syncParamResolvers = paramTypeSpecs.map((typeSpec) =>
    _syncParamResolver(typeSpec)
  )

  return (context, ...args) =>
    fn(
      ..._syncParamResolvers.map((typeSpec, index) => {
        // Last param defaults to $$VALUE
        const arg =
          args[index] === undefined && index === defaultParam
            ? ['$value', '$$VALUE']
            : args[index]
        return typeSpec(context, arg)
      }),
      context
    )
}

export const syncInterpreterList = (
  specs: ExpressionInterpreterList
): ExpressionInterpreterFunctionList =>
  Object.keys(specs).reduce(
    (acc, interperterId) => ({
      ...acc,
      [interperterId]: syncInterpreter(specs[interperterId]),
    }),
    {}
  )
