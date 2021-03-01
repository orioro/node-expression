import { interpreter } from '../interpreter'

/**
 * @function $boolean
 * @param {*} value
 * @returns {Boolean}
 */
export const $boolean = interpreter((value: any): boolean => Boolean(value), [
  'any',
])

export const BOOLEAN_EXPRESSIONS = {
  $boolean,
}
