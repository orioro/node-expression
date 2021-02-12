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

- [`$arrayIncludes(searchValue, array)`](#arrayincludessearchvalue-array)
- [`$arrayIncludesAll(searchValues, array)`](#arrayincludesallsearchvalues-array)
- [`$arrayIncludesAny(searchValue, array)`](#arrayincludesanysearchvalue-array)
- [`$arrayLength(array)`](#arraylengtharray)
- [`$arrayReduce(reduceExp, start, array)`](#arrayreducereduceexp-start-array)
- [`$arrayMap(mapExp, array)`](#arraymapmapexp-array)
- [`$arrayEvery(everyExp, array)`](#arrayeveryeveryexp-array)
- [`$arraySome(someExp, array)`](#arraysomesomeexp-array)
- [`$arrayFilter(queryExp, array)`](#arrayfilterqueryexp-array)
- [`$arrayFindIndex(queryExp, array)`](#arrayfindindexqueryexp-array)
- [`$arrayIndexOf(value, array)`](#arrayindexofvalue-array)
- [`$arrayFind(queryExp, array)`](#arrayfindqueryexp-array)
- [`$arrayReverse(array)`](#arrayreversearray)
- [`$arraySort(sortExp, array)`](#arraysortsortexp-array)
- [`$arrayPush(valueExp, array)`](#arraypushvalueexp-array)
- [`$arrayPop(array)`](#arraypoparray)
- [`$arrayUnshift(valueExp, array)`](#arrayunshiftvalueexp-array)
- [`$arrayShift(array)`](#arrayshiftarray)
- [`$arraySlice(start, end, array)`](#arrayslicestart-end-array)
- [`$arraySubstitute(start, end, values, array)`](#arraysubstitutestart-end-values-array)
- [`$arrayAddAt(index, values, array)`](#arrayaddatindex-values-array)
- [`$arrayRemoveAt(index, countExp, array)`](#arrayremoveatindex-countexp-array)
- [`$arrayJoin(separator, array)`](#arrayjoinseparator-array)
- [`$arrayAt(index, array)`](#arrayatindex-array)


##### `$arrayIncludes(searchValue, array)`

Equivalent of `Array.prototype.includes`.

- `searchValue` {*}
- `array` {Array}
- Returns: `includes` {boolean} 

##### `$arrayIncludesAll(searchValues, array)`

Similar to `$arrayIncludes`, but receives an array
of values to be searched for and returns whether the
context array contains all of the searched values.

- `searchValues` {Array}
- `array` {Array}
- Returns: `includesAll` {boolean} 

##### `$arrayIncludesAny(searchValue, array)`

Similar to `$arrayIncludes`, but returns true if
any of the searched values is in the array.

- `searchValue` {Array}
- `array` {Array}
- Returns: `includesAny` {boolean} 

##### `$arrayLength(array)`

- `array` {Array}
- Returns: `length` {number} 

##### `$arrayReduce(reduceExp, start, array)`

- `reduceExp` {[Expression](#expression)}
- `start` {*}
- `array` {Array}

##### `$arrayMap(mapExp, array)`

- `mapExp` {[Expression](#expression)}
- `array` {Array}

##### `$arrayEvery(everyExp, array)`

`Array.prototype.every`

Result is similar to logical operator `$and`. Main difference
(and reason for existence as isolate expression) is that
$arrayEvery exposes array iteration variables:
`$$PARENT_SCOPE`, `$$VALUE`, `$$INDEX`, `$$ARRAY`

- `everyExp` {[Expression](#expression)}
- `array` {Array}

##### `$arraySome(someExp, array)`

`Array.prototype.some`

- `someExp` {[Expression](#expression)}
- `array` {Array}

##### `$arrayFilter(queryExp, array)`

- `queryExp` {Boolean[Expression](#expression)}
- `array` {Array}

##### `$arrayFindIndex(queryExp, array)`

- `queryExp` {Boolean[Expression](#expression)}
- `array` {Array}

##### `$arrayIndexOf(value, array)`

- `value` {*}
- `array` {Array}

##### `$arrayFind(queryExp, array)`

- `queryExp` {Boolean[Expression](#expression)}
- `array` {Array}

##### `$arrayReverse(array)`

- `array` {Array}

##### `$arraySort(sortExp, array)`

- `sortExp` {number}
- `array` {Array}

##### `$arrayPush(valueExp, array)`

- `valueExp` {*}
- `array` {Array}

##### `$arrayPop(array)`

- `array` {Array}

##### `$arrayUnshift(valueExp, array)`

- `valueExp` {*}
- `array` {Array}

##### `$arrayShift(array)`

- `array` {Array}

##### `$arraySlice(start, end, array)`

- `start` {number}
- `end` {number}
- `array` {Array}
- Returns: {Array} 

##### `$arraySubstitute(start, end, values, array)`

- `start` {number}
- `end` {number}
- `values` {Array}
- `array` {Array}
- Returns: {Array} 

##### `$arrayAddAt(index, values, array)`

Adds items at the given position.

- `index` {number}
- `values` {Array}
- `array` {Array}
- Returns: `resultingArray` {Array} The array with items added at position

##### `$arrayRemoveAt(index, countExp, array)`

- `index` {number}
- `countExp` {number}
- `array` {Array}
- Returns: `resultingArray` {Array} The array without the removed item

##### `$arrayJoin(separator, array)`

- `separator` {String}
- `array` {Array}
- Returns: {string} 

##### `$arrayAt(index, array)`

- `index` {number}
- `array` {Array}
- Returns: `value` {*} 


## Boolean

- [`$boolean(value)`](#booleanvalue)


##### `$boolean(value)`

- `value` {*}
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
- [`ISODate`](#isodate)
- [`Duration`](#duration)
- [`$date(parseFmtArgs, serializeFmtArgs, date)`](#dateparsefmtargs-serializefmtargs-date)
- [`$dateNow(serializeFmtArgs)`](#datenowserializefmtargs)
- [`$dateIsValid()`](#dateisvalid)
- [`$dateStartOf(unitExp, date)`](#datestartofunitexp-date)
- [`$dateEndOf(unitExp, date)`](#dateendofunitexp-date)
- [`$dateSet(valuesExp, dateExp)`](#datesetvaluesexp-dateexp)
- [`$dateSetConfig(configExp, date)`](#datesetconfigconfigexp-date)
- [`$dateGt(referenceDateExp, date)`](#dategtreferencedateexp-date)
- [`$dateGte(referenceDateExp, date)`](#dategtereferencedateexp-date)
- [`$dateLt(referenceDateExp, date)`](#dateltreferencedateexp-date)
- [`$dateLte(referenceDateExp, date)`](#dateltereferencedateexp-date)
- [`$dateEq(referenceDateExp, compareUnitExp, date)`](#dateeqreferencedateexp-compareunitexp-date)
- [`$dateMoveForward(duration, date)`](#datemoveforwardduration-date)
- [`$dateMoveBackward(duration, date)`](#datemovebackwardduration-date)


##### `DateFormat`

Arguments to be forwarded to Luxon corresponding DateTime parser.
If a `string`, will be considered as the name of the format.
If an `Array`, will be considered as a tuple consisting of
[format, formatOptions].
Recognized formats (exported as constants `DATE_{FORMAT_IN_CONSTANT_CASE}`):
- `ISO`
- `ISODate`
- `ISOWeekDate`
- `ISOTime`
- `RFC2822`
- `HTTP`
- `SQL`
- `SQLTime`
- `SQLTime`
- `UnixEpochMs`
- `UnixEpochS`
- `JSDate`
- `PlainObject`
- `LuxonDateTime`



##### `ISODate`

String in the full ISO 8601 format:
`2017-04-20T11:32:00.000-04:00`



##### `Duration`

Duration represented in an object format:

- `duration` {Object}
  - `years` {number}
  - `quarters` {number}
  - `months` {number}
  - `weeks` {number}
  - `days` {number}
  - `hours` {number}
  - `minutes` {number}
  - `seconds` {number}
  - `milliseconds` {number}

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

- `` {*}
- Returns: `isValid` {boolean} 

##### `$dateStartOf(unitExp, date)`

Returns the date at the start of the given `unit` (e.g. `day`, `month`).

- `unitExp` {string}
- `date` {[[ISODate](#isodate)](#isodate)}
- Returns: `date` {[[ISODate](#isodate)](#isodate)} 

##### `$dateEndOf(unitExp, date)`

Returns the date at the end of the given `unit` (e.g. `day`, `month`).

- `unitExp` {string}
- `date` {[[ISODate](#isodate)](#isodate)}
- Returns: `date` {[[ISODate](#isodate)](#isodate)} 

##### `$dateSet(valuesExp, dateExp)`

Modifies date specific `units` and returns resulting date.
See [`DateTime#set`](https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html#instance-method-set)
and [`DateTime.fromObject`](https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html#static-method-fromObject)

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
- `dateExp` {[[ISODate](#isodate)](#isodate)}
- Returns: `date` {[[ISODate](#isodate)](#isodate)} 

##### `$dateSetConfig(configExp, date)`

Modifies a configurations of the date.

- `configExp` {Object}
- `date` {[[ISODate](#isodate)](#isodate)}
- Returns: `date` {[[ISODate](#isodate)](#isodate)} 

##### `$dateGt(referenceDateExp, date)`

Greater than `date > reference`

- `referenceDateExp` {[[ISODate](#isodate)](#isodate)}
- `date` {[[ISODate](#isodate)](#isodate)}
- Returns: {boolean} 

##### `$dateGte(referenceDateExp, date)`

Greater than or equal `date >= reference`

- `referenceDateExp` {[[ISODate](#isodate)](#isodate)}
- `date` {[[ISODate](#isodate)](#isodate)}
- Returns: {boolean} 

##### `$dateLt(referenceDateExp, date)`

Lesser than `date < reference`

- `referenceDateExp` {[[ISODate](#isodate)](#isodate)}
- `date` {[[ISODate](#isodate)](#isodate)}
- Returns: {boolean} 

##### `$dateLte(referenceDateExp, date)`

Lesser than or equal `date <= reference`

- `referenceDateExp` {[[ISODate](#isodate)](#isodate)}
- `date` {[[ISODate](#isodate)](#isodate)}
- Returns: {boolean} 

##### `$dateEq(referenceDateExp, compareUnitExp, date)`

`date == reference`
Converts both `date` and `reference` and compares their
specified `compareUnit`. By default compares `millisecond` unit
so that checks whether are exactly the same millisecond in time,
but could be used to compare other units, such as whether two dates
are within the same `day`, `month` or `year`.

- `referenceDateExp` {[[ISODate](#isodate)](#isodate)}
- `compareUnitExp` {string}
- `date` {[[ISODate](#isodate)](#isodate)}
- Returns: {boolean} 

##### `$dateMoveForward(duration, date)`

Modifies the date by moving it forward the duration specified.

- `duration` {[Duration](#duration)}
- `date` {[[ISODate](#isodate)](#isodate)}
- Returns: `date` {[[ISODate](#isodate)](#isodate)} 

##### `$dateMoveBackward(duration, date)`

Modifies the date by moving it backward the duration specified.

- `duration` {[Duration](#duration)}
- `date` {[[ISODate](#isodate)](#isodate)}
- Returns: `date` {[[ISODate](#isodate)](#isodate)} 


## Functional

- [`$pipe(expressions)`](#pipeexpressions)


##### `$pipe(expressions)`

- `expressions` {[Expression](#expression)[]}
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

- `expressionsExp` {Array[Expression](#expression)}
- Returns: {boolean} 

##### `$or(expressionsExp)`

- `expressionsExp` {Array[Expression](#expression)}
- Returns: {boolean} 

##### `$not(expressionsExp)`

- `expressionsExp` {Array[Expression](#expression)}
- Returns: {boolean} 

##### `$nor(expressionsExp)`

- `expressionsExp` {Array[Expression](#expression)}
- Returns: {boolean} 

##### `$xor(expressionA, expressionB)`

- `expressionA` {Boolean[Expression](#expression)}
- `expressionB` {Boolean[Expression](#expression)}
- Returns: {boolean} 

##### `$if(conditionExp, thenExp, elseExp)`

- `conditionExp` {Boolean[Expression](#expression)}
- `thenExp` {[Expression](#expression)}
- `elseExp` {[Expression](#expression)}
- Returns: `result` {*} 

##### `$switch(casesExp, defaultExp)`

- `casesExp` {Array[Expression](#expression)}
- `defaultExp` {[Expression](#expression)}
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

- [`$objectMatches(criteriaByPath, value)`](#objectmatchescriteriabypath-value)
- [`$objectFormat(format, source)`](#objectformatformat-source)
- [`$objectDefaults(defaultValuesExp, base)`](#objectdefaultsdefaultvaluesexp-base)
- [`$objectAssign(values, base)`](#objectassignvalues-base)


##### `$objectMatches(criteriaByPath, value)`

- `criteriaByPath` {Object}
- `value` {Object}
- Returns: `matches` {boolean} 

##### `$objectFormat(format, source)`

- `format` {Object | Array}
- `source` {*}
- Returns: `object` {Object | Array} 

##### `$objectDefaults(defaultValuesExp, base)`

- `defaultValuesExp` {Object}
- `base` {Object}
- Returns: {Object} 

##### `$objectAssign(values, base)`

- `values` {Object}
- `base` {Object}
- Returns: {Object} 


## String

- [`$string(value)`](#stringvalue)
- [`$stringStartsWith(query, strExp)`](#stringstartswithquery-strexp)
- [`$stringLength(strExp)`](#stringlengthstrexp)
- [`$stringSubstr(startExp, endExp, strExp)`](#stringsubstrstartexp-endexp-strexp)
- [`$stringConcat(concatExp, baseExp)`](#stringconcatconcatexp-baseexp)
- [`$stringTrim(strExp)`](#stringtrimstrexp)
- [`$stringPadStart(targetLengthExp, padStringExp, strExp)`](#stringpadstarttargetlengthexp-padstringexp-strexp)
- [`$stringPadEnd(targetLengthExp, padStringExp, strExp)`](#stringpadendtargetlengthexp-padstringexp-strexp)
- [`$stringMatch(regExpExp, valueExp)`](#stringmatchregexpexp-valueexp)
- [`$stringTest(regExpExp, valueExp)`](#stringtestregexpexp-valueexp)
- [`$stringReplace(searchExp, replacementExp)`](#stringreplacesearchexp-replacementexp)
- [`$stringToUpperCase(valueExp)`](#stringtouppercasevalueexp)
- [`$stringToLowerCase(valueExp)`](#stringtolowercasevalueexp)
- [`$stringInterpolate(data, template)`](#stringinterpolatedata-template)


##### `$string(value)`

- `value` {*}
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

##### `$stringMatch(regExpExp, valueExp)`

- `regExpExp` {string}
- `valueExp` {string}
- Returns: {string[]} 

##### `$stringTest(regExpExp, valueExp)`

- `regExpExp` {string}
- `valueExp` {string}
- Returns: {boolean} 

##### `$stringReplace(searchExp, replacementExp)`

- `searchExp` {string | [string, string?]}
- `replacementExp` {string | String[Expression](#expression)}
- Returns: {string} 

##### `$stringToUpperCase(valueExp)`

- `valueExp` {string}
- Returns: {string} 

##### `$stringToLowerCase(valueExp)`

- `valueExp` {string}
- Returns: {string} 

##### `$stringInterpolate(data, template)`

- `data` {object | array}
- `template` {string}


## Type

- [`$type(valueExp)`](#typevalueexp)


##### `$type(valueExp)`

- `valueExp` {*}
- Returns: `type` {string} Possible values:
  - string
  - regexp
  - number
  - bigint
  - nan
  - null
  - undefined
  - boolean
  - function
  - object
  - array
  - date
  - symbol
  - map
  - set
  - weakmap
  - weakset


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

- `expExp` {[Expression](#expression)}
- `scopeExp` {Object | null}
- Returns: {*}
