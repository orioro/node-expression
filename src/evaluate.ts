import { TypeSpec, validateType } from '@orioro/typing'

import { Expression, InterpreterList, EvaluationContext } from './types'
import { SyncModePromiseUnsupportedError } from './errors'

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
