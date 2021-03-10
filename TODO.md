- $and               | Add 'strict' mode option (src/expressions/logical.ts)
- array              | $arrayEvery write tests with async conditions (src/expressions/array.ts)
- array              | $arraySome write tests with async conditions (src/expressions/array.ts)
- array              | Make it possible for the same set of expression interpreters
            to be called synchronously or asynchronously. E.g. sort comparator
            expression should only support Synchronous (src/expressions/array.ts)
- asyncParamResolver | ONE_OF_TYPES: handle complex cases, e.g.
                         oneOfTypes(['string', objectType({ key1: 'string', key2: 'number '})]) (src/interpreter/asyncParamResolver.ts)
- logical            | Write test to ensure delayed evaluation (src/expressions/logical.ts)
- syncInterpreter    | Handle nested object param typeSpec (src/interpreter/syncParamResolver.ts)
- syncInterpreter    | Study better ways at validating evlauation results for
                      tupleType and indefiniteArrayOfType. Currently validation is highly redundant. (src/interpreter/syncParamResolver.ts)
- syncInterpreter    | Update Interpreter type: remove function (src/interpreter/syncInterpreter.ts)
- value              | Consider adding 'expression' type (src/expressions/value.ts)
