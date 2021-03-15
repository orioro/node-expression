import { isPlainObject } from 'lodash'
import {
  InterpreterSpec,
  InterpreterFunction,
  InterpreterSpecList,
  Interpreter,
  InterpreterList,
} from '../types'

import { SyncModeUnsupportedError, AsyncModeUnsupportedError } from '../errors'

import { syncInterpreter } from './syncInterpreter'
import { asyncInterpreter } from './asyncInterpreter'

const _syncUnsupported = (interperterId) => () => {
  throw new SyncModeUnsupportedError(interperterId)
}

const _asyncUnsupported = (interperterId) => () => {
  throw new AsyncModeUnsupportedError(interperterId)
}

/**
 * @function interpreter
 * @param {InterpreterSpec | InterpreterFunction} spec
 * @param {String} [interperterId='UNKNOWN_INTERPRETER']
 * @returns {Interpreter}
 */
export const interpreter = (
  spec: InterpreterSpec | InterpreterFunction,
  interperterId: string = 'UNKNOWN_INTERPRETER'
): Interpreter => {
  if (typeof spec === 'function') {
    // Assume it is a shared function that works
    // in both sync and async modes
    return {
      sync: spec,
      async: spec,
    }
  } else if (Array.isArray(spec)) {
    // Assume it is a shared spec that works
    // in both sync and async modes
    return {
      sync: syncInterpreter(spec),
      async: asyncInterpreter(spec),
    }
  } else if (isPlainObject(spec)) {
    return {
      sync:
        typeof spec.sync === 'function'
          ? spec.sync
          : Array.isArray(spec.sync)
          ? syncInterpreter(spec.sync)
          : _syncUnsupported(interperterId),
      async:
        typeof spec.async === 'function'
          ? spec.async
          : Array.isArray(spec.async)
          ? asyncInterpreter(spec.async)
          : _asyncUnsupported(interperterId),
    }
  } else {
    throw new Error(`Invalid interpreter spec ${spec}`)
  }
}

/**
 * @function interpreterList
 * @param {InterpreterSpecList} specs
 * @returns {InterpreterList}
 */
export const interpreterList = (specs: InterpreterSpecList): InterpreterList =>
  Object.keys(specs).reduce(
    (acc, interperterId) => ({
      ...acc,
      [interperterId]: interpreter(specs[interperterId], interperterId),
    }),
    {}
  )
