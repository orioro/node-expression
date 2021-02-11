import { evaluate } from '../expression'
import { $value } from './value'
import { $boolean } from './boolean'
import { $and, $or, $if, $switch, LOGICAL_EXPRESSIONS } from './logical'
import { $arrayMap } from './array'
import { $eq, $gt, $gte, $lt, $lte } from './comparison'
import { $stringSubstr } from './string'
import { $mathSum, $mathMult } from './math'

describe('$and', () => {
  const interpreters = {
    $value,
    $and
  }

  test('error situations', () => {
    expect(() => evaluate({
      interpreters,
      scope: { $$VALUE: undefined }
    }, ['$and'])).toThrow(TypeError)

    expect(() => evaluate({
      interpreters,
      scope: { $$VALUE: null }
    }, ['$and'])).toThrow(TypeError)

    expect(() => evaluate({
      interpreters,
      scope: { $$VALUE: true }
    }, ['$and'])).toThrow(TypeError)

    expect(() => evaluate({
      interpreters,
      scope: { $$VALUE: 8 }
    }, ['$and'])).toThrow(TypeError)

    expect(() => evaluate({
      interpreters,
      scope: { $$VALUE: {} }
    }, ['$and'])).toThrow(TypeError)
  })

  test('', () => {
    expect(evaluate({
      interpreters,
      scope: { $$VALUE: [true, true, true] }
    }, ['$and'])).toEqual(true)

    expect(evaluate({
      interpreters,
      scope: { $$VALUE: [true, false, true] }
    }, ['$and'])).toEqual(false)

    expect(evaluate({
      interpreters: {
        ...interpreters,
        $arrayMap,
        $boolean
      },
      scope: { $$VALUE: [1, 'string', true] }
    }, ['$and', ['$arrayMap', ['$boolean']]])).toEqual(true)

    expect(evaluate({
      interpreters: {
        ...interpreters,
        $arrayMap,
        $boolean
      },
      scope: { $$VALUE: [1, '', true] }
    }, ['$and', ['$arrayMap', ['$boolean']]])).toEqual(false)
  })

  test('value coercion', () => {
    expect(evaluate({
      interpreters,
      scope: { $$VALUE: [1, 0, true] }
    }, ['$and'])).toEqual(false)

    expect(evaluate({
      interpreters,
      scope: { $$VALUE: [1, 'some-string', true] }
    }, ['$and'])).toEqual(true)

    expect(evaluate({
      interpreters,
      scope: { $$VALUE: [1, '', true] }
    }, ['$and'])).toEqual(false)

    expect(evaluate({
      interpreters,
      scope: { $$VALUE: [1, null, true] }
    }, ['$and'])).toEqual(false)
  })

  test('w/ comparison', () => {
    const context = {
      interpreters: {
        ...interpreters,
        $eq,
        $gt,
        $lt,
        $stringSubstr
      },
      scope: {
        $$VALUE: {
          name: 'João Maranhão',
          age: 25
        }
      }
    }

    expect(evaluate(context, ['$and', [
      ['$eq', 'João', ['$stringSubstr', 0, 4, ['$value', 'name']]],
      ['$gt', 20, ['$value', 'age']],
      ['$lt', 30, ['$value', 'age']]
    ]])).toEqual(true)

    expect(evaluate(context, ['$and', [
      ['$gt', 20, ['$value', 'age']],
      ['$lt', 30, ['$value', 'age']]
    ]])).toEqual(true)

    expect(evaluate(context, ['$and', [
      ['$eq', 'Fernando', ['$stringSubstr', 0, 8, ['$value', 'name']]],
      ['$gt', 20, ['$value', 'age']],
      ['$lt', 30, ['$value', 'age']]
    ]])).toEqual(false)

    expect(evaluate(context, ['$and', [
      ['$gt', 20, ['$value', 'age']],
      ['$lt', 30, ['$value', 'age']]
    ]])).toEqual(true)
  })
})

describe('$or', () => {
  const interpreters = {
    $value,
    $or
  }

  test('', () => {
    expect(evaluate({
      interpreters,
      scope: { $$VALUE: [false, true, false] }
    }, ['$or'])).toEqual(true)

    expect(evaluate({
      interpreters,
      scope: { $$VALUE: [false, false, false] }
    }, ['$or'])).toEqual(false)
  })
})

describe('$if', () => {
  const interpreters = {
    $value,
    $if,
    $gt
  }

  test('', () => {
    expect(evaluate({
      interpreters,
      scope: { $$VALUE: 15 }
    }, ['$if', ['$gt', 10], 100, 0])).toEqual(100)

    expect(evaluate({
      interpreters,
      scope: { $$VALUE: 8 }
    }, ['$if', ['$gt', 10], 100, 0])).toEqual(0)
  })
})

describe('$switch', () => {
  const interpreters = {
    $value,
    $switch,
    $and,
    $eq,
    $gt,
    $gte,
    $lt,
    $lte,
    $mathSum,
    $mathMult
  }

  test('', () => {
    const $expr = ['$switch', [
      [
        ['$eq', 'CASE_A'],
        'VALUE_A'
      ],
      [
        ['$eq', 'CASE_B'],
        'VALUE_B'
      ],
      [
        ['$eq', 'CASE_C'],
        'VALUE_C'
      ]
    ]]

    expect(evaluate({
      interpreters,
      scope: { $$VALUE: 'CASE_B' }
    }, $expr)).toEqual('VALUE_B')
  })

  test('', () => {
    const $expr = [
      '$switch',
      [
        [
          ['$and', [
            ['$gte', 0],
            ['$lt', 10]
          ]],
          ['$mathMult', 0]
        ],
        [
          ['$and', [
            ['$gte', 10],
            ['$lt', 20]
          ]],
          ['$mathMult', 10]
        ],
        [
          ['$and', [
            ['$gte', 20],
            ['$lt', 30]
          ]],
          ['$mathMult', 20]
        ]
      ],
      ['$mathMult', -1]
    ]

    expect(evaluate({
      interpreters,
      scope: { $$VALUE: 5 }
    }, $expr)).toEqual(0)

    expect(evaluate({
      interpreters,
      scope: { $$VALUE: 15 }
    }, $expr)).toEqual(150)

    expect(evaluate({
      interpreters,
      scope: { $$VALUE: 25 }
    }, $expr)).toEqual(500)

    expect(evaluate({
      interpreters,
      scope: { $$VALUE: 30 }
    }, $expr)).toEqual(-30)
  })
})

describe('$switchKey', () => {
  const interpreters = {
    $value,
    ...LOGICAL_EXPRESSIONS
  }

  const options = {
    key1: 'value1',
    key2: 'value2',
    key3: 'value3',
  }

  test('', () => {
    const exp = ['$switchKey', options, 'DEFAULT_VALUE']

    const expected = [
      [undefined, 'DEFAULT_VALUE'],
      [null, 'DEFAULT_VALUE'],
      ['key1', 'value1'],
      ['key2', 'value2'],
      ['key3', 'value3'],
      ['key4', 'DEFAULT_VALUE']
    ]

    expected.forEach(([input, result]) => {
      expect(evaluate({
        interpreters,
        scope: { $$VALUE: input }
      }, exp)).toEqual(result)
    })
  })
})