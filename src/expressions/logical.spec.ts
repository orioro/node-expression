import {
  testCases,
  asyncResult,
  valueLabel,
  resultLabel,
} from '@orioro/jest-util'
import { evaluate } from '../evaluate'
import { syncInterpreterList } from '../syncInterpreter'
import { asyncInterpreterList } from '../asyncInterpreter'
import { VALUE_EXPRESSIONS } from './value'
import { BOOLEAN_EXPRESSIONS } from './boolean'
import { LOGICAL_EXPRESSIONS } from './logical'
import { ARRAY_EXPRESSIONS } from './array'
import { COMPARISON_EXPRESSIONS } from './comparison'
import { STRING_EXPRESSIONS } from './string'
import { MATH_EXPRESSIONS } from './math'

const COMMON_EXPRESSIONS = {
  ...VALUE_EXPRESSIONS,
  ...BOOLEAN_EXPRESSIONS,
  ...LOGICAL_EXPRESSIONS,
  ...ARRAY_EXPRESSIONS,
  ...COMPARISON_EXPRESSIONS,
  ...STRING_EXPRESSIONS,
  ...MATH_EXPRESSIONS,
}

const syncInterpreters = syncInterpreterList(COMMON_EXPRESSIONS)

const delayValue = (value, ms = 100) =>
  new Promise((resolve) => setTimeout(resolve.bind(null, value), ms))

const asyncInterpreters = asyncInterpreterList({
  ...COMMON_EXPRESSIONS,
  $asyncValue: (context, ...args) =>
    delayValue(evaluate(context, ['$value', ...args])),
  $asyncNum50: () => delayValue(50),
  $asyncNum100: () => delayValue(100),
  $asyncStr1: () => delayValue('str1'),
  $asyncStr2: () => delayValue('str2'),
  $asyncFalse: () => delayValue(false),
  $asyncTrue: () => delayValue(true),
})

const _evSync = (value, expression) =>
  evaluate(
    {
      interpreters: syncInterpreters,
      scope: { $$VALUE: value },
    },
    expression
  )

const _evAsync = (value, expression) =>
  evaluate(
    {
      interpreters: asyncInterpreters,
      scope: { $$VALUE: value },
    },
    expression
  )

const _evLabel = ([value, expression], result) =>
  `${valueLabel(value)} | ${valueLabel(expression)} -> ${resultLabel(result)}`

const _evTestCases = (cases) => {
  testCases(
    cases,
    _evSync,
    ([value, expression], result) =>
      `sync - ${_evLabel([value, expression], result)}`
  )

  testCases(
    cases.map((_case) => {
      const result = _case[_case.length - 1]
      const args = _case.slice(0, -1)

      return [...args, asyncResult(result)]
    }),
    _evAsync,
    ([value, expression], result) =>
      `async - ${_evLabel([value, expression], result)}`
  )
}

