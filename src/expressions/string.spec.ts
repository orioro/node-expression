import { VALUE_EXPRESSIONS } from './value'
import { STRING_EXPRESSIONS } from './string'
import { _prepareEvaluateTestCases } from '../../spec/specUtil'

const EXP = {
  ...VALUE_EXPRESSIONS,
  ...STRING_EXPRESSIONS,
}

const _evTestCases = _prepareEvaluateTestCases(EXP)

describe('$string', () => {
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

  _evTestCases(
    expectations.map(([input, result]) => [input, ['$string'], result])
  )
})

describe('$stringStartsWith', () => {
  _evTestCases([
    ['some_string', ['$stringStartsWith', 'some'], true],
    ['some_string', ['$stringStartsWith', 'somethingelse'], false],
  ])
})

describe('$stringLength', () => {
  _evTestCases([
    ['some_string', ['$stringLength'], 11],
    ['', ['$stringLength'], 0],
  ])
})

describe('$stringSubstr', () => {
  _evTestCases([
    ['some_string', ['$stringSubstr', 0, 4], 'some'],
    ['some_string', ['$stringSubstr', 4], '_string'],
  ])
})

describe('$stringConcat', () => {
  describe('single string', () => {
    _evTestCases([
      [
        'some_string',
        ['$stringConcat', '_another_string'],
        'some_string_another_string',
      ],
    ])
  })

  describe('array of strings', () => {
    _evTestCases([
      [
        'some_string',
        ['$stringConcat', ['some', 'other', 'strings']],
        'some_stringsomeotherstrings',
      ],
    ])
  })
})

describe('$stringTrim', () => {
  _evTestCases([[' some string  ', ['$stringTrim'], 'some string']])
})

describe('$stringPadStart', () => {
  _evTestCases([['1', ['$stringPadStart', 3, '0'], '001']])
})

describe('$stringPadEnd', () => {
  _evTestCases([['1', ['$stringPadEnd', 3, '*'], '1**']])
})

describe('$stringToUpperCase', () => {
  _evTestCases([
    ['String Multi Case', ['$stringToUpperCase'], 'STRING MULTI CASE'],
  ])
})

describe('$stringToLowerCase', () => {
  _evTestCases([
    ['String Multi Case', ['$stringToLowerCase'], 'string multi case'],
  ])
})

describe('$stringInterpolate(data, string)', () => {
  describe('object', () => {
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

    const expectations = [
      [
        'Olá, eu sou ${ name }. Minha mãe ${ mother.name }, meu pai ${ father.name }.',
        'Olá, eu sou João. Minha mãe Maria, meu pai Guilherme.',
      ],
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

    _evTestCases(
      expectations.map(([input, result]) => [
        input,
        ['$stringInterpolate', data],
        result,
      ])
    )
  })

  describe('array', () => {
    const data = ['first', 'second', 'third']
    const template = '1: ${0}; 2: ${1}; 3: ${2}'

    _evTestCases([
      [template, ['$stringInterpolate', data], '1: first; 2: second; 3: third'],
    ])
  })

  describe('null / undefined / other type values', () => {
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

    _evTestCases(
      expectations.map(([data, result]) => [
        template,
        ['$stringInterpolate', data],
        result,
      ])
    )
  })
})
