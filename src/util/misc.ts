import { EvaluationContext, Expression } from '../types'

export const _maybeExpression = (
  value: any // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
): boolean =>
  Array.isArray(value) &&
  typeof value[0] === 'string' &&
  value[0].startsWith('$')

export const _ellipsis = (str: string, maxlen = 50): string =>
  str.length > maxlen ? str.substr(0, maxlen - 1).concat('...') : str

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const _evaluateDev = (evaluate, isExpression) => (
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

  return evaluate(context, expOrValue)
}
