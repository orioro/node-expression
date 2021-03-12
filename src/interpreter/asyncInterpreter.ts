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
  TypeSpec,
} from '../types'

import { evaluate, evaluateTypedAsync } from '../evaluate'

const _asyncParamResolverNoop = (context: EvaluationContext, arg: any): any =>
  arg

const _resolveObject = (object, resolver) => {
  const keys = Object.keys(object)

  return Promise.all(keys.map((key) => resolver(object[key], key))).then(
    (values) =>
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

export const _asyncParamResolver = (typeSpec: TypeSpec) => {
  const expectedType = castTypeSpec(typeSpec)

  if (expectedType === null) {
    throw new TypeError(`Invalid typeSpec: ${JSON.stringify(typeSpec)}`)
  }

  switch (expectedType.specType) {
    case ANY_TYPE:
      return expectedType.delayEvaluation
        ? (context, value) => Promise.resolve(value)
        : (context, value) => Promise.resolve(evaluate(context, value))
    case SINGLE_TYPE:
    case ONE_OF_TYPES:
    case ENUM_TYPE:
      return evaluateTypedAsync.bind(null, expectedType)
    case TUPLE_TYPE: {
      const itemParamResolvers = expectedType.items.map((itemResolver, index) =>
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
        evaluateTypedAsync('object', context, value)
          .then((unresolvedObject) =>
            _resolveObject(unresolvedObject, (propertyValue, propertyKey) =>
              propertyParamResolvers[propertyKey](context, propertyValue)
            )
          )
          .then((resolvedObject) => {
            validateType(expectedType, resolvedObject)

            return resolvedObject
          })
    }
    case INDEFINITE_OBJECT_OF_TYPE: {
      const propertyParamResolver = _asyncParamResolver(
        expectedType.propertyType
      )

      return (context, value) =>
        evaluateTypedAsync('object', context, value)
          .then((object) =>
            _resolveObject(object, (propertyValue) =>
              propertyParamResolver(context, propertyValue)
            )
          )
          .then((finalObject) => {
            validateType(expectedType, finalObject)

            return finalObject
          })
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
