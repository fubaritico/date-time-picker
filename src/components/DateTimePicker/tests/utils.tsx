import { render } from '@testing-library/react'

import {
  addMonths,
  getLocaleAndTzTimeOffsets,
  getOffsetInMsFromTimezone,
  getTimeOffset,
} from '../../../utils'
import I18nDateLabel from '../../I18nDateLabel'
import DateRangePicker from '../DateRangePicker'

import Integration from './Picker.integration'

import type { AnyPickerComponent, AnyPickerProps, DateRange } from '../types'

export const dateSpanTestId = 'current-value'
export const localeAwareFormat: LocaleAwareFormat = 'L LT'

/**
 * Set up the DateTimePicker component for testing.
 *
 * @param {AnyPickerProps} props - The props to pass to the component.
 * @param {AnyPickerComponent} Component - The type of picker to be used in the test
 * @param {Number} pFixedDate - The fixed date to use for the tests. Here, 2025-03-15T15:28:13.000Z as a timestamp.
 *
 * @returns The localeTodayTimestamp, the timezone offset and the render function.
 */
export const setupUncontrolledPicker = (
  pFixedDate: number,
  Component: AnyPickerComponent,
  props?: AnyPickerProps
) => {
  const today = new Date(pFixedDate)
  const inOneMonthTime = new Date(addMonths(pFixedDate, 1))

  const offsets = [
    getLocaleAndTzTimeOffsets(today.getTime(), props?.timezone),
    getLocaleAndTzTimeOffsets(inOneMonthTime.getTime(), props?.timezone),
  ]

  const finalOffset = getTimeOffset(
    offsets[0].timezoneMsOffset,
    offsets[0].localeMsOffset
  )

  const oneMonthFinalOffset = getTimeOffset(
    offsets[1].timezoneMsOffset,
    offsets[1].localeMsOffset
  )

  const localeTodayTimestamp = today.getTime() + finalOffset
  const oneMonthTimestamp = inOneMonthTime.getTime() + oneMonthFinalOffset

  return {
    localeTodayTimestamp,
    oneMonthTimestamp,
    finalOffset,
    oneMonthFinalOffset,
    render: render(<Component {...props} />),
  }
}

/**
 * Set up the DateTimePicker component for testing.
 *
 * @param {AnyPickerComponent} Component - The type of picker to be used in the test
 * @param {Number} pFixedDate - The fixed date to use for the tests. Here 2025-03-15T15:28:13.000Z as a timestamp.
 * @param {CommonPickerProps} props - The props to pass to the component.
 * @param spyOnDateChangeFn
 *
 * @returns {Object} - The localeTodayTimestamp, the timezone offset and the render function.
 */
export const setupControlledDateTimePicker = (
  Component: AnyPickerComponent,
  pFixedDate: number,
  props?: AnyPickerProps,
  spyOnDateChangeFn = jest.fn()
) => {
  const today = new Date(pFixedDate)
  const { localeMsOffset, timezoneMsOffset } = getLocaleAndTzTimeOffsets(
    today.getTime(),
    props?.timezone
  )
  const finalOffset = getTimeOffset(timezoneMsOffset, localeMsOffset)
  const dateTimestamp = today.getTime() + finalOffset

  return {
    localeTodayTimestamp: dateTimestamp,
    finalOffset,
    render: render(
      <Integration {...props} spyOnDateChange={spyOnDateChangeFn}>
        {({ props, currentValue, setCurrentValue }) => (
          <>
            <Component
              {...props}
              date={currentValue as number | undefined}
              onChange={setCurrentValue}
            />
            {!!currentValue && (
              <span data-test={dateSpanTestId}>
                <I18nDateLabel
                  value={currentValue as number | undefined}
                  localeAwareFormat={localeAwareFormat}
                  locale={props.locale}
                  timezone={props.timezone}
                />
              </span>
            )}
          </>
        )}
      </Integration>
    ),
  }
}

/**
 * Set up the DateRangePicker component for testing.
 *
 * @param {Number} pFixedDate - The fixed date to use for the tests. Here 2025-03-15T15:28:13.000Z as a timestamp.
 * @param {AnyPickerProps} props - The props to pass to the component.
 * @param {jest.Mock} spyOnDateChangeFn - A mock function to spy on date changes.
 * @param {Number} daysBeforeToday -
 * @param {Number} daysAfterToday -
 *
 * @returns {Object} - The localeTodayTimestamp, the timezone offset and the render function.
 */
export const setupControlledDateRangePicker = (
  pFixedDate: number,
  props?: AnyPickerProps,
  spyOnDateChangeFn = jest.fn(),
  daysBeforeToday = 0,
  daysAfterToday = 20
) => {
  const oneDayInMs = 86400000
  const today = new Date(pFixedDate)
  const startDate = pFixedDate - daysBeforeToday * oneDayInMs
  const endDate = pFixedDate + daysAfterToday * oneDayInMs
  const { localeMsOffset, timezoneMsOffset } = getLocaleAndTzTimeOffsets(
    today.getTime(),
    props?.timezone
  )
  const finalOffset = getTimeOffset(timezoneMsOffset, localeMsOffset)
  const msOffsets = [
    getOffsetInMsFromTimezone(new Date(startDate), props?.timezone),
    getOffsetInMsFromTimezone(new Date(endDate), props?.timezone),
  ]

  const properties = {
    ...props,
    dateRange: [startDate, endDate],
  }

  return {
    localeTodayTimestamp: today.getTime() + finalOffset,
    finalOffset,
    msOffsets,
    startDate,
    endDate,
    render: render(
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      <Integration<'DATERANGE'>
        {...properties}
        spyOnDateChange={spyOnDateChangeFn}
      >
        {({ props, currentValue, setCurrentValue }) => {
          const range = currentValue as DateRange | undefined

          return (
            <>
              <DateRangePicker
                {...props}
                dateRange={range}
                onDateRangeChange={(v) => {
                  setCurrentValue(v as DateRange | undefined)
                }}
              />
              {!!currentValue && (
                <span data-test={dateSpanTestId}>
                  <I18nDateLabel
                    value={range?.[0]}
                    localeAwareFormat={localeAwareFormat}
                    locale={props.locale}
                    timezone={props.timezone}
                  />
                  <I18nDateLabel
                    value={range?.[1]}
                    localeAwareFormat={localeAwareFormat}
                    locale={props.locale}
                    timezone={props.timezone}
                  />
                </span>
              )}
            </>
          )
        }}
      </Integration>
    ),
  }
}
