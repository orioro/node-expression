import { evaluate } from '../expression'
import { $value } from './value'
import {
  STRING_EXPRESSIONS
} from './string'

const interpreters = {
  $value,
  ...STRING_EXPRESSIONS,
}

test('$string', () => {
  expect(evaluate({
    interpreters,
    data: { $$VALUE: 10.5 }
  }, ['$string'])).toEqual('10.5')
})

test('$stringStartsWith', () => {
  const context = {
    interpreters,
    data: { $$VALUE: 'some_string' }
  }

  expect(evaluate(context, ['$stringStartsWith', 'some'])).toEqual(true)
  expect(evaluate(context, ['$stringStartsWith', 'somethingelse'])).toEqual(false)
})

test('$stringLength', () => {
  expect(evaluate({
    interpreters,
    data: { $$VALUE: 'some_string' }
  }, ['$stringLength'])).toEqual(11)
})

test('$stringSubstr', () => {
  const context = {
    interpreters,
    data: { $$VALUE: 'some_string' }
  }

  expect(evaluate(context, ['$stringSubstr', 0, 4])).toEqual('some')
  expect(evaluate(context, ['$stringSubstr', 4])).toEqual('_string')
})

test('$stringConcat', () => {
  const context = {
    interpreters,
    data: { $$VALUE: 'some_string' }
  }

  expect(evaluate(context, ['$stringConcat', '_another_string'])).toEqual('some_string_another_string')
})

test('$stringTrim', () => {
  const context = {
    interpreters,
    data: { $$VALUE: ' some string  ' }
  }

  expect(evaluate(context, ['$stringTrim'])).toEqual('some string')
})
