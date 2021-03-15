import { evaluate } from '../evaluate'
import { interpreterList } from '../interpreter/interpreter'
import { VALUE_EXPRESSIONS } from './value'
import { BOOLEAN_EXPRESSIONS } from './boolean'
import { LOGICAL_EXPRESSIONS } from './logical'
import { ARRAY_EXPRESSIONS } from './array'
import { COMPARISON_EXPRESSIONS } from './comparison'
import { STRING_EXPRESSIONS } from './string'
import { MATH_EXPRESSIONS } from './math'

import {
  SyncModePromiseUnsupportedError,
  SyncModeUnsupportedError,
} from '../errors'

import {
  _prepareEvaluateTestCases,
  delay,
  $asyncEcho,
} from '../../spec/specUtil'

const EXP = {
  ...VALUE_EXPRESSIONS,
  ...BOOLEAN_EXPRESSIONS,
  ...LOGICAL_EXPRESSIONS,
  ...ARRAY_EXPRESSIONS,
  ...COMPARISON_EXPRESSIONS,
  ...STRING_EXPRESSIONS,
  ...MATH_EXPRESSIONS,
  // `$incorrectAsyncEcho` is incorrect because it is written using the function
  // spec shorthand and thus will be used as both sync and async interpreters
  // The correct implementation specifies that the expression is async only
  // by providing an object whose sync property is null
  $incorrectAsyncEcho: (context, value) => delay(value),
  $asyncEcho,
}

const _evTestCases = _prepareEvaluateTestCases(EXP)

describe('$and', () => {
  describe('error situations', () => {
    _evTestCases([
      [undefined, ['$and'], TypeError],
      [null, ['$and'], TypeError],
      [true, ['$and'], TypeError],
      [8, ['$and'], TypeError],
      [{}, ['$and'], TypeError],
    ])

    _evTestCases.testSyncCases([
      [[true, true], ['$and'], true],
      [
        [['$incorrectAsyncEcho', true], true],
        ['$and'],
        new SyncModePromiseUnsupportedError('$incorrectAsyncEcho'),
      ],
      [
        [true, ['$incorrectAsyncEcho', true]],
        ['$and'],
        new SyncModePromiseUnsupportedError('$incorrectAsyncEcho'),
      ],
      [
        [['$incorrectAsyncEcho', true], true],
        ['$and'],
        new SyncModePromiseUnsupportedError('$incorrectAsyncEcho'),
      ],

      // Errors are different because the moment they are detected is different
      [
        [['$asyncEcho', true], true],
        ['$and'],
        new SyncModeUnsupportedError('$asyncEcho'),
      ],
    ])

    _evTestCases.testAsyncCases([
      [[true, true], ['$and'], true],
      [[['$incorrectAsyncEcho', true], true], ['$and'], true],
      [
        [
          ['$incorrectAsyncEcho', true],
          ['$incorrectAsyncEcho', true],
        ],
        ['$and'],
        true,
      ],
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
        interpreters: interpreterList(EXP),
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

    // const interpreters = interpreterList({
    //   ...VALUE_EXPRESSIONS,
    //   ...LOGICAL_EXPRESSIONS,
    //   ...COMPARISON_EXPRESSIONS,
    //   $asyncGetMinValue: () =>
    //     new Promise((resolve) => {
    //       setTimeout(resolve.bind(null, MIN_VALUE), 100)
    //     }),
    //   $asyncGetMaxValue: () =>
    //     new Promise((resolve) => {
    //       setTimeout(resolve.bind(null, MAX_VALUE), 100)
    //     }),
    // })

    const _evTestCases = _prepareEvaluateTestCases({
      ...VALUE_EXPRESSIONS,
      ...LOGICAL_EXPRESSIONS,
      ...COMPARISON_EXPRESSIONS,
      $asyncGetMinValue: {
        sync: null,
        async: () =>
          new Promise((resolve) => {
            setTimeout(resolve.bind(null, MIN_VALUE), 100)
          }),
      },
      $asyncGetMaxValue: {
        sync: null,
        async: () =>
          new Promise((resolve) => {
            setTimeout(resolve.bind(null, MAX_VALUE), 100)
          }),
      },
    })

    const exp = [
      '$and',
      [
        ['$gte', ['$asyncGetMinValue']],
        ['$lte', ['$asyncGetMaxValue']],
      ],
    ]

    _evTestCases.testSyncCases([
      [30, exp, new SyncModeUnsupportedError('$asyncGetMinValue')],
      [20, exp, new SyncModeUnsupportedError('$asyncGetMinValue')],
      [10, exp, new SyncModeUnsupportedError('$asyncGetMinValue')],
    ])

    _evTestCases.testAsyncCases([
      [30, exp, true],
      [20, exp, true],
      [10, exp, false],
    ])
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
    const $expA = jest.fn(() => 'expA-result')
    const $expB = jest.fn(() => 'expB-result')

    expect(
      evaluate(
        {
          interpreters: interpreterList({
            ...EXP,
            $expA,
            $expB,
          }),
          scope: { $$VALUE: 15 },
        },
        ['$if', ['$gt', 10], ['$expA'], ['$expB']]
      )
    ).toEqual('expA-result')

    expect($expA).toHaveBeenCalledTimes(1)
    expect($expB).not.toHaveBeenCalled()
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
      ['CASE_D', expWithDefault, 'DEFAULT_VALUE'],
    ])
  })

  describe('more complex condition', () => {
    const $switchExpr = [
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

    _evTestCases([
      [5, $switchExpr, 0],
      [15, $switchExpr, 150],
      [25, $switchExpr, 500],
      [30, $switchExpr, -30],
    ])
  })
})

describe('$switchKey', () => {
  const options = {
    key1: 'value1',
    key2: 'value2',
    key3: 'value3',
  }
  const exp = ['$switchKey', options, 'DEFAULT_VALUE']

  _evTestCases([
    [undefined, exp, 'DEFAULT_VALUE'],
    [null, exp, 'DEFAULT_VALUE'],
    ['key1', exp, 'value1'],
    ['key2', exp, 'value2'],
    ['key3', exp, 'value3'],
    ['key4', exp, 'DEFAULT_VALUE'],
  ])
})
