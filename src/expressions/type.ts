import { interpreter } from '../expression'
import { getType } from '@orioro/validate-type'

/**
 * @todo $type Return value for arrays, objects and regexp (move away from typeof)
 * 
 * @function $type
 * @param {*} valueExp
 * @returns {string} type Possible values:
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
export const $type = interpreter((
  value:any
):string => getType(value), [
  'any'
])

export const TYPE_EXPRESSIONS = {
  $type
}
