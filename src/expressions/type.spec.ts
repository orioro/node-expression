import { evaluate } from '../expression'
import { $value } from './value'
import {
  TYPE_EXPRESSIONS
} from './type'

const interpreters = {
  $value,
  ...TYPE_EXPRESSIONS,
}

describe('$type', () => {
  test('string', () => {
    expect(evaluate({
      interpreters,
      scope: { $$VALUE: 'some string' }
    }, ['$type'])).toEqual('string')
  })

  test('number', () => {
    expect(evaluate({
      interpreters,
      scope: { $$VALUE: 10 }
    }, ['$type'])).toEqual('number')
  })

  test('boolean', () => {
    expect(evaluate({
      interpreters,
      scope: { $$VALUE: true }
    }, ['$type'])).toEqual('boolean')
  })
})
