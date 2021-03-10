import { InterpreterSpecSingle, InterpreterFunction } from '../types'

import { asyncParamResolver } from './asyncParamResolver'

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
}
