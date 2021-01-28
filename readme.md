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
  * [Array](#array)
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
  * [Boolean](#boolean)
        * [`$boolean(valueExp)`](#booleanvalueexp)
  * [Comparison](#comparison)
        * [`$eq(referenceExp, valueExp)`](#eqreferenceexp-valueexp)
        * [`$notEq(referenceExp, valueExp)`](#noteqreferenceexp-valueexp)
        * [`$in(arrayExp, valueExp)`](#inarrayexp-valueexp)
        * [`$notIn(arrayExp, valueExp)`](#notinarrayexp-valueexp)
        * [`$gt(referenceExp, valueExp)`](#gtreferenceexp-valueexp)
        * [`$gte(referenceExp, valueExp)`](#gtereferenceexp-valueexp)
        * [`$lt(referenceExp, valueExp)`](#ltreferenceexp-valueexp)
        * [`$lte(referenceExp, valueExp)`](#ltereferenceexp-valueexp)
        * [`$matches(criteriaExp, valueExp)`](#matchescriteriaexp-valueexp)
  * [Date](#date)
        * [`()`](#)
        * [`$date(parseFmtArgs, serializeFmtArgs, date)`](#dateparsefmtargs-serializefmtargs-date)
        * [`$dateNow(serializeFmtArgs)`](#datenowserializefmtargs)
        * [`$dateIsValid()`](#dateisvalid)
        * [`$dateStartOf(unitExp, date)`](#datestartofunitexp-date)
        * [`$dateEndOf(unitExp, date)`](#dateendofunitexp-date)
        * [`$dateSet(valuesExp, dateExp)`](#datesetvaluesexp-dateexp)
        * [`$dateConfig(configExp, date)`](#dateconfigconfigexp-date)
        * [`$dateGt(referenceDateExp, date)`](#dategtreferencedateexp-date)
        * [`$dateGte(referenceDateExp, date)`](#dategtereferencedateexp-date)
        * [`$dateLt(referenceDateExp, date)`](#dateltreferencedateexp-date)
        * [`$dateLte(referenceDateExp, date)`](#dateltereferencedateexp-date)
        * [`$dateEq(referenceDateExp, compareUnitExp, date)`](#dateeqreferencedateexp-compareunitexp-date)
        * [`$dateMoveForward(duration, date)`](#datemoveforwardduration-date)
        * [`$dateMoveBack(duration, date)`](#datemovebackduration-date)
  * [Functional](#functional)
        * [`$pipe(expressionsExp)`](#pipeexpressionsexp)
  * [Logical](#logical)
        * [`$and(expressionsExp)`](#andexpressionsexp)
        * [`$or(expressionsExp)`](#orexpressionsexp)
        * [`$not(expressionsExp)`](#notexpressionsexp)
        * [`$nor(expressionsExp)`](#norexpressionsexp)
        * [`$xor(expressionA, expressionB)`](#xorexpressiona-expressionb)
        * [`$if(conditionExp, thenExp, elseExp)`](#ifconditionexp-thenexp-elseexp)
        * [`$switch(casesExp, defaultExp)`](#switchcasesexp-defaultexp)
        * [`$switchKey(casesExp, defaultExp, ValueExp)`](#switchkeycasesexp-defaultexp-valueexp)
  * [Math](#math)
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
  * [Number](#number)
        * [`$numberInt(radix, value)`](#numberintradix-value)
        * [`$numberFloat(value)`](#numberfloatvalue)
  * [Object](#object)
        * [`$objectMatches(criteriaByPathExp, valueExp)`](#objectmatchescriteriabypathexp-valueexp)
        * [`$objectFormat(formatExp, sourceExp)`](#objectformatformatexp-sourceexp)
        * [`$objectDefaults(defaultValuesExp, baseExp)`](#objectdefaultsdefaultvaluesexp-baseexp)
        * [`$objectAssign(valuesExp, baseExp)`](#objectassignvaluesexp-baseexp)
  * [String](#string)
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
  * [Type](#type)
        * [`$type(valueExp)`](#typevalueexp)
  * [Value](#value)
        * [`$value(pathExp, defaultExp)`](#valuepathexp-defaultexp)
        * [`$literal(value)`](#literalvalue)
        * [`$evaluate(expExp, scopeExp)`](#evaluateexpexp-scopeexp)

## Array

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

## Boolean

##### `$boolean(valueExp)`

- `valueExp` {*}
- Returns: {boolean}

## Comparison

##### `$eq(referenceExp, valueExp)`

Checks if the two values

- `referenceExp` {*} Value to be compared to.
- `valueExp` {*} Value being compared.
- Returns: {boolean}

##### `$notEq(referenceExp, valueExp)`

- `referenceExp` {*} Value to be compared to.
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

##### `()`


##### `$date(parseFmtArgs, serializeFmtArgs, date)`

Parses a date from a given input format and serializes it into
another format. Use this expression to convert date formats into
your requirements. E.g. `UnixEpochMs` into `ISO`.

- `parseFmtArgs` {DateFormat} Arguments to be forwarded to
        Luxon corresponding DateTime parser. If a `string`,
        will be considered as the name of the format. If an `Array`, will be
        considered as a tuple consisting of [format, formatOptions].
        Recognized formats (exported as constants DATE_{FORMAT_IN_CONSTANT_CASE}):
        `ISO`, `ISODate`, `ISOWeekDate`, `ISOTime`, `RFC2822`, `HTTP`, `SQL`,
        `SQLTime`, `SQLTime`, `UnixEpochMs`, `UnixEpochS`, `JSDate`, `PlainObject`,
        `LuxonDateTime` Default: `'ISO'`
- `serializeFmtArgs` {DateFormat} Same as `parseFmtArgs`
        but will be used to format the resulting output Default: `'ISO'`
- `date` {string | number | Object | Date} Input type should be in accordance
        with the `parseFmtArgs`. Default: `$$VALUE`
- Returns: `date` {string | number | Object | Date} Output will vary according to `serializeFmtArgs`

##### `$dateNow(serializeFmtArgs)`

Generates a ISO date string from `Date.now`

- `serializeFmtArgs` {DateFormat} See `$date` Default: `'ISO'`
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

- `unitExp` {string} Unit to be used as basis for calculation:
                        `year`, `quarter`, `month`, `week`, `day`,
                        `hour`, `minute`, `second`, or `millisecond`.
- `date` {ISODateTimeString} Default: `$$VALUE`
- Returns: `date` {ISODateTimeString}

##### `$dateEndOf(unitExp, date)`

Returns the date at the end of the given `unit` (e.g. `day`, `month`).

- `unitExp` {string} Unit to be used as basis for calculation:
                        `year`, `quarter`, `month`, `week`, `day`,
                        `hour`, `minute`, `second`, or `millisecond`.
- `date` {ISODateTimeString} Default: `$$VALUE`
- Returns: `date` {ISODateTimeString}

##### `$dateSet(valuesExp, dateExp)`

Modifies date specific `units` and returns resulting date.
See https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html#instance-method-set
and https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html#static-method-fromObject

- `valuesExp` {Object}
- `valuesExp.year` {number}
- `valuesExp.month` {number}
- `valuesExp.day` {number}
- `valuesExp.ordinal` {number}
- `valuesExp.weekYear` {number}
- `valuesExp.weekNumber` {number}
- `valuesExp.weekday` {number}
- `valuesExp.hour` {number}
- `valuesExp.minute` {number}
- `valuesExp.second` {number}
- `valuesExp.millisecond` {number}
- `dateExp` {ISODateTimeString} Default: `$$VALUE`
- Returns: `date` {ISODateTimeString}

##### `$dateConfig(configExp, date)`

Modifies a configurations of the date.

- `configExp` {Object}
- `config.locale` {string}
- `config.zone` {string}
- `date` {ISODateTimeString} Default: `$$VALUE`
- Returns: `date` {ISODateTimeString}

##### `$dateGt(referenceDateExp, date)`

Greater than `date > reference`

- `referenceDateExp` {ISODateTimeString}
- `date` {ISODateTimeString} Default: `$$VALUE`
- Returns: {boolean}

##### `$dateGte(referenceDateExp, date)`

Greater than or equal `date >= reference`

- `referenceDateExp` {ISODateTimeString}
- `date` {ISODateTimeString} Default: `$$VALUE`
- Returns: {boolean}

##### `$dateLt(referenceDateExp, date)`

Lesser than `date < reference`

- `referenceDateExp` {ISODateTimeString}
- `date` {ISODateTimeString} Default: `$$VALUE`
- Returns: {boolean}

##### `$dateLte(referenceDateExp, date)`

Lesser than or equal `date <= reference`

- `referenceDateExp` {ISODateTimeString}
- `date` {ISODateTimeString} Default: `$$VALUE`
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
- `date` {ISODateTimeString} Default: `$$VALUE`
- Returns: {boolean}

##### `$dateMoveForward(duration, date)`

Modifies the date by moving it forward the duration specified.

- `duration` {Duration}
- `duration.years` {number}
- `duration.quarters` {number}
- `duration.months` {number}
- `duration.weeks` {number}
- `duration.days` {number}
- `duration.hours` {number}
- `duration.minutes` {number}
- `duration.seconds` {number}
- `duration.milliseconds` {number}
- `date` {ISODateTimeString} Default: `$$VALUE`
- Returns: `date` {ISODateTimeString}

##### `$dateMoveBack(duration, date)`

Modifies the date by moving it backward the duration specified.

- `duration` {Duration}
- `duration.years` {number}
- `duration.quarters` {number}
- `duration.months` {number}
- `duration.weeks` {number}
- `duration.days` {number}
- `duration.hours` {number}
- `duration.minutes` {number}
- `duration.seconds` {number}
- `duration.milliseconds` {number}
- `date` {ISODateTimeString} Default: `$$VALUE`
- Returns: `date` {ISODateTimeString}

## Functional

##### `$pipe(expressionsExp)`

- `expressionsExp` {ArrayExpression}
- Returns: `pipeResult` {*}

## Logical

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

## Math

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

## Number

##### `$numberInt(radix, value)`

- `radix` {number}
- `value` {*}
- Returns: {number}

##### `$numberFloat(value)`

- `value` {*}
- Returns: {number}

## Object

##### `$objectMatches(criteriaByPathExp, valueExp)`

- `criteriaByPathExp` {Object}
- `valueExp` {Object} Default: `$$VALUE`
- Returns: `matches` {boolean}

##### `$objectFormat(formatExp, sourceExp)`

- `formatExp` {Object | Array}
- `sourceExp` {*} Default: `$$VALUE`
- Returns: `object` {Object | Array}

##### `$objectDefaults(defaultValuesExp, baseExp)`

- `defaultValuesExp` {Object}
- `baseExp` {Object} Default: `$$VALUE`
- Returns: {Object}

##### `$objectAssign(valuesExp, baseExp)`

- `valuesExp` {Object}
- `baseExp` {Object} Default: `$$VALUE`
- Returns: {Object}

## String

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

## Type

##### `$type(valueExp)`

- `valueExp` {*}
- Returns: `type` {string}

## Value

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
