import { evaluate } from '../evaluate'
import { syncInterpreterList } from '../interpreter/syncInterpreter'
import { asyncInterpreterList } from '../interpreter/asyncInterpreter'
import { VALUE_EXPRESSIONS } from './value'
import { NUMBER_EXPRESSIONS } from './number'
import { _prepareEvaluateTestCases } from '../../spec/specUtil'

const EXP = {
  ...VALUE_EXPRESSIONS,
  ...NUMBER_EXPRESSIONS,
}

const syncInterpreters = syncInterpreterList(EXP)
const asyncInterpreters = asyncInterpreterList(EXP)

const _evTestCases = _prepareEvaluateTestCases({
  syncInterpreters,
  asyncInterpreters,
})

describe('$numberInt', () => {
  _evTestCases([
    ['10.50', ['$numberInt'], 10],
    [10.5, ['$numberInt'], 10.5],
    [true, ['$numberInt'], TypeError]
  ])
})

describe('$numberFloat', () => {
  _evTestCases([
    ['10.50', ['$numberFloat'], 10.5],
    [10.5, ['$numberFloat'], 10.5],
    [true, ['$numberFloat'], TypeError]
  ])
})
