# expression

```
npm install @orioro/expression
```

## API

#### Array

##### `$arrayIncludes(searchValueExp, arrayExp = $$VALUE)`

Equivalent of `Array.prototype.includes`.

- `searchValueExp` {AnyValueExpression}
- `arrayExp` {ArrayExpression} Default: `$$VALUE`
- Returns: `includes` {boolean}

##### `$arrayIncludesAll(searchValuesExp, arrayExp = $$VALUE)`

Similar to `$arrayIncludes`, but receives an array
of values to be searched for and returns whether the
context array contains all of the searched values.

- `searchValuesExp` {ArrayExpression}
- `arrayExp` {ArrayExpression} Default: `$$VALUE`
- Returns: `includesAll` {boolean}

##### `$arrayIncludesAny(searchValueExp, arrayExp = $$VALUE)`

Similar to `$arrayIncludes`, but returns true if
any of the searched values is in the array.

- `searchValueExp` {ArrayExpression}
- `arrayExp` {ArrayExpression} Default: `$$VALUE`
- Returns: `includesAny` {boolean}

##### `$arrayLength(arrayExp = $$VALUE)`

- `arrayExp` {ArrayExpression} Default: `$$VALUE`
- Returns: `length` {number}

##### `$arrayReduce(reduceExp, startExp, arrayExp = $$VALUE)`

- `reduceExp` {Expression} An expression that returns the
                              result of reduction. Has access to:
                              - $$PARENT_SCOPE
                              - $$VALUE
                              - $$INDEX
                              - $$ARRAY
                              - $$ACC
- `startExp` {AnyExpression}
- `arrayExp` {ArrayExpression} Default: `$$VALUE`

##### `$arrayMap(mapExp, arrayExp = $$VALUE)`

- `mapExp` {Expression}
- `arrayExp` {ArrayExpression} Default: `$$VALUE`

##### `$arrayFilter(queryExp, arrayExp = $$VALUE)`

- `queryExp` {BooleanExpression}
- `arrayExp` {ArrayExpression} Default: `$$VALUE`

##### `$arrayIndexOf(queryExp, arrayExp = $$VALUE)`

- `queryExp` {BooleanExpression}
- `arrayExp` {ArrayExpression} Default: `$$VALUE`

##### `$arrayFind(queryExp, arrayExp = $$VALUE)`

- `queryExp` {BooleanExpression}
- `arrayExp` {ArrayExpression} Default: `$$VALUE`

##### `$arrayReverse(arrayExp = $$VALUE)`

- `arrayExp` {ArrayExpression} Default: `$$VALUE`

##### `$arraySort(sortExp, arrayExp = $$VALUE)`

- `sortExp` {NumberExpression}
- `arrayExp` {ArrayExpression} Default: `$$VALUE`

##### `$arrayPush(arrayExp = $$VALUE)`

- `arrayExp` {ArrayExpression} Default: `$$VALUE`

##### `$arrayUnshift(valueExp, arrayExp = $$VALUE)`

- `valueExp` {*}
- `arrayExp` {ArrayExpression} Default: `$$VALUE`

##### `$arrayShift(arrayExp = $$VALUE)`

- `arrayExp` {ArrayExpression} Default: `$$VALUE`

##### `$arraySlice(startExp, endExp, arrayExp = $$VALUE)`

- `startExp` {NumberExpression}
- `endExp` {NumberExpression}
- `arrayExp` {ArrayExpression} Default: `$$VALUE`
- Returns: {Array}

##### `$arraySubstitute(startExp, endExp, valuesExp, arrayExp = $$VALUE)`

- `startExp` {NumberExpression}
- `endExp` {NumberExpression}
- `valuesExp` {ArrayExpression}
- `arrayExp` {ArrayExpression} Default: `$$VALUE`
- Returns: {Array}

##### `$arrayAddAt(indexExp, valuesExp, arrayExp = $$VALUE)`

- `indexExp` {NumberExpression}
- `valuesExp` {ArrayExpression}
- `arrayExp` {ArrayExpression} Default: `$$VALUE`
- Returns: {Array}

##### `$arrayRemoveAt(indexExp, countExp = 1, arrayExp = $$VALUE)`

