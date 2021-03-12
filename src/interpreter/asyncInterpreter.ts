import {
  ExpressionInterpreter,
  ExpressionInterpreterList,
  ExpressionInterpreterFunction,
  ExpressionInterpreterFunctionList,
} from '../types'

import { asyncParamResolver } from './asyncParamResolver'

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
  const asyncParamResolvers = paramResolvers.map((resolver) =>
    asyncParamResolver(resolver)
  )

  return (context, ...args) =>
    Promise.all(
      asyncParamResolvers.map((resolver, index) => {
        // Last param defaults to $$VALUE
        const arg =
          args[index] === undefined && index === defaultParam
            ? ['$value', '$$VALUE']
            : args[index]
        return resolver(context, arg)
      })
    ).then((resolvedArgs) => fn(...resolvedArgs, context))
      .then(result => {
        if (Array.isArray(result)) {
          return Promise.all(result)
        } else {
          return result
        }
      })
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
