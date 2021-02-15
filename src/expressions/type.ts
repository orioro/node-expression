import { interpreter } from '../expression'
import { getType } from '@orioro/validate-type'

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
export const $type = interpreter((value: any): string => getType(value), [
  'any',
])

export const TYPE_EXPRESSIONS = {
  $type,
}
