import { evaluate } from '../expression'
import { $stringSubstr } from './string'
import {
  $eq,
  $notEq,
  $in,
  $notIn,
  $gt,
  $gte,
  $lt,
  $lte,
  $matches
} from './comparison'
import { $value } from './value'

describe('$eq / $notEq', () => {
  const interpreters = {
    $value,
    $stringSubstr,
    $eq,
    $notEq
  }

  test('string', () => {
    const context = {
      interpreters,
      scope: {
        $$VALUE: 'SOME_STRING'
      }
    }

    expect(evaluate(context, ['$eq', 'SOME_STRING'])).toEqual(true)
    expect(evaluate(context, ['$notEq', 'SOME_STRING'])).toEqual(false)

    expect(evaluate(context, ['$eq', 'OTHER_STRING'])).toEqual(false)
    expect(evaluate(context, ['$notEq', 'OTHER_STRING'])).toEqual(true)

    expect(evaluate(context, ['$eq', ['$stringSubstr', 4, 15, 'PRE_SOME_STRING_POS']])).toEqual(true)
  })
})

describe('$in / $notIn', () => {
  const interpreters = {
    $value,
    $in,
    $notIn
  }

  test('', () => {
    const context = {
      interpreters,
      scope: {
        $$VALUE: 'C'
      }
    }

    expect(evaluate(context, ['$in', ['A', 'B', 'C']])).toEqual(true)
    expect(evaluate(context, ['$notIn', ['A', 'B', 'C']])).toEqual(false)

    expect(evaluate(context, ['$in', ['X', 'Y', 'Z']])).toEqual(false)
    expect(evaluate(context, ['$notIn', ['X', 'Y', 'Z']])).toEqual(true)
  })
})

describe('$gt / $gte / $lt / $lte', () => {
  const interpreters = {
    $value,
    $gt,
    $gte,
    $lt,
    $lte,
  }

  const context = {
    interpreters,
    scope: {
      $$VALUE: 20
    }
  }

  test('$gt', () => {
    expect(evaluate(context, ['$gt', 10])).toEqual(true)
    expect(evaluate(context, ['$gt', 20])).toEqual(false)
    expect(evaluate(context, ['$gt', 30])).toEqual(false)
  })

  test('$gte', () => {
    expect(evaluate(context, ['$gte', 10])).toEqual(true)
    expect(evaluate(context, ['$gte', 20])).toEqual(true)
    expect(evaluate(context, ['$gte', 30])).toEqual(false)
  })

  test('$lt', () => {
    expect(evaluate(context, ['$lt', 10])).toEqual(false)
    expect(evaluate(context, ['$lt', 20])).toEqual(false)
    expect(evaluate(context, ['$lt', 30])).toEqual(true)
  })

  test('$lte', () => {
    expect(evaluate(context, ['$lte', 10])).toEqual(false)
    expect(evaluate(context, ['$lte', 20])).toEqual(true)
    expect(evaluate(context, ['$lte', 30])).toEqual(true)
  })
})

describe('$matches', () => {
  const interpreters = {
    $value,
    $eq,
    $notEq,
    $in,
    $notIn,
    $gt,
    $gte,
    $lt,
    $lte,
    $matches
  }

  const context = {
    interpreters,
    scope: {
      $$VALUE: {
        name: 'João Silva',
        age: 54,
        children: [
          { name: 'Maria Joaquina Silva', age: 30 },
          { name: 'Rafael Guimarães Silva', age: 18 }
        ],
        hobbies: [
          'Cozinhar',
          'Música'
        ]
      }
    }
  }

  test('', () => {
    const context = {
      interpreters,
      scope: {
        $$VALUE: 24
      }
    }

    expect(evaluate(context, ['$matches', {
      $gt: 20,
      $lt: 30
    }])).toEqual(true)
    expect(evaluate(context, ['$matches', {
      $gt: 20,
      $lt: 24
    }])).toEqual(false)
  })
})
