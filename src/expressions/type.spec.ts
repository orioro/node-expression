import { evaluate } from '../expression'
import { $value } from './value'
import { TYPE_EXPRESSIONS } from './type'

const interpreters = {
  $value,
  ...TYPE_EXPRESSIONS,
}

describe('$type', () => {
  test('string', () => {
    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: 'some string' },
        },
        ['$type']
      )
    ).toEqual('string')
  })

  test('number', () => {
    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: 10 },
        },
        ['$type']
      )
    ).toEqual('number')
  })

  test('boolean', () => {
    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: true },
        },
        ['$type']
      )
    ).toEqual('boolean')
  })

  test('array', () => {
    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: [] },
        },
        ['$type']
      )
    ).toEqual('array')
  })

  test('object', () => {
    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: {} },
        },
        ['$type']
      )
    ).toEqual('object')
  })

  test('map', () => {
    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: new Map() },
        },
        ['$type']
      )
    ).toEqual('map')
  })

  test('set', () => {
    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: new Set() },
        },
        ['$type']
      )
    ).toEqual('set')
  })

  test('symbol', () => {
    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: Symbol() },
        },
        ['$type']
      )
    ).toEqual('symbol')
  })
})
