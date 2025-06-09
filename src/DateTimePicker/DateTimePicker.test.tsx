import { act, render, screen, waitFor } from '@testing-library/react'
import user from '@testing-library/user-event'
import MockDate from 'mockdate'

import {
  I18nDate,
  addHours,
  addMinutes,
  addMonths,
  addYears,
  formatTimestampForTextInput,
  getAllMonthNames,
  getDayOfCurrentMonthTs,
  getFirstDayOfCurrentMonthTs,
  getLongMonthNameFromTs,
  getOffsetInMsFromTimezone,
  getYearFromTs,
  setNewUtcTimestamp,
  subtractHours,
  subtractMinutes,
  subtractYears,
} from '@components'

import { formatToLocaleAwareFormat } from '../utils'

import DatePicker from './DatePicker'
import DateTimePicker from './DateTimePicker'
import Integration from './DateTimePicker.integration'
import { DATE_FORMAT, DATE_TIME_FORMAT, TIME_FORMAT } from './formats'
import TimePicker from './TimePicker'

import type { AnyPickerComponent, AnyPickerProps } from '@types'

/**
 * Set up the DateTimePicker component for testing.
 *
 * @param {AnyPickerProps} props - The props to pass to the component.
 * @param {AnyPickerComponent} Component - The type of picker to be used in the test
 * @param {Number} pFixedDate - The fixed date to use for the tests. Here, 2025-03-15T15:28:13.000Z as a timestamp.
 *
 * @returns The dateTimestamp, the offset and the render function.
 */
const setup = (
  pFixedDate: number,
  Component: AnyPickerComponent,
  props?: AnyPickerProps
) => {
  const today = new Date(pFixedDate)
  const offset = getOffsetInMsFromTimezone(today, props?.timezone)
  const dateTimestamp = today.getTime() + offset

  return {
    dateTimestamp,
    offset,
    render: render(<Component {...props} />),
  }
}

const spyOnDateChangeFn = jest.fn()
const dateSpanTestId = 'current-value'
const localeAwareFormat: LocaleAwareFormat = 'L LT'

/**
 * Set up the DateTimePicker component for testing.
 *
 * @param {AnyPickerComponent} Component - The type of picker to be used in the test
 * @param {Number} pFixedDate - The fixed date to use for the tests. Here 2025-03-15T15:28:13.000Z as a timestamp.
 * @param {CommonPickerProps} props - The props to pass to the component.
 *
 * @returns {Object} - The dateTimestamp, the offset and the render function.
 */
