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
})

test('$numberFloat', () => {
  expect(evaluate({
    interpreters,
    data: { $$VALUE: '10.50' }
  }, ['$numberFloat'])).toEqual(10.5)
})
