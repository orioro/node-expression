import { evaluate } from '../expression'
import { $value } from './value'
import {
  $arrayLength,
  $arrayIncludes,
  $arrayMap,
  $arrayReduce,
} from './array'

import {
  $mathSum
} from './math'

describe('$arrayLength', () => {
  const interpreters = {
    $value,
    $arrayLength
  }

  test('', () => {
    const context = {
      interpreters,
      data: {
        $$VALUE: ['A', 'B', 'C', 'D']
      }
    }

    expect(evaluate(context, ['$arrayLength'])).toEqual(4)
  })
})

describe('$arrayIncludes', () => {
  const interpreters = {
    $value,
    $arrayIncludes
  }

  test('', () => {
    const context = {
      interpreters,
      data: {
        $$VALUE: ['A', 'B', 'C', 'D']
      }
    }

    expect(evaluate(context, ['$arrayIncludes', 'A'])).toEqual(true)
    expect(evaluate(context, ['$arrayIncludes', 'Z'])).toEqual(false)
  })
})

describe('$arrayMap', () => {
  const interpreters = {
    $value,
    $mathSum,
    $arrayMap,
    $arrayLength
  }

  test('', () => {
    const context = {
      interpreters,
      data: {
        $$VALUE: [-10, 0, 10, 20]
      }
    }

    expect(evaluate(context, ['$arrayMap', 'SOME_VALUE'])).toEqual([
      'SOME_VALUE',
      'SOME_VALUE',
      'SOME_VALUE',
      'SOME_VALUE',
    ])

    expect(evaluate(context, ['$arrayMap', ['$mathSum', 5]]))
      .toEqual([-5, 5, 15, 25])

  })

  test('[$value, $$ARRAY]', () => {
    expect(evaluate(
      {
        interpreters,
        data: { $$VALUE: [-10, 0, 10, 20] }
      },
      ['$arrayMap',
        ['$mathSum',
          ['$arrayLength', ['$value', '$$ARRAY']]
        ]
      ]
    )).toEqual([-6, 4, 14, 24])
  })

  test('[$value, $$INDEX]', () => {
    expect(evaluate(
      {
        interpreters,
        data: { $$VALUE: [-10, 0, 10, 20] }
      },
      ['$arrayMap',
        ['$mathSum',
          ['$value', '$$INDEX']
        ]
      ]
    )).toEqual([-10, 1, 12, 23])
  })
})

describe('$arrayReduce', () => {
  const interpreters = {
    $value,
    $mathSum,
    $arrayReduce
  }

  test('', () => {
    const context = {
      interpreters,
      data: { $$VALUE: [0, 10, 20, 40] }
    }

    expect(evaluate(context, ['$arrayReduce', ['$mathSum', ['$value', '$$ACC']], 0]))
      .toEqual(70)
  })
})

