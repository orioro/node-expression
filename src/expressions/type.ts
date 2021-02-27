import { interpreter } from '../expression'
import { typing, CORE_TYPES } from '@orioro/typing'
import { TypeAlternatives, TypeMap, ExpressionInterpreter } from '../types'

export const typeExpressions = (
  types: TypeAlternatives | TypeMap
): [ExpressionInterpreter, ExpressionInterpreter] => {
  const {
    getType,
    isType,
    // validateType
  } = typing(types)

  /**
   * @function $type
   * @param {*} valueExp
   * @returns {String} type Possible values:
   *   - string
   *   - regexp
   *   - number
   *   - bigint
   *   - nan
   *   - null
   *   - undefined
   *   - boolean
   *   - function
   *   - object
   *   - array
   *   - date
   *   - symbol
   *   - map
   *   - set
   *   - weakmap
   *   - weakset
   */
  const $type = interpreter((value: any): string => getType(value), ['any'])

  /**
   * @function $isType
   * @param {ExpectedType} type
   * @param {*} value
   * @returns {Boolean}
   */
  const $isType = interpreter(
    (type: string, value: any): boolean => isType(type, value),
    [['string', 'array', 'object'], 'any']
  )

  //
  // The usage of $validateType expression is not clear, we've opted for not
  // exposing it for now
  //
  // const $validateType = interpreter(
  //   (type: string, value: any): void => validateType(type, value),
  //   [['string', 'array', 'object'], 'any']
  // )

  return [$type, $isType]
}

const [$type, $isType] = typeExpressions(CORE_TYPES)

export { $type, $isType, CORE_TYPES }

export const TYPE_EXPRESSIONS = {
  $type,
  $isType,
}
