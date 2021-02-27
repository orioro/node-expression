import { TypeAlternatives, TypeMap } from '@orioro/typing'

export { TypeAlternatives, TypeMap }

/**
 * An expression is an array tuple with the first item
 * as a string identifier.
 *
 * @typedef {[String, ...rest]} Expression
 */
export type Expression = [string, ...any[]]

/**
 * Function that receives as first parameter the EvaluationContext
 * and should return the result for evaluating a given expression.
 *
 * @typedef {Function} ExpressionInterpreter
 */
export type ExpressionInterpreter = (
  context: EvaluationContext,
  ...args: any[]
) => any

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

/**
 * @typedef {Object} EvaluationContext
 * @property {Object} context
 * @property {ExpressionInterpreterList} context.interpreters
 * @property {EvaluationScope} context.scope
 */
export type EvaluationContext = {
  interpreters: ExpressionInterpreterList
  scope: EvaluationScope
}

/**
 * @typedef {Object} PlainObject
 */
export type PlainObject = { [key: string]: any }
