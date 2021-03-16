import { VALUE_EXPRESSIONS } from './value'
import { COMPARISON_EXPRESSIONS } from './comparison'
import { LOGICAL_EXPRESSIONS } from './logical'
import { ARRAY_EXPRESSIONS } from './array'
import { OBJECT_EXPRESSIONS } from './object'
import { STRING_EXPRESSIONS } from './string'
import { MATH_EXPRESSIONS } from './math'
import { NUMBER_EXPRESSIONS } from './number'

import {
  SyncModePromiseUnsupportedError,
  SyncModeUnsupportedError,
} from '../errors'

import { _prepareEvaluateTestCases, $asyncEcho } from '../../spec/specUtil'

const EXPRESSIONS = {
  ...VALUE_EXPRESSIONS,
  ...LOGICAL_EXPRESSIONS,
  ...NUMBER_EXPRESSIONS,
  ...MATH_EXPRESSIONS,
  ...COMPARISON_EXPRESSIONS,
  ...OBJECT_EXPRESSIONS,
  ...STRING_EXPRESSIONS,
  ...ARRAY_EXPRESSIONS,
  $asyncEcho,
}

const _evTestCases = _prepareEvaluateTestCases(EXPRESSIONS)

describe('$arrayIncludes', () => {
  _evTestCases([
    [['A', 'B', 'C', 'D'], ['$arrayIncludes', 'A'], true],
    [['A', 'B', 'C', 'D'], ['$arrayIncludes', 'Z'], false],
    [
      {
        key1: 'A',
        key2: 'B',
        key3: 'C',
      },
      [
        '$arrayIncludes',
        'B',
        [
          ['$value', 'key1'],
          ['$value', 'key2'],
          ['$value', 'key3'],
        ],
      ],
      true,
    ],
    [
      {
        key1: 'A',
        key2: 'B',
        key3: 'C',
      },
      [
        '$arrayIncludes',
        'D',
        [
          ['$value', 'key1'],
          ['$value', 'key2'],
          ['$value', 'key3'],
        ],
      ],
      false,
    ],
  ])
})

describe('$arrayIncludesAll', () => {
  _evTestCases([
    [['A', 'B', 'C', 'D'], ['$arrayIncludesAll', ['A', 'B']], true],
    [['A', 'B', 'C', 'D'], ['$arrayIncludesAll', ['A', 'Z']], false],
  ])
})

describe('$arrayIncludesAny', () => {
  _evTestCases([
    [['A', 'B', 'C', 'D'], ['$arrayIncludesAny', ['A', 'B']], true],
    [['A', 'B', 'C', 'D'], ['$arrayIncludesAny', ['A', 'Z']], true],
    [['A', 'B', 'C', 'D'], ['$arrayIncludesAny', ['X', 'Y', 'Z']], false],
  ])
})

describe('$arrayLength', () => {
  _evTestCases([
    [['A', 'B', 'C', 'D'], ['$arrayLength'], 4],
    [['A', 'B', 'C', 'D', 'E'], ['$arrayLength'], 5],
    [[], ['$arrayLength'], 0],
  ])
})

describe('$arrayMap', () => {
  describe('basic usage', () => {
    _evTestCases([
      [[-10, 0, 10, 20], ['$arrayMap', 'SOME_VALUE'], TypeError],
      [
        [-10, 0, 10, 20],
        ['$arrayMap', ['$mathSum', 5]],
        [-5, 5, 15, 25],
      ],
    ])
  })

  describe('[$value, $$ARRAY]', () => {
    _evTestCases([
      [
        [-10, 0, 10, 20],
        ['$arrayMap', ['$mathSum', ['$arrayLength', ['$value', '$$ARRAY']]]],
        [-6, 4, 14, 24],
      ],
    ])
  })

  describe('[$value, $$INDEX]', () => {
    _evTestCases([
      [
        [-10, 0, 10, 20],
        ['$arrayMap', ['$mathSum', ['$value', '$$INDEX']]],
        [-10, 1, 12, 23],
      ],
    ])
  })
})

