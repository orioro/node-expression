import {
  evaluateStringOrRegExp,
  evaluateString,
} from '../expression'

import {
  EvaluationContext,
  Expression,
} from '../types'

import { $$VALUE, $value } from './value'

export const $regExp = (
  context:EvaluationContext,
  regExpExp:Expression | RegExp,
  regExpOptionsExp:Expression | String
) => {
  const regExp = evaluateStringOrRegExp(context, regExpExp)
  const regExpOptions = evaluateString.allowUndefined(context, regExpOptionsExp)

  return new RegExp(regExp, regExpOptions)
}

export const $regExpMatch = (
  context:EvaluationContext,
  regExpExp:Expression | RegExp,
  regExpOptionsExp:Expression | String,
  valueExp:Expression = $$VALUE
) => {
  const regExp = $regExp(context, regExpExp, regExpOptionsExp)
  const value = evaluateString(context, valueExp)

  return value.match(regExp)
}

export const $regExpTest = (
  context:EvaluationContext,
  regExpExp:Expression | RegExp,
  regExpOptionsExp:Expression | String,
  valueExp:Expression = $$VALUE
) => {
  const regExp = $regExp(context, regExpExp, regExpOptionsExp)
  const value = evaluateString(context, valueExp)

  return regExp.test(value)
}

export {
  $value
}
