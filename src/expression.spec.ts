import {
  typedEvaluate
} from './expression'

describe('typedEvaluate(expectedTypes, context, value)', () => {
  test('simple type - example: number', () => {
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

  test('array object type', () => {
    expect(() => {
      console.log(typedEvaluate('array', {
        interpreters: {},
        scope: { $$VALUE: 'aa' }
      }, '1'))
    }).toThrow(TypeError)

    expect(() => {
      console.log(typedEvaluate('array', {
        interpreters: {
          $someExpression: () => 'text'
        },
        scope: { $$VALUE: 'aa' }
      }, ['$someExpression']))
    }).toThrow(TypeError)

    expect(typedEvaluate('array', {
      interpreters: {
        $someExpression: () => ['item-1', 'item-2']
      },
      scope: { $$VALUE: 'aa' }
    }, ['$someExpression'])).toEqual(['item-1', 'item-2'])
  })
})
