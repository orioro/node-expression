import { evaluate } from '../evaluate'
import { syncInterpreterList } from '../interpreter/syncInterpreter'
import { asyncInterpreterList } from '../interpreter/asyncInterpreter'
import { VALUE_EXPRESSIONS } from './value'
import { COMPARISON_EXPRESSIONS } from './comparison'
import { LOGICAL_EXPRESSIONS } from './logical'
import { ARRAY_EXPRESSIONS } from './array'
import { OBJECT_EXPRESSIONS } from './object'
import { STRING_EXPRESSIONS } from './string'
import { MATH_EXPRESSIONS } from './math'
import { NUMBER_EXPRESSIONS } from './number'

import { _prepareEvaluateTestCases } from '../../spec/specUtil'

const EXPRESSIONS = {
  ...VALUE_EXPRESSIONS,
  ...LOGICAL_EXPRESSIONS,
  ...NUMBER_EXPRESSIONS,
  ...MATH_EXPRESSIONS,
  ...COMPARISON_EXPRESSIONS,
  ...OBJECT_EXPRESSIONS,
  ...STRING_EXPRESSIONS,
  ...ARRAY_EXPRESSIONS,
}

const syncInterpreters = syncInterpreterList(EXPRESSIONS)
const asyncInterpreters = asyncInterpreterList(EXPRESSIONS)

const _evTestCases = _prepareEvaluateTestCases({
  syncInterpreters,
  asyncInterpreters,
})

describe('$arrayIncludes', () => {
  _evTestCases([
    [['A', 'B', 'C', 'D'], ['$arrayIncludes', 'A'], true],
    [['A', 'B', 'C', 'D'], ['$arrayIncludes', 'Z'], false],
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
      [
        [-10, 0, 10, 20],
        ['$arrayMap', 'SOME_VALUE'],
        ['SOME_VALUE', 'SOME_VALUE', 'SOME_VALUE', 'SOME_VALUE'],
      ],
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
      [['9', '1', '12', '11'], ['$arraySort', SORT_NUMBERS], ['1', '9', '11', '12']],
      [['9', '1', '12', '11'], ['$arraySort', [SORT_NUMBERS]], ['1', '9', '11', '12']],
      [
        ['9', '1', '12', '11'],
        ['$arraySort', [SORT_NUMBERS, 'DESC']],
        ['12', '11', '9', '1'],
      ],
    ])
  })

  // test('with custom comparator', () => {
  //   const context = {
  //     interpreters: syncInterpreters,
  //     scope: { $$VALUE: ['9', '1', '12', '11'] },
  //   }

  //   const SORT_NUMBERS = [
  //     '$mathSub',
  //     ['$numberInt', 10, ['$value', '$$SORT_B']],
  //     ['$numberInt', 10, ['$value', '$$SORT_A']],
  //   ]

  //   expect(evaluate(context, ['$arraySort'])).toEqual(['1', '11', '12', '9'])

  //   expect(evaluate(context, ['$arraySort', SORT_NUMBERS])).toEqual([
  //     '1',
  //     '9',
  //     '11',
  //     '12',
  //   ])

  //   expect(evaluate(context, ['$arraySort', [SORT_NUMBERS]])).toEqual([
  //     '1',
  //     '9',
  //     '11',
  //     '12',
  //   ])

  //   expect(evaluate(context, ['$arraySort', [SORT_NUMBERS, 'DESC']])).toEqual([
  //     '12',
  //     '11',
  //     '9',
  //     '1',
  //   ])
  // })
})

describe('$arrayPush', () => {
  test('basic usage', () => {
    const context = {
      interpreters: syncInterpreters,
      scope: { $$VALUE: ['A', 'B', 'C', 'D'] },
    }

    expect(evaluate(context, ['$arrayPush', 'E'])).toEqual([
      'A',
      'B',
      'C',
      'D',
      'E',
    ])
  })
})

describe('$arrayPop', () => {
  test('basic usage', () => {
    const context = {
      interpreters: syncInterpreters,
      scope: { $$VALUE: ['A', 'B', 'C', 'D'] },
    }

    expect(evaluate(context, ['$arrayPop'])).toEqual(['A', 'B', 'C'])
  })
})

describe('$arrayUnshift', () => {
  test('basic usage', () => {
    const context = {
      interpreters: syncInterpreters,
      scope: { $$VALUE: ['A', 'B', 'C', 'D'] },
    }

    expect(evaluate(context, ['$arrayUnshift', 'Z'])).toEqual([
      'Z',
      'A',
      'B',
      'C',
      'D',
    ])
  })
})

describe('$arrayShift', () => {
  test('basic usage', () => {
    const context = {
      interpreters: syncInterpreters,
      scope: { $$VALUE: ['A', 'B', 'C', 'D'] },
    }

    expect(evaluate(context, ['$arrayShift'])).toEqual(['B', 'C', 'D'])
  })
})

describe('$arraySlice', () => {
  test('basic usage', () => {
    const context = {
      interpreters: syncInterpreters,
      scope: { $$VALUE: ['A', 'B', 'C', 'D'] },
    }

    expect(evaluate(context, ['$arraySlice', 1, 3])).toEqual(['B', 'C'])
  })
})

