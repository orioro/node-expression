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

# API

- [Array](#Array)
- [Boolean](#Boolean)
- [Comparison](#Comparison)
- [Date](#Date)
- [Functional](#Functional)
- [Logical](#Logical)
- [Math](#Math)
- [Number](#Number)
- [Object](#Object)
- [String](#String)
- [Type](#Type)
- [Value](#Value)

## Array

- [`$arrayIncludes(searchValueExp, arrayExp)`](#arrayincludessearchvalueexp-arrayexp)
- [`$arrayIncludesAll(searchValuesExp, arrayExp)`](#arrayincludesallsearchvaluesexp-arrayexp)
- [`$arrayIncludesAny(searchValueExp, arrayExp)`](#arrayincludesanysearchvalueexp-arrayexp)
- [`$arrayLength(arrayExp)`](#arraylengtharrayexp)
- [`$arrayReduce(reduceExp, startExp, arrayExp)`](#arrayreducereduceexp-startexp-arrayexp)
- [`$arrayMap(mapExp, arrayExp)`](#arraymapmapexp-arrayexp)
- [`$arrayFilter(queryExp, arrayExp)`](#arrayfilterqueryexp-arrayexp)
- [`$arrayIndexOf(queryExp, arrayExp)`](#arrayindexofqueryexp-arrayexp)
- [`$arrayFind(queryExp, arrayExp)`](#arrayfindqueryexp-arrayexp)
- [`$arrayReverse(arrayExp)`](#arrayreversearrayexp)
- [`$arraySort(sortExp, arrayExp)`](#arraysortsortexp-arrayexp)
- [`$arrayPush(arrayExp)`](#arraypusharrayexp)
- [`$arrayUnshift(valueExp, arrayExp)`](#arrayunshiftvalueexp-arrayexp)
- [`$arrayShift(arrayExp)`](#arrayshiftarrayexp)
- [`$arraySlice(startExp, endExp, arrayExp)`](#arrayslicestartexp-endexp-arrayexp)
- [`$arraySubstitute(startExp, endExp, valuesExp, arrayExp)`](#arraysubstitutestartexp-endexp-valuesexp-arrayexp)
- [`$arrayAddAt(indexExp, valuesExp, arrayExp)`](#arrayaddatindexexp-valuesexp-arrayexp)
- [`$arrayRemoveAt(indexExp, countExp, arrayExp)`](#arrayremoveatindexexp-countexp-arrayexp)
- [`$arrayJoin(separatorExp, arrayExp)`](#arrayjoinseparatorexp-arrayexp)
- [`$arrayAt(indexExp, arrayExp)`](#arrayatindexexp-arrayexp)


##### `$arrayIncludes(searchValueExp, arrayExp)`

Equivalent of `Array.prototype.includes`.

- `searchValueExp` {*}
- `arrayExp` {Array}
- Returns: `includes` {boolean} 

##### `$arrayIncludesAll(searchValuesExp, arrayExp)`

Similar to `$arrayIncludes`, but receives an array
of values to be searched for and returns whether the
context array contains all of the searched values.

- `searchValuesExp` {Array}
- `arrayExp` {Array}
- Returns: `includesAll` {boolean} 

##### `$arrayIncludesAny(searchValueExp, arrayExp)`

Similar to `$arrayIncludes`, but returns true if
any of the searched values is in the array.

- `searchValueExp` {Array}
- `arrayExp` {Array}
- Returns: `includesAny` {boolean} 

##### `$arrayLength(arrayExp)`

- `arrayExp` {Array}
- Returns: `length` {number} 

##### `$arrayReduce(reduceExp, startExp, arrayExp)`

- `reduceExp` {Expression}
- `startExp` {*}
- `arrayExp` {Array}

##### `$arrayMap(mapExp, arrayExp)`

- `mapExp` {Expression}
- `arrayExp` {Array}

##### `$arrayFilter(queryExp, arrayExp)`

- `queryExp` {BooleanExpression}
- `arrayExp` {Array}

##### `$arrayIndexOf(queryExp, arrayExp)`

- `queryExp` {BooleanExpression}
- `arrayExp` {Array}

##### `$arrayFind(queryExp, arrayExp)`

- `queryExp` {BooleanExpression}
- `arrayExp` {Array}

##### `$arrayReverse(arrayExp)`

- `arrayExp` {Array}

##### `$arraySort(sortExp, arrayExp)`

- `sortExp` {number}
- `arrayExp` {Array}

##### `$arrayPush(arrayExp)`

- `arrayExp` {Array}

##### `$arrayUnshift(valueExp, arrayExp)`

- `valueExp` {*}
- `arrayExp` {Array}

##### `$arrayShift(arrayExp)`

- `arrayExp` {Array}

##### `$arraySlice(startExp, endExp, arrayExp)`

- `startExp` {number}
- `endExp` {number}
- `arrayExp` {Array}
- Returns: {Array} 

##### `$arraySubstitute(startExp, endExp, valuesExp, arrayExp)`

- `startExp` {number}
- `endExp` {number}
- `valuesExp` {Array}
- `arrayExp` {Array}
- Returns: {Array} 

##### `$arrayAddAt(indexExp, valuesExp, arrayExp)`

Adds items at the given position.

- `indexExp` {number}
- `valuesExp` {Array}
- `arrayExp` {Array}
- Returns: `resultingArray` {Array} The array with items added at position

##### `$arrayRemoveAt(indexExp, countExp, arrayExp)`

- `indexExp` {number}
- `countExp` {number}
- `arrayExp` {Array}
- Returns: `resultingArray` {Array} The array without the removed item

##### `$arrayJoin(separatorExp, arrayExp)`

- `separatorExp` {StringExpression}
- `arrayExp` {Array}
- Returns: {string} 

##### `$arrayAt(indexExp, arrayExp)`

- `indexExp` {number}
- `arrayExp` {Array}
- Returns: `value` {*} 


## Boolean

- [`$boolean(valueExp)`](#booleanvalueexp)


##### `$boolean(valueExp)`

- `valueExp` {*}
- Returns: {boolean} 


## Comparison

- [`$eq(referenceExp, valueExp)`](#eqreferenceexp-valueexp)
- [`$notEq(referenceExp, valueExp)`](#noteqreferenceexp-valueexp)
- [`$in(arrayExp, valueExp)`](#inarrayexp-valueexp)
- [`$notIn(arrayExp, valueExp)`](#notinarrayexp-valueexp)
- [`$gt(referenceExp, valueExp)`](#gtreferenceexp-valueexp)
- [`$gte(referenceExp, valueExp)`](#gtereferenceexp-valueexp)
- [`$lt(referenceExp, valueExp)`](#ltreferenceexp-valueexp)
- [`$lte(referenceExp, valueExp)`](#ltereferenceexp-valueexp)
- [`$matches(criteriaExp, valueExp)`](#matchescriteriaexp-valueexp)


##### `$eq(referenceExp, valueExp)`

Checks if the two values

- `referenceExp` {*}
- `valueExp` {*}
- Returns: {boolean} 

##### `$notEq(referenceExp, valueExp)`

- `referenceExp` {*}
- `valueExp` {*}
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

##### `$gt(referenceExp, valueExp)`

Greater than `value > threshold`

- `referenceExp` {number}
- `valueExp` {number}
- Returns: {boolean} 

##### `$gte(referenceExp, valueExp)`

Greater than or equal `value >= threshold`

- `referenceExp` {number}
- `valueExp` {number}
- Returns: {boolean} 

##### `$lt(referenceExp, valueExp)`

Lesser than `value < threshold`

- `referenceExp` {number}
- `valueExp` {number}
- Returns: {boolean} 

##### `$lte(referenceExp, valueExp)`

Lesser than or equal `value <= threshold`

- `referenceExp` {number}
- `valueExp` {number}
- Returns: {boolean} 

##### `$matches(criteriaExp, valueExp)`

Checks if the value matches the set of criteria.

- `criteriaExp` {Object}
- `valueExp` {number}
- Returns: {boolean} 


## Date

Set of expressions aimed at solving common date-related operations: 
parse, format, compare, validate, manipulate (e.g. move forward, move back).
Most (if not all) operations are based on and built with [`Luxon`](https://github.com/moment/luxon/) `DateTime`. If not stated otherwise, date operations return a `string` in ISO 8601 format (`2021-01-27T20:38:12.807Z`).

- [`DateFormat`](#dateformat)
- [`$date(parseFmtArgs, serializeFmtArgs, date)`](#dateparsefmtargs-serializefmtargs-date)
- [`$dateNow(serializeFmtArgs)`](#datenowserializefmtargs)
- [`$dateIsValid()`](#dateisvalid)
- [`$dateStartOf(unitExp, date)`](#datestartofunitexp-date)
- [`$dateEndOf(unitExp, date)`](#dateendofunitexp-date)
- [`$dateSet(valuesExp, dateExp)`](#datesetvaluesexp-dateexp)
- [`$dateConfig(configExp, date)`](#dateconfigconfigexp-date)
- [`$dateGt(referenceDateExp, date)`](#dategtreferencedateexp-date)
- [`$dateGte(referenceDateExp, date)`](#dategtereferencedateexp-date)
- [`$dateLt(referenceDateExp, date)`](#dateltreferencedateexp-date)
- [`$dateLte(referenceDateExp, date)`](#dateltereferencedateexp-date)
- [`$dateEq(referenceDateExp, compareUnitExp, date)`](#dateeqreferencedateexp-compareunitexp-date)
- [`$dateMoveForward(duration, date)`](#datemoveforwardduration-date)
- [`$dateMoveBack(duration, date)`](#datemovebackduration-date)


##### `DateFormat`



##### `$date(parseFmtArgs, serializeFmtArgs, date)`

Parses a date from a given input format and serializes it into
another format. Use this expression to convert date formats into
your requirements. E.g. `UnixEpochMs` into `ISO`.

- `parseFmtArgs` {[DateFormat](#dateformat)}
- `serializeFmtArgs` {[DateFormat](#dateformat)}
- `date` {string | number | Object | Date}
- Returns: `date` {string | number | Object | Date} Output will vary according to `serializeFmtArgs`

##### `$dateNow(serializeFmtArgs)`

Generates a ISO date string from `Date.now`

- `serializeFmtArgs` {[DateFormat](#dateformat)}
- Returns: `date` {string | number | Object | Date} 

##### `$dateIsValid()`

Verifies whether the given date is valid.
From Luxon docs:
> The most common way to do that is to over- or underflow some unit:
> - February 40th
> - 28:00
> - 4 pm
> - etc
See https://github.com/moment/luxon/blob/master/docs/validity.md

- `` {ISODateTimeString}
- Returns: `isValid` {boolean} 

##### `$dateStartOf(unitExp, date)`

Returns the date at the start of the given `unit` (e.g. `day`, `month`).

- `unitExp` {string}
- `date` {ISODateTimeString}
- Returns: `date` {ISODateTimeString} 

##### `$dateEndOf(unitExp, date)`

Returns the date at the end of the given `unit` (e.g. `day`, `month`).

- `unitExp` {string}
- `date` {ISODateTimeString}
- Returns: `date` {ISODateTimeString} 

##### `$dateSet(valuesExp, dateExp)`

Modifies date specific `units` and returns resulting date.
See https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html#instance-method-set
and https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html#static-method-fromObject

- `valuesExp` {Object}
  - `year` {number}
  - `month` {number}
  - `day` {number}
  - `ordinal` {number}
  - `weekYear` {number}
  - `weekNumber` {number}
  - `weekday` {number}
  - `hour` {number}
  - `minute` {number}
  - `second` {number}
  - `millisecond` {number}
- `dateExp` {ISODateTimeString}
- Returns: `date` {ISODateTimeString} 

##### `$dateConfig(configExp, date)`

Modifies a configurations of the date.

- `configExp` {Object}
- `date` {ISODateTimeString}
- Returns: `date` {ISODateTimeString} 

##### `$dateGt(referenceDateExp, date)`

Greater than `date > reference`

- `referenceDateExp` {ISODateTimeString}
- `date` {ISODateTimeString}
- Returns: {boolean} 

##### `$dateGte(referenceDateExp, date)`

Greater than or equal `date >= reference`

- `referenceDateExp` {ISODateTimeString}
- `date` {ISODateTimeString}
- Returns: {boolean} 

##### `$dateLt(referenceDateExp, date)`

Lesser than `date < reference`

- `referenceDateExp` {ISODateTimeString}
- `date` {ISODateTimeString}
- Returns: {boolean} 

##### `$dateLte(referenceDateExp, date)`

Lesser than or equal `date <= reference`

- `referenceDateExp` {ISODateTimeString}
- `date` {ISODateTimeString}
- Returns: {boolean} 

##### `$dateEq(referenceDateExp, compareUnitExp, date)`

`date == reference`
Converts both `date` and `reference` and compares their
specified `compareUnit`. By default compares `millisecond` unit
so that checks whether are exactly the same millisecond in time,
but could be used to compare other units, such as whether two dates
are within the same `day`, `month` or `year`.

- `referenceDateExp` {ISODateTimeString}
- `compareUnitExp` {string}
- `date` {ISODateTimeString}
- Returns: {boolean} 

##### `$dateMoveForward(duration, date)`

Modifies the date by moving it forward the duration specified.

- `duration` {Duration}
  - `years` {number}
  - `quarters` {number}
  - `months` {number}
  - `weeks` {number}
  - `days` {number}
  - `hours` {number}
  - `minutes` {number}
  - `seconds` {number}
  - `milliseconds` {number}
- `date` {ISODateTimeString}
- Returns: `date` {ISODateTimeString} 

##### `$dateMoveBack(duration, date)`

Modifies the date by moving it backward the duration specified.

- `duration` {Duration}
  - `years` {number}
  - `quarters` {number}
  - `months` {number}
  - `weeks` {number}
  - `days` {number}
  - `hours` {number}
  - `minutes` {number}
  - `seconds` {number}
  - `milliseconds` {number}
- `date` {ISODateTimeString}
- Returns: `date` {ISODateTimeString} 


## Functional

- [`$pipe(expressionsExp)`](#pipeexpressionsexp)


##### `$pipe(expressionsExp)`

- `expressionsExp` {ArrayExpression}
- Returns: `pipeResult` {*} 


## Logical

- [`$and(expressionsExp)`](#andexpressionsexp)
- [`$or(expressionsExp)`](#orexpressionsexp)
- [`$not(expressionsExp)`](#notexpressionsexp)
- [`$nor(expressionsExp)`](#norexpressionsexp)
- [`$xor(expressionA, expressionB)`](#xorexpressiona-expressionb)
- [`$if(conditionExp, thenExp, elseExp)`](#ifconditionexp-thenexp-elseexp)
- [`$switch(casesExp, defaultExp)`](#switchcasesexp-defaultexp)
- [`$switchKey(casesExp, defaultExp, ValueExp)`](#switchkeycasesexp-defaultexp-valueexp)


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
  - `0` {string}
  - `1` {*}
- `defaultExp` {*}
- `ValueExp` {String}
- Returns: {*} 


## Math

- [`$mathSum(sum, base)`](#mathsumsum-base)
- [`$mathSub(subtract, base)`](#mathsubsubtract-base)
- [`$mathMult(multiplier, base)`](#mathmultmultiplier-base)
- [`$mathDiv(divisor, dividend)`](#mathdivdivisor-dividend)
- [`$mathMod(divisor, dividend)`](#mathmoddivisor-dividend)
- [`$mathPow(exponent, base)`](#mathpowexponent-base)
- [`$mathAbs(value)`](#mathabsvalue)
- [`$mathMax(otherValue, value)`](#mathmaxothervalue-value)
- [`$mathMin(otherValue, value)`](#mathminothervalue-value)
- [`$mathRound(value)`](#mathroundvalue)
- [`$mathFloor(value)`](#mathfloorvalue)
- [`$mathCeil(value)`](#mathceilvalue)


##### `$mathSum(sum, base)`

- `sum` {number}
- `base` {number}
- Returns: `result` {number} 

##### `$mathSub(subtract, base)`

- `subtract` {number}
- `base` {number}
- Returns: `result` {number} 

##### `$mathMult(multiplier, base)`

- `multiplier` {number}
- `base` {number}
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
- `base` {number}
- Returns: `result` {number} 

##### `$mathAbs(value)`

- `value` {number}
- Returns: `result` {number} 

##### `$mathMax(otherValue, value)`

- `otherValue` {number}
- `value` {number}
- Returns: `result` {number} 

##### `$mathMin(otherValue, value)`

- `otherValue` {number}
- `value` {number}
- Returns: `result` {number} 

##### `$mathRound(value)`

- `value` {number}
- Returns: `result` {number} 

##### `$mathFloor(value)`

- `value` {number}
- Returns: `result` {number} 

##### `$mathCeil(value)`

- `value` {number}
- Returns: `result` {number} 


## Number

- [`$numberInt(radix, value)`](#numberintradix-value)
- [`$numberFloat(value)`](#numberfloatvalue)


##### `$numberInt(radix, value)`

- `radix` {number}
- `value` {*}
- Returns: {number} 

##### `$numberFloat(value)`

- `value` {*}
- Returns: {number} 


## Object

- [`$objectMatches(criteriaByPathExp, valueExp)`](#objectmatchescriteriabypathexp-valueexp)
- [`$objectFormat(formatExp, sourceExp)`](#objectformatformatexp-sourceexp)
- [`$objectDefaults(defaultValuesExp, baseExp)`](#objectdefaultsdefaultvaluesexp-baseexp)
- [`$objectAssign(valuesExp, baseExp)`](#objectassignvaluesexp-baseexp)


##### `$objectMatches(criteriaByPathExp, valueExp)`

- `criteriaByPathExp` {Object}
- `valueExp` {Object}
- Returns: `matches` {boolean} 

##### `$objectFormat(formatExp, sourceExp)`

- `formatExp` {Object | Array}
- `sourceExp` {*}
- Returns: `object` {Object | Array} 

##### `$objectDefaults(defaultValuesExp, baseExp)`

- `defaultValuesExp` {Object}
- `baseExp` {Object}
- Returns: {Object} 

##### `$objectAssign(valuesExp, baseExp)`

- `valuesExp` {Object}
- `baseExp` {Object}
- Returns: {Object} 


## String

- [`$string(valueExp)`](#stringvalueexp)
- [`$stringStartsWith(query, strExp)`](#stringstartswithquery-strexp)
- [`$stringLength(strExp)`](#stringlengthstrexp)
- [`$stringSubstr(startExp, endExp, strExp)`](#stringsubstrstartexp-endexp-strexp)
- [`$stringConcat(concatExp, baseExp)`](#stringconcatconcatexp-baseexp)
- [`$stringTrim(strExp)`](#stringtrimstrexp)
- [`$stringPadStart(targetLengthExp, padStringExp, strExp)`](#stringpadstarttargetlengthexp-padstringexp-strexp)
- [`$stringPadEnd(targetLengthExp, padStringExp, strExp)`](#stringpadendtargetlengthexp-padstringexp-strexp)
- [`$stringMatch(regExpExp, regExpOptionsExp, valueExp)`](#stringmatchregexpexp-regexpoptionsexp-valueexp)
- [`$stringTest(regExpExp, regExpOptionsExp, valueExp)`](#stringtestregexpexp-regexpoptionsexp-valueexp)


##### `$string(valueExp)`

- `valueExp` {*}
- Returns: {string} 

##### `$stringStartsWith(query, strExp)`

- `query` {string}
- `strExp` {string}
- Returns: {boolean} 

##### `$stringLength(strExp)`

- `strExp` {string}
- Returns: {number} 

##### `$stringSubstr(startExp, endExp, strExp)`

- `startExp` {number}
- `endExp` {number}
- `strExp` {string}

##### `$stringConcat(concatExp, baseExp)`

- `concatExp` {string}
- `baseExp` {string}
- Returns: {string} 

##### `$stringTrim(strExp)`

- `strExp` {string}
- Returns: {string} 

##### `$stringPadStart(targetLengthExp, padStringExp, strExp)`

- `targetLengthExp` {number}
- `padStringExp` {string}
- `strExp` {string}
- Returns: {string} 

##### `$stringPadEnd(targetLengthExp, padStringExp, strExp)`

- `targetLengthExp` {number}
- `padStringExp` {string}
- `strExp` {string}
- Returns: {string} 

##### `$stringMatch(regExpExp, regExpOptionsExp, valueExp)`

- `regExpExp` {string}
- `regExpOptionsExp` {string}
- `valueExp` {string}
- Returns: {string[]} 

##### `$stringTest(regExpExp, regExpOptionsExp, valueExp)`

- `regExpExp` {string}
- `regExpOptionsExp` {string}
- `valueExp` {string}
- Returns: {boolean} 


## Type

- [`$type(valueExp)`](#typevalueexp)


##### `$type(valueExp)`

- `valueExp` {*}
- Returns: `type` {string} 


## Value

- [`$value(pathExp, defaultExp)`](#valuepathexp-defaultexp)
- [`$literal(value)`](#literalvalue)
- [`$evaluate(expExp, scopeExp)`](#evaluateexpexp-scopeexp)


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
