import { TypeAlternatives, TypeMap, TypeSpec } from '@orioro/typing'

export { TypeAlternatives, TypeMap }

export type ParamResolverFunction = (context: EvaluationContext, arg: any) => any

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
export type ParamResolver = null | TypeSpec

/**
 * An expression is an array tuple with the first item
 * as a string identifier.
 *
 * @typedef {[String, ...rest]} Expression
 */
export type Expression = [string, ...any[]]

/**
 * Specification of an expression interpreter. In this format
 * the resulting expression interpreter (prepared through either
 * `syncInterpreter`, `syncInterpreterList`, `asyncInterpreter` or
 * `asyncInterpreterList`) may be compatible with sync and async formats.
 *
 * @typedef {[Function, ParamResolver[] | null, Object]} ExpressionInterpreterSpec
 * @param {Function} interpreterFn Function that executes logic for interpreting the
 *                                 expression. If `paramResolvers` are not null, the
 *                                 interpreterFn is invoked with the list of resolved
 *                                 parameters + the evaluation context as last
 *                                 argument.
 * @param {ParamResolver[] | null} paramResolvers A list of resolvers that will
 *                                                convert the arguments given to the
 *                                                expression into the parameters
 *                                                of the interpreter function
 * @param {Object} [options={ defaultParam = paramResolvers.length}] The index of the
 *                                                                   argument that should receive
 *                                                                   the default value (`scope.$$VALUE`).
 *                                                                   By default, is the last parameter.
 *                                                                   In case the defaultParameter should not
 *                                                                   be used, use `defaultParam = -1`
 */
export type ExpressionInterpreterSpec = [
  (...args: any) => any,
  ParamResolver[],
  { defaultParam?: number }?
]

/**
 * Function that receives as first parameter the EvaluationContext
 * and should return the result for evaluating a given expression.
 *
 * @typedef {Function} ExpressionInterpreterFunction
 */
export type ExpressionInterpreterFunction = (
  context: EvaluationContext,
  ...args: any[]
) => any

export type ExpressionInterpreter =
  | ExpressionInterpreterSpec
  | ExpressionInterpreterFunction

/**
 * @typedef {Object} EvaluationScope
 * @property {Object} scope
 * @property {EvaluationScope} scope.$$PARENT_SCOPE
 * @property {*} scope.$$VALUE
 * @property {*[]} scope.$$ARRAY Available only for array iteration expressions
 *                               such as $arrayMap, $arrayFilter, etc.
 * @property {Number} scope.$$INDEX
 * @property {*} scope.$$ACC Available for $arrayReduce
 * @property {*} scope.$$SORT_A Available for $arraySort
 * @property {*} scope.$$SORT_B
 */
export type EvaluationScope = {
  $$PARENT_SCOPE?: EvaluationScope
  $$VALUE: any
  $$ARRAY?: any[]
  $$INDEX?: number
  $$ACC?: any
  $$SORT_A?: any
  $$SORT_B?: any
  [key: string]: any
}

/**
 * @typedef {Object} ExpressionInterpreterList
 * @property {Object} interpreterList
 * @property {ExpressionInterpreter} interpreterList.{{ expressionName }}
 */
export type ExpressionInterpreterList = {
  [key: string]: ExpressionInterpreter
}

export type ExpressionInterpreterFunctionList = {
  [key: string]: ExpressionInterpreterFunction
}

/**
 * @typedef {Object} EvaluationContext
 * @property {Object} context
 * @property {ExpressionInterpreterFunctionList} context.interpreters
 * @property {EvaluationScope} context.scope
 */
export type EvaluationContext = {
  interpreters: ExpressionInterpreterFunctionList
  scope: EvaluationScope
}

/**
 * @typedef {Object} PlainObject
 */
export type PlainObject = { [key: string]: any }
