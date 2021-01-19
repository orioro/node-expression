import { evaluate } from '../expression'
import { $value } from './value'
import {
  COMPARISON_EXPRESSIONS
} from './comparison'
import {
  ARRAY_EXPRESSIONS
} from './array'
import {
  OBJECT_EXPRESSIONS
} from './object'

const interpreters = {
  $value,
  ...COMPARISON_EXPRESSIONS,
  ...ARRAY_EXPRESSIONS,

  ...OBJECT_EXPRESSIONS,
}

const context = {
  interpreters,
  data: {
    $$VALUE: {
      name: 'João Silva',
      age: 50,
      mother: {
        name: 'Maria do Carmo',
        age: 76
      },
      father: {
        name: 'Galvão Queiroz',
        age: 74
      }
    }
  }
}

describe('$objectMatches', () => {
  test('path notation', () => {
    expect(evaluate(context, ['$objectMatches', {
      name: 'João Silva',
      'mother.name': 'Maria do Carmo'
    }])).toEqual(true)
  })

  test('object property equality', () => {

    expect(evaluate(context, ['$objectMatches', {
      mother: {
        $eq: {
          name: 'Maria do Carmo',
          age: 76
        }
      }
    }])).toEqual(true)

    expect(evaluate(context, ['$objectMatches', {
      mother: {
        $eq: {
          name: 'Maria do Carmo',
          age: 76,
          someOtherProp: 'B',
        }
      }
    }])).toEqual(false)
  })

  test('comparison operators', () => {
    expect(evaluate(context, ['$objectMatches', {
      age: {
        $gte: 50
      }
    }])).toEqual(true)

    expect(evaluate(context, ['$objectMatches', {
      age: {
        $gte: 51
      }
    }])).toEqual(false)
  })
})

describe('$objectFormat', () => {
  test('simple transformation', () => {
    expect(evaluate(context, ['$objectFormat', {
      fatherName: 'father.name',
      motherName: 'mother.name'
    }]))
  })

  test('', () => {
    expect(evaluate(context, ['$objectFormat', {
      fatherName: 'father.name',
      motherNameIsMariaDoCarmo: ['$eq', 'Maria do Carmo', ['$value', 'mother.name']],
      parentNames: [
        'father.name',
        'mother.name'
      ]
    }]))
    .toEqual({
      fatherName: 'Galvão Queiroz',
      motherNameIsMariaDoCarmo: true,
      parentNames: ['Galvão Queiroz', 'Maria do Carmo']
    })
  })
})
