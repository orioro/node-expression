import { interpreter } from '../expression'

/**
 * @function $boolean
 * @param {*} value
 * @returns {boolean}
 */
export const $boolean = interpreter((value: any): boolean => Boolean(value), [
  'any',
])

export const BOOLEAN_EXPRESSIONS = {
  $boolean,
}