- `indexExp` {NumberExpression}
- `countExp` {NumberExpression} Default: `1`
- `arrayExp` {ArrayExpression} Default: `$$VALUE`
- Returns: {Array}

##### `$arrayJoin(separatorExp, arrayExp = $$VALUE)`

- `separatorExp` {StringExpression}
- `arrayExp` {ArrayExpression} Default: `$$VALUE`
- Returns: {string}

##### `$arrayAt(indexExp, arrayExp = $$VALUE)`

- `indexExp` {NumberExpression}
- `arrayExp` {ArrayExpression} Default: `$$VALUE`
- Returns: `value` {*}

##### `$arrayFormat(formatExp, arrayExp = $$VALUE)`

- `formatExp` {ArrayExpression}
- `arrayExp` {ArrayExpression} Default: `$$VALUE`
- Returns: {Array}


#### Boolean

##### `$boolean(valueExp)`

- `valueExp` {*}
- Returns: {boolean}


#### Comparison

##### `$eq(targetValueExp, valueExp)`

- `targetValueExp` {Expression} Value to be compared to.
- `valueExp` {Expression} Value being compared.
- Returns: {boolean}

##### `$notEq(targetValueExp, valueExp)`

- `targetValueExp` {Expression} Value to be compared to.
- `valueExp` {Expression} Value being compared.
- Returns: {boolean}

##### `$in(arrayExp, valueExp)`

Checks whether the value is in the given array.

- `arrayExp` {ArrayExpression}
- `valueExp` {Expression}
- Returns: {boolean}

##### `$notIn(arrayExp, valueExp)`

Checks whether the value is **not** in the given array.

- `arrayExp` {ArrayExpression}
- `valueExp` {Expression}
- Returns: {boolean}

##### `$gt(thresholdExp, valueExp)`

Greater than `value > threshold`

- `thresholdExp` {NumberExpression}
- `valueExp` {NumberExpression}
- Returns: {boolean}

##### `$gte(thresholdExp, valueExp)`

Greater than or equal `value >= threshold`

- `thresholdExp` {NumberExpression}
- `valueExp` {NumberExpression}
- Returns: {boolean}

##### `$lt(thresholdExp, valueExp)`

Lesser than `value < threshold`

- `thresholdExp` {NumberExpression}
- `valueExp` {NumberExpression}
- Returns: {boolean}

##### `$lte(criteriaExp, valueExp)`

Checks if the value matches the set of criteria.

- `criteriaExp` {PlainObjectExpression}
- `valueExp` {NumberExpression}
- Returns: {boolean}


#### Date

##### `$date(parseFmtArgsExp = 'ISO', serializeFmtArgsExp = 'ISO', dateExp = $$VALUE)`

- `parseFmtArgsExp` {LuxonFmtArgsExpression} Default: `'ISO'`
- `serializeFmtArgsExp` {LuxonFmtArgsExpression} Default: `'ISO'`
- `dateExp` {*} Default: `$$VALUE`
- Returns: `date` {string}

##### `$dateNow(serializeFmtArgsExp = 'ISO')`

- `serializeFmtArgsExp` {LuxonFmtArgsExpression} Default: `'ISO'`
- Returns: `date` {string}

##### `$dateIsValid()`

- `` {ISODateExpression}
- Returns: `isValid` {boolean}

##### `$dateStartOf(unitExp, dateExp = $$VALUE)`

- `unitExp` {StringExpression}
- `dateExp` {ISODateExpression} Default: `$$VALUE`
- Returns: `date` {ISODateString}

##### `$dateEndOf(unitExp, dateExp = $$VALUE)`

- `unitExp` {StringExpression}
- `dateExp` {ISODateExpression} Default: `$$VALUE`
- Returns: `date` {ISODateString}

##### `$dateSet(valuesExp, dateExp)`

- `valuesExp` {PlainObjectExpression}
- `dateExp` {ISODateExpression}
- Returns: `date` {ISODateString}

##### `$dateConfig(configExp, dateExp = $$VALUE)`

- `configExp` {PlainObjectExpression}
- `dateExp` {ISODateExpression} Default: `$$VALUE`
- Returns: `date` {ISODateString}

