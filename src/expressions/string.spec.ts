import { evaluate } from '../evaluate'
import { syncInterpreterList } from '../interpreter/syncInterpreter'
import { VALUE_EXPRESSIONS } from './value'
import { STRING_EXPRESSIONS } from './string'

const interpreters = syncInterpreterList({
  ...VALUE_EXPRESSIONS,
  ...STRING_EXPRESSIONS,
})

test('$string', () => {
  const expectations = [
    ['some string', 'some string'],
    [10.5, '10.5'],
    [false, 'false'],
    [undefined, 'undefined'],
    [null, 'null'],
    [NaN, 'NaN'],
    [[], ''],
    [
      [1, 'some str', {}, 'another str'],
      '1, some str, [object Object], another str',
    ],
    [
      (a, b) => {
        return a + b
      },
      '[object Function]',
    ],
    [{}, '[object Object]'],
    [/re/g, '[object RegExp]'],
    [Symbol(), '[object Symbol]'],
    [new Set(), '[object Set]'],
    [new WeakSet(), '[object WeakSet]'],
    [new Map(), '[object Map]'],
    [new WeakMap(), '[object WeakMap]'],
  ]

  expectations.forEach(([input, result]) => {
    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: input },
        },
        ['$string']
      )
    ).toEqual(result)
  })
})

test('$stringStartsWith', () => {
  const context = {
    interpreters,
    scope: { $$VALUE: 'some_string' },
  }

  expect(evaluate(context, ['$stringStartsWith', 'some'])).toEqual(true)
  expect(evaluate(context, ['$stringStartsWith', 'somethingelse'])).toEqual(
    false
  )
})

test('$stringLength', () => {
  expect(
    evaluate(
      {
        interpreters,
        scope: { $$VALUE: 'some_string' },
      },
      ['$stringLength']
    )
  ).toEqual(11)
})

test('$stringSubstr', () => {
  const context = {
    interpreters,
    scope: { $$VALUE: 'some_string' },
  }

  expect(evaluate(context, ['$stringSubstr', 0, 4])).toEqual('some')
  expect(evaluate(context, ['$stringSubstr', 4])).toEqual('_string')
})

describe('$stringConcat', () => {
  const context = {
    interpreters,
    scope: { $$VALUE: 'some_string' },
  }

  test('single string', () => {
    expect(evaluate(context, ['$stringConcat', '_another_string'])).toEqual(
      'some_string_another_string'
    )
  })

  test('array of strings', () => {
    expect(
      evaluate(context, ['$stringConcat', ['some', 'other', 'strings']])
    ).toEqual('some_stringsomeotherstrings')
  })
})

test('$stringTrim', () => {
  const context = {
    interpreters,
    scope: { $$VALUE: ' some string  ' },
  }

  expect(evaluate(context, ['$stringTrim'])).toEqual('some string')
})

test('$stringPadStart', () => {
  const context = {
    interpreters,
    scope: { $$VALUE: '1' },
  }

  expect(evaluate(context, ['$stringPadStart', 3, '0'])).toEqual('001')
})

test('$stringPadEnd', () => {
  const context = {
    interpreters,
    scope: { $$VALUE: '1' },
  }

  expect(evaluate(context, ['$stringPadEnd', 3, '*'])).toEqual('1**')
})

test('$stringToUpperCase', () => {
  expect(
    evaluate(
      {
        interpreters,
        scope: { $$VALUE: 'String Multi Case' },
      },
      ['$stringToUpperCase']
    )
  ).toEqual('STRING MULTI CASE')
})

test('$stringToLowerCase', () => {
  expect(
    evaluate(
      {
        interpreters,
        scope: { $$VALUE: 'String Multi Case' },
      },
      ['$stringToLowerCase']
    )
  ).toEqual('string multi case')
})

describe('$stringInterpolate(data, string)', () => {
  test('object', () => {
    const data = {
      name: 'João',
      mother: {
        name: 'Maria',
      },
      father: {
        name: 'Guilherme',
      },

      $special1: '$$$$$',
      _special2: '_____',
    }

    const template =
      'Olá, eu sou ${ name }. Minha mãe ${ mother.name }, meu pai ${ father.name }.'

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: template },
        },
        ['$stringInterpolate', data]
      )
    ).toEqual('Olá, eu sou João. Minha mãe Maria, meu pai Guilherme.')

    const expectations = [
      ['name: ${ name }', 'name: João'],
      ['${name}', 'João'],
      ['${name }', 'João'],
      ['${ name}', 'João'],
      ['mother name: ${ mother.name }', 'mother name: Maria'],

      ['${ $special1 }', '$$$$$'],
      ['${ _special2 }', '_____'],

      // unrecognized
      ['${ }', '${ }'],
      ['${ {name} }', '${ {name} }'],
      ['${ mother. name }', '${ mother. name }'],
      ['${ [] }', '${ [] }'],
    ]

    expectations.forEach(([input, expected]) => {
      expect(
        evaluate(
          {
            interpreters,
            scope: { $$VALUE: input },
          },
          ['$stringInterpolate', data]
        )
      ).toEqual(expected)
    })
  })

  test('array', () => {
    const data = ['first', 'second', 'third']
    const template = '1: ${0}; 2: ${1}; 3: ${2}'

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: template },
        },
        ['$stringInterpolate', data]
      )
    ).toEqual('1: first; 2: second; 3: third')
  })

  test('null / undefined / other type values', () => {
    const template = '1: ${0}; 2: ${1}; 3: ${2}'

    const expectations = [
      [['first', null, 3], '1: first; 2: ; 3: 3'],
      [[undefined, false, 'third'], '1: ; 2: ; 3: third'],
      [[true, { some: 'object' }, 'third'], '1: ; 2: ; 3: third'],
      [
        [
          function (a, b) {
            return a + b
          },
          { some: 'object' },
          'third',
        ],
        '1: ; 2: ; 3: third',
      ],
    ]

    expectations.forEach(([input, result]) => {
      expect(
        evaluate(
          {
            interpreters,
            scope: { $$VALUE: template },
          },
          ['$stringInterpolate', input]
        )
      ).toEqual(result)
    })
  })
})
