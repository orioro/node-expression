import {
  expression,
  VALUE_EXPRESSIONS,
  LOGICAL_EXPRESSIONS,
  MATH_EXPRESSIONS,
  COMPARISON_EXPRESSIONS,
} from '../src'

describe('comparison expressions', () => {

  const evaluate = expression({
    ...VALUE_EXPRESSIONS,
    ...LOGICAL_EXPRESSIONS,
    ...MATH_EXPRESSIONS,
    ...COMPARISON_EXPRESSIONS
  })

  test('$eq - primitives', () => {
    const valueEq10 = ['$eq', ['$value', null], 10]
    const valueEqTrue = ['$eq', ['$value', null], true]

    expect(evaluate(valueEq10, 10)).toEqual(true)
    expect(evaluate(valueEq10, 11)).toEqual(false)
    expect(evaluate(valueEq10, '10')).toEqual(false)
    expect(evaluate(valueEqTrue, true)).toEqual(true)
    expect(evaluate(valueEqTrue, false)).toEqual(false)
    expect(evaluate(valueEqTrue, '')).toEqual(false)
    expect(evaluate(valueEqTrue, 0)).toEqual(false)
  })

  test('$eq - object', () => {
    const expression = ['$eq', ['$value', null], {
      title: 'Test title',
      nested: {
        key: 'nested value',
        key1: 123,
      }
    }]

    expect(evaluate(expression, {title: 'Test title'})).toEqual(false)
    expect(evaluate(expression, {
      title: 'Test title',
      nested: {
        key: 'nested value',
        key1: 123,
      }
    })).toEqual(true)
  })

  test('$notEq - primitives', () => {
    expect(evaluate(['$notEq', ['$value', null], 10], 11)).toEqual(true)
  })

  test('$gt', () => {
    expect(evaluate(['$gt', 9, 10], null)).toEqual(true)
    expect(evaluate(['$gt', 10, 10], null)).toEqual(false)
    expect(evaluate(['$gt', 11, 10], null)).toEqual(false)
  })

  test('$gte', () => {
    expect(evaluate(['$gte', 9, 10], null)).toEqual(true)
    expect(evaluate(['$gte', 10, 10], null)).toEqual(true)
    expect(evaluate(['$gt', 11, 10], null)).toEqual(false)
  })

  test('$lt', () => {
    expect(evaluate(['$lt', 10, 9], null)).toEqual(true)
    expect(evaluate(['$lt', 10, 10], null)).toEqual(false)
    expect(evaluate(['$lt', 10, 11], null)).toEqual(false)
  })

  test('$lte', () => {
    expect(evaluate(['$lte', 10, 9], null)).toEqual(true)
    expect(evaluate(['$lte', 10, 10], null)).toEqual(true)
    expect(evaluate(['$lte', 10, 11], null)).toEqual(false)
  })

  test('$in', () => {
    const tags = ['tag-1', 'tag-2', 'tag-3']
    expect(evaluate([
      '$in',
      tags,
      ['$value', null]
    ], 'tag-3'))
    .toEqual(true)

    expect(evaluate([
      '$in',
      tags,
      ['$value', null]
    ], 'tag-4'))
    .toEqual(false)
  })

  test('$nin', () => {
    const tags = ['tag-1', 'tag-2', 'tag-3']
    expect(evaluate([
      '$nin',
      tags,
      ['$value', null]
    ], 'tag-3'))
    .toEqual(false)

    expect(evaluate([
      '$nin',
      tags,
      ['$value', null]
    ], 'tag-4'))
    .toEqual(true)
  })
})