describe('$arrayFilter', () => {
  describe('testing against parent scope value', () => {
    _evTestCases([
      [
        2,
        [
          '$arrayFilter',
          ['$eq', 0, ['$mathMod', ['$value', '$$PARENT_SCOPE.$$VALUE']]],
          [1, 2, 3, 4, 5, 6],
        ],
        [2, 4, 6],
      ],
    ])
  })

  describe('with meta evaluation', () => {
    const OUT_OF_RANGE_COND = [
      '$and',
      [
        ['$gte', 1],
        ['$lte', 10],
      ],
    ]
    const OUT_OF_RANGE_ERR = {
      code: 'OUT_OF_RANGE_ERR',
      message: 'Must be a number between 1 and 10',
    }

    const NOT_EVEN_COND = ['$eq', 0, ['$mathMod', 2]]
    const NOT_EVEN_ERR = {
      code: 'NOT_EVEN_ERR',
      message: 'Must be an even number',
    }

    const CASES = [
      [OUT_OF_RANGE_COND, OUT_OF_RANGE_ERR],
      [NOT_EVEN_COND, NOT_EVEN_ERR],
    ]

    const EXPRESSION = [
      '$arrayFilter',
      ['$notEq', null],
      [
        '$arrayMap',
        [
          '$if',
          ['$evaluate', ['$value', '0'], ['$value', '$$PARENT_SCOPE']],
          null,
          ['$value', '1'],
        ],
        CASES,
      ],
    ]

    _evTestCases([
      [9, EXPRESSION, [NOT_EVEN_ERR]],
      [10, EXPRESSION, []],
      [11, EXPRESSION, [OUT_OF_RANGE_ERR, NOT_EVEN_ERR]],
    ])
  })
})

describe('$arrayIndexOf', () => {
  _evTestCases([[[0, 10, 20, 40], ['$arrayIndexOf', 20], 2]])
})

describe('$arrayFindIndex', () => {
  _evTestCases([[[0, 10, 20, 40], ['$arrayFindIndex', ['$eq', 20]], 2]])
})

describe('$arrayReduce', () => {
  _evTestCases([
    [
      [0, 10, 20, 40],
      ['$arrayReduce', ['$mathSum', ['$value', '$$ACC']], 0],
      70,
    ],
  ])
})

describe('$arrayReverse', () => {
  _evTestCases([
    [['A', 'B', 'C', 'D'], ['$arrayReverse'], ['D', 'C', 'B', 'A']],
  ])
})

describe('$arraySort', () => {
  describe('basic usage', () => {
    _evTestCases([
      [['B', 'D', 'C', 'A'], ['$arraySort'], ['A', 'B', 'C', 'D']],
      [
        ['B', 'D', 'C', 'A'],
        ['$arraySort', 'DESC'],
        ['D', 'C', 'B', 'A'],
      ],
    ])
  })

  describe('with custom comparator', () => {
    const SORT_NUMBERS = [
      '$mathSub',
      ['$numberInt', 10, ['$value', '$$SORT_B']],
      ['$numberInt', 10, ['$value', '$$SORT_A']],
    ]

    _evTestCases([
      [['9', '1', '12', '11'], ['$arraySort'], ['1', '11', '12', '9']],
      [
        ['9', '1', '12', '11'],
        ['$arraySort', SORT_NUMBERS],
        ['1', '9', '11', '12'],
      ],
      [
        ['9', '1', '12', '11'],
        ['$arraySort', [SORT_NUMBERS]], // invalid tuple
        TypeError,
      ],
      [
        ['9', '1', '12', '11'],
        ['$arraySort', [SORT_NUMBERS, 'DESC']],
        ['12', '11', '9', '1'],
      ],
    ])
  })
})

describe('$arrayPush', () => {
  _evTestCases([
    [
      ['A', 'B', 'C', 'D'],
      ['$arrayPush', 'E'],
      ['A', 'B', 'C', 'D', 'E'],
    ],
  ])
})

describe('$arrayPop', () => {
  _evTestCases([[['A', 'B', 'C', 'D'], ['$arrayPop'], ['A', 'B', 'C']]])
})

describe('$arrayUnshift', () => {
  _evTestCases([
    [
      ['A', 'B', 'C', 'D'],
      ['$arrayUnshift', 'Z'],
      ['Z', 'A', 'B', 'C', 'D'],
    ],
  ])
})

describe('$arrayShift', () => {
  _evTestCases([[['A', 'B', 'C', 'D'], ['$arrayShift'], ['B', 'C', 'D']]])
})

describe('$arraySlice', () => {
  _evTestCases([
    [
      ['A', 'B', 'C', 'D'],
      ['$arraySlice', 1, 3],
      ['B', 'C'],
    ],
  ])
})

