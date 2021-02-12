/**
 * An expression is an array tuple with the first item
 * as a string identifier.
 * 
 * @typedef {[string, ...args]} Expression
 */
export type Expression = [string, ...any[]]

/**
 * Function that receives as first parameter the EvaluationContext
 * and should return the result for evaluating a given expression.
 * 
 * @typedef {function} ExpressionInterpreter
 */
export type ExpressionInterpreter = (context:EvaluationContext, ...args:any[]) => any

/**
 * @typedef {Object} EvaluationScope
 * @property {Object} scope
 * @property {EvaluationScope} scope.$$PARENT_SCOPE
 * @property {*} scope.$$VALUE
 * @property {*[]} scope.$$ARRAY Available only for array iteration expressions
 *                               such as $arrayMap, $arrayFilter, etc.
 * @property {number} scope.$$INDEX
 * @property {*} scope.$$ACC Available for $arrayReduce
 * @property {*} scope.$$SORT_A Available for $arraySort
 * @property {*} scope.$$SORT_B
 */
export type EvaluationScope = {
  $$PARENT_SCOPE?: EvaluationScope,
  $$VALUE: any,
  $$ARRAY?: any[],
  $$INDEX?: number,
  $$ACC?: any,
  $$SORT_A?: any,
  $$SORT_B?: any,
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
  interpreters: ExpressionInterpreterList,
  scope: EvaluationScope
}

/**
 * @typedef {String} ISODate
 */
export type ISODate = string

export type PlainObject = { [key:string]: any }

export type AnyExpression = Expression | any
export type NumberExpression = Expression | number
export type ArrayExpression = Expression | any[]
export type StringExpression = Expression | string
export type PlainObjectExpression = Expression | { [key:string]: any }
export type BooleanExpression = Expression | boolean
export type ISODateExpression = Expression | ISODate
