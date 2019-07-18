import {
  get,
  isPlainObject
} from 'lodash'
import {
  evaluate,
  isExpression,
  isExpressionId,
} from '../expression'
import { validatePlainObject } from '../util'
import {
  evaluatePlainObject,
  evaluateBoolean,
  evaluateNotObject,
  evaluatePlainObjectOrArray
} from '../expression-util'

const $match = (options, criteriaExp, valueExp) => {
  const criteria = evaluatePlainObject(options, criteriaExp)
  const value = evaluate(options, valueExp)

  const criteriaKeys = Object.keys(criteria)

  if (criteriaKeys.length === 0) {
    throw new Error(`Invalid criteria: ${JSON.stringify(criteria)}`)
  }

  return criteriaKeys.every(criteriaKey => {
    //
    // Criteria value may be an expression.
    // Evaluate the expression against the original context, not
    // against the value
    //
    const criteriaValue = evaluate(options, criteria[criteriaKey])

    return evaluateBoolean(
      {
        ...options,
        context: value
      },
      [criteriaKey, criteriaValue, ['$value', null]]
    )
  })
}

const $matchPaths = (options, criteriaByPathExp, valueExp) => {
  const value = evaluatePlainObjectOrArray(options, valueExp)
  const criteriaByPath = evaluatePlainObject(options, criteriaByPathExp)

  const paths = Object.keys(criteriaByPath)

  if (paths.length === 0) {
    throw new Error(`Invalid criteriaByPathExp: ${JSON.stringify(criteriaByPathExp)}`)
  }

  return paths.every(path => {
    let pathCriteria = criteriaByPath[path]

    if (!isPlainObject(pathCriteria)) {
      //
      // pathCriteria is either:
      // - a literal value to be compared against (array, string, number)
      // - or an expression to be evaluated against the value
      //
      pathCriteria = {
        $eq: pathCriteria
      }
    }

    return evaluate({
      ...options,
      context: value
    }, [
      '$match',
      pathCriteria,
      ['$value', path]
    ])
  })
}

export const MATCH_EXPRESSIONS = {
  $match,
  $matchPaths
}
