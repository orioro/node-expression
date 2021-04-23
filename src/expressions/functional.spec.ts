import { COMPARISON_EXPRESSIONS } from './comparison'
import { VALUE_EXPRESSIONS } from './value'
import { FUNCTIONAL_EXPRESSIONS } from './functional'
import { ARRAY_EXPRESSIONS } from './array'
import { MATH_EXPRESSIONS } from './math'
import { STRING_EXPRESSIONS } from './string'

import {
  SyncModeUnsupportedError,
  AsyncModeUnsupportedError,
  EvaluationError,
} from '../errors'

import { _prepareEvaluateTestCases } from '../../spec/specUtil'

const _mockFailSync = [
  (err) => {
    throw err || new Error('MOCK_ERROR')
  },
  ['any'],
  { defaultParam: -1 },
]

const _mockFailAsync = [
  (err) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(err || new Error('MOCK_ERROR'))
      }, 100)
    }),
  ['any'],
  { defaultParam: -1 },
]

const EXPS = {
  ...VALUE_EXPRESSIONS,
  ...COMPARISON_EXPRESSIONS,
  ...FUNCTIONAL_EXPRESSIONS,
  ...ARRAY_EXPRESSIONS,
  ...MATH_EXPRESSIONS,
  ...STRING_EXPRESSIONS,

  $mockFailSync: { sync: _mockFailSync },
  $mockFailAsync: { async: _mockFailAsync },
  $mockFailIsomorphic: {
    sync: _mockFailSync,
    async: _mockFailAsync,
  },
  $mockFailImplicitSync: _mockFailSync,
}

const _evTestCases = _prepareEvaluateTestCases(EXPS)

class CustomError extends Error {
  constructor(code: string) {
    super(`CustomError message: the error code was "${code}"`)
    this.code = code
  }

  code: string
}

describe('$pipe', () => {
  const SUM_2 = ['$arrayMap', ['$mathSum', 2]]
  const MULT_2 = ['$arrayMap', ['$mathMult', 2]]
  const GREATER_THAN_50 = ['$arrayFilter', ['$gt', 50]]

  const VALUE = [10, 20, 30, 40]

  _evTestCases([
    [VALUE, ['$pipe', [SUM_2, MULT_2]], [24, 44, 64, 84]],
    [VALUE, ['$pipe', [SUM_2, MULT_2, GREATER_THAN_50]], [64, 84]],
    [VALUE, ['$pipe', [SUM_2, GREATER_THAN_50]], []],
  ])
})

describe('$try', () => {
  describe('sync/async isomorphism', () => {
    const VALUE = 'any-value'

    _evTestCases([
      [
        VALUE,
        ['$try', ['$mockFailIsomorphic']],
        { error: true, message: 'MOCK_ERROR' },
      ],

      // Custom error code
      [
        VALUE,
        ['$try', ['$mockFailIsomorphic', 'CUSTOM_ERROR_CODE']],
        { error: true, code: 'CUSTOM_ERROR_CODE' },
      ],

      // Custom error object
      [
        VALUE,
        [
          '$try',
          ['$mockFailIsomorphic', { error: true, code: 'CUSTOM_ERROR_CODE' }],
        ],
        { error: true, code: 'CUSTOM_ERROR_CODE' },
      ],

      // CustomError instance
      [
        VALUE,
        ['$try', ['$mockFailIsomorphic', new CustomError('CUSTOM_ERROR_CODE')]],
        {
          error: true,
          code: 'CUSTOM_ERROR_CODE',
          message:
            'CustomError message: the error code was "CUSTOM_ERROR_CODE"',
        },
      ],

      // Invalid error
      [VALUE, ['$try', ['$mockFailIsomorphic', 9]], EvaluationError],

      // Catch value
      [VALUE, ['$try', ['$mockFailIsomorphic'], 'FAIL_VALUE'], 'FAIL_VALUE'],

      // Catch expression
      [
        VALUE,
        [
          '$try',
          ['$mockFailIsomorphic'],
          ['$stringConcat', ['::FAILED::', ['$value', '$$ERROR.message']]],
        ],
        'any-value::FAILED::MOCK_ERROR',
      ],
    ])
  })

  describe('sync only', () => {
    const VALUE = 'any-value'

    _evTestCases.testSyncCases([
      [
        VALUE,
        ['$try', ['$mockFailSync']],
        { error: true, message: 'MOCK_ERROR' },
      ],
      [VALUE, ['$try', ['$mockFailAsync']], SyncModeUnsupportedError],
    ])
  })

  describe('async only', () => {
    const VALUE = 'any-value'

    _evTestCases.testAsyncCases([
      [VALUE, ['$try', ['$mockFailSync']], AsyncModeUnsupportedError],
      [
        VALUE,
        ['$try', ['$mockFailImplicitSync']],
        { error: true, message: 'MOCK_ERROR' },
      ],
      [
        VALUE,
        ['$try', ['$mockFailAsync']],
        { error: true, message: 'MOCK_ERROR' },
      ],
    ])
  })
})
