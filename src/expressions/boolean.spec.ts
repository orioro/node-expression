import { evaluate } from '../evaluate'
import { syncInterpreterList } from '../interpreter/syncInterpreter'
import { asyncInterpreterList } from '../interpreter/asyncInterpreter'
import { $value } from './value'
import { $boolean } from './boolean'

import { _prepareEvaluateTestCases } from '../../spec/specUtil'

const EXPS = {
  $value,
  $boolean
}

const syncInterpreters = syncInterpreterList(EXPS)
const asyncInterpreters = asyncInterpreterList(EXPS)

const _evTestCases = _prepareEvaluateTestCases({
  syncInterpreters,
  asyncInterpreters,
})

describe('$boolean', () => {

  describe('numbers', () => {
    _evTestCases([
      [1, ['$boolean'], true],
      [0, ['$boolean'], false],
      [-1, ['$boolean'], true],
    ])
  })

  describe('string', () => {
    _evTestCases([
      ['some string', ['$boolean'], true],
      ['', ['$boolean'], false]
    ])
  })
})
