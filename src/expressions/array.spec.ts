import { evaluate } from '../expression'
import { $value } from './value'
import { COMPARISON_EXPRESSIONS } from './comparison'
import { LOGICAL_EXPRESSIONS } from './logical'
import { ARRAY_EXPRESSIONS } from './array'
import { OBJECT_EXPRESSIONS } from './object'
import { STRING_EXPRESSIONS } from './string'
import { MATH_EXPRESSIONS } from './math'
import { NUMBER_EXPRESSIONS } from './number'

const interpreters = {
  $value,
  ...LOGICAL_EXPRESSIONS,
  ...NUMBER_EXPRESSIONS,
  ...MATH_EXPRESSIONS,
  ...COMPARISON_EXPRESSIONS,
  ...OBJECT_EXPRESSIONS,
  ...STRING_EXPRESSIONS,
  ...ARRAY_EXPRESSIONS
}

describe('$arrayIncludes', () => {
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

describe('$arrayIncludesAll', () => {
  test('', () => {
    const context = {
      interpreters,
      data: {
        $$VALUE: ['A', 'B', 'C', 'D']
      }
    }

    expect(evaluate(context, ['$arrayIncludesAll', ['A', 'B']])).toEqual(true)
    expect(evaluate(context, ['$arrayIncludesAll', ['A', 'Z']])).toEqual(false)
  })
})

describe('$arrayIncludesAny', () => {
  test('', () => {
    const context = {
      interpreters,
      data: {
        $$VALUE: ['A', 'B', 'C', 'D']
      }
    }

    expect(evaluate(context, ['$arrayIncludesAny', ['A', 'B']])).toEqual(true)
    expect(evaluate(context, ['$arrayIncludesAny', ['A', 'Z']])).toEqual(true)
    expect(evaluate(context, ['$arrayIncludesAny', ['X', 'Y', 'Z']])).toEqual(false)
  })
})

describe('$arrayLength', () => {
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

describe('$arrayMap', () => {
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

describe('$arrayFilter', () => {

  test('testing against parent scope value', () => {
    expect(evaluate(
      {
        interpreters,
        data: { $$VALUE: 2 }
      },
      [
        '$arrayFilter',
        ['$eq', 0, ['$mathMod', ['$value', '$$PARENT.$$VALUE']]],
        [1, 2, 3, 4, 5, 6]
      ]
    )).toEqual([2, 4, 6])
  })
})

describe('$arrayReduce', () => {
  test('', () => {
    const context = {
      interpreters,
      data: { $$VALUE: [0, 10, 20, 40] }
    }

    expect(evaluate(context, ['$arrayReduce', ['$mathSum', ['$value', '$$ACC']], 0]))
      .toEqual(70)
  })
})

describe('$arrayReverse', () => {
  test('', () => {
    const context = {
      interpreters,
      data: { $$VALUE: ['A', 'B', 'C', 'D'] }
    }

    expect(evaluate(context, ['$arrayReverse']))
      .toEqual(['D', 'C', 'B', 'A'])
  })
})

describe('$arraySort', () => {
  test('', () => {
    const context = {
      interpreters,
      data: { $$VALUE: ['B', 'D', 'C', 'A'] }
    }

    expect(evaluate(context, ['$arraySort']))
      .toEqual(['A', 'B', 'C', 'D'])
  })

  test('with custom comparator', () => {
    const context = {
      interpreters,
      data: { $$VALUE: ['9', '1', '12', '11'] }
    }

    expect(evaluate(context, ['$arraySort']))
      .toEqual(['1', '11', '12', '9'])

    expect(evaluate(context, [
      '$arraySort', ['$mathSub',
        ['$numberInt', 10, ['$value', '$$SORT_B']],
        ['$numberInt', 10, ['$value', '$$SORT_A']]
      ]
    ])).toEqual(['1', '9', '11', '12'])
  })
})

describe('$arrayPush', () => {
  test('', () => {
    const context = {
      interpreters,
      data: { $$VALUE: ['A', 'B', 'C', 'D'] }
    }

    expect(evaluate(context, ['$arrayPush', 'E']))
      .toEqual(['A', 'B', 'C', 'D', 'E'])
  })
})

describe('$arrayPop', () => {
  test('', () => {
    const context = {
      interpreters,
      data: { $$VALUE: ['A', 'B', 'C', 'D'] }
    }

    expect(evaluate(context, ['$arrayPop']))
      .toEqual(['A', 'B', 'C'])
  })
})

describe('$arrayUnshift', () => {
  test('', () => {
    const context = {
      interpreters,
      data: { $$VALUE: ['A', 'B', 'C', 'D'] }
    }

    expect(evaluate(context, ['$arrayUnshift', 'Z']))
      .toEqual(['Z', 'A', 'B', 'C', 'D'])
  })
})

describe('$arrayShift', () => {
  test('', () => {
    const context = {
      interpreters,
      data: { $$VALUE: ['A', 'B', 'C', 'D'] }
    }

    expect(evaluate(context, ['$arrayShift']))
      .toEqual(['B', 'C', 'D'])
  })
})

describe('$arraySlice', () => {
  test('', () => {
    const context = {
      interpreters,
      data: { $$VALUE: ['A', 'B', 'C', 'D'] }
    }

    expect(evaluate(context, ['$arraySlice', 1, 3]))
      .toEqual(['B', 'C'])
  })
})

describe('$arraySubstitute', () => {
  test('', () => {
    const context = {
      interpreters,
      data: { $$VALUE: ['A', 'B', 'C', 'D'] }
    }
    
    expect(evaluate(context, ['$arraySubstitute', 1, 3, ['$arraySlice', 0, 4]]))
      .toEqual(['A', 'A', 'B', 'C', 'D', 'D'])
  })
})

describe('$arrayAddAt', () => {
  test('', () => {
    const context = {
      interpreters,
      data: { $$VALUE: ['A', 'B', 'C', 'D'] }
    }
    
    expect(evaluate(context, ['$arrayAddAt', 1, ['$arraySlice', 0, 4]]))
      .toEqual(['A', 'A', 'B', 'C', 'D', 'B', 'C', 'D'])
  })
})

describe('$arrayRemoveAt', () => {
  test('', () => {
    const context = {
      interpreters,
      data: { $$VALUE: ['A', 'B', 'C', 'D'] }
    }
    
    expect(evaluate(context, ['$arrayRemoveAt', 1, 2]))
      .toEqual(['A', 'D'])

    expect(evaluate(context, ['$arrayRemoveAt', 1]))
      .toEqual(['A', 'C', 'D'])
  })
})

describe('$arrayJoin', () => {
  test('', () => {
    const context = {
      interpreters,
      data: { $$VALUE: ['A', 'B', 'C', 'D'] }
    }
    
    expect(evaluate(context, ['$arrayJoin', '_']))
      .toEqual('A_B_C_D')
    
    expect(evaluate(context, ['$arrayJoin']))
      .toEqual('ABCD')
  })
})

describe('$arrayAt', () => {
  test('', () => {
    const context = {
      interpreters,
      data: { $$VALUE: ['A', 'B', 'C', 'D'] }
    }
    
    expect(evaluate(context, ['$arrayAt', 0]))
      .toEqual('A')
    
    expect(evaluate(context, ['$arrayAt', 3]))
      .toEqual('D')

    expect(evaluate(context, ['$arrayAt', 4]))
      .toEqual(undefined)
  })
})

describe('$arrayFormat', () => {
  const context = {
    interpreters,
    data: {
      $$VALUE: {
        name: 'João',
        lastName: 'Silva Souza',
        father: {
          name: 'Raimundo',
          lastName: 'Silva'
        },
        mother: {
          name: 'Maria',
          lastName: 'do Carmo'
        }
      }
    }
  }

  test('', () => {
    expect(evaluate(context, ['$arrayFormat', [
      'name',
      'father.name',
      'mother.lastName'
    ]])).toEqual(['João', 'Raimundo', 'do Carmo'])
  })

  test('expression items', () => {

    expect(evaluate(context, ['$arrayFormat', [
      ['$stringConcat', ['$value', 'father.name'], ['$value', 'mother.name']],
      'name',
      'father.name',
      'mother.lastName'
    ]])).toEqual(['MariaRaimundo', 'João', 'Raimundo', 'do Carmo'])
  })

  test('with object items', () => {
    expect(evaluate(context, ['$arrayFormat', [
      'father.name',
      {
        fatherName: 'father.name'
      }
    ]]))
    .toEqual([
      'Raimundo',
      { fatherName: 'Raimundo' }
    ])
  })
})
