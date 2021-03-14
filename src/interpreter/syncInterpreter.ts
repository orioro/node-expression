import { isPlainObject } from 'lodash'

import {
  InterpreterSpecSingle,
  InterpreterList,
  InterpreterFunction,
} from '../types'

import { syncParamResolver } from './syncParamResolver'

/**
 * @todo syncInterpreter Update Interpreter type: remove function
 * @function syncInterpreter
 * @returns {Interpreter}
 */
export const syncInterpreter = (
  spec: InterpreterSpecSingle
): InterpreterFunction => {
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
  const syncParamResolvers = paramTypeSpecs.map((typeSpec) =>
    syncParamResolver(typeSpec)
  )

  return (context, ...args) =>
    fn(
      ...syncParamResolvers.map((typeSpec, index) => {
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

// export const syncInterpreterList = (
//   specs: InterpreterList
// ): InterpreterFunctionList =>
//   Object.keys(specs).reduce(
//     (acc, interperterId) => ({
//       ...acc,
//       [interperterId]: syncInterpreter(specs[interperterId]),
//     }),
//     {}
//   )
