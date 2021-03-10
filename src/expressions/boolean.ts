import { InterpreterSpec } from '../types'

/**
 * @function $boolean
 * @param {*} value
 * @returns {Boolean}
 */
export const $boolean: InterpreterSpec = [
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  (value: any): boolean => Boolean(value),
  ['any'],
]

export const BOOLEAN_EXPRESSIONS = {
  $boolean,
}
