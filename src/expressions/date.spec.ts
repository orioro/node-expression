import { evaluate } from '../expression'
import { VALUE_EXPRESSIONS } from './value'
import { DATE_EXPRESSIONS } from './date'
import { COMPARISON_EXPRESSIONS } from './comparison'

const interpreters = {
  ...VALUE_EXPRESSIONS,
  ...DATE_EXPRESSIONS,
  ...COMPARISON_EXPRESSIONS,
}

const isoStringToTime = (ISOString) => new Date(ISOString).getTime()

describe('$date', () => {
  test('ISO', () => {
    const context = {
      interpreters,
      scope: { $$VALUE: '2020-10-14T23:09:30.787Z' },
    }

    expect(evaluate(context, ['$date', 'ISO', 'y'])).toEqual('2020')
    expect(evaluate(context, ['$date', 'ISO', 'MMMM'])).toEqual('October')
  })

  test('ms', () => {
    const ISODate = '2020-10-14T23:09:30.787Z'
    const context = {
      interpreters,
      scope: { $$VALUE: new Date(ISODate).getTime() },
    }

    expect(
      evaluate(context, ['$date', ['UnixEpochMs', { zone: 'utc' }]])
    ).toEqual(ISODate)
  })
})

describe('$dateNow', () => {
  test('basic', () => {
    const context = {
      interpreters,
      scope: { $$VALUE: undefined },
    }

    const now = evaluate(context, ['$dateNow', 'UnixEpochMs'])

    return new Promise((resolve) => setTimeout(resolve, 50)).then(() => {
      expect(now).toBeLessThanOrEqual(Date.now())
      expect(now).toBeGreaterThan(Date.now() - 100)
    })
  })
})

test('$dateIsValid', () => {
  const expectations = [
    [undefined, false],
    [null, false],
    ['', false],
    ['2021 02 12T12:34:15.020-03:00', false],
    ['2021-02-12T12:34:15.020-03:00', true],
    ['2021-02-12T12:34:15.020', true],
    ['2021-02-12T12:34:15', true],
    ['2021-02-12', true],
    ['2021-02', true],
    ['2021', true],
    ['202', false],
    ['some random string', false],
    [10, false],
  ]

  expectations.forEach(([input, expected]) => {
    expect(
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: input },
        },
        ['$dateIsValid']
      )
    ).toEqual(expected)
  })
})

test('$dateStartOf', () => {
  const context = {
    interpreters,
    scope: { $$VALUE: '2021-02-12T12:34:15.020-03:00' },
  }

  const expectations = [
    ['year', '2021-01-01T00:00:00.000-03:00'],
    ['month', '2021-02-01T00:00:00.000-03:00'],
    ['day', '2021-02-12T00:00:00.000-03:00'],
    ['hour', '2021-02-12T12:00:00.000-03:00'],
    ['minute', '2021-02-12T12:34:00.000-03:00'],
    ['second', '2021-02-12T12:34:15.000-03:00'],
  ]

  expectations.forEach(([input, expected]) => {
    const result = evaluate(context, ['$dateStartOf', input])
    expect(isoStringToTime(result)).toEqual(isoStringToTime(expected))
  })
})

test('$dateEndOf', () => {
  const context = {
    interpreters,
    scope: { $$VALUE: '2021-02-12T12:34:15.020-03:00' },
  }

  const expectations = [
    ['year', '2021-12-31T23:59:59.999-03:00'],
    ['month', '2021-02-28T23:59:59.999-03:00'],
    ['day', '2021-02-12T23:59:59.999-03:00'],
    ['hour', '2021-02-12T12:59:59.999-03:00'],
    ['minute', '2021-02-12T12:34:59.999-03:00'],
    ['second', '2021-02-12T12:34:15.999-03:00'],
  ]

  expectations.forEach(([input, expected]) => {
    const result = evaluate(context, ['$dateEndOf', input])
    expect(isoStringToTime(result)).toEqual(isoStringToTime(expected))
  })
})

test('$dateSet', () => {
  const context = {
    interpreters,
    scope: { $$VALUE: '2021-02-12T12:34:15.020-03:00' },
  }

  const expectations = [
    [{ month: 1 }, '2021-01-12T12:34:15.020-03:00'],
    [{ year: 2020 }, '2020-02-12T12:34:15.020-03:00'],
    [{ day: 1 }, '2021-02-01T12:34:15.020-03:00'],
    [{ hour: 1 }, '2021-02-12T01:34:15.020-03:00'],
    [{ minute: 1 }, '2021-02-12T12:01:15.020-03:00'],
    [{ second: 1 }, '2021-02-12T12:34:01.020-03:00'],
  ]

  expectations.forEach(([input, expected]) => {
    const result = evaluate(context, ['$dateSet', input])
    expect(isoStringToTime(result)).toEqual(isoStringToTime(expected))
  })
})

