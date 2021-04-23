import {
  EvaluationContext,
  Expression,
  InterpreterSpec,
  InterpreterSpecSingle,
} from '../types'

import { EvaluationError } from '../errors'

import { isPlainObject } from 'lodash'

import { evaluate, evaluateAsync } from '../evaluate'

import { anyType } from '@orioro/typing'

/**
 * @function $pipe
 * @param {Expression[]} expressions
 * @returns {*} pipeResult
 */
export const $pipe: InterpreterSpec = [
  (expressions: Expression[], context: EvaluationContext): any =>
    expressions.reduce((acc, expression) => {
      return evaluate(
        {
          ...context,
          scope: { $$VALUE: acc },
        },
        expression
      )
    }, context.scope.$$VALUE),
  ['array'],
]

const _serializableError = (err) => {
  if (err instanceof Error) {
    return {
      error: true,
      ...err,
      message: err.message,
    }
  } else if (typeof err === 'string') {
    return {
      error: true,
      code: err,
    }
  } else if (isPlainObject(err)) {
    return {
      error: true,
      ...err,
    }
  } else {
    throw new EvaluationError('$try', `Invalid error object: ${err}`)
  }
}

const _tryHandleError = (catchExpressionOrValue, context, err) => {
  if (err instanceof EvaluationError) {
    throw err
  }

  const $$ERROR = _serializableError(err)

  return catchExpressionOrValue === undefined
    ? $$ERROR
    : evaluate(
        {
          ...context,
          scope: {
            ...context.scope,
            $$ERROR,
          },
        },
        catchExpressionOrValue
      )
}

const _trySync: InterpreterSpecSingle = [
  (
    expressionOrValue: Expression | any,
    catchExpressionOrValue: undefined | Expression | any,
    context: EvaluationContext
  ): any => {
    try {
      return evaluate(context, expressionOrValue)
    } catch (err) {
      return _tryHandleError(catchExpressionOrValue, context, err)
    }
  },
  [anyType({ skipEvaluation: true }), anyType({ skipEvaluation: true })],
  {
    defaultParam: -1,
  },
]

const _tryAsync: InterpreterSpecSingle = [
  (
    expressionOrValue: Expression | any,
    catchExpressionOrValue: undefined | Expression | any,
    context: EvaluationContext
  ): Promise<any> =>
    evaluateAsync(context, expressionOrValue).catch((err) =>
      _tryHandleError(catchExpressionOrValue, context, err)
    ),
  [anyType({ skipEvaluation: true }), anyType({ skipEvaluation: true })],
  {
    defaultParam: -1,
  },
]

/**
 * @function $try
 * @param {Expression | *} expressionOrValue
 * @param {Expression | *} [catchExpressionOrValue=$$ERROR]
 */
export const $try: InterpreterSpec = {
  sync: _trySync,
  async: _tryAsync,
}

export const FUNCTIONAL_EXPRESSIONS = {
  $pipe,
  $try,
}
