import {
  evaluateNumber,
  typedEvaluate
} from './expression'

import {
  MATH_EXPRESSIONS
} from './expressions/math'

test('evaluateNumber', () => {
  expect(() => {
    console.log(evaluateNumber({
      interpreters: MATH_EXPRESSIONS,
      scope: { $$VALUE: 'aa' }
    }, '1'))
  }).toThrow('Evaluated invalid valid_number')

  expect(() => {
    console.log(evaluateNumber({
      interpreters: MATH_EXPRESSIONS,
      scope: { $$VALUE: 'aa' }
    }, ['$someUnknownExpression']))
  }).toThrow('Evaluated invalid valid_number')
})

test('typedEvaluate(expectedTypes, context, value)', () => {
  expect(() => {
    console.log(typedEvaluate('number', {
      interpreters: {},
      scope: { $$VALUE: 'aa' }
    }, '1'))
  }).toThrow(TypeError)

  expect(() => {
    console.log(typedEvaluate('number', {
      interpreters: {},
      scope: { $$VALUE: 'aa' }
    }, ['$someUnknownExpression']))
  }).toThrow(TypeError)
})
