import {
  evaluateBoolean,
  evaluateString
} from '../expression'

import {
  EvaluationContext,
  StringExpression,
  BooleanExpression
} from '../types'

export const $error = (
  context:EvaluationContext,
  nameExp:StringExpression,
  messageExp:StringExpression,
  silentExp:BooleanExpression = true
) => {
  const name = evaluateString(context, nameExp)
  const message = evaluateString.allowUndefined(context, messageExp) || name
  const silent = evaluateBoolean(context, silentExp)

  const error = new Error(message)

  error.name = name

  if (silent) {
    return error
  } else {
    throw error
  }
}
