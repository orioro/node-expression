import { evaluateTyped } from './expression'

describe('evaluateTyped(expectedTypes, context, value)', () => {
  test('simple type - example: number', () => {
    expect(() => {
      console.log(
        evaluateTyped(
          'number',
          {
            interpreters: {},
            scope: { $$VALUE: 'aa' },
          },
          '1'
        )
      )
    }).toThrow(TypeError)

    const _warn = console.warn
    console.warn = jest.fn()

    expect(() => {
      console.log(
        evaluateTyped(
          'number',
          {
            interpreters: {},
            scope: { $$VALUE: 'aa' },
          },
          ['$someUnknownExpression']
        )
      )
    }).toThrow(TypeError)

    expect(console.warn).toHaveBeenCalledWith(
      'Possible missing expression error: ["$someUnknownExpression"]. ' +
        "No interpreter was found for '$someUnknownExpression'"
    )
    console.warn = _warn
  })

  test('array object type', () => {
    expect(() => {
      console.log(
        evaluateTyped(
          'array',
          {
            interpreters: {},
            scope: { $$VALUE: 'aa' },
          },
          '1'
        )
      )
    }).toThrow(TypeError)

    expect(() => {
      console.log(
        evaluateTyped(
          'array',
          {
            interpreters: {
              $someExpression: () => 'text',
            },
            scope: { $$VALUE: 'aa' },
          },
          ['$someExpression']
        )
      )
    }).toThrow(TypeError)

    expect(
      evaluateTyped(
        'array',
        {
          interpreters: {
            $someExpression: () => ['item-1', 'item-2'],
          },
          scope: { $$VALUE: 'aa' },
        },
        ['$someExpression']
      )
    ).toEqual(['item-1', 'item-2'])
  })
})
