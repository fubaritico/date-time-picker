import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockDate from 'mockdate'

import {
  formatTimestampForTextInput,
  getMillisecondsSinceMidnight,
  getTimestampFromDateString,
} from '@utils'
import { DATE_FORMAT } from '@components'

import DateRangePicker from '../DateRangePicker'
import { AnyPickerComponent, AnyPickerProps } from '../types'

import {
  setupControlledDateRangePicker,
  setupUncontrolledPicker,
} from './utils'

const spyOnDateRangeChangeFn = jest.fn()

const runTests = (timezone?: Timezone) => {
  const mockedNow = 1742052493000 // 2025-03-15T15:28:13.000Z
  const oneDayInMs = 86400000

  beforeEach(() => {
    MockDate.set(mockedNow)
  })

  afterEach(() => {
    MockDate.reset()
  })

  it('should render', async () => {
    const {
      render: { container },
    } = setupUncontrolledPicker(
      mockedNow,
      DateRangePicker as AnyPickerComponent,
      { timezone }
    )

    await waitFor(() => {
      expect(container).toBeInTheDocument()
    })

    expect(container).toMatchSnapshot()
  })

  /**
   * When uncontrolled, the default value should be that of today.
   */
  describe('Uncontrolled - init', () => {
    it('should not pass any value to the inputs on init', async () => {
      setupUncontrolledPicker(
        mockedNow,
        DateRangePicker as AnyPickerComponent,
        { timezone }
      )

      await waitFor(() => {
        expect(screen.getByTestId('start-input')).toHaveValue('____/__/__')
      })
      expect(screen.getByTestId('end-input')).toHaveValue('____/__/__')
    })

    it('should open the date range panel with the start date input only', async () => {
      setupUncontrolledPicker(
        mockedNow,
        DateRangePicker as AnyPickerComponent,
        { timezone }
      )

      await userEvent.click(
        within(screen.getByTestId('start-input-control')).getByRole('button')
      )

      expect(screen.getByTestId('date-range-panel')).toBeInTheDocument()

      await userEvent.click(document.body)

      await waitFor(() => {
        expect(screen.queryByTestId('date-range-panel')).not.toBeInTheDocument()
      })

      await userEvent.click(
        within(screen.getByTestId('end-input-control')).getByRole('button')
      )

      expect(screen.queryByTestId('date-range-panel')).not.toBeInTheDocument()
    })

    it('should give the opener button the "Choose Date Range" label', () => {
      setupUncontrolledPicker(
        mockedNow,
        DateRangePicker as AnyPickerComponent,
        { timezone }
      )

      expect(
        within(screen.getByTestId('start-input-control')).getByRole('button')
      ).toHaveAccessibleName('Choose Date Range')
    })

    it('should show the current date in the left panel by default', async () => {
      const { localeTodayTimestamp } = setupUncontrolledPicker(
        mockedNow,
        DateRangePicker as AnyPickerComponent,
        { timezone }
      )

      await userEvent.click(screen.getByLabelText('Choose Date Range'))

      expect(screen.getByTestId('date-range-panel')).toBeInTheDocument()

      expect(
        within(screen.getByTestId('left-panel')).getByTestId(
          localeTodayTimestamp.toString()
        )
      ).toHaveClass('DaysGridCell today blue md')
    })

    it('should open the panel with proper state', async () => {
      setupUncontrolledPicker(
        mockedNow,
        DateRangePicker as AnyPickerComponent,
        { timezone }
      )

      await userEvent.click(screen.getByLabelText('Choose Date Range'))

      expect(screen.getByTestId('date-range-panel')).toBeInTheDocument()

      expect(
        within(screen.getByTestId('left-panel')).getByLabelText(
          'Previous Month'
        )
      ).toBeEnabled()

      expect(
        within(screen.getByTestId('left-panel')).getByText('March')
      ).toBeInTheDocument()

      expect(
        within(screen.getByTestId('left-panel')).getByText('2025')
      ).toBeInTheDocument()

      expect(
        within(screen.getByTestId('left-panel')).getByLabelText('Next Month')
      ).toBeDisabled()

      expect(
        within(screen.getByTestId('right-panel')).getByLabelText(
          'Previous Month'
        )
      ).toBeDisabled()

      expect(
        within(screen.getByTestId('right-panel')).getByText('April')
      ).toBeInTheDocument()

      expect(
        within(screen.getByTestId('right-panel')).getByText('2025')
      ).toBeInTheDocument()

      expect(
        within(screen.getByTestId('right-panel')).getByLabelText('Next Month')
      ).toBeEnabled()
    })
  })

  describe('Uncontrolled - interaction', () => {
    it(
      'should enable next button in start date panel and previous button in end date panel ' +
        'if months in panels are not successive',
      async () => {
        setupUncontrolledPicker(
          mockedNow,
          DateRangePicker as AnyPickerComponent,
          { timezone }
        )

        await userEvent.click(screen.getByLabelText('Choose Date Range'))

        await userEvent.click(
          within(screen.getByTestId('left-panel')).getByLabelText(
            'Previous Month'
          )
        )

        expect(
          within(screen.getByTestId('left-panel')).getByLabelText('Next Month')
        ).toBeEnabled()

        expect(
          within(screen.getByTestId('right-panel')).getByLabelText(
            'Previous Month'
          )
        ).toBeEnabled()

        await userEvent.click(
          within(screen.getByTestId('right-panel')).getByLabelText(
            'Previous Month'
          )
        )

        expect(
          within(screen.getByTestId('left-panel')).getByLabelText('Next Month')
        ).toBeDisabled()

        expect(
          within(screen.getByTestId('right-panel')).getByLabelText(
            'Previous Month'
          )
        ).toBeDisabled()
      }
    )

    it('should update month in the panel header when click on previous or next button', async () => {
      setupUncontrolledPicker(
        mockedNow,
        DateRangePicker as AnyPickerComponent,
        { timezone }
      )

      await userEvent.click(screen.getByLabelText('Choose Date Range'))

      await userEvent.click(
        within(screen.getByTestId('left-panel')).getByLabelText(
          'Previous Month'
        )
      )

      expect(
        within(screen.getByTestId('left-panel')).getByText('February')
      ).toBeInTheDocument()

      await userEvent.click(
        within(screen.getByTestId('left-panel')).getByLabelText('Next Month')
      )

      expect(
        within(screen.getByTestId('left-panel')).getByText('March')
      ).toBeInTheDocument()
    })

    it('should select a date range when clicking on a first date and clicking on a second date', async () => {
      setupUncontrolledPicker(
        mockedNow,
        DateRangePicker as AnyPickerComponent,
        { timezone }
      )

      await userEvent.click(screen.getByLabelText('Choose Date Range'))

      expect(screen.getByTestId('date-range-panel')).toBeInTheDocument()

      await userEvent.click(
        within(screen.getByTestId('left-panel')).getByText('3')
      )

      await userEvent.click(
        within(screen.getByTestId('left-panel')).getByText('28')
      )

      await waitFor(() => {
        expect(screen.queryByTestId('date-range-panel')).not.toBeInTheDocument()
      })

      expect(screen.getByTestId('start-input')).toHaveValue('2025/03/03')
      expect(screen.getByTestId('end-input')).toHaveValue('2025/03/28')
    })

    it('should display start date in start date input as soon as the start date is selected', async () => {
      setupUncontrolledPicker(
        mockedNow,
        DateRangePicker as AnyPickerComponent,
        { timezone }
      )

      await userEvent.click(screen.getByLabelText('Choose Date Range'))

      expect(screen.getByTestId('start-input')).toHaveValue('____/__/__')

      await userEvent.click(
        within(screen.getByTestId('left-panel')).getByText('6')
      )

      expect(screen.getByTestId('start-input')).toHaveValue('2025/03/06')
      expect(screen.getByTestId('end-input')).toHaveValue('____/__/__')
    })

    it('should update start date when re-selecting a date range', async () => {
      setupUncontrolledPicker(
        mockedNow,
        DateRangePicker as AnyPickerComponent,
        { timezone }
      )

      await userEvent.click(screen.getByLabelText('Choose Date Range'))

      await userEvent.click(
        within(screen.getByTestId('left-panel')).getByText('4')
      )

      await userEvent.click(
        within(screen.getByTestId('left-panel')).getByText('18')
      )

      await waitFor(() => {
        expect(screen.queryByTestId('date-range-panel')).not.toBeInTheDocument()
      })

      expect(screen.getByTestId('start-input')).toHaveValue('2025/03/04')
      expect(screen.getByTestId('end-input')).toHaveValue('2025/03/18')

      await userEvent.click(screen.getByLabelText('Choose Date Range'))

      await userEvent.click(
        within(screen.getByTestId('left-panel')).getByText('5')
      )

      expect(screen.getByTestId('start-input')).toHaveValue('2025/03/05')
      expect(screen.getByTestId('end-input')).toHaveValue('____/__/__')

      await userEvent.click(
        within(screen.getByTestId('left-panel')).getByText('18')
      )

      expect(screen.getByTestId('end-input')).toHaveValue('2025/03/18')
    })

    it('should not allow an end date to be selected when clicking on a previous selected start date', async () => {
      setupUncontrolledPicker(
        mockedNow,
        DateRangePicker as AnyPickerComponent,
        { timezone }
      )

      await userEvent.click(screen.getByLabelText('Choose Date Range'))

      await userEvent.click(
        within(screen.getByTestId('left-panel')).getByText('5')
      )

      expect(screen.getByTestId('start-input')).toHaveValue('2025/03/05')
      expect(screen.getByTestId('end-input')).toHaveValue('____/__/__')

      await userEvent.click(
        within(screen.getByTestId('left-panel')).getByText('5')
      )
      await userEvent.click(
        within(screen.getByTestId('left-panel')).getByText('5')
      )

      expect(screen.getByTestId('end-input')).toHaveValue('____/__/__')
      expect(screen.getByTestId('date-range-panel')).toBeInTheDocument()
    })

    it('should allow to continue selection after having selected start date only and closed panel', async () => {
      setupUncontrolledPicker(
        mockedNow,
        DateRangePicker as AnyPickerComponent,
        { timezone }
      )

      await userEvent.click(screen.getByLabelText('Choose Date Range'))

      await userEvent.click(
        within(screen.getByTestId('left-panel')).getByText('5')
      )

      expect(screen.getByTestId('start-input')).toHaveValue('2025/03/05')
      expect(screen.getByTestId('end-input')).toHaveValue('____/__/__')

      await userEvent.click(document.body)

      await waitFor(() => {
        expect(screen.queryByTestId('date-range-panel')).not.toBeInTheDocument()
      })

      await userEvent.click(screen.getByLabelText('Choose Date Range'))

      await userEvent.click(
        within(screen.getByTestId('left-panel')).getByText('11')
      )

      await waitFor(() => {
        expect(screen.queryByTestId('date-range-panel')).not.toBeInTheDocument()
      })

      expect(screen.getByTestId('end-input')).toHaveValue('2025/03/11')
    })

    it('should not allow to define an end date that is before a previously selected start date', async () => {
      setupUncontrolledPicker(
        mockedNow,
        DateRangePicker as AnyPickerComponent,
        { timezone }
      )

      const user = userEvent.setup()

      const startDateInput = screen.getByTestId('start-input')
      const endDateInput = screen.getByTestId('end-input')

      await user.type(startDateInput, '20250305')

      expect(startDateInput).toHaveValue('2025/03/05')

      // Events have to be "simulated" like in the unit tests of the mask library
      fireEvent.change(endDateInput, { target: { value: '2025/03/03' } })

      expect(endDateInput).toHaveValue('____/__/__')

      fireEvent.change(endDateInput, { target: { value: '2025/03/06' } })

      await waitFor(() => {
        expect(endDateInput).toHaveValue('2025/03/06')
      })
    })

    it('should not allow to update a start date that is after a previously selected end date', async () => {
      const { finalOffset, localeTodayTimestamp } = setupUncontrolledPicker(
        mockedNow,
        DateRangePicker as AnyPickerComponent,
        { timezone }
      )

      const startDate = '2025/03/05'
      const endDate = '2025/03/08'

      const millisecondsToAdd =
        getMillisecondsSinceMidnight(localeTodayTimestamp)
      const startDateTimestamp =
        getTimestampFromDateString(startDate) + millisecondsToAdd
      const endDateTimestamp =
        getTimestampFromDateString(endDate) + millisecondsToAdd

      const user = userEvent.setup()
      const startDateInput = screen.getByTestId('start-input')
      const endDateInput = screen.getByTestId('end-input')

      await user.type(startDateInput, '20250305')

      expect(startDateInput).toHaveValue('2025/03/05')

      expect(startDateInput).toHaveValue(
        formatTimestampForTextInput(startDateTimestamp, DATE_FORMAT.en)
      )

      await user.type(endDateInput, '20250308')

      expect(endDateInput).toHaveValue(
        formatTimestampForTextInput(
          endDateTimestamp,
          DATE_FORMAT.en,
          finalOffset
        )
      )

      // Opted for this approach because it can't be done using userEvent.type
      // Events have to be "simulated" like in the unit tests of the mask library
      // @see: https://github.com/mona-health/react-input-mask/blob/master/tests/input/input.test.js
      fireEvent.change(startDateInput, { target: { value: '2025/03/09' } })

      await waitFor(() => {
        expect(startDateInput).toHaveValue('2025/03/05')
      })
    })

    it("should disable end date input as long as a valid start hasn't been set once", async () => {
      setupUncontrolledPicker(
        mockedNow,
        DateRangePicker as AnyPickerComponent,
        { timezone }
      )

      const user = userEvent.setup()
      const startDateInput = screen.getByTestId('start-input')
      const endDateInput = screen.getByTestId('end-input')

      expect(endDateInput).toBeDisabled()

      await user.type(startDateInput, '2025030')

      expect(startDateInput).toHaveValue('2025/03/0_')

      expect(endDateInput).toBeDisabled()

      // Can't continue the input, maybe the cursor position has to be set
      // @see: https://github.com/mona-health/react-input-mask/blob/master/tests/input/input.test.js
      fireEvent.change(startDateInput, { target: { value: '2025/03/08' } })

      expect(startDateInput).toHaveValue('2025/03/08')

      expect(endDateInput).toBeEnabled()

      await user.type(endDateInput, '20250309')

      expect(endDateInput).toHaveValue('2025/03/09')
    })
  })

  describe('Controlled', () => {
    beforeEach(() => {
      spyOnDateRangeChangeFn.mockReset()
    })

    const defaultProperties: AnyPickerProps = {
      locale: 'en_US',
      timezone,
    }

    it('should render', async () => {
      const {
        render: { baseElement, container },
      } = setupControlledDateRangePicker(
        mockedNow,
        defaultProperties,
        spyOnDateRangeChangeFn,
        0,
        13
      )

      expect(container).toMatchSnapshot()

      await userEvent.click(screen.getByLabelText('Choose Date Range'))

      expect(baseElement).toMatchSnapshot()
    })

    describe('Init', () => {
      it('should pass proper values to the inputs on init', () => {
        const daysBeforeToday = 0
        const daysAfterToday = 13

        const { startDate, endDate, msOffsets } =
          setupControlledDateRangePicker(
            mockedNow,
            defaultProperties,
            spyOnDateRangeChangeFn,
            daysBeforeToday,
            daysAfterToday
          )

        const startDateInput = screen.getByTestId('start-input')
        const endDateInput = screen.getByTestId('end-input')

        expect(startDateInput).toHaveValue(
          formatTimestampForTextInput(
            startDate,
            DATE_FORMAT[defaultProperties.locale?.split('_')[0] ?? 'en'],
            msOffsets[0]
          )
        )

        expect(endDateInput).toHaveValue(
          formatTimestampForTextInput(
            endDate,
            DATE_FORMAT[defaultProperties.locale?.split('_')[0] ?? 'en'],
            msOffsets[0]
          )
        )
      })

      it('should open the panel with the proper state', async () => {
        const daysBeforeToday = 0
        const daysAfterToday = 13

        const { localeTodayTimestamp } = setupControlledDateRangePicker(
          mockedNow,
          defaultProperties,
          spyOnDateRangeChangeFn,
          daysBeforeToday,
          daysAfterToday
        )

        const expectedStartValue =
          localeTodayTimestamp - oneDayInMs * daysBeforeToday
        const expectedEndValue =
          localeTodayTimestamp + oneDayInMs * daysAfterToday

        await userEvent.click(screen.getByLabelText('Choose Date Range'))

        expect(screen.getByTestId('date-range-panel')).toBeInTheDocument()

        expect(
          within(screen.getByTestId('left-panel')).getByLabelText(
            'Previous Month'
          )
        ).toBeEnabled()

        expect(
          within(screen.getByTestId('left-panel')).getByLabelText('Next Month')
        ).toBeDisabled()

        expect(
          within(screen.getByTestId('right-panel')).getByLabelText(
            'Previous Month'
          )
        ).toBeDisabled()

        expect(
          within(screen.getByTestId('right-panel')).getByLabelText('Next Month')
        ).toBeEnabled()

        expect(
          within(screen.getByTestId('left-panel')).getByTestId(
            expectedStartValue.toString()
          )
        ).toHaveClass('hasDateRangeMode inRange selectedStartDate')

        expect(
          within(screen.getByTestId('left-panel')).getByTestId(
            expectedEndValue.toString()
          )
        ).toHaveClass('hasDateRangeMode inRange selectedEndDate')

        for (let i = 1; i < daysBeforeToday; i++) {
          const expectedValue = localeTodayTimestamp - oneDayInMs * i
          const cell = within(screen.getByTestId('left-panel')).getByTestId(
            expectedValue.toString()
          )
          expect(cell).toHaveClass('hasDateRangeMode inRange')
          expect(cell).not.toHaveClass('selectedStartDate')
          expect(cell).not.toHaveClass('selectedEndDate')
        }

        for (let i = 1; i < daysAfterToday; i++) {
          const expectedValue = localeTodayTimestamp + oneDayInMs * i
          const cell = within(screen.getByTestId('left-panel')).getByTestId(
            expectedValue.toString()
          )
          expect(cell).toHaveClass('hasDateRangeMode inRange')
          expect(cell).not.toHaveClass('selectedStartDate')
          expect(cell).not.toHaveClass('selectedEndDate')
        }
      })

      it('should clear the end date input when selecting a new start date from the panel', async () => {
        const daysBeforeToday = 0
        const daysAfterToday = 13

        setupControlledDateRangePicker(
          mockedNow,
          defaultProperties,
          spyOnDateRangeChangeFn,
          daysBeforeToday,
          daysAfterToday
        )

        await userEvent.click(screen.getByLabelText('Choose Date Range'))

        expect(screen.getByTestId('date-range-panel')).toBeInTheDocument()

        await userEvent.click(
          within(screen.getByTestId('left-panel')).getByText('3')
        )

        expect(screen.getByTestId('end-input')).toHaveValue('____/__/__')
      })

      it('should call onDateRange callback with the expected arguments when date range is valid', async () => {
        const newDaysBeforeToday = 2
        const newDaysAfterToday = 13
        const daysBeforeToday = 0
        const daysAfterToday = 15

        const { localeTodayTimestamp, msOffsets } =
          setupControlledDateRangePicker(
            mockedNow,
            defaultProperties,
            spyOnDateRangeChangeFn,
            daysBeforeToday,
            daysAfterToday
          )

        const expectedStartValue =
          localeTodayTimestamp - oneDayInMs * newDaysBeforeToday
        const expectedEndValue =
          localeTodayTimestamp + oneDayInMs * newDaysAfterToday

        await userEvent.click(screen.getByLabelText('Choose Date Range'))

        expect(screen.getByTestId('date-range-panel')).toBeInTheDocument()

        await userEvent.click(screen.getByTestId(expectedStartValue.toString()))
        await userEvent.click(screen.getByTestId(expectedEndValue.toString()))

        expect(spyOnDateRangeChangeFn).toHaveBeenCalledWith([
          expectedStartValue - msOffsets[0],
          expectedEndValue - msOffsets[1],
        ])
      })

      it('should allow to select a new range of dates', async () => {
        const newDaysBeforeToday = 2
        const newDaysAfterToday = 13
        const daysBeforeToday = 0
        const daysAfterToday = 15

        const { localeTodayTimestamp } = setupControlledDateRangePicker(
          mockedNow,
          defaultProperties,
          spyOnDateRangeChangeFn,
          daysBeforeToday,
          daysAfterToday
        )

        const expectedStartValue =
          localeTodayTimestamp - oneDayInMs * newDaysBeforeToday
        const expectedEndValue =
          localeTodayTimestamp + oneDayInMs * newDaysAfterToday

        await userEvent.click(screen.getByLabelText('Choose Date Range'))

        expect(screen.getByTestId('date-range-panel')).toBeInTheDocument()

        await userEvent.click(screen.getByTestId(expectedStartValue.toString()))
        await userEvent.click(screen.getByTestId(expectedEndValue.toString()))

        await waitFor(() => {
          expect(
            screen.queryByTestId('date-range-panel')
          ).not.toBeInTheDocument()
        })

        await userEvent.click(screen.getByLabelText('Choose Date Range'))

        expect(
          within(screen.getByTestId('left-panel')).getByTestId(
            expectedStartValue.toString()
          )
        ).toHaveClass('hasDateRangeMode inRange selectedStartDate')

        expect(
          within(screen.getByTestId('left-panel')).getByTestId(
            expectedEndValue.toString()
          )
        ).toHaveClass('hasDateRangeMode inRange selectedEndDate')

        for (let i = 1; i < newDaysBeforeToday; i++) {
          const expectedValue = localeTodayTimestamp - oneDayInMs * i
          const cell = within(screen.getByTestId('left-panel')).getByTestId(
            expectedValue.toString()
          )
          expect(cell).toHaveClass('hasDateRangeMode inRange')
          expect(cell).not.toHaveClass('selectedStartDate')
          expect(cell).not.toHaveClass('selectedEndDate')
        }

        for (let i = 1; i < newDaysAfterToday; i++) {
          const expectedValue = localeTodayTimestamp + oneDayInMs * i
          const cell = within(screen.getByTestId('left-panel')).getByTestId(
            expectedValue.toString()
          )
          expect(cell).toHaveClass('hasDateRangeMode inRange')
          expect(cell).not.toHaveClass('selectedStartDate')
          expect(cell).not.toHaveClass('selectedEndDate')
        }
      })
    })
  })
}

/**
 * The Date management of the component is not based on moment.js anymore.
 * JS Date object and Intl.DateTimeFormat are used instead.
 * The first set of tests will focus on the basic behavior of the component.
 * And the machine timezone is used (fr, GMT + 1:00 or anything else)
 *
 * For the sake of reliability, MockDate will be used in those tests to keep them deterministic.
 *
 * A few tests are added to ensure that a provided timezone is taken into account.
 */
describe('DateRangePicker', () => {
  runTests()
})

/**
 * The same set of test with a given timezone
 */
describe('DateRangePicker w/ "America/Argentina/La_Rioja" timezone', () => {
  runTests('America/Argentina/La_Rioja')
})

describe('DateRangePicker w/ "Asia/Tokyo" timezone', () => {
  runTests('Asia/Tokyo')
})
