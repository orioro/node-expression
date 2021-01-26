# node-expression

```
npm install @orioro/expression
```

# Use cases

## Data querying

Main modules: `comparison` and `object`

```js
const person = {
  givenName: 'João',
  middleName: 'Cruz',
  familyName: 'Silva',
  age: 32,
  interests: ['sport', 'music', 'books'],
  mother: {
    givenName: 'Maria',
    familyName: 'Cruz',
    age: 57
  },
  father: {
    givenName: 'Pedro',
    familyName: 'Silva',
    age: 56
  }
}

const context = {
  interpreters,
  scope: { $$VALUE: person }
}

// Simple equality comparison
evaluate(context, ['$objectMatches', { givenName: 'João' }]) // true
evaluate(context, ['$objectMatches', { givenName: 'Maria' }]) // false

// Use dot (.) path notation to access nested properties
evaluate(context, ['$objectMatches', {
  'mother.age': { $gte: 20, $lte: 50 },
  'father.age': { $gte: 20, $lte: 50 }
}]) // false
```

## Tree structure formatting

```js
TODO
```

## Conditional evaluation
```js
TODO
// const context = {
//   interpreters,
//   scope: {
//     $$VALUE: {
//       name: 'João',
//       interests: ['music', 'sports']
//       age: 30
//     }
//   }
// }

// const cases = [
//   [['$objectMatches', {
//     interests: {
//       $arrayIncludes: 'music'
//     }
//   }]]
// ]

```

