import { evaluate } from '../evaluate'
import { syncInterpreterList } from '../syncInterpreter'
import { VALUE_EXPRESSIONS } from './value'
import { MATH_EXPRESSIONS } from './math'

const interpreters = syncInterpreterList({
  ...VALUE_EXPRESSIONS,
  ...MATH_EXPRESSIONS,
})

describe('operations', () => {
  const context = {
    interpreters,
    scope: {
      $$VALUE: 10,
    },
  }

  test('$mathSum', () => expect(evaluate(context, ['$mathSum', 5])).toEqual(15))
  test('$mathSub', () => expect(evaluate(context, ['$mathSub', 5])).toEqual(5))
  test('$mathMult', () =>
    expect(evaluate(context, ['$mathMult', 5])).toEqual(50))
  test('$mathDiv', () => expect(evaluate(context, ['$mathDiv', 5])).toEqual(2))
  test('$mathMod', () => expect(evaluate(context, ['$mathMod', 3])).toEqual(1))
  test('$mathPow', () =>
    expect(evaluate(context, ['$mathPow', 3])).toEqual(1000))
})

test('$mathAbs', () => {
  expect(
    evaluate(
      {
        interpreters,
        scope: { $$VALUE: 10 },
      },
      ['$mathAbs']
    )
  ).toEqual(10)
  expect(
    evaluate(
      {
        interpreters,
        scope: { $$VALUE: -10 },
      },
      ['$mathAbs']
    )
  ).toEqual(10)
})

describe('$mathMax', () => {
  const context = {
    interpreters,
    scope: { $$VALUE: 10 },
  }

  test('single value', () => {
    expect(evaluate(context, ['$mathMax', 5])).toEqual(10)
    expect(evaluate(context, ['$mathMax', 15])).toEqual(15)
  })

  test('array of values', () => {
    expect(evaluate(context, ['$mathMax', []])).toEqual(10)
    expect(evaluate(context, ['$mathMax', [0, 5]])).toEqual(10)
    expect(evaluate(context, ['$mathMax', [5, 15]])).toEqual(15)
  })
})

describe('$mathMin', () => {
  const context = {
    interpreters,
    scope: { $$VALUE: 10 },
  }

  test('single value', () => {
    expect(evaluate(context, ['$mathMin', 5])).toEqual(5)
    expect(evaluate(context, ['$mathMin', 15])).toEqual(10)
  })

  test('array of values', () => {
    expect(evaluate(context, ['$mathMin', []])).toEqual(10)
    expect(evaluate(context, ['$mathMin', [0, 5]])).toEqual(0)
    expect(evaluate(context, ['$mathMin', [5, 15]])).toEqual(5)
    expect(evaluate(context, ['$mathMin', [25, 15]])).toEqual(10)
  })
})

test('$mathRound', () => {
  expect(
    evaluate(
      {
        interpreters,
        scope: { $$VALUE: 10.1 },
      },
      ['$mathRound']
    )
  ).toEqual(10)
})

test('$mathFloor', () => {
  expect(
    evaluate(
      {
        interpreters,
        scope: { $$VALUE: 10.1 },
      },
      ['$mathFloor']
    )
  ).toEqual(10)
})

test('$mathCeil', () => {
  expect(
    evaluate(
      {
        interpreters,
        scope: { $$VALUE: 10.1 },
      },
      ['$mathCeil']
    )
  ).toEqual(11)
})
