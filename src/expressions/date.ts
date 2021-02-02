import { isPlainObject } from 'lodash'
import { DateTime } from 'luxon'

import {
  AnyExpression,
  EvaluationContext,
  StringExpression,
  PlainObjectExpression,
  ISODate,
  ISODateExpression
} from '../types'

import {
  evaluate,
  evaluateString,
  evaluatePlainObject
} from '../expression'

import { $$VALUE } from './value'

export const DATE_ISO = 'ISO'
export const DATE_ISO_DATE = 'ISODate'
export const DATE_ISO_WEEK_DATE = 'ISOWeekDate'
export const DATE_ISO_TIME = 'ISOTime'
export const DATE_RFC2822 = 'RFC2822'
export const DATE_HTTP = 'HTTP'
export const DATE_SQL = 'SQL'
export const DATE_SQL_DATE = 'SQLTime'
export const DATE_SQL_TIME = 'SQLTime'
export const DATE_UNIX_EPOCH_MS = 'UnixEpochMs'
export const DATE_UNIX_EPOCH_S = 'UnixEpochS'
export const DATE_JS_DATE = 'JSDate'
export const DATE_PLAIN_OBJECT = 'PlainObject'
export const DATE_LUXON_DATE_TIME = 'LuxonDateTime'

const parseLuxonDate = (value, format = 'ISO', options?) => {
  if (value instanceof DateTime || format === DATE_LUXON_DATE_TIME) {
    return value
  } else {
    switch (format) {
      case DATE_ISO:
      case DATE_ISO_DATE:
      case DATE_ISO_WEEK_DATE:
      case DATE_ISO_TIME:
        return DateTime.fromISO(value, options)
      case DATE_RFC2822:
        return DateTime.fromRFC2822(value, options)
      case DATE_HTTP:
        return DateTime.fromHTTP(value, options)
      case DATE_SQL:
      case DATE_SQL_DATE:
      case DATE_SQL_TIME:
        return DateTime.fromSQL(value, options)
      case DATE_UNIX_EPOCH_MS:
        return DateTime.fromMillis(value, options)
      case DATE_UNIX_EPOCH_S:
        return DateTime.fromSeconds(value, options)
      case DATE_JS_DATE:
        return DateTime.fromJSDate(value, options)
      case DATE_PLAIN_OBJECT:
        return DateTime.fromObject(value, options)
      default:
        return DateTime.fromFormat(value, format, options)
    }
  }
}

const serializeLuxonDate = (value, format = 'ISO', options?) => {
  switch (format) {
    case DATE_LUXON_DATE_TIME:
      return value
    case DATE_ISO:
      return value.toISO(options)
    case DATE_ISO_DATE:
      return value.toISODate(options)
    case DATE_ISO_WEEK_DATE:
      return value.toISOWeekDate(options)
    case DATE_ISO_TIME:
      return value.toISOTime(options)
    case DATE_RFC2822:
      return value.toRFC2822(options)
    case DATE_HTTP:
      return value.toHTTP(options)
    case DATE_SQL:
      return value.toSQL(options)
    case DATE_SQL_DATE:
      return value.toSQLDate(options)
    case DATE_SQL_TIME:
      return value.toSQLTime(options)
    case DATE_UNIX_EPOCH_MS:
      return value.toMillis(options)
    case DATE_UNIX_EPOCH_S:
      return value.toSeconds(options)
    case DATE_JS_DATE:
      return value.toJSDate(options)
    case DATE_PLAIN_OBJECT:
      return value.toObject(options)
    default:
      return value.toFormat(format, options)
  }
}

const _luxonFmtArgs = args => (
  Array.isArray(args)
    ? args
    : [args, undefined]
)

/**
 * Arguments to be forwarded to Luxon corresponding DateTime parser.
 * If a `string`, will be considered as the name of the format.
 * If an `Array`, will be considered as a tuple consisting of
 * [format, formatOptions].
 * Recognized formats (exported as constants `DATE_{FORMAT_IN_CONSTANT_CASE}`):
 * - `ISO`
 * - `ISODate`
 * - `ISOWeekDate`
 * - `ISOTime`
 * - `RFC2822`
 * - `HTTP`
 * - `SQL`
 * - `SQLTime`
 * - `SQLTime`
 * - `UnixEpochMs`
 * - `UnixEpochS`
 * - `JSDate`
 * - `PlainObject`
 * - `LuxonDateTime`
 * 
 * @typedef {string|[string, Object]} DateFormat
 */
type DateFormatExpression = StringExpression | [StringExpression, PlainObjectExpression]

/**
 * String in the full ISO 8601 format:
 * `2017-04-20T11:32:00.000-04:00`
 * 
 * @typedef {string} ISODate
 */

/**
 * Duration represented in an object format:
 *
 * @typedef {Object} Duration
 * @property {Object} duration
 * @property {number} duration.years
 * @property {number} duration.quarters
 * @property {number} duration.months
 * @property {number} duration.weeks
 * @property {number} duration.days
 * @property {number} duration.hours
 * @property {number} duration.minutes
 * @property {number} duration.seconds
 * @property {number} duration.milliseconds
 */

