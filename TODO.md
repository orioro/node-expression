- $and               | Add 'strict' mode option (src/expressions/logical.ts)
- array              | Substitute anyType({ delaytEvaluation }) for some type that better
            expresses that the value is an expression whose evaluation
            has been delayed (src/expressions/array.ts)
- asyncParamResolver | ONE_OF_TYPES: handle complex cases, e.g.
                         oneOfTypes(['string', objectType({ key1: 'string', key2: 'number '})]) (src/interpreter/asyncParamResolver.ts)
- syncInterpreter    | Study better ways at validating evlauation results for
                      tupleType and indefiniteArrayOfType. Currently validation is highly redundant. (src/interpreter/syncParamResolver.ts)
- value              | Consider adding 'expression' type (src/expressions/value.ts)