describe('$arrayReplace', () => {
  const context = {
    interpreters: syncInterpreters,
    scope: { $$VALUE: ['0', '1', '2', '3'] },
  }

  test('index', () => {
    expect(evaluate(context, ['$arrayReplace', 1, 'R'])).toEqual([
      '0',
      'R',
      '2',
      '3',
    ])
    expect(
      evaluate(context, ['$arrayReplace', 1, ['R1', 'R2', 'R3']])
    ).toEqual(['0', 'R1', 'R2', 'R3', '2', '3'])
  })

  test('range', () => {
    expect(evaluate(context, ['$arrayReplace', [1, 3], 'R'])).toEqual([
      '0',
      'R',
      '3',
    ])
    expect(
      evaluate(context, ['$arrayReplace', [1, 3], ['R1', 'R2', 'R3']])
    ).toEqual(['0', 'R1', 'R2', 'R3', '3'])
  })

  test('empty replacement (removal)', () => {
    expect(evaluate(context, ['$arrayReplace', 1, []])).toEqual(['0', '2', '3'])

    expect(evaluate(context, ['$arrayReplace', [1, 3], []])).toEqual(['0', '3'])
  })

  test('empty range (add)', () => {
    expect(evaluate(context, ['$arrayReplace', [1, 1], 'R'])).toEqual([
      '0',
      'R',
      '1',
      '2',
      '3',
    ])

    expect(
      evaluate(context, ['$arrayReplace', [1, 1], ['R1', 'R2', 'R3']])
    ).toEqual(['0', 'R1', 'R2', 'R3', '1', '2', '3'])
  })
})

describe('$arrayAddAt', () => {
  test('basic usage', () => {
    const context = {
      interpreters: syncInterpreters,
      scope: { $$VALUE: ['A', 'B', 'C', 'D'] },
    }

    expect(
      evaluate(context, ['$arrayAddAt', 1, ['$arraySlice', 0, 4]])
    ).toEqual(['A', 'A', 'B', 'C', 'D', 'B', 'C', 'D'])
  })
})

describe('$arrayRemoveAt', () => {
  test('basic usage', () => {
    const context = {
      interpreters: syncInterpreters,
      scope: { $$VALUE: ['A', 'B', 'C', 'D'] },
    }

    expect(evaluate(context, ['$arrayRemoveAt', 1, 2])).toEqual(['A', 'D'])

    expect(evaluate(context, ['$arrayRemoveAt', 1])).toEqual(['A', 'C', 'D'])
  })
})

describe('$arrayJoin', () => {
  test('basic usage', () => {
    const context = {
      interpreters: syncInterpreters,
      scope: { $$VALUE: ['A', 'B', 'C', 'D'] },
    }

    expect(evaluate(context, ['$arrayJoin', '_'])).toEqual('A_B_C_D')

    expect(evaluate(context, ['$arrayJoin'])).toEqual('ABCD')
  })
})

describe('$arrayAt', () => {
  test('basic usage', () => {
    const context = {
      interpreters: syncInterpreters,
      scope: { $$VALUE: ['A', 'B', 'C', 'D'] },
    }

    expect(evaluate(context, ['$arrayAt', 0])).toEqual('A')

    expect(evaluate(context, ['$arrayAt', 3])).toEqual('D')

    expect(evaluate(context, ['$arrayAt', 4])).toEqual(undefined)
  })
})

describe('$arrayEvery vs $and (logical) - example: check for array item uniqueness', () => {
  const ITEM_IS_UNIQUE_EXP = [
    '$eq',
    ['$value', '$$INDEX'],
    ['$arrayIndexOf', ['$value', '$$VALUE'], ['$value', '$$ARRAY']],
  ]

  test('using $and', () => {
    const MAP_EXP = ['$arrayMap', ITEM_IS_UNIQUE_EXP]

    const ITEMS_UNIQUE_EXP = ['$and', MAP_EXP]

    const itemsAreUnique = (array) =>
      evaluate(
        {
          interpreters: syncInterpreters,
          scope: { $$VALUE: array },
        },
        ITEMS_UNIQUE_EXP
      )

    expect(itemsAreUnique([1, 2, 3, 4])).toEqual(true)
    expect(itemsAreUnique([1, 2, 3, 1])).toEqual(false)
  })

  test('using $arrayEvery', () => {
    // Skips the 'map' step,
    // which prevents executing the ITEM_IS_UNIQUE_EXP for
    // every value, as $arrayEvery (Array.prototype.every)
    // will return at first false value
    const ITEMS_UNIQUE_EXP = ['$arrayEvery', ITEM_IS_UNIQUE_EXP]

    const itemsAreUnique = (array) =>
      evaluate(
        {
          interpreters: syncInterpreters,
          scope: { $$VALUE: array },
        },
        ITEMS_UNIQUE_EXP
      )

    expect(itemsAreUnique([1, 2, 3, 4])).toEqual(true)
    expect(itemsAreUnique([1, 2, 3, 1])).toEqual(false)
  })
})
