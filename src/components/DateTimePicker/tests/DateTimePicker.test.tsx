import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockDate from 'mockdate'

import {
  addHours,
  addMinutes,
  addMonths,
  addYears,
  formatHumanReadableDate,
  formatTimestampForTextInput,
  formatToLocaleAwareFormat,
  getAllMonthNames,
  getDayOfCurrentMonthTs,
  getFirstDayOfCurrentMonthTs,
  getLongMonthNameFromTs,
  getYearFromTs,
  setNewUtcTimestamp,
  subtractHours,
  subtractMinutes,
  subtractYears,
} from '@utils'

import DateTimePicker from '../DateTimePicker'
import { DATE_FORMAT, DATE_TIME_FORMAT } from '../formats'

import {
  dateSpanTestId,
  localeAwareFormat,
  setup,
  setupAsControlled,
} from './utils'

import type { AnyPickerComponent, AnyPickerProps } from '../types'

const spyOnDateChangeFn = jest.fn()

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
        DATE_TIME_FORMAT.en,
        0
      )

      setup(fixedDate, DateTimePicker as AnyPickerComponent)

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveValue(expectedValue)
      })
    })

    it('should show days panel content on icon click', async () => {
      const {
        todayTimestamp,
        render: { container },
      } = setup(fixedDate, DateTimePicker as AnyPickerComponent, {
        timezone,
      })
      if (timezone) expect(container).toMatchSnapshot()

      const currentMonth = getLongMonthNameFromTs(todayTimestamp).toString()
      const currentYear = getYearFromTs(todayTimestamp).toString()

      await userEvent.click(screen.getByLabelText('Choose Date'))

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
        todayTimestamp,
        render: { baseElement },
      } = setup(fixedDate, DateTimePicker as AnyPickerComponent, { timezone })

      await userEvent.click(screen.getByLabelText('Choose Date'))

      expect(await screen.findByTestId('days-grid')).toBeInTheDocument()

      if (timezone) {
        expect(baseElement).toMatchSnapshot()
      }

      expect(await screen.findByTestId(todayTimestamp.toString())).toHaveClass(
        'DaysGridCell enabled today blue md'
      )
    })

    it('should close the days panel on date selection', async () => {
      setup(fixedDate, DateTimePicker as AnyPickerComponent)

      await userEvent.click(screen.getByLabelText('Choose Date'))

      await userEvent.click(
        await screen.findByRole('button', { name: 'Next Month' })
      )

      await userEvent.click(
        screen.getByRole('button', {
          name: formatHumanReadableDate(addMonths(fixedDate, 1)),
        })
      )

      await waitFor(() => {
        expect(screen.queryByRole('grid')).not.toBeInTheDocument()
      })
    })

    it('should display a previously selected date as an slightly highlighted grid cell', async () => {
      const {
        todayTimestamp,
        render: { baseElement },
      } = setup(fixedDate, DateTimePicker as AnyPickerComponent, { timezone })

      const clickableDate = getFirstDayOfCurrentMonthTs(
        addMonths(todayTimestamp, 1)
      )

      await userEvent.click(screen.getByLabelText('Choose Date'))

      await userEvent.click(
        await screen.findByRole('button', { name: 'Next Month' })
      )

      await userEvent.click(
        screen.getByRole('button', {
          name: formatHumanReadableDate(clickableDate),
        })
      )

      if (timezone) {
        expect(baseElement).toMatchSnapshot()
      }

      expect(screen.getByTestId(clickableDate.toString())).toHaveClass(
        'DaysGridCell enabled selected blue md'
      )
    })

    it('should show month panel contents on month button click', async () => {
      const { todayTimestamp } = setup(
        fixedDate,
        DateTimePicker as AnyPickerComponent,
        {
          timezone,
        }
      )

      const currentMonth = getLongMonthNameFromTs(todayTimestamp).toString()
      const currentYear = getYearFromTs(todayTimestamp).toString()

      await userEvent.click(screen.getByLabelText('Choose Date'))
      await userEvent.click(
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
      const { todayTimestamp } = setup(
        fixedDate,
        DateTimePicker as AnyPickerComponent,
        {
          timezone,
        }
      )

      const currentYear = getYearFromTs(todayTimestamp).toString()
      const years = Array.from({ length: 12 }, (_, i) =>
        (i + parseInt(currentYear, 10)).toString()
      )

      await userEvent.click(screen.getByLabelText('Choose Date'))

      await userEvent.click(
        await screen.findByRole('button', { name: currentYear })
      )

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
      const { todayTimestamp } = setup(
        fixedDate,
        DateTimePicker as AnyPickerComponent,
        {
          timezone,
        }
      )
      const currentMonth = getLongMonthNameFromTs(todayTimestamp).toString()

      await userEvent.click(screen.getByLabelText('Choose Date'))

      await userEvent.click(
        await screen.findByRole('button', { name: currentMonth })
      )

      expect(screen.getByLabelText(`Choose ${currentMonth}`)).toHaveClass(
        'PanelButton',
        'blue',
        'md',
        'selected'
      )
    })

    it('should display the proper month as selected after selection', async () => {
      const { todayTimestamp } = setup(
        fixedDate,
        DateTimePicker as AnyPickerComponent,
        {
          timezone,
        }
      )

      const currentMonth = getLongMonthNameFromTs(todayTimestamp).toString()
      const monthToBeClicked = getLongMonthNameFromTs(
        addMonths(todayTimestamp, 1)
      ).toString()

      await userEvent.click(screen.getByLabelText('Choose Date'))

      await userEvent.click(
        await screen.findByRole('button', { name: currentMonth })
      )

      await userEvent.click(
        screen.getByRole('button', { name: `Choose ${monthToBeClicked}` })
      )

      await userEvent.click(screen.getByLabelText('Choose Date'))

      await userEvent.click(
        await screen.findByRole('button', { name: monthToBeClicked })
      )

      expect(screen.getByLabelText(`Choose ${monthToBeClicked}`)).toHaveClass(
        'PanelButton',
        'blue',
        'md',
        'selected'
      )
    })

    it('should display selected year on init', async () => {
      const { todayTimestamp } = setup(
        fixedDate,
        DateTimePicker as AnyPickerComponent,
        {
          timezone,
        }
      )

      const currentYear = getYearFromTs(todayTimestamp).toString()

      await userEvent.click(screen.getByLabelText('Choose Date'))

      await userEvent.click(screen.getByRole('button', { name: currentYear }))

      expect(screen.getByLabelText(`Choose ${currentYear}`)).toHaveClass(
        'PanelButton',
        'blue',
        'md',
        'selected'
      )
    })

    it('should display the proper year as selected after selection', async () => {
      const { todayTimestamp } = setup(
        fixedDate,
        DateTimePicker as AnyPickerComponent,
        {
          timezone,
        }
      )

      const currentYear = getYearFromTs(todayTimestamp).toString()
      const yearToBeClicked = getYearFromTs(
        addYears(todayTimestamp, 1)
      ).toString()

      await userEvent.click(screen.getByLabelText('Choose Date'))

      await userEvent.click(
        await screen.findByRole('button', { name: currentYear })
      )

      await userEvent.click(
        screen.getByRole('button', { name: `Choose ${yearToBeClicked}` })
      )

      await userEvent.click(screen.getByLabelText('Choose Date'))

      await userEvent.click(
        await screen.findByRole('button', { name: yearToBeClicked })
      )

      expect(screen.getByLabelText(`Choose ${yearToBeClicked}`)).toHaveClass(
        'PanelButton',
        'blue',
        'md',
        'selected'
      )
    })

    it('should show 12 previous years in panel on previous button click', async () => {
      const {
        todayTimestamp,
        render: { baseElement },
      } = setup(fixedDate, DateTimePicker as AnyPickerComponent, { timezone })

      const currentYear = getYearFromTs(todayTimestamp).toString()
      const twelveYearAgo = getYearFromTs(
        subtractYears(todayTimestamp, 12)
      ).toString() // 2013
      const years = Array.from(
        { length: 12 },
        (_, i) => (i + parseInt(twelveYearAgo, 10)).toString() // 2013 > 2024
      )

      await userEvent.click(screen.getByLabelText('Choose Date'))

      await userEvent.click(
        await screen.findByRole('button', { name: currentYear })
      )

      await userEvent.click(
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
      const { todayTimestamp } = setup(
        fixedDate,
        DateTimePicker as AnyPickerComponent,
        {
          timezone,
        }
      )

      const currentYear = getYearFromTs(todayTimestamp).toString()
      const yearsFromNow = getYearFromTs(
        addYears(todayTimestamp, 12)
      ).toString()
      const years = Array.from({ length: 12 }, (_, i) =>
        (i + parseInt(currentYear, 10) + 12).toString()
      )

      await userEvent.click(screen.getByLabelText('Choose Date'))

      await userEvent.click(
        await screen.findByRole('button', { name: currentYear })
      )

      await userEvent.click(
        screen.getByRole('button', { name: 'Next 12 years' })
      )

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
        msOffset,
        render: { container },
      } = setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties,
        spyOnDateChangeFn
      )

      const date = defaultProperties.date ?? Date.now()
      const innerDate = date + msOffset

      if (timezone) {
        expect(container).toMatchSnapshot()
      }

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveValue(
          formatTimestampForTextInput(
            innerDate, // Reproducing the addition of msOffset in the component
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
        defaultProperties,
        spyOnDateChangeFn
      )

      const selectedDay = 1
      const expectedValue = getFirstDayOfCurrentMonthTs(
        defaultProperties.date ?? Date.now()
      )

      await userEvent.click(screen.getByLabelText('Choose Date'))

      const buttonAriaLabel = within(screen.getByRole('grid'))
        .getAllByRole('button')
        [selectedDay - 1].getAttribute('aria-label')

      if (buttonAriaLabel === null) {
        throw new Error('Button aria-label is null')
      }

      await userEvent.click(
        screen.getByRole('button', { name: buttonAriaLabel })
      )

      expect(spyOnDateChangeFn).toHaveBeenCalledTimes(1)
      expect(spyOnDateChangeFn).toHaveBeenCalledWith(expectedValue)
    })

    it('should call the onDateChange component method with proper value when selecting a date after browsing days panel', async () => {
      setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties,
        spyOnDateChangeFn
      )

      const selectedDay = 5
      const nextMonthsClicks = 2
      const expectedValue = getDayOfCurrentMonthTs(
        addMonths(defaultProperties.date ?? Date.now(), nextMonthsClicks),
        selectedDay
      )

      await userEvent.click(screen.getByLabelText('Choose Date'))

      for (let i = 0; i < nextMonthsClicks; i++) {
        await userEvent.click(
          screen.getByRole('button', { name: 'Next Month' })
        )
      }

      const buttonAriaLabel = within(screen.getByRole('grid'))
        .getAllByRole('button')
        [selectedDay - 1].getAttribute('aria-label')

      if (buttonAriaLabel === null) {
        throw new Error('Button aria-label is null')
      }

      await userEvent.click(
        screen.getByRole('button', { name: buttonAriaLabel })
      )

      expect(spyOnDateChangeFn).toHaveBeenCalledTimes(1)
      expect(spyOnDateChangeFn).toHaveBeenCalledWith(expectedValue)
    })

    it('should call the onDateChange component method with proper value when selecting a month', async () => {
      const { msOffset } = setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties,
        spyOnDateChangeFn
      )

      const date = defaultProperties.date ?? Date.now()
      const innerDate = date + msOffset

      const currentMonth = getLongMonthNameFromTs(innerDate).toString()
      const monthToBeClicked = getLongMonthNameFromTs(
        addMonths(innerDate, 2)
      ).toString()
      const expectedValue = addMonths(date, 2)

      await userEvent.click(screen.getByLabelText('Choose Date'))

      await userEvent.click(
        await screen.findByRole('button', { name: currentMonth })
      )

      await userEvent.click(
        screen.getByRole('button', { name: `Choose ${monthToBeClicked}` })
      )

      expect(spyOnDateChangeFn).toHaveBeenCalledTimes(1)
      expect(spyOnDateChangeFn).toHaveBeenCalledWith(expectedValue)
    })

    it('should call the onDateChange component method with proper value when selecting a month after browsing months panel', async () => {
      const {
        msOffset,
        render: { baseElement },
      } = setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties,
        spyOnDateChangeFn
      )

      const date = defaultProperties.date ?? Date.now()
      const innerDate = date + msOffset

      const currentMonth = getLongMonthNameFromTs(innerDate).toString()
      const monthIndex = 1

      const monthToBeClicked = getAllMonthNames('long')[monthIndex]
      const monthDiff = monthIndex - new Date(innerDate).getMonth()
      const nextYearClicks = 3
      const expectedValue = addMonths(addYears(date, nextYearClicks), monthDiff)

      await userEvent.click(screen.getByLabelText('Choose Date'))

      await userEvent.click(
        await screen.findByRole('button', { name: currentMonth })
      )

      if (!timezone) {
        expect(baseElement).toMatchSnapshot()
      }

      for (let i = 1; i <= nextYearClicks; i++) {
        await userEvent.click(screen.getByRole('button', { name: 'Next Year' }))
      }

      if (!timezone) {
        expect(baseElement).toMatchSnapshot()
      }

      await userEvent.click(
        screen.getByRole('button', { name: `Choose ${monthToBeClicked}` })
      )

      if (!timezone) {
        expect(baseElement).toMatchSnapshot()
      }

      expect(spyOnDateChangeFn).toHaveBeenCalledTimes(1)
      expect(spyOnDateChangeFn).toHaveBeenCalledWith(expectedValue)
    })

    it('should call the onDateChange component method with proper value when selecting a year', async () => {
      const { msOffset } = setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties,
        spyOnDateChangeFn
      )

      const date = defaultProperties.date ?? Date.now()
      const innerDate = date + msOffset

      const currentYear = getYearFromTs(innerDate).toString()
      const yearToBeClicked = getYearFromTs(addYears(innerDate, 1)).toString()
      const expectedValue = addYears(date, 1)

      await userEvent.click(screen.getByLabelText('Choose Date'))

      await userEvent.click(
        await screen.findByRole('button', { name: currentYear })
      )

      await userEvent.click(
        screen.getByRole('button', { name: `Choose ${yearToBeClicked}` })
      )

      expect(spyOnDateChangeFn).toHaveBeenCalledTimes(1)
      expect(spyOnDateChangeFn).toHaveBeenCalledWith(expectedValue)
    })

    it('should call the onDateChange component method with proper value when selecting a year after browsing year panel', async () => {
      const { msOffset } = setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties,
        spyOnDateChangeFn
      )

      const date = defaultProperties.date ?? Date.now()
      const innerDate = date + msOffset

      const currentYear = getYearFromTs(innerDate).toString()
      const yearToBeClicked = '2038'
      const yearDiff = parseInt(yearToBeClicked) - parseInt(currentYear)
      const expectedValue = addYears(date, yearDiff)

      await userEvent.click(screen.getByLabelText('Choose Date'))

      await userEvent.click(
        await screen.findByRole('button', { name: currentYear })
      )

      await userEvent.click(
        await screen.findByRole('button', { name: 'Next 12 years' })
      )

      await userEvent.click(
        screen.getByRole('button', { name: `Choose ${yearToBeClicked}` })
      )

      expect(spyOnDateChangeFn).toHaveBeenCalledTimes(1)
      expect(spyOnDateChangeFn).toHaveBeenCalledWith(expectedValue)
    })

    it('should call the onDateChange component method with proper value when changing hours', async () => {
      setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties,
        spyOnDateChangeFn
      )

      const hoursToBeAdded = 5

      const date = defaultProperties.date ?? Date.now()

      await userEvent.click(screen.getByLabelText('Choose Date'))

      await userEvent.click(
        await screen.findByRole('button', { name: 'Switch to time view' })
      )

      for (let i = 1; i <= hoursToBeAdded; i++) {
        const expectedValue = addHours(date, i)
        await userEvent.click(
          screen.getByRole('button', { name: 'Add one hour' })
        )
        expect(spyOnDateChangeFn).toHaveBeenCalledWith(expectedValue)
      }

      expect(spyOnDateChangeFn).toHaveBeenCalledTimes(hoursToBeAdded)
    })

    it('should call the onDateChange component method with proper value when changing minutes', async () => {
      setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties,
        spyOnDateChangeFn
      )

      const date = defaultProperties.date ?? Date.now()

      const minutesToBeAdded = 15
      const minutesToBeRemoved = 5

      await userEvent.click(screen.getByLabelText('Choose Date'))

      await userEvent.click(
        await screen.findByRole('button', { name: 'Switch to time view' })
      )

      const callValues: number[][] = []

      for (let i = 1; i <= minutesToBeAdded; i++) {
        callValues.push([addMinutes(date, i)])
        await userEvent.click(
          screen.getByRole('button', { name: 'Add one minute' })
        )
      }

      for (let j = 1; j <= minutesToBeRemoved; j++) {
        callValues.push([
          subtractMinutes(callValues[minutesToBeAdded - 1][0], j),
        ])
        await userEvent.click(
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
        defaultProperties,
        spyOnDateChangeFn
      )

      const date = defaultProperties.date ?? Date.now()

      const expectedValue = subtractHours(date, 12)

      await userEvent.click(screen.getByLabelText('Choose Date'))

      await userEvent.click(
        await screen.findByRole('button', { name: 'Switch to time view' })
      )

      // Because there's now a possibility that the date could change
      // from AM to PM or vice versa, we will only stick to this case
      // give that the date is fixed and the
      await userEvent.click(screen.getByRole('button', { name: 'Choose AM' }))

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
      const user = userEvent.setup()
      const expectedValue = '2021/12/31 11:30 AM'
      setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties,
        spyOnDateChangeFn
      )

      const textInput = await screen.findByRole('textbox')

      await act(async () => {
        await user.clear(textInput)
        await user.type(textInput, '202112311130')
      })

      expect((textInput as HTMLInputElement).value).toContain(expectedValue)

      expect(spyOnDateChangeFn).toHaveBeenCalledTimes(1)

      expect(screen.getByTestId(dateSpanTestId)).toHaveTextContent(
        expectedValue
      )
      expect(spyOnDateChangeFn).toHaveBeenCalledWith(1640995140000)
    })
  })

  describe('Controlled Date/Time Picker - i18n', () => {
    const date = 1723201362000 // Aug 9, 2024, 11:02:42 AM
    const defaultProperties: AnyPickerProps = {
      date,
      timezone,
    }

    it.each([['en'], ['fr']])(
      'should render w/ the provided and formatted date in the text field according to locale (%s)',
      async (pLocale: string) => {
        defaultProperties.locale = pLocale

        const { msOffset } = setupAsControlled(
          DateTimePicker as AnyPickerComponent,
          fixedDate,
          defaultProperties
        )

        const innerDate = date + msOffset

        const selectedDay = 1

        await userEvent.click(screen.getByLabelText('Choose Date'))

        const buttonAriaLabel = within(screen.getByRole('grid'))
          .getAllByRole('button')
          [selectedDay - 1].getAttribute('aria-label')

        if (buttonAriaLabel === null) {
          throw new Error('Button aria-label is null')
        }

        await userEvent.click(
          screen.getByRole('button', { name: buttonAriaLabel })
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

      await userEvent.type(textInput, '2024-01-01')
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
        msOffset,
        render: { baseElement },
      } = setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties
      )

      const disabledDate = fixedDate - 1000 * 60 * 60 * 24 + msOffset
      defaultProperties.date = disabledDate

      await userEvent.click(screen.getByLabelText('Choose Date'))

      if (timezone) {
        expect(baseElement).toMatchSnapshot()
      }

      expect(screen.getByTestId(disabledDate)).toHaveAttribute(
        'aria-disabled',
        'true'
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

      await userEvent.click(screen.getByLabelText('Choose Date'))

      await userEvent.click(
        screen.getByRole('button', {
          name: formatHumanReadableDate(defaultProperties.date),
        })
      )
      expect(spyOnDateChangeFn).not.toHaveBeenCalled()
    })

    it('allows selection of dates equal to minDate and maxDate', async () => {
      const minDate = setNewUtcTimestamp(2025, 2, 10, 0, 0)
      const maxDate = setNewUtcTimestamp(2025, 2, 20, 0, 0)
      defaultProperties.minDate = minDate
      defaultProperties.maxDate = maxDate
      defaultProperties.date = setNewUtcTimestamp(2025, 2, 15, 0, 0)
      const { msOffset } = setupAsControlled(
        DateTimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties
      )
      await userEvent.click(screen.getByLabelText('Choose Date'))

      const minDateElement = screen.getByTestId(minDate + msOffset)
      expect(minDateElement).not.toHaveClass('cursor-not-allowed')

      const maxDateElement = screen.getByTestId(maxDate + msOffset)
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
