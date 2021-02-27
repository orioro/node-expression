import { evaluate } from '../expression'
import { $value } from './value'
import { TYPE_EXPRESSIONS, typeExpressions } from './type'
import { testCases } from '@orioro/jest-util'

const interpreters = {
  $value,
  ...TYPE_EXPRESSIONS,
}

describe('$type', () => {
  testCases(
    [
      ['some string', 'string'],
      [10, 'number'],
      [true, 'boolean'],
      [[], 'array'],
      [{}, 'object'],
      [new Map(), 'map'],
      [new Set(), 'set'],
      [Symbol(), 'symbol'],
    ],
    (value) =>
      evaluate(
        {
          interpreters,
          scope: { $$VALUE: value },
        },
        ['$type']
      ),
    '$type'
  )
})

describe('$isType', () => {
  testCases(
    [
      ['string', 'Some str', true],
      ['string', 9, false],
      ['number', 9, true],
    ],
    (type, value) =>
      evaluate({ interpreters, scope: { $$VALUE: value } }, ['$isType', type]),
    '$isType'
  )
})

describe('typeExpressions(types)', () => {
  const [$customType, $customIsType] = typeExpressions({
    numericOnlyString: (value) =>
      typeof value === 'string' && /^[0-9]+$/.test(value),
    alphaOnlyString: (value) =>
      typeof value === 'string' && /^[a-zA-Z]+$/.test(value),
    alphaNumericString: (value) =>
      typeof value === 'string' && /^[a-zA-Z0-9]+$/.test(value),
    normalString: (value) => typeof value === 'string',
  })

  describe('$customType', () => {
    testCases(
      [
        ['abc123', 'alphaNumericString'],
        ['abc123-', 'normalString'],
        ['abc', 'alphaOnlyString'],
        ['abc123', 'alphaNumericString'],
        ['123', 'numericOnlyString'],
      ],
      (value) =>
        evaluate(
          {
            interpreters: {
              ...interpreters,
              $customType,
              $customIsType,
            },
            scope: { $$VALUE: value },
          },
          ['$customType']
        ),
      '$customType'
    )
  })

  describe('$customIsType', () => {
    testCases(
      [
        ['alphaNumericString', 'abc123', true],
        ['alphaNumericString', 'abc123-', false],
        ['alphaOnlyString', 'abc', true],
        ['alphaOnlyString', 'abc123', false],
        ['numericOnlyString', '123', true],
        ['numericOnlyString', 'abc123', false],
      ],
      (type, value) =>
        evaluate(
          {
            interpreters: {
              ...interpreters,
              $customType,
              $customIsType,
            },
            scope: { $$VALUE: value },
          },
          ['$customIsType', type]
        ),
      '$customIsType'
    )
  })
})
