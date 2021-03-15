import { TypeSpec, validateType } from '@orioro/typing'

import { Expression, InterpreterList, EvaluationContext } from './types'
import { SyncModePromiseUnsupportedError } from './errors'

import { _evaluateDev } from './util/misc'

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
  typeof interpreters[candidateExpression[0]] === 'object'

/**
 * @function evaluate
 * @param {EvaluationContext} context
 * @param {Expression | *} expOrValue
 * @returns {*}
 */
const _evaluate = (
  context: EvaluationContext,
  expOrValue: Expression | any
): any => {
  let interpreterId
  let result

  if (!isExpression(context.interpreters, expOrValue)) {
    interpreterId = 'LITERAL_VALUE'
    result = expOrValue
  } else {
    const [_interpreterId, ...interpreterArgs] = expOrValue
    const interpreter = context.async
      ? context.interpreters[_interpreterId].async
      : context.interpreters[_interpreterId].sync

    interpreterId = _interpreterId
    result = interpreter(context, ...interpreterArgs)
  }

  if (!context.async && result instanceof Promise) {
    throw new SyncModePromiseUnsupportedError(interpreterId)
  }

  return result
}

export const evaluate =
  process && process.env && process.env.NODE_ENV !== 'production'
    ? _evaluateDev(_evaluate, isExpression)
    : _evaluate

/**
 * @function evaluateSync
 */
export const evaluateSync = (
  context: EvaluationContext,
  expOrValue: Expression | any
): any =>
  evaluate(
    {
      ...context,
      async: false,
    },
    expOrValue
  )

/**
 * @function evaluateAsync
 */
export const evaluateAsync = (
  context: EvaluationContext,
  expOrValue: Expression | any
): Promise<any> =>
  Promise.resolve(
    evaluate(
      {
        ...context,
        async: true,
      },
      expOrValue
    )
  )

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

export const evaluateTypedSync = (
  expectedTypes: TypeSpec,
  context: EvaluationContext,
  expOrValue: Expression | any
): any => {
  const value = evaluate({ ...context, async: false }, expOrValue)
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
  evaluateAsync(context, expOrValue).then((value) => {
    validateType(expectedTypes, value)
    return value
  })
