import { evaluate, evaluateAsync } from '../src/evaluate'
import {
  testCases,
  asyncResult,
  valueLabel,
  resultLabel,
  variableName,
  VariableName
} from '@orioro/jest-util'

const _evLabel = ([value, expression], result) =>
  `${valueLabel(value)} | ${valueLabel(expression)} -> ${resultLabel(result)}`

export const _prepareEvaluateTestCases = ({
  syncInterpreters,
  asyncInterpreters
}) => (cases, expressionLabel: string | VariableName | null = null) => {
  testCases(
    cases,
    (value, expression) => evaluate({
      interpreters: syncInterpreters,
      scope: { $$VALUE: value }
    }, expression),
    ([value, expression], result) =>
      `sync - ${_evLabel([value, expressionLabel || expression], result)}`
  )

  testCases(
    cases.map((_case) => {
      const result = _case[_case.length - 1]
      const args = _case.slice(0, -1)

      return [...args, asyncResult(result)]
    }),
    (value, expression) => evaluateAsync({
      interpreters: asyncInterpreters,
      scope: { $$VALUE: value }
    }, expression),
    ([value, expression], result) =>
      `async - ${_evLabel([value, expressionLabel || expression], result)}`
  )
}
