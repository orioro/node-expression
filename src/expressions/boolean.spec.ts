import { evaluate } from '../evaluate'
import { syncInterpreterList } from '../interpreter/syncInterpreter'
import { $value } from './value'
import { $boolean } from './boolean'

const interpreters = syncInterpreterList({
  $value,
  $boolean,
})

describe('$boolean', () => {
  test('numbers', () => {
    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: 1 },
        },
        ['$boolean']
      )
    ).toEqual(true)

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: 0 },
        },
        ['$boolean']
      )
    ).toEqual(false)

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: -1 },
        },
        ['$boolean']
      )
    ).toEqual(true)
  })

  test('string', () => {
    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: 'some string' },
        },
        ['$boolean']
      )
    ).toEqual(true)

    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: '' },
        },
        ['$boolean']
      )
    ).toEqual(false)
  })
})
