import {
  evaluateNumber,
} from './expression'

import {
  MATH_EXPRESSIONS
} from './expressions/math'

test('evaluateNumber', () => {
  expect(() => {
    console.log(evaluateNumber({
      interpreters: MATH_EXPRESSIONS,
      data: { $$VALUE: 'aa' }
    }, '1'))
  }).toThrow('Evaluated invalid valid_number')

  expect(() => {
    console.log(evaluateNumber({
      interpreters: MATH_EXPRESSIONS,
      data: { $$VALUE: 'aa' }
    }, ['$someUnknownExpression']))
  }).toThrow('Evaluated invalid valid_number')
})
