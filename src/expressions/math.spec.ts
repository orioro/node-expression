import { evaluate } from '../expression'
import { $value } from './value'
import {
  $mathSum,
  $mathSub,
  $mathMult,
  $mathDiv,
  $mathMod,
  $mathPow,
  $mathAbs,
  $mathMax,
  $mathMin,
  $mathRound,
  $mathFloor,
  $mathCeil,
} from './math'

const interpreters = {
  $value,
  $mathSum,
  $mathSub,
  $mathMult,
  $mathDiv,
  $mathMod,
  $mathPow,
  $mathAbs,
  $mathMax,
  $mathMin,
  $mathRound,
  $mathFloor,
  $mathCeil,
}

describe('operations', () => {
  const context = {
    interpreters,
    scope: {
      $$VALUE: 10
    }
  }
  
  test('$mathSum', () => expect(evaluate(context, ['$mathSum', 5])).toEqual(15))
  test('$mathSub', () => expect(evaluate(context, ['$mathSub', 5])).toEqual(5))
  test('$mathMult', () => expect(evaluate(context, ['$mathMult', 5])).toEqual(50))
  test('$mathDiv', () => expect(evaluate(context, ['$mathDiv', 5])).toEqual(2))
  test('$mathMod', () => expect(evaluate(context, ['$mathMod', 3])).toEqual(1))
  test('$mathPow', () => expect(evaluate(context, ['$mathPow', 3])).toEqual(1000))
})

test('$mathAbs', () => {
  expect(evaluate({
    interpreters,
    scope: { $$VALUE: 10 }
  }, ['$mathAbs'])).toEqual(10)
  expect(evaluate({
    interpreters,
    scope: { $$VALUE: -10 }
  }, ['$mathAbs'])).toEqual(10)
})

test('$mathMax', () => {
  expect(evaluate({
    interpreters,
    scope: { $$VALUE: 10 }
  }, ['$mathMax', 5])).toEqual(10)
  expect(evaluate({
    interpreters,
    scope: { $$VALUE: 10 }
  }, ['$mathMax', 50])).toEqual(50)
})

test('$mathMin', () => {
  expect(evaluate({
    interpreters,
    scope: { $$VALUE: 10 }
  }, ['$mathMin', 5])).toEqual(5)
  expect(evaluate({
    interpreters,
    scope: { $$VALUE: 10 }
  }, ['$mathMin', 50])).toEqual(10)
})

test('$mathRound', () => {
  expect(evaluate({
    interpreters,
    scope: { $$VALUE: 10.1 }
  }, ['$mathRound'])).toEqual(10)
})

test('$mathFloor', () => {
  expect(evaluate({
    interpreters,
    scope: { $$VALUE: 10.1 }
  }, ['$mathFloor'])).toEqual(10)
})

test('$mathCeil', () => {
  expect(evaluate({
    interpreters,
    scope: { $$VALUE: 10.1 }
  }, ['$mathCeil'])).toEqual(11)
})