describe('$and', () => {
  describe('error situations', () => {
    _evTestCases([
      [undefined, ['$and'], TypeError],
      [null, ['$and'], TypeError],
      [true, ['$and'], TypeError],
      [8, ['$and'], TypeError],
      [{}, ['$and'], TypeError],
    ])
  })

  describe('basic', () => {
    _evTestCases([
      [[true, true, true], ['$and'], true],
      [[true, false, true], ['$and'], false],
      [[1, 'string', true], ['$and'], true],
      [[1, '', true], ['$and'], false],
    ])
  })

  describe('value coercion', () => {
    _evTestCases([
      [[1, 0, true], ['$and'], false],
      [[1, 'some-string', true], ['$and'], true],
      [[1, '', true], ['$and'], false],
      [[1, null, true], ['$and'], false],
    ])
  })

  // eslint-disable-next-line jest/no-disabled-tests
  test('value coercion on unknown expressions / expression-like values should trigger warning', () => {
    const warn_ = console.warn
    console.warn = jest.fn()

    evaluate(
      {
        interpreters: syncInterpreters,
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

  describe('w/ comparison', () => {
    const data = {
      name: 'João Maranhão',
      age: 25,
    }
    const context = {
      interpreters: syncInterpreters,
      scope: {
        $$VALUE: data,
      },
    }

    _evTestCases([
      [
        data,
        [
          '$and',
          [
            ['$eq', 'João', ['$stringSubstr', 0, 4, ['$value', 'name']]],
            ['$gt', 20, ['$value', 'age']],
            ['$lt', 30, ['$value', 'age']],
          ],
        ],
        true,
      ],
      [
        data,
        [
          '$and',
          [
            ['$gt', 20, ['$value', 'age']],
            ['$lt', 30, ['$value', 'age']],
          ],
        ],
        true,
      ],
      [
        data,
        [
          '$and',
          [
            ['$eq', 'Fernando', ['$stringSubstr', 0, 8, ['$value', 'name']]],
            ['$gt', 20, ['$value', 'age']],
            ['$lt', 30, ['$value', 'age']],
          ],
        ],
        false,
      ],
      [
        data,
        [
          '$and',
          [
            ['$gt', 20, ['$value', 'age']],
            ['$lt', 30, ['$value', 'age']],
          ],
        ],
        true,
      ],
    ])
  })

  describe('using async getters', () => {
    const MIN_VALUE = 20
    const MAX_VALUE = 50

    const asyncInterpreters = asyncInterpreterList({
      ...VALUE_EXPRESSIONS,
      ...LOGICAL_EXPRESSIONS,
      ...COMPARISON_EXPRESSIONS,
      $asyncGetMinValue: () =>
        new Promise((resolve) => {
          setTimeout(resolve.bind(null, MIN_VALUE), 100)
        }),
      $asyncGetMaxValue: () =>
        new Promise((resolve) => {
          setTimeout(resolve.bind(null, MAX_VALUE), 100)
        }),
    })

    const exp = [
      '$and',
      [
        ['$gte', ['$asyncGetMinValue']],
        ['$lte', ['$asyncGetMaxValue']],
      ],
    ]

    testCases(
      [
        [30, asyncResult(true)],
        [20, asyncResult(true)],
        [10, asyncResult(false)],
      ],
      (input) =>
        evaluate(
          {
            interpreters: asyncInterpreters,
            scope: { $$VALUE: input },
          },
          exp
        ),
      ([value], result) =>
        `${value} >= ${MIN_VALUE} && ${value} <= ${MAX_VALUE} -> ${resultLabel(
          result
        )}`
    )
  })
})

describe('$or', () => {
  _evTestCases([
    [[false, true, false], ['$or'], true],
    [[false, false, false], ['$or'], false],
    [
      10,
      [
        '$or',
        [
          ['$eq', 0, ['$mathMod', 5]],
          ['$eq', 0, ['$mathMod', 3]],
        ],
      ],
      true,
    ],
    [
      7,
      [
        '$or',
        [
          ['$eq', 0, ['$mathMod', 5]],
          ['$eq', 0, ['$mathMod', 3]],
        ],
      ],
      false,
    ],
  ])
})

describe('$not', () => {
  _evTestCases([
    ['some-value', ['$not', ['$eq', 'some-value']], false],
    ['some-value', ['$not', ['$eq', 'some-other-value']], true],
  ])
})

describe('$nor', () => {
  _evTestCases([
    [
      '1234567890',
      [
        '$nor',
        [
          ['$stringStartsWith', '123'], // true
          ['$gt', 15, ['$stringLength']], // false
        ],
      ],
      false,
    ],
    [
      '1234567890',
      [
        '$nor',
        [
          ['$stringStartsWith', '0000'], // false
          ['$gt', 15, ['$stringLength']], // false
        ],
      ],
      true,
    ],
  ])
})

describe('$xor', () => {
  _evTestCases([
    [
      '1234567890',
      [
        '$xor',
        ['$stringStartsWith', '123'], // true
        ['$gt', 15, ['$stringLength']], // false
      ],
      true,
    ],
    [
      '1234567890',
      [
        '$xor',
        ['$stringStartsWith', '0000'], // false
        ['$gt', 15, ['$stringLength']], // false
      ],
      false,
    ],
    [
      '1234567890',
      [
        '$xor',
        ['$stringStartsWith', '123'], // true
        ['$gt', 5, ['$stringLength']], // true
      ],
      false,
    ],
  ])
})

describe('$if', () => {
  describe('basic', () => {
    _evTestCases([
      [15, ['$if', ['$gt', 10], 100, 0], 100],
      [8, ['$if', ['$gt', 10], 100, 0], 0],
      [15, ['$if', ['$gt', 10], ['$mathMult', 10], ['$mathMult', -10]], 150],
      [8, ['$if', ['$gt', 10], ['$mathMult', 10], ['$mathMult', -10]], -80],
    ])
  })

  test('then and else expressions should be evaluated only after condition evaluation', () => {
    let expAExecuted = false
    let expBExecuted = false // eslint-disable-line prefer-const

    expect(
      evaluate(
        {
          interpreters: {
            ...syncInterpreters,
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
  describe('simple comparison', () => {
    const expNoDefault = [
      '$switch',
      [
        [['$eq', 'CASE_A'], 'VALUE_A'],
        [['$eq', 'CASE_B'], 'VALUE_B'],
        [['$eq', 'CASE_C'], 'VALUE_C'],
      ],
    ]

    const expWithDefault = [...expNoDefault, 'DEFAULT_VALUE']

    _evTestCases([
      ['CASE_B', expNoDefault, 'VALUE_B'],
      ['CASE_D', expNoDefault, undefined],
      ['CASE_D', expWithDefault, 'DEFAULT_VALUE']
    ])
  })

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
          interpreters: syncInterpreters,
          scope: { $$VALUE: 5 },
        },
        $expr
      )
    ).toEqual(0)

    expect(
      evaluate(
        {
          interpreters: syncInterpreters,
          scope: { $$VALUE: 15 },
        },
        $expr
      )
    ).toEqual(150)

    expect(
      evaluate(
        {
          interpreters: syncInterpreters,
          scope: { $$VALUE: 25 },
        },
        $expr
      )
    ).toEqual(500)

    expect(
      evaluate(
        {
          interpreters: syncInterpreters,
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
            interpreters: syncInterpreters,
            scope: { $$VALUE: input },
          },
          exp
        )
      ).toEqual(result)
    })
  })
})