describe('$arrayReplace', () => {
  const BASE_VALUE = ['0', '1', '2', '3']

  describe('index', () => {
    _evTestCases([
      [BASE_VALUE, ['$arrayReplace', 1, 'R'], ['0', 'R', '2', '3']],
      [
        BASE_VALUE,
        ['$arrayReplace', 1, ['R1', 'R2', 'R3']],
        ['0', 'R1', 'R2', 'R3', '2', '3'],
      ],
    ])
  })

  describe('range', () => {
    _evTestCases([
      [BASE_VALUE, ['$arrayReplace', [1, 3], 'R'], ['0', 'R', '3']],
      [
        BASE_VALUE,
        ['$arrayReplace', [1, 3], ['R1', 'R2', 'R3']],
        ['0', 'R1', 'R2', 'R3', '3'],
      ],
    ])
  })

  describe('empty replacement (removal)', () => {
    _evTestCases([
      [BASE_VALUE, ['$arrayReplace', 1, []], ['0', '2', '3']],
      [BASE_VALUE, ['$arrayReplace', [1, 3], []], ['0', '3']],
    ])
  })

  describe('empty range (add)', () => {
    _evTestCases([
      [BASE_VALUE, ['$arrayReplace', [1, 1], 'R'], ['0', 'R', '1', '2', '3']],
      [
        BASE_VALUE,
        ['$arrayReplace', [1, 1], ['R1', 'R2', 'R3']],
        ['0', 'R1', 'R2', 'R3', '1', '2', '3'],
      ],
    ])
  })
})

describe('$arrayAddAt', () => {
  _evTestCases([
    [
      ['A', 'B', 'C', 'D'],
      ['$arrayAddAt', 1, ['$arraySlice', 0, 4]],
      ['A', 'A', 'B', 'C', 'D', 'B', 'C', 'D'],
    ],
  ])
})

describe('$arrayRemoveAt', () => {
  _evTestCases([
    [
      ['A', 'B', 'C', 'D'],
      ['$arrayRemoveAt', 1, 2],
      ['A', 'D'],
    ],
    [
      ['A', 'B', 'C', 'D'],
      ['$arrayRemoveAt', 1],
      ['A', 'C', 'D'],
    ],
  ])
})

describe('$arrayJoin', () => {
  _evTestCases([
    [['A', 'B', 'C', 'D'], ['$arrayJoin', '_'], 'A_B_C_D'],
    [['A', 'B', 'C', 'D'], ['$arrayJoin'], 'ABCD'],
  ])
})

describe('$arrayAt', () => {
  _evTestCases([
    [['A', 'B', 'C', 'D'], ['$arrayAt', 0], 'A'],
    [['A', 'B', 'C', 'D'], ['$arrayAt', 3], 'D'],
    [['A', 'B', 'C', 'D'], ['$arrayAt', 4], undefined],
    [['A', 'B', 'C', 'D'], ['$arrayAt', '0'], TypeError],
  ])
})