/**
 * Parses a date from a given input format and serializes it into
 * another format. Use this expression to convert date formats into
 * your requirements. E.g. `UnixEpochMs` into `ISO`.
 * 
 * @function $date
 * @param {DateFormat} [parseFmtArgs='ISO']
 * @param {DateFormat} [serializeFmtArgs='ISO'] Same as `parseFmtArgs`
 *         but will be used to format the resulting output
 * @param {string | number | Object | Date} [date=$$VALUE] Input type should be in accordance
 *         with the `parseFmtArgs`.
 * @returns {string | number | Object | Date} date Output will vary according to `serializeFmtArgs`
 */
export const $date = (
  context:EvaluationContext,
  parseFmtArgsExp:DateFormatExpression = 'ISO',
  serializeFmtArgsExp:DateFormatExpression = 'ISO',
  dateExp:AnyExpression = $$VALUE
):any => {
  const parseFmtArgs = _luxonFmtArgs(evaluate(context, parseFmtArgsExp))
  const serializeFmtArgs = _luxonFmtArgs(evaluate(context, serializeFmtArgsExp))
  const value = evaluate(context, dateExp)

  return serializeLuxonDate(
    parseLuxonDate(
      value,
      ...parseFmtArgs
    ),
    ...serializeFmtArgs
  )
}

/**
 * Generates a ISO date string from `Date.now`
 * 
 * @function $dateNow
 * @param {DateFormat} [serializeFmtArgs='ISO']
 * @returns {string | number | Object | Date} date
 */
export const $dateNow = (
  context:EvaluationContext,
  serializeFmtArgsExp:DateFormatExpression = 'ISO',
):any => (
  serializeLuxonDate(
    DateTime.fromMillis(Date.now()),
    ..._luxonFmtArgs(serializeFmtArgsExp)
  )
)

/**
 * Verifies whether the given date is valid.
 * From Luxon docs:
 * > The most common way to do that is to over- or underflow some unit:
 * > - February 40th
 * > - 28:00
 * > - 4 pm
 * > - etc
 * See https://github.com/moment/luxon/blob/master/docs/validity.md
 * 
 * @function $dateIsValid
 * @param {ISODate}
 * @returns {boolean} isValid
 */
export const $dateIsValid = (
  context:EvaluationContext,
  dateExp:ISODateExpression = $$VALUE
):boolean => DateTime.fromISO(evaluateString(context, dateExp)).isValid

/**
 * Returns the date at the start of the given `unit` (e.g. `day`, `month`).
 * 
 * @function $dateStartOf
 * @param {string} unitExp Unit to be used as basis for calculation:
 *                         `year`, `quarter`, `month`, `week`, `day`,
 *                         `hour`, `minute`, `second`, or `millisecond`.
 * @param {ISODate} [date=$$VALUE]
 * @returns {ISODate} date
 */
export const $dateStartOf = (
  context:EvaluationContext,
  unitExp:StringExpression,
  dateExp:ISODateExpression = $$VALUE
):ISODate => (
  DateTime.fromISO(evaluateString(context, dateExp))
    .startOf(evaluateString(context, unitExp))
    .toISO()
)

/**
 * Returns the date at the end of the given `unit` (e.g. `day`, `month`).
 * 
 * @function $dateEndOf
 * @param {string} unitExp Unit to be used as basis for calculation:
 *                         `year`, `quarter`, `month`, `week`, `day`,
 *                         `hour`, `minute`, `second`, or `millisecond`.
 * @param {ISODate} [date=$$VALUE]
 * @returns {ISODate} date
 */
export const $dateEndOf = (
  context:EvaluationContext,
  unitExp:StringExpression,
  dateExp:ISODateExpression = $$VALUE
):ISODate => (
  DateTime.fromISO(evaluateString(context, dateExp))
    .endOf(evaluateString(context, unitExp))
    .toISO()
)

/**
 * Modifies date specific `units` and returns resulting date.
 * See [`DateTime#set`](https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html#instance-method-set)
 * and [`DateTime.fromObject`](https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html#static-method-fromObject)
 * 
 * @function $dateSet
 * @param {Object} valuesExp
 * @param {number} valuesExp.year
 * @param {number} valuesExp.month
 * @param {number} valuesExp.day
 * @param {number} valuesExp.ordinal
 * @param {number} valuesExp.weekYear
 * @param {number} valuesExp.weekNumber
 * @param {number} valuesExp.weekday
 * @param {number} valuesExp.hour
 * @param {number} valuesExp.minute
 * @param {number} valuesExp.second
 * @param {number} valuesExp.millisecond
 * @param {ISODate} [dateExp=$$VALUE]
 * @returns {ISODate} date
 */
export const $dateSet = (
  context:EvaluationContext,
  valuesExp:PlainObjectExpression,
  dateExp:ISODateExpression = $$VALUE
):ISODate => (
  DateTime.fromISO(evaluateString(context, dateExp))
    .set(evaluatePlainObject(context, valuesExp))
    .toISO()
)