test('$dateSetConfig', () => {
  const context = {
    interpreters,
    scope: { $$VALUE: '2021-02-12T12:34:15.020-03:00' },
  }

  const expectations = [
    [{ zone: 'UTC+0' }, '2021-02-12T15:34:15.020Z'],
    [{ zone: 'UTC+1' }, '2021-02-12T16:34:15.020+01:00'],
  ]

  expectations.forEach(([input, expected]) => {
    expect(evaluate(context, ['$dateSetConfig', input])).toEqual(expected)
  })

  expect(() => {
    evaluate(context, [
      '$dateSetConfig',
      {
        unknownConfig: 'value',
      },
    ])
  }).toThrow('Unknown DateTime config')
})

describe('date comparison', () => {
  const DATE_BEFORE = '2019-10-14T23:09:30.787Z'
  const DATE_REFERENCE = '2020-10-14T23:09:30.787Z'
  const DATE_REFERENCE_OTHER_TZ = '2020-10-14T20:09:30.787-03:00'
  const DATE_AFTER = '2021-10-14T23:09:30.787Z'
  const context = {
    interpreters,
    scope: { $$VALUE: DATE_REFERENCE },
  }

  test('with math operators', () => {
    expect(
      evaluate(context, ['$lt', Date.now(), ['$date', 'ISO', 'UnixEpochMs']])
    ).toEqual(true)
  })

  test('with date operators', () => {
    const expectations = [
      ['$dateGt', DATE_BEFORE, true],
      ['$dateGt', DATE_AFTER, false],
      ['$dateGt', DATE_REFERENCE, false],
      ['$dateGt', DATE_REFERENCE_OTHER_TZ, false],

      ['$dateGte', DATE_BEFORE, true],
      ['$dateGte', DATE_AFTER, false],
      ['$dateGte', DATE_REFERENCE, true],
      ['$dateGte', DATE_REFERENCE_OTHER_TZ, true],

      ['$dateLt', DATE_BEFORE, false],
      ['$dateLt', DATE_AFTER, true],
      ['$dateLt', DATE_REFERENCE, false],
      ['$dateLt', DATE_REFERENCE_OTHER_TZ, false],

      ['$dateLte', DATE_BEFORE, false],
      ['$dateLte', DATE_AFTER, true],
      ['$dateLte', DATE_REFERENCE, true],
      ['$dateLte', DATE_REFERENCE_OTHER_TZ, true],

      ['$dateEq', DATE_BEFORE, false],
      ['$dateEq', DATE_AFTER, false],
      ['$dateEq', DATE_REFERENCE, true],
      ['$dateEq', DATE_REFERENCE_OTHER_TZ, true],
    ]

    expectations.forEach(([expression, input, expected]) => {
      expect(evaluate(context, [expression, input])).toEqual(expected)
    })
  })
})

test('$dateMoveForward', () => {
  const context = {
    interpreters,
    scope: { $$VALUE: '2021-02-12T12:34:15.020-03:00' },
  }

  const expectations = [
    [{ month: 1 }, '2021-03-12T12:34:15.020-03:00'],
    [{ year: 2 }, '2023-02-12T12:34:15.020-03:00'],
    [{ day: 1 }, '2021-02-13T12:34:15.020-03:00'],
    [{ hour: 1 }, '2021-02-12T13:34:15.020-03:00'],
    [{ minute: 1 }, '2021-02-12T12:35:15.020-03:00'],
    [{ second: 1 }, '2021-02-12T12:34:16.020-03:00'],
  ]

  expectations.forEach(([input, expected]) => {
    const result = evaluate(context, ['$dateMoveForward', input])
    expect(isoStringToTime(result)).toEqual(isoStringToTime(expected))
  })
})

test('$dateMoveBackward', () => {
  const context = {
    interpreters,
    scope: { $$VALUE: '2021-02-12T12:34:15.020-03:00' },
  }

  const expectations = [
    [{ month: 1 }, '2021-01-12T12:34:15.020-03:00'],
    [{ year: 1 }, '2020-02-12T12:34:15.020-03:00'],
    [{ day: 1 }, '2021-02-11T12:34:15.020-03:00'],
    [{ hour: 1 }, '2021-02-12T11:34:15.020-03:00'],
    [{ minute: 1 }, '2021-02-12T12:33:15.020-03:00'],
    [{ second: 1 }, '2021-02-12T12:34:14.020-03:00'],
  ]

  expectations.forEach(([input, expected]) => {
    const result = evaluate(context, ['$dateMoveBackward', input])
    expect(isoStringToTime(result)).toEqual(isoStringToTime(expected))
  })
})
