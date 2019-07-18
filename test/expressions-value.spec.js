import {
  expression,
  $$VALUE,
  VALUE_EXPRESSIONS
} from '../src'

describe('VALUE_EXPRESSIONS', () => {

  const evaluate = expression({
    ...VALUE_EXPRESSIONS,
  })

  const NUMBER = 123
  const STRING = 'String value'
  const BOOLEAN = true
  const ARRAY = [NUMBER, STRING, ['nested', 'array']]
  const OBJECT = {
    string: STRING,
    number: NUMBER,
    boolean: BOOLEAN,
    nested: {
      key: 'Nested value',
      array: ARRAY,
    },
  }

  describe('literals', () => {
    test('basic', () => {
      expect(evaluate(['some', 'array', 'of', 'values'], null))
        .toEqual(['some', 'array', 'of', 'values'])
    })

    test('$literal', () => {
      expect(evaluate(['$literal', ['$value', 'literal']], null))
        .toEqual(['$value', 'literal'])
      expect(evaluate(['$literal', ['$literal', 'literal']], null))
        .toEqual(['$literal', 'literal'])
    })
  })

  describe('$value', () => {
    test('root', () => {
      expect(evaluate(['$value', null], NUMBER)).toEqual(NUMBER)
      expect(evaluate(['$value', null], STRING)).toEqual(STRING)
      expect(evaluate(['$value', null], BOOLEAN)).toEqual(BOOLEAN)
      expect(evaluate(['$value', null], ARRAY)).toEqual(ARRAY)

      expect(evaluate($$VALUE, 'Any value')).toEqual('Any value')
    })

    test('path', () => {
      expect(evaluate(['$value', 'string'], OBJECT)).toEqual('String value')
      expect(evaluate(['$value', 'nested.key'], OBJECT)).toEqual('Nested value')
      expect(evaluate(['$value', 'nested.array.0'], OBJECT)).toEqual(123)
    })
  })
})
