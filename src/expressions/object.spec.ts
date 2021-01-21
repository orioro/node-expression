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
  scope: {
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

describe('$objectDefaults', () => {
  test('simple', () => {
    expect(evaluate({
      interpreters,
      scope: {
        $$VALUE: {
          propA: 'valueA',
          propB: 'valueB'
        }
      }
    }, ['$objectDefaults', {
      propA: 'defaultA',
      propB: 'defaultB',
      propC: 'defaultC'
    }]))
    .toEqual({
      propA: 'valueA',
      propB: 'valueB',
      propC: 'defaultC'
    })
  })

  test('nested object', () => {
    expect(evaluate({
      interpreters,
      scope: {
        $$VALUE: {
          propA: 'valueA',
          propB: 'valueB',
          propC: {
            propCA: 'valueCA'
          }
        }
      }
    }, ['$objectDefaults', {
      propA: 'defaultValueA',
      propB: 'defaultValueB',
      propC: {
        propCA: 'defaultValueCA',
        propCB: 'defaultValueCB'
      },
      propD: 'defaultValueD',
    }]))
    .toEqual({
      propA: 'valueA',
      propB: 'valueB',
      propC: {
        propCA: 'valueCA',
        propCB: 'defaultValueCB'
      },
      propD: 'defaultValueD'
    })
  })

  test('nested array', () => {
    const context = {
      interpreters,
      scope: {
        $$VALUE: {
          propA: 'valueA',
          propB: [
            { id: 'B0' },
            { id: 'B1' },
            undefined,
            { id: 'B3' }
          ]
        }
      }
    }

    const expression = ['$objectDefaults', {
      propA: 'defaultA',
      propB: [
        { id: 'defaultB0', foo: 0 },
        { id: 'defaultB1', foo: 1 },
        { id: 'defaultB2', foo: 2 },
        { id: 'defaultB3', foo: 3 },
      ],
      propC: 'defaultC',
    }]

    expect(evaluate(context, expression)).toEqual({
      propA: 'valueA',
      propB: [
        { id: 'B0', foo: 0 },
        { id: 'B1', foo: 1 },
        { id: 'defaultB2', foo: 2 },
        { id: 'B3', foo: 3 }
      ],
      propC: 'defaultC'
    })
  })
})

describe('$objectAssign', () => {
  test('simple', () => {
    expect(evaluate({
      interpreters,
      scope: {
        $$VALUE: {
          propA: 'valueA',
          propB: 'valueB'
        }
      }
    }, ['$objectAssign', {
      propA: 'assignA',
      propC: 'assignC'
    }]))
    .toEqual({
      propA: 'assignA',
      propB: 'valueB',
      propC: 'assignC'
    })
  })

  test('nested', () => {
    expect(evaluate({
      interpreters,
      scope: {
        $$VALUE: {
          propA: 'valueA',
          propB: {
            propBA: 'valueBA',
            propBB: 'valueBB',
          },
          propC: 'valueC'
        }
      }
    }, ['$objectAssign', {
      propA: 'assignA',
      propB: {
        propBB: 'assignBB'
      }
    }]))
    .toEqual({
      propA: 'assignA',
      propB: {
        propBA: 'valueBA',
        propBB: 'assignBB'
      },
      propC: 'valueC'
    })
  })
})
