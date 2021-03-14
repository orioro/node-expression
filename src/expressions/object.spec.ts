import { evaluate } from '../evaluate'
import { $value } from './value'
import { COMPARISON_EXPRESSIONS } from './comparison'
import { ARRAY_EXPRESSIONS } from './array'
import { OBJECT_EXPRESSIONS } from './object'
import { STRING_EXPRESSIONS } from './string'
import { LOGICAL_EXPRESSIONS } from './logical'
import { _prepareEvaluateTestCases } from '../../spec/specUtil'

const EXP = {
  $value,
  ...STRING_EXPRESSIONS,
  ...COMPARISON_EXPRESSIONS,
  ...ARRAY_EXPRESSIONS,
  ...LOGICAL_EXPRESSIONS,

  ...OBJECT_EXPRESSIONS,
}

const _evTestCases = _prepareEvaluateTestCases(EXP)

describe('$objectMatches', () => {
  const DATA = {
    name: 'João Silva',
    age: 50,
    mother: {
      name: 'Maria do Carmo',
      age: 76,
    },
    father: {
      name: 'Galvão Queiroz',
      age: 74,
    },
  }

  describe('path notation', () => {
    _evTestCases([
      [
        DATA,
        [
          '$objectMatches',
          {
            name: 'João Silva',
            'mother.name': 'Maria do Carmo',
          },
        ],
        true,
      ],
    ])
  })

  describe('object property equality', () => {
    _evTestCases([
      [
        DATA,
        [
          '$objectMatches',
          {
            mother: {
              $eq: {
                name: 'Maria do Carmo',
                age: 76,
              },
            },
          },
        ],
        true,
      ],
      [
        DATA,
        [
          '$objectMatches',
          {
            mother: {
              $eq: {
                name: 'Maria do Carmo',
                age: 76,
                someOtherProp: 'B',
              },
            },
          },
        ],
        false,
      ],
    ])
  })

  describe('comparison operators', () => {
    _evTestCases([
      [
        DATA,
        [
          '$objectMatches',
          {
            age: {
              $gte: 50,
            },
          },
        ],
        true,
      ],
      [
        DATA,
        [
          '$objectMatches',
          {
            age: {
              $gte: 51,
            },
          },
        ],
        false,
      ],
    ])
  })
})

describe('$objectFormat', () => {
  const DATA = {
    name: 'João Silva',
    age: 50,
    mother: {
      name: 'Maria do Carmo',
      age: 76,
    },
    father: {
      name: 'Galvão Queiroz',
      age: 74,
    },
  }

  describe('object root', () => {
    describe('simple transformation', () => {
      _evTestCases([
        [
          DATA,
          [
            '$objectFormat',
            {
              fatherName: 'father.name',
              motherName: 'mother.name',
            },
          ],
          {
            fatherName: 'Galvão Queiroz',
            motherName: 'Maria do Carmo',
          },
        ],
      ])
    })

    describe('basic', () => {
      _evTestCases([
        [
          DATA,
          [
            '$objectFormat',
            {
              fatherName: 'father.name',
              motherNameIsMariaDoCarmo: [
                '$eq',
                'Maria do Carmo',
                ['$value', 'mother.name'],
              ],
              parentNames: ['father.name', 'mother.name'],
            },
          ],
          {
            fatherName: 'Galvão Queiroz',
            motherNameIsMariaDoCarmo: true,
            parentNames: ['Galvão Queiroz', 'Maria do Carmo'],
          },
        ],
      ])
    })
  })

  describe('array root', () => {
    describe('basic', () => {
      _evTestCases([
        [
          DATA,
          ['$objectFormat', ['name', 'father.name', 'mother.name']],
          ['João Silva', 'Galvão Queiroz', 'Maria do Carmo'],
        ],
      ])
    })

    describe('expression items', () => {
      _evTestCases([
        [
          DATA,
          [
            '$objectFormat',
            [
              [
                '$stringConcat',
                ['$value', 'father.name'],
                ['$value', 'mother.name'],
              ],
              'name',
              'father.name',
              'mother.name',
            ],
          ],
          [
            'Maria do CarmoGalvão Queiroz',
            'João Silva',
            'Galvão Queiroz',
            'Maria do Carmo',
          ],
        ],
      ])
    })

    describe('with object items', () => {
      _evTestCases([
        [
          DATA,
          [
            '$objectFormat',
            [
              'father.name',
              {
                fatherName: 'father.name',
              },
            ],
          ],
          ['Galvão Queiroz', { fatherName: 'Galvão Queiroz' }],
        ],
      ])
    })
  })
})

