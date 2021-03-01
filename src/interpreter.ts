import { validateType, ExpectedType } from '@orioro/typing'

import { isPlainObject } from 'lodash'

import { EvaluationContext, ExpressionInterpreter } from './types'

import { evaluate, evaluateTyped } from './evaluate'

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
export type ParamResolver =
  | ParamResolverFunction
  | null
  | ExpectedType
  | ExpectedType[]

const _paramResolverNoop = (context: EvaluationContext, arg: any): any => arg

const _isExpectedType = (resolver: ParamResolver): boolean =>
  Array.isArray(resolver) ||
  isPlainObject(resolver) ||
  typeof resolver === 'string'

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
 * @param {Boolean} [defaultScopeValue=true] Whether the last argument of the
 *                                           expression should default to the
 *                                           context's scope's value
 *                                           ['$value', '$$VALUE']. If given a number,
 *                                           indicates the index of the parameter
 *                                           that should get the scope value by default
 * @returns {ExpressionInterpreter}
 */
export const interpreter = (
  interpreterFn: (...args: any[]) => any,
  paramResolvers: ParamResolver[] | null,
  defaultScopeValue: boolean | number = true
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
      } else if (_isExpectedType(resolver)) {
        return resolver === 'any'
          ? evaluate
          : evaluateTyped.bind(null, resolver)
      } else if (resolver === null) {
        return _paramResolverNoop
      } else {
        throw new TypeError(
          `Expected resolver to be either Function | ExpectedType | 'any' | null, but got ${typeof resolver}: ${resolver}`
        )
      }
    })

    defaultScopeValue =
      defaultScopeValue === true
        ? _paramResolvers.length - 1
        : defaultScopeValue

    //
    // For difference between `argument` and `parameter` definitions, see:
    // https://developer.mozilla.org/en-US/docs/Glossary/Parameter
    //
    return typeof defaultScopeValue === 'number'
      ? (context: EvaluationContext, ...args) => {
          return interpreterFn(
            ..._paramResolvers.map((resolver, index) => {
              // Last param defaults to $$VALUE
              const arg =
                args[index] === undefined && index === defaultScopeValue
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
