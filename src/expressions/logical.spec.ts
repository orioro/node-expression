import { evaluate } from '../evaluate'
import { syncInterpreterList } from '../interpreter'
import { VALUE_EXPRESSIONS } from './value'
import { BOOLEAN_EXPRESSIONS } from './boolean'
import { LOGICAL_EXPRESSIONS } from './logical'
import { ARRAY_EXPRESSIONS } from './array'
import { COMPARISON_EXPRESSIONS } from './comparison'
import { STRING_EXPRESSIONS } from './string'
import { MATH_EXPRESSIONS } from './math'

const interpreters = syncInterpreterList({
  ...VALUE_EXPRESSIONS,
  ...BOOLEAN_EXPRESSIONS,
  ...LOGICAL_EXPRESSIONS,
  ...ARRAY_EXPRESSIONS,
  ...COMPARISON_EXPRESSIONS,
  ...STRING_EXPRESSIONS,
  ...MATH_EXPRESSIONS,
})

describe('$and', () => {
  test('error situations', () => {
    expect(() =>
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: undefined },
        },
        ['$and']
      )
    ).toThrow(TypeError)

    expect(() =>
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: null },
        },
        ['$and']
      )
    ).toThrow(TypeError)

    expect(() =>
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: true },
        },
        ['$and']
      )
    ).toThrow(TypeError)

    expect(() =>
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: 8 },
        },
        ['$and']
      )
    ).toThrow(TypeError)

    expect(() =>
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: {} },
        },
        ['$and']
      )
    ).toThrow(TypeError)
  })

  test('basic', () => {
    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: [true, true, true] },
        },
        ['$and']
      )
    ).toEqual(true)

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: [true, false, true] },
        },
        ['$and']
      )
    ).toEqual(false)

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: [1, 'string', true] },
        },
        ['$and', ['$arrayMap', ['$boolean']]]
      )
    ).toEqual(true)

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: [1, '', true] },
        },
        ['$and', ['$arrayMap', ['$boolean']]]
      )
    ).toEqual(false)
  })

  test('value coercion', () => {
    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: [1, 0, true] },
        },
        ['$and']
      )
    ).toEqual(false)

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: [1, 'some-string', true] },
        },
        ['$and']
      )
    ).toEqual(true)

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: [1, '', true] },
        },
        ['$and']
      )
    ).toEqual(false)

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: [1, null, true] },
        },
        ['$and']
      )
    ).toEqual(false)
  })

  // eslint-disable-next-line jest/no-disabled-tests
  test('value coercion on unknown expressions / expression-like values should trigger warning', () => {
    const warn_ = console.warn
    console.warn = jest.fn()

    evaluate(
      {
        interpreters,
        scope: {
          $$VALUE: [
            ['$unknownExpression', 1, 2],
            ['$anotherUnknownExpression', null],
          ],
        },
      },
      ['$and']
    )

    expect(console.warn).toHaveBeenNthCalledWith(
      1,
      'Possible missing expression error: ["$unknownExpression",1,2]. ' +
        "No interpreter was found for '$unknownExpression'"
    )
    expect(console.warn).toHaveBeenNthCalledWith(
      2,
      'Possible missing expression error: ["$anotherUnknownExpression",null]. ' +
        "No interpreter was found for '$anotherUnknownExpression'"
    )

    console.warn = warn_
  })

  test('w/ comparison', () => {
    const context = {
      interpreters,
      scope: {
        $$VALUE: {
          name: 'João Maranhão',
          age: 25,
        },
      },
    }

    expect(
      evaluate(context, [
        '$and',
        [
          ['$eq', 'João', ['$stringSubstr', 0, 4, ['$value', 'name']]],
          ['$gt', 20, ['$value', 'age']],
          ['$lt', 30, ['$value', 'age']],
        ],
      ])
    ).toEqual(true)

    expect(
      evaluate(context, [
        '$and',
        [
          ['$gt', 20, ['$value', 'age']],
          ['$lt', 30, ['$value', 'age']],
        ],
      ])
    ).toEqual(true)

    expect(
      evaluate(context, [
        '$and',
        [
          ['$eq', 'Fernando', ['$stringSubstr', 0, 8, ['$value', 'name']]],
          ['$gt', 20, ['$value', 'age']],
          ['$lt', 30, ['$value', 'age']],
        ],
      ])
    ).toEqual(false)

    expect(
      evaluate(context, [
        '$and',
        [
          ['$gt', 20, ['$value', 'age']],
          ['$lt', 30, ['$value', 'age']],
        ],
      ])
    ).toEqual(true)
  })
})

describe('$or', () => {
  test('basic', () => {
    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: [false, true, false] },
        },
        ['$or']
      )
    ).toEqual(true)

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: [false, false, false] },
        },
        ['$or']
      )
    ).toEqual(false)
  })
})