describe('$arrayEvery vs $and (logical) - example: check for array item uniqueness', () => {
  const ITEM_IS_UNIQUE_EXP = [
    '$eq',
    ['$value', '$$INDEX'],
    ['$arrayIndexOf', ['$value', '$$VALUE'], ['$value', '$$ARRAY']],
  ]

  describe('using $and', () => {
    const MAP_EXP = ['$arrayMap', ITEM_IS_UNIQUE_EXP]

    const ITEMS_UNIQUE_EXP = ['$and', MAP_EXP]

    _evTestCases([
      [[1, 2, 3, 4], ITEMS_UNIQUE_EXP, true],
      [[1, 2, 3, 1], ITEMS_UNIQUE_EXP, false],
    ])
  })

  describe('using $arrayEvery', () => {
    // Skips the 'map' step,
    // which prevents executing the ITEM_IS_UNIQUE_EXP for
    // every value, as $arrayEvery (Array.prototype.every)
    // will return at first false value
    const ITEMS_UNIQUE_EXP = ['$arrayEvery', ITEM_IS_UNIQUE_EXP]

    _evTestCases([
      [[1, 2, 3, 4], ITEMS_UNIQUE_EXP, true],
      [[1, 2, 3, 1], ITEMS_UNIQUE_EXP, false],
    ])

    _evTestCases.testSyncCases([
      [
        Promise.resolve([1, 2, 3, 4]),
        ITEMS_UNIQUE_EXP,
        new SyncModePromiseUnsupportedError('$value'),
      ],
      [
        'any-value', // irrelevant
        ['$arrayEvery', ITEM_IS_UNIQUE_EXP, ['$asyncEcho', [1, 2, 3, 4]]],
        new SyncModeUnsupportedError('$asyncEcho'),
      ],
    ])

    _evTestCases.testAsyncCases([
      [Promise.resolve([1, 2, 3, 4]), ITEMS_UNIQUE_EXP, true], // not so realistic case
      [
        'any-value', // irrelevant
        ['$arrayEvery', ITEM_IS_UNIQUE_EXP, ['$asyncEcho', [1, 2, 3, 4]]],
        true,
      ],
    ])
  })

  describe('async expression', () => {
    const list = [1, 3, 5]
    const SYNC_IS_IN_LIST = ['$in', list]
    const ASYNC_IS_IN_LIST = ['$in', ['$asyncEcho', list]]

    _evTestCases.testSyncCases([
      [[1, 3], ['$arrayEvery', SYNC_IS_IN_LIST], true],
      [
        [1, 3],
        ['$arrayEvery', ASYNC_IS_IN_LIST],
        new SyncModeUnsupportedError('$asyncEcho'),
      ],
      [[1, 2, 3], ['$arrayEvery', SYNC_IS_IN_LIST], false],
      [
        [1, 2, 3],
        ['$arrayEvery', ASYNC_IS_IN_LIST],
        new SyncModeUnsupportedError('$asyncEcho'),
      ],
      [[2, 4], ['$arrayEvery', SYNC_IS_IN_LIST], false],
      [
        [2, 4],
        ['$arrayEvery', ASYNC_IS_IN_LIST],
        new SyncModeUnsupportedError('$asyncEcho'),
      ],
    ])

    _evTestCases.testAsyncCases([
      [[1, 3], ['$arrayEvery', SYNC_IS_IN_LIST], true],
      [[1, 3], ['$arrayEvery', ASYNC_IS_IN_LIST], true],
      [[1, 2, 3], ['$arrayEvery', SYNC_IS_IN_LIST], false],
      [[1, 2, 3], ['$arrayEvery', ASYNC_IS_IN_LIST], false],
      [[2, 4], ['$arrayEvery', SYNC_IS_IN_LIST], false],
      [[2, 4], ['$arrayEvery', ASYNC_IS_IN_LIST], false],
    ])
  })
})

describe('$arraySome', () => {
  _evTestCases([
    [[1, 2, 3, 4], ['$arraySome', ['$eq', 0, ['$mathMod', 2]]], true],
    [[1, 3, 5, 7], ['$arraySome', ['$eq', 0, ['$mathMod', 2]]], false],
  ])

  describe('async expression', () => {
    const list = [1, 3, 5]
    const SYNC_IS_IN_LIST = ['$in', list]
    const ASYNC_IS_IN_LIST = ['$in', ['$asyncEcho', list]]

    _evTestCases.testSyncCases([
      [[1, 3], ['$arraySome', SYNC_IS_IN_LIST], true],
      [
        [1, 3],
        ['$arraySome', ASYNC_IS_IN_LIST],
        new SyncModeUnsupportedError('$asyncEcho'),
      ],
      [[1, 2, 3], ['$arraySome', SYNC_IS_IN_LIST], true],
      [
        [1, 2, 3],
        ['$arraySome', ASYNC_IS_IN_LIST],
        new SyncModeUnsupportedError('$asyncEcho'),
      ],
      [[2, 4], ['$arraySome', SYNC_IS_IN_LIST], false],
      [
        [2, 4],
        ['$arraySome', ASYNC_IS_IN_LIST],
        new SyncModeUnsupportedError('$asyncEcho'),
      ],
    ])

    _evTestCases.testAsyncCases([
      [[1, 3], ['$arraySome', SYNC_IS_IN_LIST], true],
      [[1, 3], ['$arraySome', ASYNC_IS_IN_LIST], true],
      [[1, 2, 3], ['$arraySome', SYNC_IS_IN_LIST], true],
      [[1, 2, 3], ['$arraySome', ASYNC_IS_IN_LIST], true],
      [[2, 4], ['$arraySome', SYNC_IS_IN_LIST], false],
      [[2, 4], ['$arraySome', ASYNC_IS_IN_LIST], false],
    ])
  })
})
