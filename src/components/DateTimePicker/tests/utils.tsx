import { render } from '@testing-library/react'

import { getOffsetInMsFromTimezone } from '../../../utils'
import I18nDateLabel from '../../I18nDateLabel'

import Integration from './Picker.integration'

import type { AnyPickerComponent, AnyPickerProps } from '../types'

export const dateSpanTestId = 'current-value'
export const localeAwareFormat: LocaleAwareFormat = 'L LT'

/**
 * Set up the DateTimePicker component for testing.
 *
 * @param {AnyPickerProps} props - The props to pass to the component.
 * @param {AnyPickerComponent} Component - The type of picker to be used in the test
 * @param {Number} pFixedDate - The fixed date to use for the tests. Here, 2025-03-15T15:28:13.000Z as a timestamp.
 *
 * @returns The todayTimestamp, the msOffset and the render function.
 */
export const setupUncontrolledPicker = (
  pFixedDate: number,
  Component: AnyPickerComponent,
  props?: AnyPickerProps
) => {
  const today = new Date(pFixedDate)
  const msOffset = getOffsetInMsFromTimezone(today, props?.timezone)
  const todayTimestamp = today.getTime() + msOffset

  return {
    todayTimestamp,
    msOffset,
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
 * @returns {Object} - The todayTimestamp, the msOffset and the render function.
 */
export const setupControlledDateTimePicker = (
  Component: AnyPickerComponent,
  pFixedDate: number,
  props?: AnyPickerProps,
  spyOnDateChangeFn = jest.fn()
) => {
  const today = new Date(pFixedDate)
  const msOffset = getOffsetInMsFromTimezone(today, props?.timezone)

  const dateTimestamp = today.getTime() + msOffset

  return {
    todayTimestamp: dateTimestamp,
    msOffset,
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
 * @param {AnyPickerComponent} Component - The type of picker to be used in the test
 * @param {Number} pFixedDate - The fixed date to use for the tests. Here 2025-03-15T15:28:13.000Z as a timestamp.
 * @param {CommonPickerProps} props - The props to pass to the component.
 * @param {Mock} spyOnDateChangeFn
 *
 * @returns {Object} - The todayTimestamp, the msOffset and the render function.
 */
export const setupControlledDateRangePicker = (
  Component: AnyPickerComponent,
  pFixedDate: number,
  props?: AnyPickerProps,
  spyOnDateChangeFn = jest.fn()
) => {
  const today = new Date(pFixedDate)
  const msOffset = getOffsetInMsFromTimezone(today, props?.timezone)

  const dateTimestamp = today.getTime() + msOffset

  return {
    todayTimestamp: dateTimestamp,
    msOffset,
    render: render(
      <Integration {...props} spyOnDateChange={spyOnDateChangeFn}>
        {({ props, currentValue, setCurrentValue }) => {
          const range = currentValue as never[] | undefined
          return (
            <>
              <Component
                {...props}
                dateRange={currentValue as never[] | undefined}
                onChange={setCurrentValue}
              />
              {!!currentValue && (
                <span data-test={dateSpanTestId}>
                  <I18nDateLabel
                    value={range?.[0] as number | undefined}
                    localeAwareFormat={localeAwareFormat}
                    locale={props.locale}
                    timezone={props.timezone}
                  />
                  <I18nDateLabel
                    value={range?.[1] as number | undefined}
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
