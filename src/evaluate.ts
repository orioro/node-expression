import { TypeSpec, validateType } from '@orioro/typing'

import {
  Expression,
  InterpreterList,
  EvaluationContext,
} from './types'

/**
 * @function isExpression
 * @param {InterpreterList}
 */
export const isExpression = (
  interpreters: InterpreterList,
  candidateExpression: any // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
): boolean =>
  Array.isArray(candidateExpression) &&
  typeof candidateExpression[0] === 'string' &&
  typeof interpreters[candidateExpression[0]] === 'function'

const _maybeExpression = (value) =>
  Array.isArray(value) &&
  typeof value[0] === 'string' &&
  value[0].startsWith('$')

const _ellipsis = (str, maxlen = 50) =>
  str.length > maxlen ? str.substr(0, maxlen - 1).concat('...') : str

const _evaluateDev = (
  context: EvaluationContext,
  expOrValue: Expression | any
): any => {
  if (
    !isExpression(context.interpreters, expOrValue) &&
    _maybeExpression(expOrValue)
  ) {
    console.warn(
      `Possible missing expression error: ${_ellipsis(
        JSON.stringify(expOrValue)
      )}. No interpreter was found for '${expOrValue[0]}'`
    )
  }

  return _evaluate(context, expOrValue)
}

const _evaluate = (
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
 * @function evaluate
 * @param {EvaluationContext} context
 * @param {Expression | *} expOrValue
 * @returns {*}
 */
export const evaluate =
  process && process.env && process.env.NODE_ENV !== 'production'
    ? _evaluateDev
    : _evaluate

/**
 * @function evaluateTyped
 * @param {String | string[]} expectedTypes
 * @param {EvaluationContext} context
 * @param {Expression | any} expOrValue
 * @returns {*}
 */
export const evaluateTyped = (
  expectedTypes: TypeSpec,
  context: EvaluationContext,
  expOrValue: Expression | any
): any => {
  const value = evaluate(context, expOrValue)
  validateType(expectedTypes, value)
  return value
}

/**
 * @function evaluateTypedAsync
 * @param {String | string[]} expectedTypes
 * @param {EvaluationContext} context
 * @param {Expression | any} expOrValue
 * @returns {Promise<*>}
 */
export const evaluateTypedAsync = (
  expectedTypes: TypeSpec,
  context: EvaluationContext,
  expOrValue: Expression | any
): Promise<any> =>
  Promise.resolve(evaluate(context, expOrValue)).then((value) => {
    validateType(expectedTypes, value)
    return value
  })
