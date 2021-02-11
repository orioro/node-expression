import {
  evaluateTyped
} from './expression'

describe('evaluateTyped(expectedTypes, context, value)', () => {
  test('simple type - example: number', () => {
    expect(() => {
      console.log(evaluateTyped('number', {
        interpreters: {},
        scope: { $$VALUE: 'aa' }
      }, '1'))
    }).toThrow(TypeError)

    expect(() => {
      console.log(evaluateTyped('number', {
        interpreters: {},
        scope: { $$VALUE: 'aa' }
      }, ['$someUnknownExpression']))
    }).toThrow(TypeError)
  })

  test('array object type', () => {
    expect(() => {
      console.log(evaluateTyped('array', {
        interpreters: {},
        scope: { $$VALUE: 'aa' }
      }, '1'))
    }).toThrow(TypeError)

    expect(() => {
      console.log(evaluateTyped('array', {
        interpreters: {
          $someExpression: () => 'text'
        },
        scope: { $$VALUE: 'aa' }
      }, ['$someExpression']))
    }).toThrow(TypeError)

    expect(evaluateTyped('array', {
      interpreters: {
        $someExpression: () => ['item-1', 'item-2']
      },
      scope: { $$VALUE: 'aa' }
    }, ['$someExpression'])).toEqual(['item-1', 'item-2'])
  })
})
