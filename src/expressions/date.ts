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

type LuxonFmtArgsExpression = StringExpression | [StringExpression, PlainObjectExpression]

/**
 * @name $date
 * @param {LuxonFmtArgsExpression} [parseFmtArgsExp='ISO']
 * @param {LuxonFmtArgsExpression} [serializeFmtArgsExp='ISO']
 * @param {*} [dateExp=$$VALUE]
 * @return {string} date
 */
export const $date = (
  context:EvaluationContext,
  parseFmtArgsExp:LuxonFmtArgsExpression = 'ISO',
  serializeFmtArgsExp:LuxonFmtArgsExpression = 'ISO',
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
 * @name $dateNow
 * @param {LuxonFmtArgsExpression} [serializeFmtArgsExp='ISO']
 * @return {string} date
 */
export const $dateNow = (
  context:EvaluationContext,
  serializeFmtArgsExp:LuxonFmtArgsExpression = 'ISO',
):any => (
  serializeLuxonDate(
    DateTime.fromMillis(Date.now()),
    ..._luxonFmtArgs(serializeFmtArgsExp)
  )
)

/**
 * @name $dateIsValid
 * @param {ISODateExpression}
 * @return {boolean} isValid
 */
export const $dateIsValid = (
  context:EvaluationContext,
  dateExp:ISODateExpression = $$VALUE
):boolean => DateTime.fromISO(evaluateString(context, dateExp)).isValid

/**
 * @name $dateStartOf
 * @param {StringExpression} unitExp
 * @param {ISODateExpression} [dateExp=$$VALUE]
 * @return {ISODateString} date
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
 * @name $dateEndOf
 * @param {StringExpression} unitExp
 * @param {ISODateExpression} [dateExp=$$VALUE]
 * @return {ISODateString} date
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
 * @name $dateSet
 * @param {PlainObjectExpression} valuesExp
 * @param {ISODateExpression} dateExp
 * @return {ISODateString} date
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
 * @name $dateConfig
 * @param {PlainObjectExpression} configExp
 * @param {ISODateExpression} [dateExp=$$VALUE]
 * @return {ISODateString} date
 */
export const $dateConfig = (
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
 * @name $dateGt
 * @param {ISODateExpression} referenceDateExp
 * @param {ISODateExpression} [dateExp=$$VALUE]
 * @return {boolean}
 */
export const $dateGt = _dateComparison((threshold, date) => date > threshold)

/**
 * @name $dateGte
 * @param {ISODateExpression} referenceDateExp
 * @param {ISODateExpression} [dateExp=$$VALUE]
 * @return {boolean}
 */
export const $dateGte = _dateComparison((threshold, date) => date >= threshold)

/**
 * @name $dateLt
 * @param {ISODateExpression} referenceDateExp
 * @param {ISODateExpression} [dateExp=$$VALUE]
 * @return {boolean}
 */
export const $dateLt = _dateComparison((threshold, date) => date < threshold)

/**
 * @name $dateLte
 * @param {ISODateExpression} referenceDateExp
 * @param {ISODateExpression} [dateExp=$$VALUE]
 * @return {boolean}
 */
export const $dateLte = _dateComparison((threshold, date) => date <= threshold)

/**
 * @name $dateEq
 * @param {ISODateExpression} referenceDateExp
 * @param {ISODateExpression} [dateExp=$$VALUE]
 * @return {boolean}
 */
export const $dateEq = (
  context:EvaluationContext,
  referenceDateExp:ISODateExpression,
  compareExp:StringExpression = 'millisecond',
  dateExp:ISODateExpression = $$VALUE
):boolean => (
  DateTime.fromISO(evaluateString(context, referenceDateExp))
    .hasSame(
      DateTime.fromISO(evaluateString(context, dateExp)),
      evaluateString(context, compareExp)
    )
)

/**
 * @name $dateMoveForward
 * @param {PlainObjectExpression} moveForwardExp
 * @param {ISODateExpression} [dateExp=$$VALUE]
 * @return {ISODateString} date
 */
export const $dateMoveForward = (
  context:EvaluationContext,
  moveForwardExp:PlainObjectExpression,
  dateExp:ISODateExpression = $$VALUE
):ISODate => {
  const date = DateTime.fromISO(evaluateString(context, dateExp))
  const moveForward = evaluatePlainObject(context, moveForwardExp)

  return date.plus(moveForward).toISO()
}

/**
 * @name $dateMoveBack
 * @param {PlainObjectExpression} moveForwardExp
 * @param {ISODateExpression} [dateExp=$$VALUE]
 * @return {ISODateString} date
 */
export const $dateMoveBack = (
  context:EvaluationContext,
  moveBackExp:PlainObjectExpression,
  dateExp:ISODateExpression = $$VALUE
):ISODate => {
  const date = DateTime.fromISO(evaluateString(context, dateExp))
  const moveBack = evaluatePlainObject(context, moveBackExp)

  return date.minus(moveBack).toISO()
}

export const DATE_EXPRESSIONS = {
  $date,
  $dateNow,
  $dateIsValid,
  $dateStartOf,
  $dateEndOf,
  $dateSet,
  $dateConfig,
  $dateGt,
  $dateGte,
  $dateLt,
  $dateLte,
  $dateEq,
  $dateMoveForward,
  $dateMoveBack,
}