const setupAsControlled = (
  Component: AnyPickerComponent,
  pFixedDate: number,
  props?: AnyPickerProps
) => {
  const today = new Date(pFixedDate)
  const msOffset = getOffsetInMsFromTimezone(today, props?.timezone)

  const dateTimestamp = today.getTime() + msOffset

  return {
    dateTimestamp,
    offset: msOffset,
    render: render(
      <Integration {...props} spyOnDateChange={spyOnDateChangeFn}>
        {({ props, currentValue, setCurrentValue }) => (
          <>
            <Component
              {...props}
              date={currentValue}
              onChange={setCurrentValue}
            />
            {!!currentValue && (
              <span data-test={dateSpanTestId}>
                <I18nDate
                  value={currentValue}
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

const runTests = (timezone?: Timezone) => {
  const fixedDate = 1742052493000

  beforeEach(() => {
    MockDate.set(fixedDate) // some arbitrary date
  })

  afterEach(() => {
    MockDate.reset()
  })

  it('should render', async () => {
    const {
      render: { container },
    } = setup(fixedDate, DateTimePicker as AnyPickerComponent)

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })
  })

  /**
   * When uncontrolled the default value should be that of today.
   */
  describe('Basic behavior - Date/Time mode', () => {
    it('should pass the date of today as a formatted value to the masked input', async () => {
      const expectedValue = formatTimestampForTextInput(
        Date.now(),
        DATE_FORMAT.en,
        0
      )

      setup(fixedDate, DatePicker as AnyPickerComponent)

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveValue(expectedValue)
      })
    })

    it('should show days panel content on icon click', async () => {
      const { dateTimestamp } = setup(
        fixedDate,
        DateTimePicker as AnyPickerComponent,
        {
          timezone,
        }
      )

      const currentMonth = getLongMonthNameFromTs(dateTimestamp).toString()
      const currentYear = getYearFromTs(dateTimestamp).toString()

      await user.click(screen.getByLabelText('Open calendar panel'))

      expect(
        await screen.findByRole('button', { name: 'Previous Month' })
      ).toBeInTheDocument()

      expect(
        screen.getByRole('button', { name: currentMonth })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: currentYear })
      ).toBeInTheDocument()

      expect(
        screen.getByRole('button', { name: 'Next Month' })
      ).toBeInTheDocument()

      expect(screen.getByRole('grid')).toBeInTheDocument()
    })

    it("should display today's date as an highlighted grid cell (selected on init)", async () => {
      const {
        dateTimestamp,
        render: { baseElement },
      } = setup(fixedDate, DateTimePicker as AnyPickerComponent, { timezone })

      await user.click(screen.getByLabelText('Open calendar panel'))

      expect(await screen.findByTestId('days-grid')).toBeInTheDocument()

      if (timezone) {
        expect(baseElement).toMatchSnapshot()
      }

      expect(await screen.findByTestId(dateTimestamp.toString())).toHaveClass(
        'font-bold bg-blue-700 text-white'
      )
    })

    it('should close the days panel on date selection', async () => {
      setup(fixedDate, DateTimePicker as AnyPickerComponent)

      await user.click(screen.getByLabelText('Open calendar panel'))

      await user.click(
        await screen.findByRole('button', { name: 'Next Month' })
      )

      await user.click(screen.getByRole('button', { name: '1' }))

      await waitFor(() => {
        expect(screen.queryByRole('grid')).not.toBeInTheDocument()
      })
    })

    it('should display a previously selected date as an slightly highlighted grid cell', async () => {
      const {
        dateTimestamp,
        render: { baseElement },
      } = setup(fixedDate, DateTimePicker as AnyPickerComponent, { timezone })

      const clickableDate = getFirstDayOfCurrentMonthTs(
        addMonths(dateTimestamp, 1)
      ).toString()

      await user.click(screen.getByLabelText('Open calendar panel'))

      await user.click(
        await screen.findByRole('button', { name: 'Next Month' })
      )

      await user.click(screen.getByRole('button', { name: '1' }))

      if (timezone) {
        expect(baseElement).toMatchSnapshot()
      }

      expect(screen.getByTestId(clickableDate)).toHaveClass(
        'font-bold',
        'bg-blue-700',
        'text-white'
      )
    })

    it('should show month panel contents on month button click', async () => {
      const { dateTimestamp } = setup(
        fixedDate,
        DateTimePicker as AnyPickerComponent,
        {
          timezone,
        }
      )

      const currentMonth = getLongMonthNameFromTs(dateTimestamp).toString()
      const currentYear = getYearFromTs(dateTimestamp).toString()

      await user.click(screen.getByLabelText('Open calendar panel'))
      await user.click(
        await screen.findByRole('button', { name: currentMonth })
      )

      expect(
        screen.getByRole('button', { name: 'Previous Year' })
      ).toBeInTheDocument()

      expect(screen.getByText(currentYear)).toBeInTheDocument()

      expect(
        screen.getByRole('button', { name: 'Next Year' })
      ).toBeInTheDocument()
    })

    it('should show years panel contents on year button click', async () => {
      const { dateTimestamp } = setup(
        fixedDate,
        DateTimePicker as AnyPickerComponent,
        {
          timezone,
        }
      )

      const currentYear = getYearFromTs(dateTimestamp).toString()
      const years = Array.from({ length: 12 }, (_, i) =>
        (i + parseInt(currentYear, 10)).toString()
      )

      await user.click(screen.getByLabelText('Open calendar panel'))

      await user.click(await screen.findByRole('button', { name: currentYear }))

      expect(
        screen.getByRole('button', { name: 'Previous 12 years' })
      ).toBeInTheDocument()

      expect(screen.getByLabelText(currentYear)).toBeInTheDocument()
      expect(
        screen.getByLabelText(parseInt(currentYear, 10) + 11)
      ).toBeInTheDocument()

      expect(
        screen.getByRole('button', { name: 'Next 12 years' })
      ).toBeInTheDocument()

      for (const year of years) {
        expect(screen.getByLabelText(`Choose ${year}`)).toBeInTheDocument()
      }
    })

    it('should display selected month on init', async () => {
      const { dateTimestamp } = setup(
        fixedDate,
        DateTimePicker as AnyPickerComponent,
        {
          timezone,
        }
      )
      const currentMonth = getLongMonthNameFromTs(dateTimestamp).toString()

      await user.click(screen.getByLabelText('Open calendar panel'))

      await user.click(
        await screen.findByRole('button', { name: currentMonth })
      )

      expect(screen.getByLabelText(`Choose ${currentMonth}`)).toHaveClass(
        'border-blue-600',
        'bg-blue-600',
        'text-white'
      )
    })

    it('should display the proper month as selected after selection', async () => {
      const { dateTimestamp } = setup(
        fixedDate,
        DateTimePicker as AnyPickerComponent,
        {
          timezone,
        }
      )

      const currentMonth = getLongMonthNameFromTs(dateTimestamp).toString()
      const monthToBeClicked = getLongMonthNameFromTs(
        addMonths(dateTimestamp, 1)
      ).toString()

      await user.click(screen.getByLabelText('Open calendar panel'))

      await user.click(
        await screen.findByRole('button', { name: currentMonth })
      )

      await user.click(
        screen.getByRole('button', { name: `Choose ${monthToBeClicked}` })
      )

      await user.click(screen.getByLabelText('Open calendar panel'))

      await user.click(
        await screen.findByRole('button', { name: monthToBeClicked })
      )

      expect(screen.getByLabelText(`Choose ${monthToBeClicked}`)).toHaveClass(
        'border-blue-600',
        'bg-blue-600',
        'text-white'
      )
    })

    it('should display selected year on init', async () => {
      const { dateTimestamp } = setup(
        fixedDate,
        DateTimePicker as AnyPickerComponent,
        {
          timezone,
        }
      )

      const currentYear = getYearFromTs(dateTimestamp).toString()

      await user.click(screen.getByLabelText('Open calendar panel'))

      await user.click(screen.getByRole('button', { name: currentYear }))

      expect(screen.getByLabelText(`Choose ${currentYear}`)).toHaveClass(
        'border-blue-600',
        'bg-blue-600',
        'text-white'
      )
    })

    it('should display the proper year as selected after selection', async () => {
      const { dateTimestamp } = setup(
        fixedDate,
        DateTimePicker as AnyPickerComponent,
        {
          timezone,
        }
      )

      const currentYear = getYearFromTs(dateTimestamp).toString()
      const yearToBeClicked = getYearFromTs(
        addYears(dateTimestamp, 1)
      ).toString()

      await user.click(screen.getByLabelText('Open calendar panel'))

      await user.click(await screen.findByRole('button', { name: currentYear }))

      await user.click(
        screen.getByRole('button', { name: `Choose ${yearToBeClicked}` })
      )

      await user.click(screen.getByLabelText('Open calendar panel'))

      await user.click(
        await screen.findByRole('button', { name: yearToBeClicked })
      )

      expect(screen.getByLabelText(`Choose ${yearToBeClicked}`)).toHaveClass(
        'border-blue-600',
        'bg-blue-600',
        'text-white'
      )
    })

    it('should show 12 previous years in panel on previous button click', async () => {
      const {
        dateTimestamp,
        render: { baseElement },
      } = setup(fixedDate, DateTimePicker as AnyPickerComponent, { timezone })

      const currentYear = getYearFromTs(dateTimestamp).toString()
      const twelveYearAgo = getYearFromTs(
        subtractYears(dateTimestamp, 12)
      ).toString() // 2013
      const years = Array.from(
        { length: 12 },
        (_, i) => (i + parseInt(twelveYearAgo, 10)).toString() // 2013 > 2024
      )

      await user.click(screen.getByLabelText('Open calendar panel'))

      await user.click(await screen.findByRole('button', { name: currentYear }))

      await user.click(
        screen.getByRole('button', { name: 'Previous 12 years', hidden: true })
      )

      if (timezone) {
        expect(baseElement).toMatchSnapshot()
      }

      expect(screen.getByLabelText(twelveYearAgo)).toBeInTheDocument()
      expect(
        screen.getByLabelText((parseInt(currentYear, 10) - 1).toString())
      ).toBeInTheDocument()

      for (const year of years) {
        expect(screen.getByLabelText(`Choose ${year}`)).toBeInTheDocument()
      }
    })

    it('should show 12 next years in panel on next button click', async () => {
      const { dateTimestamp } = setup(
        fixedDate,
        DateTimePicker as AnyPickerComponent,
        {
          timezone,
        }
      )

      const currentYear = getYearFromTs(dateTimestamp).toString()
      const yearsFromNow = getYearFromTs(addYears(dateTimestamp, 12)).toString()
      const years = Array.from({ length: 12 }, (_, i) =>
        (i + parseInt(currentYear, 10) + 12).toString()
      )

      await user.click(screen.getByLabelText('Open calendar panel'))

      await user.click(await screen.findByRole('button', { name: currentYear }))

      await user.click(screen.getByRole('button', { name: 'Next 12 years' }))

      expect(screen.getByLabelText(yearsFromNow)).toBeInTheDocument()
      expect(
        screen.getByLabelText((parseInt(yearsFromNow, 10) + 11).toString())
      ).toBeInTheDocument()

      for (const year of years) {
        expect(screen.getByLabelText(`Choose ${year}`)).toBeInTheDocument()
      }
    })
  })

  describe('Controlled Date Picker - Date/Time mode', () => {
    beforeEach(() => {
      spyOnDateChangeFn.mockReset()
    })

    // date used for this set of test: 2024-08-09T16:28:13.000Z
    const defaultProperties: AnyPickerProps = {
      date: 1723220893000,
      locale: 'en_US',
      pickerMode: 'DATETIME',
      timezone,
    }

    it('should render w/ the provided date in the text field', async () => {
      const {
        offset,
        render: { container },
      } = setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties
      )

      const date = defaultProperties.date ?? Date.now()
      const innerDate = date + offset

      if (timezone) {
        expect(container).toMatchSnapshot()
      }

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveValue(
          formatTimestampForTextInput(
            innerDate, // Reproducing the addition of offset in the component
            DATE_TIME_FORMAT[defaultProperties.locale?.split('_')[0] ?? 'en'],
            0
          )
        )
      })
    })

    it('should call the onDateChange component method with proper value when selecting a date', async () => {
      setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties
      )

      const selectedDay = 1
      const expectedValue = getFirstDayOfCurrentMonthTs(
        defaultProperties.date ?? Date.now()
      )

      await user.click(screen.getByLabelText('Open calendar panel'))

      await user.click(
        screen.getByRole('button', { name: selectedDay.toString() })
      )

      expect(spyOnDateChangeFn).toHaveBeenCalledTimes(1)
      expect(spyOnDateChangeFn).toHaveBeenCalledWith(expectedValue)
    })

    it('should call the onDateChange component method with proper value when selecting a date after browsing days panel', async () => {
      setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties
      )

      const selectedDay = 5
      const nextMonthsClicks = 2
      const expectedValue = getDayOfCurrentMonthTs(
        addMonths(defaultProperties.date ?? Date.now(), nextMonthsClicks),
        selectedDay
      )

      await user.click(screen.getByLabelText('Open calendar panel'))

      for (let i = 0; i < nextMonthsClicks; i++) {
        await user.click(screen.getByRole('button', { name: 'Next Month' }))
      }

      await user.click(
        screen.getByRole('button', { name: selectedDay.toString() })
      )

      expect(spyOnDateChangeFn).toHaveBeenCalledTimes(1)
      expect(spyOnDateChangeFn).toHaveBeenCalledWith(expectedValue)
    })

    it('should call the onDateChange component method with proper value when selecting a month', async () => {
      const { offset } = setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties
      )

      const date = defaultProperties.date ?? Date.now()
      const innerDate = date + offset

      const currentMonth = getLongMonthNameFromTs(innerDate).toString()
      const monthToBeClicked = getLongMonthNameFromTs(
        addMonths(innerDate, 2)
      ).toString()
      const expectedValue = addMonths(date, 2)

      await user.click(screen.getByLabelText('Open calendar panel'))

      await user.click(
        await screen.findByRole('button', { name: currentMonth })
      )

      await user.click(
        screen.getByRole('button', { name: `Choose ${monthToBeClicked}` })
      )

      expect(spyOnDateChangeFn).toHaveBeenCalledTimes(1)
      expect(spyOnDateChangeFn).toHaveBeenCalledWith(expectedValue)
    })

    it('should call the onDateChange component method with proper value when selecting a month after browsing months panel', async () => {
      const { offset } = setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties
      )

      const date = defaultProperties.date ?? Date.now()
      const innerDate = date + offset

      const currentMonth = getLongMonthNameFromTs(innerDate).toString()
      const monthIndex = 1

      const monthToBeClicked = getAllMonthNames('long')[monthIndex]
      const monthDiff = monthIndex - new Date(innerDate).getMonth()
      const nextYearClicks = 3
      const expectedValue = addMonths(addYears(date, nextYearClicks), monthDiff)

      await user.click(screen.getByLabelText('Open calendar panel'))

      await user.click(
        await screen.findByRole('button', { name: currentMonth })
      )

      for (let i = 1; i <= nextYearClicks; i++) {
        await user.click(screen.getByRole('button', { name: 'Next Year' }))
      }

      await user.click(
        screen.getByRole('button', { name: `Choose ${monthToBeClicked}` })
      )

      expect(spyOnDateChangeFn).toHaveBeenCalledTimes(1)
      expect(spyOnDateChangeFn).toHaveBeenCalledWith(expectedValue)
    })

    it('should call the onDateChange component method with proper value when selecting a year', async () => {
      const { offset } = setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties
      )

      const date = defaultProperties.date ?? Date.now()
      const innerDate = date + offset

      const currentYear = getYearFromTs(innerDate).toString()
      const yearToBeClicked = getYearFromTs(addYears(innerDate, 1)).toString()
      const expectedValue = addYears(date, 1)

      await user.click(screen.getByLabelText('Open calendar panel'))

      await user.click(await screen.findByRole('button', { name: currentYear }))

      await user.click(
        screen.getByRole('button', { name: `Choose ${yearToBeClicked}` })
      )

      expect(spyOnDateChangeFn).toHaveBeenCalledTimes(1)
      expect(spyOnDateChangeFn).toHaveBeenCalledWith(expectedValue)
    })

    it('should call the onDateChange component method with proper value when selecting a year after browsing year panel', async () => {
      const { offset } = setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties
      )

      const date = defaultProperties.date ?? Date.now()
      const innerDate = date + offset

      const currentYear = getYearFromTs(innerDate).toString()
      const yearToBeClicked = '2038'
      const yearDiff = parseInt(yearToBeClicked) - parseInt(currentYear)
      const expectedValue = addYears(date, yearDiff)

      await user.click(screen.getByLabelText('Open calendar panel'))

      await user.click(await screen.findByRole('button', { name: currentYear }))

      await user.click(
        await screen.findByRole('button', { name: 'Next 12 years' })
      )

      await user.click(
        screen.getByRole('button', { name: `Choose ${yearToBeClicked}` })
      )

      expect(spyOnDateChangeFn).toHaveBeenCalledTimes(1)
      expect(spyOnDateChangeFn).toHaveBeenCalledWith(expectedValue)
    })

    it('should call the onDateChange component method with proper value when changing hours', async () => {
      setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties
      )

      const hoursToBeAdded = 5

      const date = defaultProperties.date ?? Date.now()

      await user.click(screen.getByLabelText('Open calendar panel'))

      await user.click(
        await screen.findByRole('button', { name: 'Switch to time view' })
      )

      for (let i = 1; i <= hoursToBeAdded; i++) {
        const expectedValue = addHours(date, i)
        await user.click(screen.getByRole('button', { name: 'Add one hour' }))
        expect(spyOnDateChangeFn).toHaveBeenCalledWith(expectedValue)
      }

      expect(spyOnDateChangeFn).toHaveBeenCalledTimes(hoursToBeAdded)
    })

    it('should call the onDateChange component method with proper value when changing minutes', async () => {
      setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties
      )

      const date = defaultProperties.date ?? Date.now()

      const minutesToBeAdded = 15
      const minutesToBeRemoved = 5

      await user.click(screen.getByLabelText('Open calendar panel'))

      await user.click(
        await screen.findByRole('button', { name: 'Switch to time view' })
      )

      const callValues: number[][] = []

      for (let i = 1; i <= minutesToBeAdded; i++) {
        callValues.push([addMinutes(date, i)])
        await user.click(screen.getByRole('button', { name: 'Add one minute' }))
      }

      for (let j = 1; j <= minutesToBeRemoved; j++) {
        callValues.push([
          subtractMinutes(callValues[minutesToBeAdded - 1][0], j),
        ])
        await user.click(
          screen.getByRole('button', { name: 'Remove one minute' })
        )
      }

      expect(spyOnDateChangeFn.mock.calls.length).toBe(
        minutesToBeAdded + minutesToBeRemoved
      )
      expect(callValues).toEqual(spyOnDateChangeFn.mock.calls)

      await waitFor(() => {
        expect(screen.getByTestId(dateSpanTestId)).toHaveTextContent(
          formatToLocaleAwareFormat(
            subtractMinutes(
              addMinutes(date, minutesToBeAdded),
              minutesToBeRemoved
            ),
            defaultProperties.locale ?? 'en_US',
            localeAwareFormat,
            timezone
          )
        )
      })
    })

    it('should call the onDateChange component method with proper value when changing AM-PM', async () => {
      setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties
      )

      const date = defaultProperties.date ?? Date.now()

      const expectedValue = subtractHours(date, 12)

      await user.click(screen.getByLabelText('Open calendar panel'))

      await user.click(
        await screen.findByRole('button', { name: 'Switch to time view' })
      )

      // Because there's now a possibility that the date could change
      // from AM to PM or vice versa, we will only stick to this case
      // give that the date is fixed and the
      await user.click(screen.getByRole('button', { name: 'Choose AM' }))

      expect(spyOnDateChangeFn).toHaveBeenCalledWith(expectedValue)

      await waitFor(() => {
        expect(screen.getByTestId(dateSpanTestId)).toHaveTextContent(
          formatToLocaleAwareFormat(
            expectedValue,
            defaultProperties.locale ?? 'en_US',
            localeAwareFormat,
            timezone
          )
        )
      })
    })
  })

  describe.skip('Controlled Date Picker - text input behavior (en)', () => {
    const defaultProperties: AnyPickerProps = {
      date: 1723201362000, // Aug 9, 2024, 11:02:42 AM (GMT)
      locale: 'en_US',
      pickerMode: 'DATETIME',
      timezone,
    }

    // TODO: there's no way yet to make react-input-text work in a jest/rtl environment
    // I do get an actual input, but it doesn't replace the old/previous value.
    // For instance, if I simulate a change of 8 characters length,
    // the input will have the 8 first characters of the old/orevious value.
    it('should update the date value when typing a valid date in the text input', async () => {
      const userEvent = user.setup()
      const expectedValue = '2021/12/31 11:30 AM'
      setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties
      )

      const textInput = await screen.findByRole('textbox')

      await act(async () => {
        await userEvent.clear(textInput)
        await userEvent.type(textInput, '202112311130')
      })

      expect((textInput as HTMLInputElement).value).toContain(expectedValue)

      expect(spyOnDateChangeFn).toHaveBeenCalledTimes(1)

      expect(screen.getByTestId(dateSpanTestId)).toHaveTextContent(
        expectedValue
      )
      expect(spyOnDateChangeFn).toHaveBeenCalledWith(1640995140000)
    })
  })

  describe('Controlled Time Picker - (en)', () => {
    const defaultProperties: AnyPickerProps = {
      date: 1723201362000,
      locale: 'en_US',
      pickerMode: 'TIME',
      timezone,
    }

    it('should render w/ the provided date in the text field', async () => {
      const {
        offset,
        render: { container },
      } = setupAsControlled(
        TimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties
      )

      const date = defaultProperties.date ?? Date.now()
      const locale = defaultProperties.locale?.split('_')[0]
      const innerDate = date + offset

      if (timezone) {
        expect(container).toMatchSnapshot()
      }

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveValue(
          formatTimestampForTextInput(innerDate, TIME_FORMAT[locale ?? 'en'], 0)
        )
      })
    })
  })

  describe('Controlled Time Picker - (fr)', () => {
    const defaultProperties: AnyPickerProps = {
      date: 1723201362000,
      locale: 'fr_FR',
      pickerMode: 'TIME',
      timezone,
    }

    it('should render w/ the provided date in the text field', async () => {
      const {
        offset,
        render: { container },
      } = setupAsControlled(
        TimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties
      )

      const date = defaultProperties.date ?? Date.now()
      const locale = defaultProperties.locale?.split('_')[0]
      const innerDate = date + offset

      if (timezone) {
        expect(container).toMatchSnapshot()
      }

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveValue(
          formatTimestampForTextInput(innerDate, TIME_FORMAT[locale ?? 'en'], 0)
        )
      })
    })
  })

  describe('Controlled Date/Time Picker - i18n', () => {
    const date = 1723201362000 // Aug 9, 2024, 11:02:42 AM
    const defaultProperties: AnyPickerProps = {
      date,
      pickerMode: 'DATETIME',
      timezone,
    }

    it.each([['en'], ['fr']])(
      'should render w/ the provided and formatted date in the text field according to locale (%s)',
      async (pLocale: string) => {
        defaultProperties.locale = pLocale

        const { offset } = setupAsControlled(
          DateTimePicker as AnyPickerComponent,
          fixedDate,
          defaultProperties
        )

        const innerDate = date + offset

        const selectedDay = 1

        await user.click(screen.getByLabelText('Open calendar panel'))

        await user.click(
          screen.getByRole('button', { name: selectedDay.toString() })
        ) // Pass to the 1st day of the current month

        const firstDayOfCurrentMonthTs = getFirstDayOfCurrentMonthTs(innerDate)

        await waitFor(() => {
          expect(screen.getByRole('textbox')).toHaveValue(
            formatTimestampForTextInput(
              firstDayOfCurrentMonthTs,
              DATE_TIME_FORMAT[pLocale.split('_')[0]],
              0
            ).replace(/-/g, '/')
          )
        })
      }
    )
  })

  describe('DateTimePicker: minDate and maxDate functionality', () => {
    const defaultProperties: AnyPickerProps = {
      minDate: new Date(2025, 0, 15).getTime(),
      maxDate: new Date(2025, 0, 30).getTime(),
      locale: 'en_US',
      pickerMode: 'DATE',
      timezone,
    }

    // TODO: find why the error state is not shown when the date is out of range
    it.skip('shows an error state for keyboard-entered dates outside range', async () => {
      // Update the date to outOfRangeDate and wrap the setup in `act` to ensure state changes are properly flushed
      setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties
      )

      const textInput = await screen.findByRole('textbox')
      const intl = defaultProperties.locale?.split('_')[0]

      await waitFor(() => {
        expect(textInput).toHaveValue(
          formatTimestampForTextInput(fixedDate, DATE_FORMAT[intl ?? 'en'], 0)
        )
      })

      await user.type(textInput, '2024-01-01')
      expect(screen.getByRole('textbox')).toHaveClass(
        '!border-red-500',
        '!bg-red-50',
        '!text-red-700'
      )
      const errorMessage = screen.queryByText(/Selected date is out of bounds/i)
      expect(errorMessage).toBeInTheDocument()
    })

    it('does not allow clicking on a disabled date', async () => {
      const {
        offset,
        render: { baseElement },
      } = setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties
      )

      const disabledDate = fixedDate - 1000 * 60 * 60 * 24 + offset
      defaultProperties.date = disabledDate

      await user.click(screen.getByLabelText('Open calendar panel'))

      if (timezone) {
        expect(baseElement).toMatchSnapshot()
      }

      expect(screen.getByTestId(disabledDate)).toHaveClass(
        'text-gray-300',
        'cursor-not-allowed'
      )
    })

    it('it does not call onDateChange when date is out of range', async () => {
      spyOnDateChangeFn.mockReset()
      defaultProperties.date = new Date(2024, 10, 0).getTime()
      setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties
      )

      await user.click(screen.getByLabelText('Open calendar panel'))

      await user.click(screen.getByRole('button', { name: '1' }))
      expect(spyOnDateChangeFn).not.toHaveBeenCalled()
    })

    it('allows selection of dates equal to minDate and maxDate', async () => {
      const minDate = setNewUtcTimestamp(2025, 2, 10, 0, 0)
      const maxDate = setNewUtcTimestamp(2025, 2, 20, 0, 0)
      defaultProperties.minDate = minDate
      defaultProperties.maxDate = maxDate
      defaultProperties.date = setNewUtcTimestamp(2025, 2, 15, 0, 0)
      const { offset } = setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties
      )
      await user.click(screen.getByLabelText('Open calendar panel'))

      const minDateElement = screen.getByTestId(minDate + offset)
      expect(minDateElement).not.toHaveClass('cursor-not-allowed')

      const maxDateElement = screen.getByTestId(maxDate + offset)
      expect(maxDateElement).not.toHaveClass('cursor-not-allowed')
    })
  })
}

/**
 * The Date management of the component is not based on moment.js anymore.
 * JS Date object and Intl.DateTimeFormat are used instead.
 * The first set of tests will focus on the basic behavior of the component.
 * And the machine timezone is used (fr, GMT + 1:00)
 *
 * For the sake of reliability, MockDate will be used in those tests to keep them deterministic.
 *
 * A few tests are added to ensure that a provided timezone is taken into account.
 */
describe('DateTimePicker', () => {
  runTests()
})

/**
 * The same set of test with a given timezone
 * @see: https://stackoverflow.com/questions/38399465/how-to-get-list-of-all-timezones-in-javascript
 */
describe('DateTimePicker with timezone', () => {
  runTests('America/Argentina/La_Rioja')
})