##### `$dateGt(referenceDateExp, dateExp = $$VALUE)`

- `referenceDateExp` {ISODateExpression}
- `dateExp` {ISODateExpression} Default: `$$VALUE`
- Returns: {boolean}

##### `$dateGte(referenceDateExp, dateExp = $$VALUE)`

- `referenceDateExp` {ISODateExpression}
- `dateExp` {ISODateExpression} Default: `$$VALUE`
- Returns: {boolean}

##### `$dateLt(referenceDateExp, dateExp = $$VALUE)`

- `referenceDateExp` {ISODateExpression}
- `dateExp` {ISODateExpression} Default: `$$VALUE`
- Returns: {boolean}

##### `$dateLte(referenceDateExp, dateExp = $$VALUE)`

- `referenceDateExp` {ISODateExpression}
- `dateExp` {ISODateExpression} Default: `$$VALUE`
- Returns: {boolean}

##### `$dateEq(referenceDateExp, dateExp = $$VALUE)`

- `referenceDateExp` {ISODateExpression}
- `dateExp` {ISODateExpression} Default: `$$VALUE`
- Returns: {boolean}

##### `$dateMoveForward(moveForwardExp, dateExp = $$VALUE)`

- `moveForwardExp` {PlainObjectExpression}
- `dateExp` {ISODateExpression} Default: `$$VALUE`
- Returns: `date` {ISODateString}

##### `$dateMoveBack(moveForwardExp, dateExp = $$VALUE)`

- `moveForwardExp` {PlainObjectExpression}
- `dateExp` {ISODateExpression} Default: `$$VALUE`
- Returns: `date` {ISODateString}


#### Functional

##### `$pipe(expressionsExp)`

- `expressionsExp` {ArrayExpression}
- Returns: `pipeResult` {*}


#### Logical

##### `$and(expressionsExp)`

- `expressionsExp` {ArrayExpression}
- Returns: {boolean}

##### `$or(expressionsExp)`

- `expressionsExp` {ArrayExpression}
- Returns: {boolean}

##### `$not(expressionsExp)`

- `expressionsExp` {ArrayExpression}
- Returns: {boolean}

##### `$nor(expressionsExp)`

- `expressionsExp` {ArrayExpression}
- Returns: {boolean}

##### `$xor(expressionA, expressionB)`

- `expressionA` {BooleanExpression}
- `expressionB` {BooleanExpression}
- Returns: {boolean}

##### `$if(conditionExp, thenExp, elseExp)`

- `conditionExp` {BooleanExpression}
- `thenExp` {Expression}
- `elseExp` {Expression}
- Returns: `result` {*}

##### `$switch(casesExp, defaultExp)`

- `casesExp` {ArrayExpression}
- `defaultExp` {Expression}
- Returns: `result` {*}

##### `$switchKey(casesExp, defaultExp, ValueExp)`

- `casesExp` {Cases[]}
- `casesExp[].0` {string} Case key
- `casesExp[].1` {*} Case value
- `defaultExp` {*}
- `ValueExp` {String}
- Returns: {*}


#### Math

##### `$mathSum(sum, base = $$VALUE)`

- `sum` {number}
- `base` {number} Default: `$$VALUE`
- Returns: `result` {number}

##### `$mathSub(subtract, base = $$VALUE)`

- `subtract` {number}
- `base` {number} Default: `$$VALUE`
- Returns: `result` {number}

##### `$mathMult(multiplier, base = $$VALUE)`

- `multiplier` {number}
- `base` {number} Default: `$$VALUE`
- Returns: `result` {number}

##### `$mathDiv(divisor, dividend)`

- `divisor` {number}
- `dividend` {number}
- Returns: `result` {number}

##### `$mathMod(divisor, dividend)`

- `divisor` {number}
- `dividend` {number}
- Returns: `result` {number}

##### `$mathPow(exponent, base = $$VALUE)`

- `exponent` {number}
- `base` {number} Default: `$$VALUE`
- Returns: `result` {number}

##### `$mathAbs(value = $$VALUE)`

- `value` {number} Default: `$$VALUE`
- Returns: `result` {number}