describe('$not', () => {
  test('basic', () => {
    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: 'some-value' },
        },
        ['$not', ['$eq', 'some-value']]
      )
    ).toEqual(false)

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: 'some-value' },
        },
        ['$not', ['$eq', 'some-other-value']]
      )
    ).toEqual(true)
  })
})

describe('$nor', () => {
  test('basic', () => {
    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: '1234567890' },
        },
        [
          '$nor',
          [
            ['$stringStartsWith', '123'], // true
            ['$gt', 15, ['$stringLength']], // false
          ],
        ]
      )
    ).toEqual(false)

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: '1234567890' },
        },
        [
          '$nor',
          [
            ['$stringStartsWith', '0000'], // false
            ['$gt', 15, ['$stringLength']], // false
          ],
        ]
      )
    ).toEqual(true)
  })
})

describe('$xor', () => {
  test('basic', () => {
    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: '1234567890' },
        },
        [
          '$xor',
          ['$stringStartsWith', '123'], // true
          ['$gt', 15, ['$stringLength']], // false
        ]
      )
    ).toEqual(true)

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: '1234567890' },
        },
        [
          '$xor',
          ['$stringStartsWith', '0000'], // false
          ['$gt', 15, ['$stringLength']], // false
        ]
      )
    ).toEqual(false)

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: '1234567890' },
        },
        [
          '$xor',
          ['$stringStartsWith', '123'], // true
          ['$gt', 5, ['$stringLength']], // true
        ]
      )
    ).toEqual(false)
  })
})

describe('$if', () => {
  test('basic', () => {
    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: 15 },
        },
        ['$if', ['$gt', 10], 100, 0]
      )
    ).toEqual(100)

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: 8 },
        },
        ['$if', ['$gt', 10], 100, 0]
      )
    ).toEqual(0)
  })

  test('then and else expressions should be evaluated only after condition evaluation', () => {
    let expAExecuted = false
    let expBExecuted = false // eslint-disable-line prefer-const

    expect(
      evaluate(
        {
          interpreters: {
            ...interpreters,
            $expA: () => {
              expAExecuted = true
              return 'expA-result'
            },
            $expB: () => {
              expAExecuted = false
              return 'expB-result'
            },
          },
          scope: { $$VALUE: 15 },
        },
        ['$if', ['$gt', 10], ['$expA'], ['$expB']]
      )
    ).toEqual('expA-result')

    expect(expAExecuted).toEqual(true)
    expect(expBExecuted).toEqual(false)
  })
})

describe('$switch', () => {
  test('simple comparison', () => {
    const expNoDefault = [
      '$switch',
      [
        [['$eq', 'CASE_A'], 'VALUE_A'],
        [['$eq', 'CASE_B'], 'VALUE_B'],
        [['$eq', 'CASE_C'], 'VALUE_C'],
      ],
    ]

    const expWithDefault = [...expNoDefault, 'DEFAULT_VALUE']

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: 'CASE_B' },
        },
        expNoDefault
      )
    ).toEqual('VALUE_B')

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: 'CASE_D' },
        },
        expNoDefault
      )
    ).toEqual(undefined)

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: 'CASE_D' },
        },
        expWithDefault
      )
    ).toEqual('DEFAULT_VALUE')
  })

  test('more complex condition', () => {
    const $expr = [
      '$switch',
      [
        [
          [
            '$and',
            [
              ['$gte', 0],
              ['$lt', 10],
            ],
          ],
          ['$mathMult', 0],
        ],
        [
          [
            '$and',
            [
              ['$gte', 10],
              ['$lt', 20],
            ],
          ],
          ['$mathMult', 10],
        ],
        [
          [
            '$and',
            [
              ['$gte', 20],
              ['$lt', 30],
            ],
          ],
          ['$mathMult', 20],
        ],
      ],
      ['$mathMult', -1],
    ]

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: 5 },
        },
        $expr
      )
    ).toEqual(0)

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: 15 },
        },
        $expr
      )
    ).toEqual(150)

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: 25 },
        },
        $expr
      )
    ).toEqual(500)

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: 30 },
        },
        $expr
      )
    ).toEqual(-30)
  })
})

describe('$switchKey', () => {
  const options = {
    key1: 'value1',
    key2: 'value2',
    key3: 'value3',
  }

  test('basic', () => {
    const exp = ['$switchKey', options, 'DEFAULT_VALUE']

    const expected = [
      [undefined, 'DEFAULT_VALUE'],
      [null, 'DEFAULT_VALUE'],
      ['key1', 'value1'],
      ['key2', 'value2'],
      ['key3', 'value3'],
      ['key4', 'DEFAULT_VALUE'],
    ]

    expected.forEach(([input, result]) => {
      expect(
        evaluate(
          {
            interpreters,
            scope: { $$VALUE: input },
          },
          exp
        )
      ).toEqual(result)
    })
  })
})
