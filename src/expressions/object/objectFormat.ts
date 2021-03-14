import { set, isPlainObject } from 'lodash'

import { promiseResolveObject } from '../../util/promiseResolveObject'

import { evaluate, isExpression } from '../../evaluate'

import {
  EvaluationContext,
  PlainObject,
  InterpreterSpecSingle,
} from '../../types'

const _parseFormat = (format) =>
  typeof format === 'string' ? ['$value', format] : format

const _formatSync = (context, format, source) => {
  format = _parseFormat(format)

  if (isExpression(context.interpreters, format)) {
    return evaluate(
      {
        ...context,
        scope: { $$VALUE: source },
      },
      format
    )
  } else if (Array.isArray(format)) {
    return format.map((nestedTargetValue) =>
      _formatSync(context, nestedTargetValue, source)
    )
  } else if (isPlainObject(format)) {
    const targetPaths = Object.keys(format)

    return targetPaths.reduce((acc, targetPath) => {
      set(acc, targetPath, _formatSync(context, format[targetPath], source))

      return acc
    }, {})
  } else {
    throw `Invalid $objectFormat item: ${format}`
  }
}

const _formatAsync = (context, format, source) => {
  format = _parseFormat(format)

  if (isExpression(context.interpreters, format)) {
    return evaluate(
      {
        ...context,
        scope: { $$VALUE: source },
      },
      format
    )
  } else if (Array.isArray(format)) {
    return Promise.all(
      format.map((nestedTargetValue) =>
        _formatAsync(context, nestedTargetValue, source)
      )
    )
  } else if (isPlainObject(format)) {
    return promiseResolveObject(format, (propertyValue) =>
      _formatAsync(context, propertyValue, source)
    )
  } else {
    throw `Invalid $objectFormat item: ${format}`
  }
}

export const $objectFormatSync: InterpreterSpecSingle = [
  (
    format: PlainObject | any[],
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    source: any,
    context: EvaluationContext
  ): PlainObject | any[] => _formatSync(context, format, source),
  [['object', 'array'], 'any'],
]

export const $objectFormatAsync: InterpreterSpecSingle = [
  (
    format: PlainObject | any[],
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    source: any,
    context: EvaluationContext
  ): PlainObject | any[] => _formatAsync(context, format, source),
  [['object', 'array'], 'any'],
]