##### `$mathMax(otherValue, value = $$VALUE)`

- `otherValue` {number}
- `value` {number} Default: `$$VALUE`
- Returns: `result` {number}

##### `$mathMin(otherValue, value = $$VALUE)`

- `otherValue` {number}
- `value` {number} Default: `$$VALUE`
- Returns: `result` {number}

##### `$mathRound(value = $$VALUE)`

- `value` {number} Default: `$$VALUE`
- Returns: `result` {number}

##### `$mathFloor(value = $$VALUE)`

- `value` {number} Default: `$$VALUE`
- Returns: `result` {number}

##### `$mathCeil(value = $$VALUE)`

- `value` {number} Default: `$$VALUE`
- Returns: `result` {number}


#### Number

##### `$numberInt(radix, value)`

- `radix` {number}
- `value` {*}
- Returns: {number}

##### `$numberFloat(value)`

- `value` {*}
- Returns: {number}


#### Object

##### `$objectMatches(criteriaByPathExp, valueExp = $$VALUE)`

- `criteriaByPathExp` {Object}
- `valueExp` {Object} Default: `$$VALUE`
- Returns: `matches` {boolean}

##### `$objectFormat(formatExp, sourceExp = $$VALUE)`

- `formatExp` {Object}
- `sourceExp` {*} Default: `$$VALUE`
- Returns: `object` {Object}

##### `$objectDefaults(defaultValuesExp, baseExp = $$VALUE)`

- `defaultValuesExp` {Object}
- `baseExp` {Object} Default: `$$VALUE`
- Returns: {Object}

##### `$objectAssign(valuesExp, baseExp = $$VALUE)`

- `valuesExp` {Object}
- `baseExp` {Object} Default: `$$VALUE`
- Returns: {Object}


#### String

##### `$string(valueExp = $$VALUE)`

- `valueExp` {*} Default: `$$VALUE`
- Returns: {string}

##### `$stringStartsWith(query, strExp = $$VALUE)`

- `query` {string}
- `strExp` {string} Default: `$$VALUE`
- Returns: {boolean}

##### `$stringLength(strExp = $$VALUE)`

- `strExp` {string} Default: `$$VALUE`
- Returns: {number}

##### `$stringSubstr(startExp, endExp, strExp = $$VALUE)`

- `startExp` {number}
- `endExp` {number}
- `strExp` {string} Default: `$$VALUE`

##### `$stringConcat(concatExp, baseExp = $$VALUE)`

- `concatExp` {string}
- `baseExp` {string} Default: `$$VALUE`
- Returns: {string}

##### `$stringTrim(strExp = $$VALUE)`

- `strExp` {string} Default: `$$VALUE`
- Returns: {string}

##### `$stringPadStart(targetLengthExp, padStringExp, strExp = $$VALUE)`

- `targetLengthExp` {number}
- `padStringExp` {string}
- `strExp` {string} Default: `$$VALUE`
- Returns: {string}

##### `$stringPadEnd(targetLengthExp, padStringExp, strExp = $$VALUE)`

- `targetLengthExp` {number}
- `padStringExp` {string}
- `strExp` {string} Default: `$$VALUE`
- Returns: {string}

##### `$stringMatch(regExpExp, regExpOptionsExp, valueExp = $$VALUE)`

- `regExpExp` {string}
- `regExpOptionsExp` {string}
- `valueExp` {string} Default: `$$VALUE`
- Returns: {string[]}

##### `$stringTest(regExpExp, regExpOptionsExp, valueExp = $$VALUE)`

- `regExpExp` {string}
- `regExpOptionsExp` {string}
- `valueExp` {string} Default: `$$VALUE`
- Returns: {boolean}


#### Type

##### `$type(valueExp)`

- `valueExp` {*}
- Returns: `type` {string}


#### Value

##### `$value(pathExp, defaultExp)`

- `pathExp` {string}
- `defaultExp` {*}
- Returns: `value` {*}

##### `$literal(value)`

- `value` {*}
- Returns: {*}

##### `$evaluate(expExp, scopeExp)`

- `expExp` {Expression}
- `scopeExp` {Object | null}
- Returns: {*}
