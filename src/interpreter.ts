import { isPlainObject } from 'lodash'

import {
  EvaluationContext,
  ExpressionInterpreter,
  ExpressionInterpreterList,
  ExpressionInterpreterFunction,
  ExpressionInterpreterFunctionList,
} from './types'

import { evaluateTyped, evaluateTypedAsync } from './evaluate'

import { ParamResolver } from './types'

const _paramResolverNoop = (context: EvaluationContext, arg: any): any => arg

const _isExpectedType = (resolver: ParamResolver): boolean =>
  Array.isArray(resolver) ||
  isPlainObject(resolver) ||
  typeof resolver === 'string'

// export const interpreter = (
//   interpreterFn: (...args: any[]) => any,
//   paramResolvers: ParamResolver[],
//   defaultScopeValue: boolean | number = true
// ) => [
//   interpreterFn,
//   paramResolvers,
//   {
//     defaultParam:
//       defaultScopeValue === false
//         ? -1
//         : defaultScopeValue === true
//         ? paramResolvers.length - 1
//         : defaultScopeValue,
//   },
// ]

const _paramResolver = (evaluateTyped, resolver) => {
  if (typeof resolver === 'function') {
    return resolver
  } else if (_isExpectedType(resolver)) {
    return evaluateTyped.bind(null, resolver)
  } else if (resolver === null) {
    return _paramResolverNoop
  } else {
    throw new TypeError(
      `Expected resolver to be either Function | ExpectedType | 'any' | null, but got ${typeof resolver}: ${resolver}`
    )
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
  const _paramResolvers = paramResolvers.map((resolver) =>
    _paramResolver(evaluateTyped, resolver)
  )

  return (context, ...args) =>
    fn(
      ..._paramResolvers.map((resolver, index) => {
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
  const _paramResolvers = paramResolvers.map((resolver) =>
    _paramResolver(evaluateTypedAsync, resolver)
  )

  return (context, ...args) =>
    Promise.all(
      _paramResolvers.map((resolver, index) => {
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
