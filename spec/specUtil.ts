import { evaluate, evaluateAsync } from '../src/evaluate'
import { interpreterList } from '../src/interpreter/interpreter'
import {
  testCases,
  asyncResult,
  valueLabel,
  resultLabel,
  variableName,
  VariableName,
} from '@orioro/jest-util'

const _evLabel = ([value, expression], result) =>
  `${valueLabel(value)} | ${valueLabel(expression)} -> ${resultLabel(result)}`

export const _prepareEvaluateTestCases = (interpreterSpecs) => {
  const interpreters = interpreterList(interpreterSpecs)

  const testSyncCases = (cases) => {
    testCases(
      cases,
      (value, expression) =>
        evaluate(
          {
            interpreters,
            scope: { $$VALUE: value },
          },
          expression
        ),
      ([value, expression], result) =>
        `sync - ${_evLabel([value, expression], result)}`
    )
  }

  const testAsyncCases = cases => {
    testCases(
      cases.map((_case) => {
        const result = _case[_case.length - 1]
        const args = _case.slice(0, -1)

        return [...args, asyncResult(result)]
      }),
      (value, expression) =>
        evaluateAsync(
          {
            interpreters,
            scope: { $$VALUE: value },
          },
          expression
        ),
      ([value, expression], result) =>
        `async - ${_evLabel([value, expression], result)}`
    )
  }

  const testSyncAndAsync = (cases) => {
    testSyncCases(cases)
    testAsyncCases(cases)
  }

  testSyncAndAsync.testSyncCases = testSyncCases
  testSyncAndAsync.testAsyncCases = testAsyncCases

  return testSyncAndAsync
}
