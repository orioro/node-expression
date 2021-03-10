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
} from './types'

import { evaluate, evaluateTyped } from './evaluate'

import { ParamResolver } from './types'

const _syncParamResolverNoop = (context: EvaluationContext, arg: any): any =>
  arg

const _syncParamResolver = (evaluateTyped, resolver) => {
  const expectedType = castTypeSpec(resolver)

  if (expectedType !== null) {
    switch (expectedType.specType) {
      case ANY_TYPE:
      case SINGLE_TYPE:
      case ONE_OF_TYPES:
      case ENUM_TYPE:
        return evaluateTyped.bind(null, expectedType)
      case TUPLE_TYPE:
      case INDEFINITE_ARRAY_OF_TYPE:
        return (context, value) => {
          const array = evaluateTyped('array', context, value).map((item) =>
            evaluate(context, item)
          )

          validateType(expectedType, array)
          return array
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
  } else {
    if (typeof resolver === 'function') {
      return resolver
    } else if (resolver === null) {
      return _syncParamResolverNoop
    } else {
      throw new TypeError(
        `Expected resolver to be either Function | ExpectedType | 'any' | null, but got ${typeof resolver}: ${resolver}`
      )
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
    _syncParamResolver(evaluateTyped, resolver)
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
