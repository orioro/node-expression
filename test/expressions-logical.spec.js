import {
  expression,
  $$VALUE,
  VALUE_EXPRESSIONS,
  COMPARISON_EXPRESSIONS,
  LOGICAL_EXPRESSIONS,
} from '../src'

describe('logical expressions', () => {

  const evaluate = expression({
    ...VALUE_EXPRESSIONS,
    ...COMPARISON_EXPRESSIONS,
    ...LOGICAL_EXPRESSIONS,
  })

  test('$and - basic', () => {

    const greaterThan10 = ['$gt', 10, $$VALUE]
    const lesserThan20 = ['$lt', 20, $$VALUE]

    const expression = [
      '$and',
      greaterThan10,
      lesserThan20
    ]

    expect(evaluate(expression, 12)).toEqual(true)
    expect(evaluate(expression, 20)).toEqual(false)
    expect(evaluate(expression, 22)).toEqual(false)
    expect(evaluate(expression, 10)).toEqual(false)
  })

  test('$or - basic', () => {
    const lesserThanOrEqual10 = ['$lte', 10, $$VALUE]
    const greaterThanOrEqual20 = ['$gte', 20, $$VALUE]

    const expression = [
      '$or',
      lesserThanOrEqual10,
      greaterThanOrEqual20,
    ]

    expect(evaluate(expression, 12)).toEqual(false)
    expect(evaluate(expression, 20)).toEqual(true)
    expect(evaluate(expression, 10)).toEqual(true)
  })

  test('$or - with nested $and', () => {
    const expression = [
      '$or',
      [
        '$and',
        ['$gt', 10, $$VALUE],
        ['$lt', 30, $$VALUE]
      ],
      [
        '$and',
        ['$gt', 50, $$VALUE],
        ['$lt', 70, $$VALUE]
      ],
      [
        '$eq', 5, $$VALUE
      ]
    ]

    expect(evaluate(expression, 7)).toEqual(false)
    expect(evaluate(expression, 5)).toEqual(true)
    expect(evaluate(expression, 12)).toEqual(true)
    expect(evaluate(expression, 52)).toEqual(true)
    expect(evaluate(expression, 72)).toEqual(false)
  })
})