- [node-expression](#node-expression)
- [Use cases](#use-cases)
  * [Data querying](#data-querying)
  * [Tree structure formatting](#tree-structure-formatting)
  * [Conditional evaluation](#conditional-evaluation)
- [Array](#array)
  * [`$arrayIncludes(searchValueExp, arrayExp)`](#arrayincludessearchvalueexp-arrayexp)
  * [`$arrayIncludesAll(searchValuesExp, arrayExp)`](#arrayincludesallsearchvaluesexp-arrayexp)
  * [`$arrayIncludesAny(searchValueExp, arrayExp)`](#arrayincludesanysearchvalueexp-arrayexp)
  * [`$arrayLength(arrayExp)`](#arraylengtharrayexp)
  * [`$arrayReduce(reduceExp, startExp, arrayExp)`](#arrayreducereduceexp-startexp-arrayexp)
  * [`$arrayMap(mapExp, arrayExp)`](#arraymapmapexp-arrayexp)
  * [`$arrayFilter(queryExp, arrayExp)`](#arrayfilterqueryexp-arrayexp)
  * [`$arrayIndexOf(queryExp, arrayExp)`](#arrayindexofqueryexp-arrayexp)
  * [`$arrayFind(queryExp, arrayExp)`](#arrayfindqueryexp-arrayexp)
  * [`$arrayReverse(arrayExp)`](#arrayreversearrayexp)
  * [`$arraySort(sortExp, arrayExp)`](#arraysortsortexp-arrayexp)
  * [`$arrayPush(arrayExp)`](#arraypusharrayexp)
  * [`$arrayUnshift(valueExp, arrayExp)`](#arrayunshiftvalueexp-arrayexp)
  * [`$arrayShift(arrayExp)`](#arrayshiftarrayexp)
  * [`$arraySlice(startExp, endExp, arrayExp)`](#arrayslicestartexp-endexp-arrayexp)
  * [`$arraySubstitute(startExp, endExp, valuesExp, arrayExp)`](#arraysubstitutestartexp-endexp-valuesexp-arrayexp)
  * [`$arrayAddAt(indexExp, valuesExp, arrayExp)`](#arrayaddatindexexp-valuesexp-arrayexp)
  * [`$arrayRemoveAt(indexExp, countExp, arrayExp)`](#arrayremoveatindexexp-countexp-arrayexp)
  * [`$arrayJoin(separatorExp, arrayExp)`](#arrayjoinseparatorexp-arrayexp)
  * [`$arrayAt(indexExp, arrayExp)`](#arrayatindexexp-arrayexp)
  * [`$arrayFormat(formatExp, arrayExp)`](#arrayformatformatexp-arrayexp)
- [Boolean](#boolean)
  * [`$boolean(valueExp)`](#booleanvalueexp)
- [Comparison](#comparison)
  * [`$eq(targetValueExp, valueExp)`](#eqtargetvalueexp-valueexp)
  * [`$notEq(targetValueExp, valueExp)`](#noteqtargetvalueexp-valueexp)
  * [`$in(arrayExp, valueExp)`](#inarrayexp-valueexp)
  * [`$notIn(arrayExp, valueExp)`](#notinarrayexp-valueexp)
  * [`$gt(thresholdExp, valueExp)`](#gtthresholdexp-valueexp)
  * [`$gte(thresholdExp, valueExp)`](#gtethresholdexp-valueexp)
  * [`$lt(thresholdExp, valueExp)`](#ltthresholdexp-valueexp)
  * [`$lte(thresholdExp, valueExp)`](#ltethresholdexp-valueexp)
  * [`$matches(criteriaExp, valueExp)`](#matchescriteriaexp-valueexp)
- [Date](#date)
  * [`$date(parseFmtArgsExp, serializeFmtArgsExp, dateExp)`](#dateparsefmtargsexp-serializefmtargsexp-dateexp)
  * [`$dateNow(serializeFmtArgsExp)`](#datenowserializefmtargsexp)
  * [`$dateIsValid()`](#dateisvalid)
  * [`$dateStartOf(unitExp, dateExp)`](#datestartofunitexp-dateexp)
  * [`$dateEndOf(unitExp, dateExp)`](#dateendofunitexp-dateexp)
  * [`$dateSet(valuesExp, dateExp)`](#datesetvaluesexp-dateexp)
  * [`$dateConfig(configExp, dateExp)`](#dateconfigconfigexp-dateexp)
  * [`$dateGt(referenceDateExp, dateExp)`](#dategtreferencedateexp-dateexp)
  * [`$dateGte(referenceDateExp, dateExp)`](#dategtereferencedateexp-dateexp)
  * [`$dateLt(referenceDateExp, dateExp)`](#dateltreferencedateexp-dateexp)
  * [`$dateLte(referenceDateExp, dateExp)`](#dateltereferencedateexp-dateexp)
  * [`$dateEq(referenceDateExp, dateExp)`](#dateeqreferencedateexp-dateexp)
  * [`$dateMoveForward(moveForwardExp, dateExp)`](#datemoveforwardmoveforwardexp-dateexp)
  * [`$dateMoveBack(moveForwardExp, dateExp)`](#datemovebackmoveforwardexp-dateexp)
- [Functional](#functional)
  * [`$pipe(expressionsExp)`](#pipeexpressionsexp)
- [Logical](#logical)
  * [`$and(expressionsExp)`](#andexpressionsexp)
  * [`$or(expressionsExp)`](#orexpressionsexp)
  * [`$not(expressionsExp)`](#notexpressionsexp)
  * [`$nor(expressionsExp)`](#norexpressionsexp)
  * [`$xor(expressionA, expressionB)`](#xorexpressiona-expressionb)
  * [`$if(conditionExp, thenExp, elseExp)`](#ifconditionexp-thenexp-elseexp)
  * [`$switch(casesExp, defaultExp)`](#switchcasesexp-defaultexp)
  * [`$switchKey(casesExp, defaultExp, ValueExp)`](#switchkeycasesexp-defaultexp-valueexp)
- [Math](#math)
  * [`$mathSum(sum, base)`](#mathsumsum-base)
  * [`$mathSub(subtract, base)`](#mathsubsubtract-base)
  * [`$mathMult(multiplier, base)`](#mathmultmultiplier-base)
  * [`$mathDiv(divisor, dividend)`](#mathdivdivisor-dividend)
  * [`$mathMod(divisor, dividend)`](#mathmoddivisor-dividend)
  * [`$mathPow(exponent, base)`](#mathpowexponent-base)
  * [`$mathAbs(value)`](#mathabsvalue)
  * [`$mathMax(otherValue, value)`](#mathmaxothervalue-value)
  * [`$mathMin(otherValue, value)`](#mathminothervalue-value)
  * [`$mathRound(value)`](#mathroundvalue)
  * [`$mathFloor(value)`](#mathfloorvalue)
  * [`$mathCeil(value)`](#mathceilvalue)
- [Number](#number)
  * [`$numberInt(radix, value)`](#numberintradix-value)
  * [`$numberFloat(value)`](#numberfloatvalue)
- [Object](#object)
  * [`$objectMatches(criteriaByPathExp, valueExp)`](#objectmatchescriteriabypathexp-valueexp)
  * [`$objectFormat(formatExp, sourceExp)`](#objectformatformatexp-sourceexp)
  * [`$objectDefaults(defaultValuesExp, baseExp)`](#objectdefaultsdefaultvaluesexp-baseexp)
  * [`$objectAssign(valuesExp, baseExp)`](#objectassignvaluesexp-baseexp)
- [String](#string)
  * [`$string(valueExp)`](#stringvalueexp)
  * [`$stringStartsWith(query, strExp)`](#stringstartswithquery-strexp)
  * [`$stringLength(strExp)`](#stringlengthstrexp)
  * [`$stringSubstr(startExp, endExp, strExp)`](#stringsubstrstartexp-endexp-strexp)
  * [`$stringConcat(concatExp, baseExp)`](#stringconcatconcatexp-baseexp)
  * [`$stringTrim(strExp)`](#stringtrimstrexp)
  * [`$stringPadStart(targetLengthExp, padStringExp, strExp)`](#stringpadstarttargetlengthexp-padstringexp-strexp)
  * [`$stringPadEnd(targetLengthExp, padStringExp, strExp)`](#stringpadendtargetlengthexp-padstringexp-strexp)
  * [`$stringMatch(regExpExp, regExpOptionsExp, valueExp)`](#stringmatchregexpexp-regexpoptionsexp-valueexp)
  * [`$stringTest(regExpExp, regExpOptionsExp, valueExp)`](#stringtestregexpexp-regexpoptionsexp-valueexp)
- [Type](#type)
  * [`$type(valueExp)`](#typevalueexp)
- [Value](#value)
  * [`$value(pathExp, defaultExp)`](#valuepathexp-defaultexp)
  * [`$literal(value)`](#literalvalue)
  * [`$evaluate(expExp, scopeExp)`](#evaluateexpexp-scopeexp)

# Array

##### `$arrayIncludes(searchValueExp, arrayExp)`

Equivalent of `Array.prototype.includes`.

- `searchValueExp` {*}
- `arrayExp` {Array} Default: `$$VALUE`
- Returns: `includes` {boolean}

##### `$arrayIncludesAll(searchValuesExp, arrayExp)`

Similar to `$arrayIncludes`, but receives an array
of values to be searched for and returns whether the
context array contains all of the searched values.

- `searchValuesExp` {Array}
- `arrayExp` {Array} Default: `$$VALUE`
- Returns: `includesAll` {boolean}

##### `$arrayIncludesAny(searchValueExp, arrayExp)`

Similar to `$arrayIncludes`, but returns true if
any of the searched values is in the array.

- `searchValueExp` {Array}
- `arrayExp` {Array} Default: `$$VALUE`
- Returns: `includesAny` {boolean}

##### `$arrayLength(arrayExp)`

- `arrayExp` {Array} Default: `$$VALUE`
- Returns: `length` {number}

##### `$arrayReduce(reduceExp, startExp, arrayExp)`

- `reduceExp` {Expression} An expression that returns the
                              result of reduction. Has access to:
                              `$$PARENT_SCOPE`, `$$VALUE`, `$$INDEX`,
                              `$$ARRAY`, `$$ACC`
- `startExp` {*}
- `arrayExp` {Array} Default: `$$VALUE`

##### `$arrayMap(mapExp, arrayExp)`

- `mapExp` {Expression} Expression to be evaluated for each
                           item and which return value will be
                           available in the resulting array. Has
                           access to: `$$PARENT_SCOPE`, `$$VALUE`,
                           `$$INDEX`, `$$ARRAY`, `$$ACC`
- `arrayExp` {Array} Default: `$$VALUE`

##### `$arrayFilter(queryExp, arrayExp)`

- `queryExp` {BooleanExpression}
- `arrayExp` {Array} Default: `$$VALUE`

##### `$arrayIndexOf(queryExp, arrayExp)`

- `queryExp` {BooleanExpression}
- `arrayExp` {Array} Default: `$$VALUE`

##### `$arrayFind(queryExp, arrayExp)`

- `queryExp` {BooleanExpression}
- `arrayExp` {Array} Default: `$$VALUE`

##### `$arrayReverse(arrayExp)`

- `arrayExp` {Array} Default: `$$VALUE`

##### `$arraySort(sortExp, arrayExp)`

- `sortExp` {number}
- `arrayExp` {Array} Default: `$$VALUE`

##### `$arrayPush(arrayExp)`

- `arrayExp` {Array} Default: `$$VALUE`

##### `$arrayUnshift(valueExp, arrayExp)`

- `valueExp` {*}
- `arrayExp` {Array} Default: `$$VALUE`

##### `$arrayShift(arrayExp)`

- `arrayExp` {Array} Default: `$$VALUE`

##### `$arraySlice(startExp, endExp, arrayExp)`

- `startExp` {number}
- `endExp` {number}
- `arrayExp` {Array} Default: `$$VALUE`
- Returns: {Array}

##### `$arraySubstitute(startExp, endExp, valuesExp, arrayExp)`

- `startExp` {number}
- `endExp` {number}
- `valuesExp` {Array}
- `arrayExp` {Array} Default: `$$VALUE`
- Returns: {Array}

##### `$arrayAddAt(indexExp, valuesExp, arrayExp)`

Adds items at the given position.

- `indexExp` {number}
- `valuesExp` {Array}
- `arrayExp` {Array} Default: `$$VALUE`
- Returns: `resultingArray` {Array} The array with items added at position

##### `$arrayRemoveAt(indexExp, countExp, arrayExp)`

- `indexExp` {number}
- `countExp` {number} Default: `1`
- `arrayExp` {Array} Default: `$$VALUE`
- Returns: `resultingArray` {Array} The array without the removed item

##### `$arrayJoin(separatorExp, arrayExp)`

- `separatorExp` {StringExpression}
- `arrayExp` {Array} Default: `$$VALUE`
- Returns: {string}

##### `$arrayAt(indexExp, arrayExp)`

- `indexExp` {number}
- `arrayExp` {Array} Default: `$$VALUE`
- Returns: `value` {*}

##### `$arrayFormat(formatExp, arrayExp)`

- `formatExp` {Array}
- `arrayExp` {Array} Default: `$$VALUE`
- Returns: {Array}


# Boolean

##### `$boolean(valueExp)`

- `valueExp` {*}
- Returns: {boolean}


# Comparison

##### `$eq(targetValueExp, valueExp)`

Checks if the two values

- `targetValueExp` {*} Value to be compared to.
- `valueExp` {*} Value being compared.
- Returns: {boolean}

##### `$notEq(targetValueExp, valueExp)`

- `targetValueExp` {*} Value to be compared to.
- `valueExp` {*} Value being compared.
- Returns: {boolean}

##### `$in(arrayExp, valueExp)`

Checks whether the value is in the given array.

- `arrayExp` {Array}
- `valueExp` {*}
- Returns: {boolean}

##### `$notIn(arrayExp, valueExp)`

Checks whether the value is **not** in the given array.

- `arrayExp` {Array}
- `valueExp` {*}
- Returns: {boolean}

##### `$gt(thresholdExp, valueExp)`

Greater than `value > threshold`

- `thresholdExp` {number}
- `valueExp` {number}
- Returns: {boolean}

##### `$gte(thresholdExp, valueExp)`

Greater than or equal `value >= threshold`

- `thresholdExp` {number}
- `valueExp` {number}
- Returns: {boolean}

##### `$lt(thresholdExp, valueExp)`

Lesser than `value < threshold`

- `thresholdExp` {number}
- `valueExp` {number}
- Returns: {boolean}

##### `$lte(thresholdExp, valueExp)`

Lesser than or equal `value <= threshold`

- `thresholdExp` {number}
- `valueExp` {number}
- Returns: {boolean}

##### `$matches(criteriaExp, valueExp)`

Checks if the value matches the set of criteria.

- `criteriaExp` {Object}
- `valueExp` {number}
- Returns: {boolean}


# Date

##### `$date(parseFmtArgsExp, serializeFmtArgsExp, dateExp)`

- `parseFmtArgsExp` {LuxonFmtArgsExpression} Default: `'ISO'`
- `serializeFmtArgsExp` {LuxonFmtArgsExpression} Default: `'ISO'`
- `dateExp` {*} Default: `$$VALUE`
- Returns: `date` {string}

##### `$dateNow(serializeFmtArgsExp)`

- `serializeFmtArgsExp` {LuxonFmtArgsExpression} Default: `'ISO'`
- Returns: `date` {string}

##### `$dateIsValid()`

- `` {ISODateExpression}
- Returns: `isValid` {boolean}

##### `$dateStartOf(unitExp, dateExp)`

- `unitExp` {StringExpression}
- `dateExp` {ISODateExpression} Default: `$$VALUE`
- Returns: `date` {ISODateString}

##### `$dateEndOf(unitExp, dateExp)`

- `unitExp` {StringExpression}
- `dateExp` {ISODateExpression} Default: `$$VALUE`
- Returns: `date` {ISODateString}

##### `$dateSet(valuesExp, dateExp)`

- `valuesExp` {PlainObjectExpression}
- `dateExp` {ISODateExpression}
- Returns: `date` {ISODateString}

##### `$dateConfig(configExp, dateExp)`

- `configExp` {PlainObjectExpression}
- `dateExp` {ISODateExpression} Default: `$$VALUE`
- Returns: `date` {ISODateString}

##### `$dateGt(referenceDateExp, dateExp)`

- `referenceDateExp` {ISODateExpression}
- `dateExp` {ISODateExpression} Default: `$$VALUE`
- Returns: {boolean}

##### `$dateGte(referenceDateExp, dateExp)`

- `referenceDateExp` {ISODateExpression}
- `dateExp` {ISODateExpression} Default: `$$VALUE`
- Returns: {boolean}

##### `$dateLt(referenceDateExp, dateExp)`

- `referenceDateExp` {ISODateExpression}
- `dateExp` {ISODateExpression} Default: `$$VALUE`
- Returns: {boolean}

##### `$dateLte(referenceDateExp, dateExp)`

- `referenceDateExp` {ISODateExpression}
- `dateExp` {ISODateExpression} Default: `$$VALUE`
- Returns: {boolean}

##### `$dateEq(referenceDateExp, dateExp)`

- `referenceDateExp` {ISODateExpression}
- `dateExp` {ISODateExpression} Default: `$$VALUE`
- Returns: {boolean}

##### `$dateMoveForward(moveForwardExp, dateExp)`

- `moveForwardExp` {PlainObjectExpression}
- `dateExp` {ISODateExpression} Default: `$$VALUE`
- Returns: `date` {ISODateString}

##### `$dateMoveBack(moveForwardExp, dateExp)`

- `moveForwardExp` {PlainObjectExpression}
- `dateExp` {ISODateExpression} Default: `$$VALUE`
- Returns: `date` {ISODateString}


# Functional

##### `$pipe(expressionsExp)`

- `expressionsExp` {ArrayExpression}
- Returns: `pipeResult` {*}


# Logical

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


# Math

##### `$mathSum(sum, base)`

- `sum` {number}
- `base` {number} Default: `$$VALUE`
- Returns: `result` {number}

##### `$mathSub(subtract, base)`

- `subtract` {number}
- `base` {number} Default: `$$VALUE`
- Returns: `result` {number}

##### `$mathMult(multiplier, base)`

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

##### `$mathPow(exponent, base)`

- `exponent` {number}
- `base` {number} Default: `$$VALUE`
- Returns: `result` {number}

##### `$mathAbs(value)`

- `value` {number} Default: `$$VALUE`
- Returns: `result` {number}

##### `$mathMax(otherValue, value)`

- `otherValue` {number}
- `value` {number} Default: `$$VALUE`
- Returns: `result` {number}

##### `$mathMin(otherValue, value)`

- `otherValue` {number}
- `value` {number} Default: `$$VALUE`
- Returns: `result` {number}

##### `$mathRound(value)`

- `value` {number} Default: `$$VALUE`
- Returns: `result` {number}

##### `$mathFloor(value)`

- `value` {number} Default: `$$VALUE`
- Returns: `result` {number}

##### `$mathCeil(value)`

- `value` {number} Default: `$$VALUE`
- Returns: `result` {number}


# Number

##### `$numberInt(radix, value)`

- `radix` {number}
- `value` {*}
- Returns: {number}

##### `$numberFloat(value)`

- `value` {*}
- Returns: {number}


# Object

##### `$objectMatches(criteriaByPathExp, valueExp)`

- `criteriaByPathExp` {Object}
- `valueExp` {Object} Default: `$$VALUE`
- Returns: `matches` {boolean}

##### `$objectFormat(formatExp, sourceExp)`

- `formatExp` {Object}
- `sourceExp` {*} Default: `$$VALUE`
- Returns: `object` {Object}

##### `$objectDefaults(defaultValuesExp, baseExp)`

- `defaultValuesExp` {Object}
- `baseExp` {Object} Default: `$$VALUE`
- Returns: {Object}

##### `$objectAssign(valuesExp, baseExp)`

- `valuesExp` {Object}
- `baseExp` {Object} Default: `$$VALUE`
- Returns: {Object}


# String

##### `$string(valueExp)`

- `valueExp` {*} Default: `$$VALUE`
- Returns: {string}

##### `$stringStartsWith(query, strExp)`

- `query` {string}
- `strExp` {string} Default: `$$VALUE`
- Returns: {boolean}

##### `$stringLength(strExp)`

- `strExp` {string} Default: `$$VALUE`
- Returns: {number}

##### `$stringSubstr(startExp, endExp, strExp)`

- `startExp` {number}
- `endExp` {number}
- `strExp` {string} Default: `$$VALUE`

##### `$stringConcat(concatExp, baseExp)`

- `concatExp` {string}
- `baseExp` {string} Default: `$$VALUE`
- Returns: {string}

##### `$stringTrim(strExp)`

- `strExp` {string} Default: `$$VALUE`
- Returns: {string}

##### `$stringPadStart(targetLengthExp, padStringExp, strExp)`

- `targetLengthExp` {number}
- `padStringExp` {string}
- `strExp` {string} Default: `$$VALUE`
- Returns: {string}

##### `$stringPadEnd(targetLengthExp, padStringExp, strExp)`

- `targetLengthExp` {number}
- `padStringExp` {string}
- `strExp` {string} Default: `$$VALUE`
- Returns: {string}

##### `$stringMatch(regExpExp, regExpOptionsExp, valueExp)`

- `regExpExp` {string}
- `regExpOptionsExp` {string}
- `valueExp` {string} Default: `$$VALUE`
- Returns: {string[]}

##### `$stringTest(regExpExp, regExpOptionsExp, valueExp)`

- `regExpExp` {string}
- `regExpOptionsExp` {string}
- `valueExp` {string} Default: `$$VALUE`
- Returns: {boolean}


# Type

##### `$type(valueExp)`

- `valueExp` {*}
- Returns: `type` {string}


# Value

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
