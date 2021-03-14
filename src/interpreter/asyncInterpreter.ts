import { isPlainObject } from 'lodash'

import {
  InterpreterSpecSingle,
  InterpreterList,
  InterpreterFunction,
} from '../types'

import { asyncParamResolver } from './asyncParamResolver'

import { promiseResolveObject } from '../util/promiseResolveObject'

export const asyncInterpreter = (
  spec: InterpreterSpecSingle
): InterpreterFunction => {
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
  // .then((result) => {
  //   if (Array.isArray(result)) {
  //     return Promise.all(result)
  //   } else if (isPlainObject(result)) {
  //     return result
  //     // return promiseResolveObject(result, (value, key) => value)
  //   } else {
  //     return result
  //   }
  // })
}

// export const asyncInterpreterList = (
//   specs: InterpreterList
// ): InterpreterFunctionList =>
//   Object.keys(specs).reduce(
//     (acc, interperterId) => ({
//       ...acc,
//       [interperterId]: asyncInterpreter(specs[interperterId]),
//     }),
//     {}
//   )