const _luxonConfigDate = (dt, config, value) => {
  switch (config) {
    case 'locale':
      return dt.setLocale(value)
    case 'zone':
      return dt.setZone(value)
    default:
      throw new Error(`Unknown DateTime config ${config}`)
  }
}

/**
 * Modifies a configurations of the date.
 * 
 * @function $$dateSetConfig
 * @param {Object} configExp
 * @param {string} config.locale
 * @param {string} config.zone
 * @param {ISODate} [date=$$VALUE]
 * @returns {ISODate} date
 */
export const $$dateSetConfig = (
  context:EvaluationContext,
  configExp:PlainObjectExpression,
  dateExp:ISODateExpression = $$VALUE
):ISODate => {
  const date = DateTime.fromISO(evaluateString(context, dateExp))
  const config = evaluatePlainObject(context, configExp)

  return Object.keys(config).reduce(
    (dt, key) => _luxonConfigDate(dt, key, config[key]),
    date
  )
  .toISO()
}

const _dateComparison = compare => (
  context:EvaluationContext,
  referenceDateExp:ISODateExpression,
  dateExp:ISODateExpression = $$VALUE
):boolean => compare(
  DateTime.fromISO(evaluateString(context, referenceDateExp)),
  DateTime.fromISO(evaluateString(context, dateExp))
)

/**
 * Greater than `date > reference`
 * 
 * @function $dateGt
 * @param {ISODate} referenceDateExp
 * @param {ISODate} [date=$$VALUE]
 * @returns {boolean}
 */
export const $dateGt = _dateComparison((reference, date) => date > reference)

/**
 * Greater than or equal `date >= reference`
 * 
 * @function $dateGte
 * @param {ISODate} referenceDateExp
 * @param {ISODate} [date=$$VALUE]
 * @returns {boolean}
 */
export const $dateGte = _dateComparison((reference, date) => date >= reference)

/**
 * Lesser than `date < reference`
 * 
 * @function $dateLt
 * @param {ISODate} referenceDateExp
 * @param {ISODate} [date=$$VALUE]
 * @returns {boolean}
 */
export const $dateLt = _dateComparison((reference, date) => date < reference)

/**
 * Lesser than or equal `date <= reference`
 * 
 * @function $dateLte
 * @param {ISODate} referenceDateExp
 * @param {ISODate} [date=$$VALUE]
 * @returns {boolean}
 */
export const $dateLte = _dateComparison((reference, date) => date <= reference)

/**
 * `date == reference`
 * Converts both `date` and `reference` and compares their
 * specified `compareUnit`. By default compares `millisecond` unit
 * so that checks whether are exactly the same millisecond in time,
 * but could be used to compare other units, such as whether two dates
 * are within the same `day`, `month` or `year`.
 * 
 * @function $dateEq
 * @param {ISODate} referenceDateExp
 * @param {string} compareUnitExp
 * @param {ISODate} [date=$$VALUE]
 * @returns {boolean}
 */
export const $dateEq = (
  context:EvaluationContext,
  referenceDateExp:ISODateExpression,
  compareUnitExp:StringExpression = 'millisecond',
  dateExp:ISODateExpression = $$VALUE
):boolean => (
  DateTime.fromISO(evaluateString(context, referenceDateExp))
    .hasSame(
      DateTime.fromISO(evaluateString(context, dateExp)),
      evaluateString(context, compareUnitExp)
    )
)

/**
 * Modifies the date by moving it forward the duration specified.
 * 
 * @function $dateMoveForward
 * @param {Duration} duration
 * @param {ISODate} [date=$$VALUE]
 * @returns {ISODate} date
 */
export const $dateMoveForward = (
  context:EvaluationContext,
  durationExp:PlainObjectExpression,
  dateExp:ISODateExpression = $$VALUE
):ISODate => {
  const date = DateTime.fromISO(evaluateString(context, dateExp))
  const moveForward = evaluatePlainObject(context, durationExp)

  return date.plus(moveForward).toISO()
}

/**
 * Modifies the date by moving it backward the duration specified.
 *
 * @function $dateMoveBackward
 * @param {Duration} duration
 * @param {ISODate} [date=$$VALUE]
 * @returns {ISODate} date
 */
export const $dateMoveBackward = (
  context:EvaluationContext,
  durationExp:PlainObjectExpression,
  dateExp:ISODateExpression = $$VALUE
):ISODate => {
  const date = DateTime.fromISO(evaluateString(context, dateExp))
  const moveBack = evaluatePlainObject(context, durationExp)

  return date.minus(moveBack).toISO()
}

export const DATE_EXPRESSIONS = {
  $date,
  $dateNow,
  $dateIsValid,
  $dateStartOf,
  $dateEndOf,
  $dateSet,
  $$dateSetConfig,
  $dateGt,
  $dateGte,
  $dateLt,
  $dateLte,
  $dateEq,
  $dateMoveForward,
  $dateMoveBackward,
}
