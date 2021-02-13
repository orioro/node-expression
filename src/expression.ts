import { validateType } from '@orioro/validate-type'

import {
  Expression,
  ExpressionInterpreter,
  ExpressionInterpreterList,
  EvaluationContext,
} from './types'

/**
 * @function isExpression
 * @param {ExpressionInterpreterList}
 */
export const isExpression = (
  interpreters: ExpressionInterpreterList,
  candidateExpression: any // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
): boolean =>
  Array.isArray(candidateExpression) &&
  typeof interpreters[candidateExpression[0]] === 'function'

/**
 * @function evaluate
 * @param {EvaluationContext} context
 * @param {Expression | *} expOrValue
 * @returns {*}
 */
export const evaluate = (
  context: EvaluationContext,
  expOrValue: Expression | any
): any => {
  if (!isExpression(context.interpreters, expOrValue)) {
    return expOrValue
  }

  const [interpreterId, ...interpreterArgs] = expOrValue
  const interpreter = context.interpreters[interpreterId]

  return interpreter(context, ...interpreterArgs)
}

/**
 * @function evaluateTyped
 * @param {String | string[]} expectedTypes
 * @param {EvaluationContext} context
 * @param {Expression | any} expOrValue
 * @returns {*}
 */
export const evaluateTyped = (
  expectedTypes: string | string[],
  context: EvaluationContext,
  expOrValue: Expression | any
): any => {
  const value = evaluate(context, expOrValue)
  validateType(expectedTypes, value)
  return value
}

// /**
//  * @function interpreter
//  * @param {Function} fn The function that resolves the expression's value.
//  *                      This function receives the resolved parameters.
//  * @param {Function[]} argResolvers List of functions that should be called
//  *                                  for resolving each of the expression's
//  *                                  arguments
//  * @returns {ExpressionInterpreter}
//  */
// export const interpreter = (
//   fn:(...args:any[]) => any,
//   argResolvers:((context:EvaluationContext, input:any) => any)[] | null = null
// ) => (
//   argResolvers !== null && Array.isArray(argResolvers)
//     ? (context:EvaluationContext, ...args) => (
//         fn(...argResolvers.map((resolver, index) => {
//           // Last arg defaults to $$VALUE
//           const arg = (args[index] === undefined && index === argResolvers.length - 1)
//             ? ['$value', '$$VALUE']
//             : args[index]
//           return resolver(context, arg)
//         }))
//       )
//     : (context:EvaluationContext, ...args) => fn(...args)
// )

type ParamResolverFunction = (context: EvaluationContext, arg: any) => any

/**
 * Defines how an expression argument should be resolved
 * before being passed onto the expression interpreter function.
 * - function(context, argumentValue): a function to be invoked with the evaluation context
 *   and the argument value
 * - null: argument is passed on just as received
 * - string: argument is evaluated and the result is checked for its type. Possible values:
 *   - string
 *   - regexp
 *   - number
 *   - bigint
 *   - nan
 *   - null
 *   - undefined
 *   - boolean
 *   - function
 *   - object
 *   - array
 *   - date
 *   - symbol
 *   - map
 *   - set
 *   - weakmap
 *   - weakset
 *   - any
 *
 * @typedef {Function | null | string | string[]} ParamResolver
 */
type ParamType =
  | 'string'
  | 'regexp'
  | 'number'
  | 'bigint'
  | 'nan'
  | 'null'
  | 'undefined'
  | 'boolean'
  | 'function'
  | 'object'
  | 'array'
  | 'date'
  | 'symbol'
  | 'map'
  | 'set'
  | 'weakmap'
  | 'weakset'
  | 'any'
export type ParamResolver =
  | ParamResolverFunction
  | null
  | ParamType
  | ParamType[]

const paramResolverNoop = (context: EvaluationContext, arg: any): any => arg

/**
 * @function interpreter
 * @param {Function} interpreterFn Function that executes logic for interpreting the
 *                                 expression. If `paramResolvers` are not null, the
 *                                 interpreterFn is invoked with the list of resolved
 *                                 parameters + the evaluation context as last
 *                                 argument.
 * @param {ParamResolver[] | null} paramResolvers A list of resolvers that will
 *                                                convert the arguments given to the
 *                                                expression into the parameters
 *                                                of the interpreter function
 * @param {Boolean} [defaultLastArgToScopeValue=true] Whether the last argument of the
 *                                                    expression should default to the
 *                                                    context's scope's value
 *                                                    ['$value', '$$VALUE']
 * @returns {ExpressionInterpreter}
 */
export const interpreter = (
  interpreterFn: (...args: any[]) => any,
  paramResolvers: ParamResolver[] | null,
  defaultLastArgToScopeValue = true
): ExpressionInterpreter => {
  validateType(['array', 'null'], paramResolvers)

  if (Array.isArray(paramResolvers)) {
    //
    // Bring all evaluation logic that is possible
    // to outside the returned interperter wrapper function
    // in order to minimize expression evaluation performance
    //
    const _paramResolvers = paramResolvers.map((resolver) => {
      if (typeof resolver === 'function') {
        return resolver
      } else if (Array.isArray(resolver) || typeof resolver === 'string') {
        return resolver === 'any'
          ? evaluate
          : evaluateTyped.bind(null, resolver)
      } else if (resolver === null) {
        return paramResolverNoop
      } else {
        throw new TypeError(
          `Expected resolver to be either Function | ExpectedType | 'any' | null, but got ${typeof resolver}: ${resolver}`
        )
      }
    })

    //
    // For difference between `argument` and `parameter` definitions, see:
    // https://developer.mozilla.org/en-US/docs/Glossary/Parameter
    //
    return defaultLastArgToScopeValue
      ? (context: EvaluationContext, ...args) => {
          return interpreterFn(
            ..._paramResolvers.map((resolver, index) => {
              // Last param defaults to $$VALUE
              const arg =
                args[index] === undefined &&
                index === _paramResolvers.length - 1
                  ? ['$value', '$$VALUE']
                  : args[index]
              return resolver(context, arg)
            }),
            context
          )
        }
      : (context: EvaluationContext, ...args) =>
          interpreterFn(
            ..._paramResolvers.map((resolver, index) =>
              resolver(context, args[index])
            ),
            context
          )
  } else {
    //
    // By default all arguments are evaluated before
    // being passed on to the interpreter
    //
    return (context: EvaluationContext, ...args) =>
      interpreterFn(...args.map((arg) => evaluate(context, arg)))
  }
}
