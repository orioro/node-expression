import { testCases, fnCallLabel, variableName } from '@orioro/jest-util'

import { ALL_EXPRESSIONS } from '../'
import { anyType, tupleType, indefiniteArrayOfType } from '@orioro/typing'
import { _syncParamResolver, syncInterpreterList } from './syncInterpreter'

const _label = fnName => ([context, value], result) =>
  fnCallLabel(fnName, [variableName('context'), value], result)

describe('_syncParamResolver(anyType)', () => {
  const context = {
    interpreters: syncInterpreterList(ALL_EXPRESSIONS),
    scope: {
      $$VALUE: 10,
    },
  }

  describe('anyType()', () => {
    const anyResolver = _syncParamResolver('any')

    testCases(
      [
        [context, 'value-b', 'value-b'],
        [context, ['$value'], 10],
        [context, ['$mathSum', 5], 15],
      ],
      anyResolver,
      _label('anyResolver')
    )
  })

  describe('anyType({ delayEvaluation: true })', () => {
    const anyResolver = _syncParamResolver(anyType({ delayEvaluation: true }))

    testCases(
      [
        [context, 'value-b', 'value-b'],
        [context, ['$value'], ['$value']],
        [context, ['$mathSum', 5], ['$mathSum', 5]],
      ],
      anyResolver,
      _label('anyResolver')
    )
  })
})


describe('_syncParamResolver(singleType | oneOfTypes | enumType)', () => {
  const context = {
    interpreters: syncInterpreterList(ALL_EXPRESSIONS),
    scope: {
      $$VALUE: 'some-str',
    },
  }

  describe('singleType(string)', () => {
    const stringResolver = _syncParamResolver('string')

    testCases(
      [
        [context, 'value-b', 'value-b'],
        [context, ['$value'], 'some-str'],
        [context, 7, TypeError],
      ],
      stringResolver,
      _label('singleType(string)')
    )
  })

  describe('oneOfTypes([string, number])', () => {
    const resolver = _syncParamResolver(['string', 'number'])

    testCases(
      [
        [context, 'value-b', 'value-b'],
        [context, ['$value'], 'some-str'],
        [context, 7, 7],
      ],
      resolver,
      _label('oneOfTypes([string, number])')
    )
  })
})

describe('_syncParamResolver(tupleType)', () => {
  const context = {
    interpreters: syncInterpreterList(ALL_EXPRESSIONS),
    scope: {
      $$VALUE: ['some-str', 20]
    },
  }

  describe('tupleType([string, number])', () => {
    const resolver = _syncParamResolver(tupleType(['string', 'number']))

    testCases(
      [
        [context, ['$value'], ['some-str', 20]],
        [context, ['some-other-str', 15], ['some-other-str', 15]],
        [context, 'value-b', TypeError],
        [context, 7, TypeError],
        [context, [1, 2], TypeError],
        [context, ['some-str', 20, 30], TypeError]
      ],
      resolver,
      _label('tupleType([string, number])')
    )
  })
})

describe('_syncParamResolver(indefiniteArrayOfType)', () => {
  const context = {
    interpreters: syncInterpreterList(ALL_EXPRESSIONS),
    scope: {
      $$VALUE: ['some-str', 20]
    },
  }

  describe('indefiniteArrayOfType([string, number])', () => {
    const resolver = _syncParamResolver(indefiniteArrayOfType(['string', 'number']))

    testCases(
      [
        [context, ['$value'], ['some-str', 20]],
        [context, ['some-other-str', 15], ['some-other-str', 15]],
        [context, [1, 2], [1, 2]],
        [context, ['some-str', 20, 30], ['some-str', 20, 30]],
        [context, 'value-b', TypeError],
        [context, 7, TypeError],
      ],
      resolver,
      _label('indefiniteArrayOfType([string, number])')
    )
  })
})
