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
    scope: { $$VALUE: 10.5 }
  }, ['$string'])).toEqual('10.5')
})

test('$stringStartsWith', () => {
  const context = {
    interpreters,
    scope: { $$VALUE: 'some_string' }
  }

  expect(evaluate(context, ['$stringStartsWith', 'some'])).toEqual(true)
  expect(evaluate(context, ['$stringStartsWith', 'somethingelse'])).toEqual(false)
})

test('$stringLength', () => {
  expect(evaluate({
    interpreters,
    scope: { $$VALUE: 'some_string' }
  }, ['$stringLength'])).toEqual(11)
})

test('$stringSubstr', () => {
  const context = {
    interpreters,
    scope: { $$VALUE: 'some_string' }
  }

  expect(evaluate(context, ['$stringSubstr', 0, 4])).toEqual('some')
  expect(evaluate(context, ['$stringSubstr', 4])).toEqual('_string')
})

test('$stringConcat', () => {
  const context = {
    interpreters,
    scope: { $$VALUE: 'some_string' }
  }

  expect(evaluate(context, ['$stringConcat', '_another_string'])).toEqual('some_string_another_string')
})

test('$stringTrim', () => {
  const context = {
    interpreters,
    scope: { $$VALUE: ' some string  ' }
  }

  expect(evaluate(context, ['$stringTrim'])).toEqual('some string')
})

test('$stringPadStart', () => {
  const context = {
    interpreters,
    scope: { $$VALUE: '1' }
  }

  expect(evaluate(context, ['$stringPadStart', 3, '0'])).toEqual('001')
})

test('$stringPadEnd', () => {
  const context = {
    interpreters,
    scope: { $$VALUE: '1' }
  }

  expect(evaluate(context, ['$stringPadEnd', 3, '*'])).toEqual('1**')
})

describe('$stringMatch', () => {
  test('array notation - using regexp flags', () => {
    const context = {
      interpreters,
      scope: { $$VALUE: 'abc_adc_acdc' }
    }

    expect(evaluate(context, ['$stringMatch', ['a.*?c', 'g']]))
      .toEqual([
        'abc',
        'adc',
        'ac'
      ])

    expect(evaluate(context, ['$stringMatch', 'u']))
      .toEqual([])
  })
})


test('$stringTest', () => {
  const context = {
    interpreters,
    scope: { $$VALUE: 'abc_adc_acdc' }
  }

  expect(evaluate(context, ['$stringTest', ['a.*?c', 'g']]))
    .toEqual(true)

  expect(evaluate(context, ['$stringTest', 'u']))
    .toEqual(false)
})

describe('$stringReplace', () => {
  test('string search - replaces only first match', () => {
    const context = {
      interpreters,
      scope: { $$VALUE: 'abc_adc_acdc' }
    }

    expect(evaluate(context, ['$stringReplace', 'a', '--REPLACEMENT--']))
      .toEqual('--REPLACEMENT--bc_adc_acdc')
  })

  test('regexp search - using global (g) flag', () => {
    const context = {
      interpreters,
      scope: { $$VALUE: 'abc_adc_acdc' }
    }

    expect(evaluate(context, ['$stringReplace', ['a', 'g'], '--REPLACEMENT--']))
      .toEqual('--REPLACEMENT--bc_--REPLACEMENT--dc_--REPLACEMENT--cdc')
  })

  test('regexp search - using replacement expression', () => {
    const context = {
      interpreters,
      scope: { $$VALUE: 'abc_adc_acdc' }
    }

    expect(evaluate(context, [
      '$stringReplace',
      ['[a-c]', 'g'],
      ['$stringToUpperCase']
    ]))
    .toEqual('ABC_AdC_ACdC')
  })
})
