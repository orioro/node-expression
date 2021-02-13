import { objectDeepAssign } from './deepAssign'

test('objectDeepAssign', () => {
  const base = {
    propA: 'valueA',
    propB: 'valueB',
    propC: {
      propCA: 'valueCA',
      propCB: 'valueCB',
    },
  }

  const extension = {
    propB: 'extendedB',
    propC: {
      propCB: 'extendedCB',
    },
  }

  expect(objectDeepAssign(base, extension)).toEqual({
    propA: 'valueA',
    propB: 'extendedB',
    propC: {
      propCA: 'valueCA',
      propCB: 'extendedCB',
    },
  })
})
