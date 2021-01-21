import { evaluate } from '../expression'
import { $value } from './value'
import { $date, $dateNow, $dateLt } from './date'
import { $gt, $gte, $lt, $lte, $eq } from './comparison'

describe('$date', () => {
  const interpreters = {
    $value,
    $date
  }

  test('ISO', () => {
    const context = {
      interpreters,
      scope: { $$VALUE: '2020-10-14T23:09:30.787Z' }
    }

    expect(evaluate(context, ['$date', 'ISO', 'y'])).toEqual('2020')
    expect(evaluate(context, ['$date', 'ISO', 'MMMM'])).toEqual('October')
  })

  test('ms', () => {
    const ISODate = '2020-10-14T23:09:30.787Z'
    const context = {
      interpreters,
      scope: { $$VALUE: (new Date(ISODate)).getTime() }
    }

    expect(evaluate(context, ['$date', ['UnixEpochMs', { zone: 'utc' }]]))
      .toEqual(ISODate)
  })
})

describe('$dateNow', () => {
  const interpreters = {
    $value,
    $date,
    $dateNow
  }

  test('', () => {
    const context = {
      interpreters,
      scope: { $$VALUE: undefined }
    }

    const now = evaluate(context, ['$dateNow', 'UnixEpochMs'])
    expect(now).toBeLessThanOrEqual(Date.now())
    expect(now).toBeGreaterThan(Date.now() - 10)
  })
})

describe('date comparison', () => {
  const interpreters = {
    $value,
    $date,
    $dateNow,
    $gt,
    $gte,
    $lt,
    $lte,
    $dateLt
  }

  test('with math operators', () => {
    const context = {
      interpreters,
      scope: { $$VALUE: '2020-10-14T23:09:30.787Z' }
    }

    expect(evaluate(context, ['$lt', Date.now(), ['$date', 'ISO', 'UnixEpochMs']])).toEqual(true)
  })

  test('with date operators', () => {
    const context = {
      interpreters,
      scope: { $$VALUE: '2020-10-14T23:09:30.787Z' }
    }

    expect(evaluate(context, [
      '$dateLt',
      '2021-10-14T23:09:30.787Z'
    ]))
    .toEqual(true)

    expect(evaluate(context, [
      '$dateLt',
      '2019-10-14T23:09:30.787Z'
    ]))
    .toEqual(false)
  })
})
