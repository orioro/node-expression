import {
  expression,
  $$VALUE,
  VALUE_EXPRESSIONS,
  LOGICAL_EXPRESSIONS,
  MATH_EXPRESSIONS,
  COMPARISON_EXPRESSIONS,
  MATCH_EXPRESSIONS
} from '../src'

describe('match expressions', () => {

  const evaluate = expression({
    ...VALUE_EXPRESSIONS,
    ...LOGICAL_EXPRESSIONS,
    ...MATH_EXPRESSIONS,
    ...COMPARISON_EXPRESSIONS,
    ...MATCH_EXPRESSIONS
  })

  test('$match - basic', () => {
    expect(evaluate([
      '$match',
      {
        $gt: 10,
        $lt: 20
      },
      $$VALUE
    ], 12))
    .toEqual(true)

    expect(evaluate([
      '$match',
      {
        $gt: 10,
        $lt: 20
      },
      $$VALUE
    ], 30))
    .toEqual(false)
  })

  test('$match - with evaluate', () => {

    const $divBy3 = ['$eq', 0, ['$mathMod', $$VALUE, 3]]
    const $divBy5 = ['$eq', 0, ['$mathMod', $$VALUE, 5]]

    const $gt10_lt20_divBy3_divBy5 = [
      '$match',
      {
        $gt: 10,
        $lt: 20,
        $evaluate: [
          '$and',
          $divBy3,
          $divBy5,
        ]
      },
      $$VALUE
    ]

    expect(evaluate($gt10_lt20_divBy3_divBy5, 15))
      .toEqual(true)

    expect(evaluate($gt10_lt20_divBy3_divBy5, 12))
      .toEqual(false)

    expect(evaluate($gt10_lt20_divBy3_divBy5, 9))
      .toEqual(false)
  })

  test('$matchPaths - basic', () => {

    const DATA = {
      name: 'João',
      age: 30,
      likes: ['Video game', 'Futebol'],
      mother: {
        name: 'Maria',
        age: 40,
        likes: ['Feijoada', 'Samba', 'Viagem']
      }
    }

    expect(evaluate(
      [
        '$matchPaths',
        { name: 'João' },
        $$VALUE
      ],
      DATA
    )).toEqual(true)

    expect(evaluate(
      [
        '$matchPaths',
        { name: 'Outra pessoa' },
        $$VALUE
      ],
      DATA
    )).toEqual(false)

    expect(evaluate(
      [
        '$matchPaths',
        {
          name: 'João',
          likes: { $containsAny: ['Futebol', 'Other thing'] },
          'mother.age': { $lt: 50 }
        },
        $$VALUE
      ],
      DATA
    ))
    .toEqual(true)

    expect(evaluate(
      [
        '$matchPaths',
        {
          'mother.age': { $lt: 30 }
        },
        $$VALUE
      ],
      DATA
    ))
    .toEqual(false)
  })

  test('$matchPaths - with inner comparison', () => {
    const DATA = {
      option_1: true,
      option_2: 'String value',
      nested: {
        option_1: true,
        option_2: false,
        option_3: 'String value'
      }
    }

    expect(evaluate(
      ['$matchPaths', { 'nested.option_1': ['$value', 'option_1'] }, $$VALUE],
      DATA
    )).toEqual(true)

    expect(evaluate(
      ['$matchPaths', { 'option_1': ['$value', 'nested.option_1'] }, $$VALUE],
      DATA
    )).toEqual(true)

    expect(evaluate(
      ['$matchPaths', { 'nested.option_3': ['$value', 'option_2'] }, $$VALUE],
      DATA
    )).toEqual(true)

    expect(evaluate(
      ['$matchPaths', { 'option_2': ['$value', 'nested.option_3'] }, $$VALUE],
      DATA
    )).toEqual(true)

    expect(evaluate(
      ['$matchPaths', { 'nested.option_1': ['$value', 'option_2'] }, $$VALUE],
      DATA
    ))
    .toEqual(false)

    expect(evaluate(
      ['$matchPaths', {
        option_1: true,
        option_2: 'String value',
        'nested.option_3': ['$value', 'option_2'],
      }, $$VALUE],
      DATA
    ))
    .toEqual(true)
  })
})





describe('object operators', () => {

  const evaluate = expression({
    ...VALUE_EXPRESSIONS,
    ...COMPARISON_EXPRESSIONS,
    ...LOGICAL_EXPRESSIONS,
    ...MATCH_EXPRESSIONS
  })

  const PERSON_1 = {
    name: 'João',
    familyName: 'Silva',
    age: 10,
    relatives: [
      {
        name: 'Joana',
        familyName: 'Silva',
        relationship: 'mother',
      },
      {
        name: 'Rafaela',
        familyName: 'Santos',
        relationship: 'father'
      },
      {
        name: 'Pedro',
        relationship: 'uncle'
      }
    ],
    address: {
      line_1: 'Rua Silva Sauro, 410',
      zipCode: '010101',
    }
  }

  describe('$matchPaths', () => {

    test('basic', () => {
      expect(evaluate([
        '$matchPaths',
        {
          name: 'João',
          'address.zipCode': '010101'
        },
        $$VALUE
      ], PERSON_1))
      .toEqual(true)

      expect(evaluate([
        '$matchPaths',
        {
          name: 'João',
          'address.zipCode': '999999'
        },
        $$VALUE
      ], PERSON_1))
      .toEqual(false)
    })

    test('$gt comparison', () => {
      expect(evaluate([
        '$matchPaths',
        {
          age: { $gt: 9 }
        },
        $$VALUE,
      ], PERSON_1))
      .toEqual(true)
    })

    test('inner comparison', () => {
      const expression = [
        '$matchPaths',
        {
          name: 'João',
          familyName: ['$value', 'relatives.0.familyName']
        },
        $$VALUE,
      ]

      expect(evaluate(expression, PERSON_1)).toEqual(true)
    })
  })

  describe('$transform', () => {
    test('basic', () => {
      const expression = [
        '$transform',
        {
          name: 'relatives.0.name',
          familyName: 'relatives.0.familyName',

          'children.0.name': 'name',
          'children.0.age': 'age'
        }
      ]

      console.log(evaluate(expression, PERSON_1))
    })

    test('nested', () => {
      const expression = [
        '$eq',
        [
          '$transform',
          {
            name: 'relatives.1.name',
            familyName: 'relatives.1.familyName',
          }
        ],
        {
          name: 'Rafaela',
          familyName: 'Santos'
        }
      ]

      expect(evaluate(expression, PERSON_1)).toEqual(true)
    })
  })
})

