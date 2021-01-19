import { evaluate } from '../expression'
import { $value } from './value'
import {
  NUMBER_EXPRESSIONS
} from './number'

const interpreters = {
  $value,
  ...NUMBER_EXPRESSIONS,
}

test('$numberInt', () => {
  expect(evaluate({
    interpreters,
    data: { $$VALUE: '10.50' }
  }, ['$numberInt'])).toEqual(10)

  expect(evaluate({
    interpreters,
    data: { $$VALUE: 10.5 }
  }, ['$numberInt'])).toEqual(10.5)

  expect(() => {
    expect(evaluate({
      interpreters,
      data: { $$VALUE: true }
    }, ['$numberInt']))
  }).toThrow(TypeError)
})

test('$numberFloat', () => {
  expect(evaluate({
    interpreters,
    data: { $$VALUE: '10.50' }
  }, ['$numberFloat'])).toEqual(10.5)

  expect(evaluate({
    interpreters,
    data: { $$VALUE: 10.5 }
  }, ['$numberInt'])).toEqual(10.5)

  expect(() => {
    expect(evaluate({
      interpreters,
      data: { $$VALUE: true }
    }, ['$numberInt']))
  }).toThrow(TypeError)
})
