import { curry, isPlainObject } from 'lodash'

const _parseContext = (evalOptions, $$ROOT) => {

  let { context } = evalOptions

  if (!isPlainObject(context) || !context.hasOwnProperty('$$VALUE')) {
    //
    // When the context is not a plain object
    // or it is a plain object with a '$$VALUE' property defined (even if $$VALUE === undefined)
    // the algorithm assumes it is the value itself
    //
    context = {
      $$VALUE: context
    }
  }

  //
  // Expose $$ROOT to the context
  //
  context.$$ROOT = $$ROOT

  return context
}

const _parseRoot = (evalOptions) => {
  return evalOptions.hasOwnProperty('$$ROOT') ? evalOptions.$$ROOT : evalOptions.context
}

export const isExpressionId = (evalOptions, value) => {
  return typeof evalOptions.interpreters[value] === 'function'
}

export const isExpression = (evalOptions, value) => {
  return Array.isArray(value) && isExpressionId(evalOptions, value[0])
}

export const evaluate = (evalOptions, expOrValue) => {
  if (!Array.isArray(expOrValue)) {
    return expOrValue
  }

  const [expressionId, ...expressionArgs] = expOrValue
  const { interpreters } = evalOptions
  const interpreterFn = interpreters[expressionId]

  if (typeof interpreterFn !== 'function') {
    return expOrValue
  }

  const $$ROOT = _parseRoot(evalOptions)
  const context = _parseContext(evalOptions, $$ROOT)

  return interpreterFn({
    interpreters,
    $$ROOT,
    context
  }, ...expressionArgs)
}

export const expression = curry((interpreters, exp, context) => {
  return evaluate({
    interpreters,
    context,
  }, exp)
})
