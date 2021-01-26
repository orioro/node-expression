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


#### Functional


#### Logical


#### Math


#### Number


#### Object


#### String


#### Type


#### Value
