import { evaluate } from '../expression'
import { VALUE_EXPRESSIONS } from './value'
import { COMPARISON_EXPRESSIONS } from './comparison'
import { LOGICAL_EXPRESSIONS } from './logical'
import { ARRAY_EXPRESSIONS } from './array'
import { OBJECT_EXPRESSIONS } from './object'
import { STRING_EXPRESSIONS } from './string'
import { MATH_EXPRESSIONS } from './math'
import { NUMBER_EXPRESSIONS } from './number'

const interpreters = {
  ...VALUE_EXPRESSIONS,
  ...LOGICAL_EXPRESSIONS,
  ...NUMBER_EXPRESSIONS,
  ...MATH_EXPRESSIONS,
  ...COMPARISON_EXPRESSIONS,
  ...OBJECT_EXPRESSIONS,
  ...STRING_EXPRESSIONS,
  ...ARRAY_EXPRESSIONS,
}

describe('$arrayIncludes', () => {
  test('basic usage', () => {
    const context = {
      interpreters,
      scope: {
        $$VALUE: ['A', 'B', 'C', 'D'],
      },
    }

    expect(evaluate(context, ['$arrayIncludes', 'A'])).toEqual(true)
    expect(evaluate(context, ['$arrayIncludes', 'Z'])).toEqual(false)
  })
})

describe('$arrayIncludesAll', () => {
  test('basic usage', () => {
    const context = {
      interpreters,
      scope: {
        $$VALUE: ['A', 'B', 'C', 'D'],
      },
    }

    expect(evaluate(context, ['$arrayIncludesAll', ['A', 'B']])).toEqual(true)
    expect(evaluate(context, ['$arrayIncludesAll', ['A', 'Z']])).toEqual(false)
  })
})

describe('$arrayIncludesAny', () => {
  test('basic usage', () => {
    const context = {
      interpreters,
      scope: {
        $$VALUE: ['A', 'B', 'C', 'D'],
      },
    }

    expect(evaluate(context, ['$arrayIncludesAny', ['A', 'B']])).toEqual(true)
    expect(evaluate(context, ['$arrayIncludesAny', ['A', 'Z']])).toEqual(true)
    expect(evaluate(context, ['$arrayIncludesAny', ['X', 'Y', 'Z']])).toEqual(
      false
    )
  })
})

describe('$arrayLength', () => {
  test('basic usage', () => {
    const context = {
      interpreters,
      scope: {
        $$VALUE: ['A', 'B', 'C', 'D'],
      },
    }

    expect(evaluate(context, ['$arrayLength'])).toEqual(4)
  })
})

describe('$arrayMap', () => {
  test('basic usage', () => {
    const context = {
      interpreters,
      scope: {
        $$VALUE: [-10, 0, 10, 20],
      },
    }

    expect(evaluate(context, ['$arrayMap', 'SOME_VALUE'])).toEqual([
      'SOME_VALUE',
      'SOME_VALUE',
      'SOME_VALUE',
      'SOME_VALUE',
    ])

    expect(evaluate(context, ['$arrayMap', ['$mathSum', 5]])).toEqual([
      -5,
      5,
      15,
      25,
    ])
  })

  test('[$value, $$ARRAY]', () => {
    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: [-10, 0, 10, 20] },
        },
        ['$arrayMap', ['$mathSum', ['$arrayLength', ['$value', '$$ARRAY']]]]
      )
    ).toEqual([-6, 4, 14, 24])
  })

  test('[$value, $$INDEX]', () => {
    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: [-10, 0, 10, 20] },
        },
        ['$arrayMap', ['$mathSum', ['$value', '$$INDEX']]]
      )
    ).toEqual([-10, 1, 12, 23])
  })
})

describe('$arrayFilter', () => {
  test('testing against parent scope value', () => {
    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: 2 },
        },
        [
          '$arrayFilter',
          ['$eq', 0, ['$mathMod', ['$value', '$$PARENT_SCOPE.$$VALUE']]],
          [1, 2, 3, 4, 5, 6],
        ]
      )
    ).toEqual([2, 4, 6])
  })

  test('with meta evaluation', () => {
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

    const check = (value) =>
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: value },
        },
        [
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
      )

    expect(check(9)).toEqual([NOT_EVEN_ERR])
    expect(check(10)).toEqual([])
    expect(check(11)).toEqual([OUT_OF_RANGE_ERR, NOT_EVEN_ERR])
  })
})