describe('$objectDefaults', () => {
  describe('simple', () => {
    _evTestCases([
      [
        { propA: 'valueA', propB: 'valueB' },
        [
          '$objectDefaults',
          {
            propA: 'defaultA',
            propB: 'defaultB',
            propC: 'defaultC',
          },
        ],
        { propA: 'valueA', propB: 'valueB', propC: 'defaultC' },
      ],
    ])
  })

  describe('nested object', () => {
    _evTestCases([
      [
        {
          propA: 'valueA',
          propB: 'valueB',
          propC: {
            propCA: 'valueCA',
          },
        },
        [
          '$objectDefaults',
          {
            propA: 'defaultValueA',
            propB: 'defaultValueB',
            propC: {
              propCA: 'defaultValueCA',
              propCB: 'defaultValueCB',
            },
            propD: 'defaultValueD',
          },
        ],
        {
          propA: 'valueA',
          propB: 'valueB',
          propC: {
            propCA: 'valueCA',
            propCB: 'defaultValueCB',
          },
          propD: 'defaultValueD',
        },
      ],
    ])
  })

  describe('nested array', () => {
    _evTestCases([
      [
        {
          propA: 'valueA',
          propB: [{ id: 'B0' }, { id: 'B1' }, undefined, { id: 'B3' }],
        },
        [
          '$objectDefaults',
          {
            propA: 'defaultA',
            propB: [
              { id: 'defaultB0', foo: 0 },
              { id: 'defaultB1', foo: 1 },
              { id: 'defaultB2', foo: 2 },
              { id: 'defaultB3', foo: 3 },
            ],
            propC: 'defaultC',
          },
        ],
        {
          propA: 'valueA',
          propB: [
            { id: 'B0', foo: 0 },
            { id: 'B1', foo: 1 },
            { id: 'defaultB2', foo: 2 },
            { id: 'B3', foo: 3 },
          ],
          propC: 'defaultC',
        },
      ],
    ])
  })
})

describe('$objectAssign', () => {
  describe('simple', () => {
    _evTestCases([
      [
        {
          propA: 'valueA',
          propB: 'valueB',
        },
        [
          '$objectAssign',
          {
            propA: 'assignA',
            propC: 'assignC',
          },
        ],
        {
          propA: 'assignA',
          propB: 'valueB',
          propC: 'assignC',
        },
      ],
    ])
  })

  describe('nested', () => {
    _evTestCases([
      [
        {
          propA: 'valueA',
          propB: {
            propBA: 'valueBA',
            propBB: 'valueBB',
          },
          propC: 'valueC',
        },
        [
          '$objectAssign',
          {
            propA: 'assignA',
            propB: {
              propBB: 'assignBB',
            },
          },
        ],
        {
          propA: 'assignA',
          propB: {
            propBA: 'valueBA',
            propBB: 'assignBB',
          },
          propC: 'valueC',
        },
      ],
    ])
  })
})

describe('$objectKeys', () => {
  _evTestCases([
    [
      { key1: 'value1', key2: 'value2', key3: 'value3' },
      ['$objectKeys'],
      ['key1', 'key2', 'key3'],
    ],
  ])
})
