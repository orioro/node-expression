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
} from '../types'

import { evaluate, evaluateTypedAsync } from '../evaluate'

const _asyncParamResolverNoop = (context: EvaluationContext, arg: any): any =>
  arg

const _resolveObject = (object, resolver) => {
  const keys = Object.keys(object)

  return Promise.all(keys.map((key) => resolver(object[key]))).then((values) =>
    values.reduce((acc, value, index) => {
      const key = keys[index]

      return {
        ...acc,
        [key]: value,
      }
    }, {})
  )
}

const _resolveArray = (array, resolver) =>
  Promise.all(array.map((item) => resolver(item)))

const _asyncParamResolver = (resolver: ParamResolver) => {
  const expectedType = castTypeSpec(resolver)

  if (expectedType !== null) {
    switch (expectedType.specType) {
      case ANY_TYPE:
      case SINGLE_TYPE:
      case ONE_OF_TYPES:
      case ENUM_TYPE:
        return evaluateTypedAsync.bind(null, expectedType)
      case TUPLE_TYPE: {
        const itemParamResolvers = expectedType.items.map((itemResolver, index) =>
          _asyncParamResolver(itemResolver)
        )

        return (context, value) => {
          return evaluateTypedAsync('array', context, value)
            .then(array => {
              return Promise.all(array.map((item, index) => {
                return itemParamResolvers[index](context, item)
              }))
            })
        }
      }
      case INDEFINITE_ARRAY_OF_TYPE: {
        const itemParamResolver = _asyncParamResolver(expectedType.itemType)

        return (context, value) => {
          return evaluateTypedAsync('array', context, value)
            .then(array => {
              return Promise.all(array.map(item => itemParamResolver(context, item)))
            })
        }
      }
      // case INDEFINITE_ARRAY_OF_TYPE:
      //   return (context, value) =>
      //     evaluateTypedAsync('array', context, value)
      //       .then((array) =>
      //         _resolveArray(array, (item) => evaluate(context, item))
      //       )
      //       .then((finalArray) => {
      //         validateType(expectedType, finalArray)

      //         return finalArray
      //       })
      case OBJECT_TYPE:
      case INDEFINITE_OBJECT_OF_TYPE:
        return (context, value) =>
          evaluateTypedAsync('object', context, value)
            .then((object) =>
              _resolveObject(object, (item) => evaluate(context, item))
            )
            .then((finalObject) => {
              validateType(expectedType, finalObject)

              return finalObject
            })
    }
  } else {
    if (typeof resolver === 'function') {
      return resolver
    } else if (resolver === null) {
      return _asyncParamResolverNoop
    } else {
      throw new TypeError(
        `Expected resolver to be either Function | ExpectedType | 'any' | null, but got ${typeof resolver}: ${resolver}`
      )
    }
  }
}

export const asyncInterpreter = (
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
  const _asyncParamResolvers = paramResolvers.map((resolver) =>
    _asyncParamResolver(resolver)
  )

  return (context, ...args) =>
    Promise.all(
      _asyncParamResolvers.map((resolver, index) => {
        // Last param defaults to $$VALUE
        const arg =
          args[index] === undefined && index === defaultParam
            ? ['$value', '$$VALUE']
            : args[index]
        return resolver(context, arg)
      })
    ).then((resolvedArgs) => fn(...resolvedArgs, context))
}

export const asyncInterpreterList = (
  specs: ExpressionInterpreterList
): ExpressionInterpreterFunctionList =>
  Object.keys(specs).reduce(
    (acc, interperterId) => ({
      ...acc,
      [interperterId]: asyncInterpreter(specs[interperterId]),
    }),
    {}
  )
