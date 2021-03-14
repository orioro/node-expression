import { evaluate } from '../evaluate'
import { $value } from './value'
import { $boolean } from './boolean'

import { _prepareEvaluateTestCases } from '../../spec/specUtil'

const EXPS = {
  $value,
  $boolean,
}

const _evTestCases = _prepareEvaluateTestCases(EXPS)

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
      ['', ['$boolean'], false],
    ])
  })
})