describe('$arrayIndexOf vs $arrayFindIndex', () => {
  test('$arrayIndexOf', () => {
    const context = {
      interpreters,
      scope: { $$VALUE: [0, 10, 20, 40] },
    }

    expect(evaluate(context, ['$arrayIndexOf', 20])).toEqual(2)
  })

  test('$arrayFindIndex', () => {
    const context = {
      interpreters,
      scope: { $$VALUE: [0, 10, 20, 40] },
    }

    expect(evaluate(context, ['$arrayFindIndex', ['$eq', 20]])).toEqual(2)
  })
})

describe('$arrayReduce', () => {
  test('basic usage', () => {
    const context = {
      interpreters,
      scope: { $$VALUE: [0, 10, 20, 40] },
    }

    expect(
      evaluate(context, ['$arrayReduce', ['$mathSum', ['$value', '$$ACC']], 0])
    ).toEqual(70)
  })
})

describe('$arrayReverse', () => {
  test('basic usage', () => {
    const context = {
      interpreters,
      scope: { $$VALUE: ['A', 'B', 'C', 'D'] },
    }

    expect(evaluate(context, ['$arrayReverse'])).toEqual(['D', 'C', 'B', 'A'])
  })
})

describe('$arraySort', () => {
  test('basic usage', () => {
    const context = {
      interpreters,
      scope: { $$VALUE: ['B', 'D', 'C', 'A'] },
    }

    expect(evaluate(context, ['$arraySort'])).toEqual(['A', 'B', 'C', 'D'])
  })

  test('with custom comparator', () => {
    const context = {
      interpreters,
      scope: { $$VALUE: ['9', '1', '12', '11'] },
    }

    expect(evaluate(context, ['$arraySort'])).toEqual(['1', '11', '12', '9'])

    expect(
      evaluate(context, [
        '$arraySort',
        [
          '$mathSub',
          ['$numberInt', 10, ['$value', '$$SORT_B']],
          ['$numberInt', 10, ['$value', '$$SORT_A']],
        ],
      ])
    ).toEqual(['1', '9', '11', '12'])
  })
})

describe('$arrayPush', () => {
  test('basic usage', () => {
    const context = {
      interpreters,
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
      interpreters,
      scope: { $$VALUE: ['A', 'B', 'C', 'D'] },
    }

    expect(evaluate(context, ['$arrayPop'])).toEqual(['A', 'B', 'C'])
  })
})

describe('$arrayUnshift', () => {
  test('basic usage', () => {
    const context = {
      interpreters,
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
      interpreters,
      scope: { $$VALUE: ['A', 'B', 'C', 'D'] },
    }

    expect(evaluate(context, ['$arrayShift'])).toEqual(['B', 'C', 'D'])
  })
})

describe('$arraySlice', () => {
  test('basic usage', () => {
    const context = {
      interpreters,
      scope: { $$VALUE: ['A', 'B', 'C', 'D'] },
    }

    expect(evaluate(context, ['$arraySlice', 1, 3])).toEqual(['B', 'C'])
  })
})

describe('$arraySubstitute', () => {
  test('basic usage', () => {
    const context = {
      interpreters,
      scope: { $$VALUE: ['A', 'B', 'C', 'D'] },
    }

    expect(
      evaluate(context, ['$arraySubstitute', 1, 3, ['$arraySlice', 0, 4]])
    ).toEqual(['A', 'A', 'B', 'C', 'D', 'D'])
  })
})

describe('$arrayAddAt', () => {
  test('basic usage', () => {
    const context = {
      interpreters,
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
      interpreters,
      scope: { $$VALUE: ['A', 'B', 'C', 'D'] },
    }

    expect(evaluate(context, ['$arrayRemoveAt', 1, 2])).toEqual(['A', 'D'])

    expect(evaluate(context, ['$arrayRemoveAt', 1])).toEqual(['A', 'C', 'D'])
  })
})

describe('$arrayJoin', () => {
  test('basic usage', () => {
    const context = {
      interpreters,
      scope: { $$VALUE: ['A', 'B', 'C', 'D'] },
    }

    expect(evaluate(context, ['$arrayJoin', '_'])).toEqual('A_B_C_D')

    expect(evaluate(context, ['$arrayJoin'])).toEqual('ABCD')
  })
})

describe('$arrayAt', () => {
  test('basic usage', () => {
    const context = {
      interpreters,
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
          interpreters,
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
          interpreters,
          scope: { $$VALUE: array },
        },
        ITEMS_UNIQUE_EXP
      )

    expect(itemsAreUnique([1, 2, 3, 4])).toEqual(true)
    expect(itemsAreUnique([1, 2, 3, 1])).toEqual(false)
  })
})
