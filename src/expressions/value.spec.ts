import { evaluate } from '../expression'
import { $value } from './value'

describe('$value', () => {
  const interpreters = {
    $value
  }

  test('', () => {
    const arrayA = ['A', 'B', 'C', 'D']
    const arrayB = ['X', 'Y', 'Z']

    const data = {
      key1: 'Value 1',
      key2: 'Value 2',
      key3: {
        key31: 'Value 31'
      }
    }

    const context = {
      interpreters,
      data: {
        $$VALUE: data
      }
    }

    expect(evaluate(context, ['$value'])).toEqual(data)
    expect(evaluate(context, ['$value', 'key1'])).toEqual('Value 1')
    expect(evaluate(context, ['$value', 'key3.key31'])).toEqual('Value 31')
  })
})
