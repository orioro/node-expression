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
} from './types'

import { evaluate, evaluateTyped } from './evaluate'

const _syncParamResolverNoop = (context: EvaluationContext, arg: any): any =>
  arg

/**
 * @function _syncParamResolver
 * @private
 * @param {TypeSpec} resolver
 * @returns {ParamResolverFunction}
 */
export const _syncParamResolver = (resolver: TypeSpec): ParamResolverFunction => {
  const expectedType = castTypeSpec(resolver)

  if (expectedType === null) {
    throw new TypeError(
      `Expected resolver to be either Function | ExpectedType | 'any' | null, but got ${typeof resolver}: ${resolver}`
    )
  }

  switch (expectedType.specType) {
    case ANY_TYPE:
      return expectedType.delayEvaluation
        ? (context, value) => value
        : evaluate
    case SINGLE_TYPE:
    case ONE_OF_TYPES:
    case ENUM_TYPE:
      return evaluateTyped.bind(null, expectedType)
    case TUPLE_TYPE: {
      const itemParamResolvers = expectedType.items.map(itemResolver =>
        _syncParamResolver(itemResolver)
      )

      return (context, value) => {
        const array = evaluateTyped('array', context, value).map((item, index) =>
          itemParamResolvers[index](context, item)
        )

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
    case OBJECT_TYPE:
    case INDEFINITE_OBJECT_OF_TYPE:
      return (context, value) => {
        const _object = evaluateTyped('object', context, value)
        const object = Object.keys(_object).reduce(
          (acc, key) => ({
            ...acc,
            [key]: evaluate(context, _object[key]),
          }),
          {}
        )

        validateType(expectedType, object)

        return object
      }
  }
}

/**
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
    paramResolvers,
    { defaultParam = paramResolvers.length - 1 } = {},
  ] = spec

  //
  // Bring all evaluation logic that is possible
  // to outside the returned interperter wrapper function
  // in order to minimize expression evaluation performance
  //
  const _syncParamResolvers = paramResolvers.map((resolver) =>
    _syncParamResolver(resolver)
  )

  return (context, ...args) =>
    fn(
      ..._syncParamResolvers.map((resolver, index) => {
        // Last param defaults to $$VALUE
        const arg =
          args[index] === undefined && index === defaultParam
            ? ['$value', '$$VALUE']
            : args[index]
        return resolver(context, arg)
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
