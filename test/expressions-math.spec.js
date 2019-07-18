import {
  expression,
  $$VALUE,
  VALUE_EXPRESSIONS,
  MATH_EXPRESSIONS,
  MATCH_EXPRESSIONS,
  ARRAY_EXPRESSIONS,
  COMPARISON_EXPRESSIONS,
} from '../src'

describe('math expressions', () => {

  const evaluate = expression({
    ...VALUE_EXPRESSIONS,
    ...MATH_EXPRESSIONS,
    ...MATCH_EXPRESSIONS,
    ...ARRAY_EXPRESSIONS,
    ...COMPARISON_EXPRESSIONS
  })

  test('$mathSum - basic', () => {
    const obj = {
      'pending': 23,
      'ready': 14,
      'removal': 6
    }

    expect(evaluate([
      '$mathSum',
      ['$value', 'pending'],
      ['$value', 'ready'],
      ['$value', 'removal']
    ], obj))
    .toEqual(43)
  })

  test('$mathSum - with $arrayLength', () => {
    expect(evaluate([
      '$mathSum',
      ['$arrayLength', ['$value', 'pending']],
      ['$arrayLength', ['$value', 'ready']],
      ['$arrayLength', ['$value', 'removal']]
    ], {
      pending: ['a', 'b', 'c', 'd', 'e'],
      ready: ['f', 'g', 'h'],
      removal: ['i', 'j', 'k', 'l']
    }))
    .toEqual(12)
  })

  test('$mathSum - $transform', () => {
    const obj = {
      pending: ['a', 'b', 'c', 'd', 'e'],
      ready: ['f', 'g', 'h'],
      removal: ['i', 'j', 'k', 'l']
    }

    expect(evaluate([
      '$transform',
      {
        total: [
          '$mathSum',
          ['$arrayLength', ['$value', 'pending']],
          ['$arrayLength', ['$value', 'ready']],
          ['$arrayLength', ['$value', 'removal']],
        ],
        pending: 'pending',
        ready: 'ready',
        removal: 'removal'
      }
    ], obj))
    .toEqual({
      total: 12,
      ...obj,
    })
  })

  test('$mathSum - with matchPaths', () => {

    const obj1 = {
      pending: [1, 2, 3, 4, 5, 6, 7],
      ready: [1, 2, 3],
      removal: [1, 2, 3]
    }

    const $transform_TOTAL = ['$transform', {
      total: ['$mathSum',
        ['$arrayLength', ['$value', 'pending']],
        ['$arrayLength', ['$value', 'ready']],
        ['$arrayLength', ['$value', 'removal']],
      ]
    }]

    const $TOTAL_GT_10 = [
      '$matchPaths',
      {
        total: {
          $gt: 10
        }
      },
      $transform_TOTAL,
    ]

    expect(evaluate($TOTAL_GT_10, obj1))
      .toEqual(true)
  })
})
