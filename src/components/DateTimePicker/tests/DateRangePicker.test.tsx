import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockDate from 'mockdate'

import DateRangePicker from '../DateRangePicker'

import { setupUncontrolledPicker } from './utils'

import type { AnyPickerComponent } from '../types'

const spyOnDateChangeFn = jest.fn()

const runTests = () => {
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
    } = setupUncontrolledPicker(
      fixedDate,
      DateRangePicker as AnyPickerComponent
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
      setupUncontrolledPicker(fixedDate, DateRangePicker as AnyPickerComponent)

      await waitFor(() => {
        expect(screen.getByTestId('start-input')).toHaveValue('____/__/__')
      })
      expect(screen.getByTestId('end-input')).toHaveValue('____/__/__')
    })

    it('should open the date range panel with the start date input only', async () => {
      setupUncontrolledPicker(fixedDate, DateRangePicker as AnyPickerComponent)

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
      setupUncontrolledPicker(fixedDate, DateRangePicker as AnyPickerComponent)

      expect(
        within(screen.getByTestId('start-input-control')).getByRole('button')
      ).toHaveAccessibleName('Choose Date Range')
    })

    it('should show the current date in the left panel by default', async () => {
      const { todayTimestamp } = setupUncontrolledPicker(
        fixedDate,
        DateRangePicker as AnyPickerComponent
      )

      await userEvent.click(screen.getByLabelText('Choose Date Range'))

      expect(screen.getByTestId('date-range-panel')).toBeInTheDocument()

      expect(
        within(screen.getByTestId('left-panel')).getByTestId(
          todayTimestamp.toString()
        )
      ).toHaveClass('DaysGridCell today blue md')
    })

    it('should open the panel with proper state', async () => {
      setupUncontrolledPicker(fixedDate, DateRangePicker as AnyPickerComponent)

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
          fixedDate,
          DateRangePicker as AnyPickerComponent
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
      setupUncontrolledPicker(fixedDate, DateRangePicker as AnyPickerComponent)

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
      setupUncontrolledPicker(fixedDate, DateRangePicker as AnyPickerComponent)

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
      setupUncontrolledPicker(fixedDate, DateRangePicker as AnyPickerComponent)

      await userEvent.click(screen.getByLabelText('Choose Date Range'))

      expect(screen.getByTestId('start-input')).toHaveValue('____/__/__')

      await userEvent.click(
        within(screen.getByTestId('left-panel')).getByText('6')
      )

      expect(screen.getByTestId('start-input')).toHaveValue('2025/03/06')
      expect(screen.getByTestId('end-input')).toHaveValue('____/__/__')
    })

    it('should update start date when re-selecting a date range', async () => {
      setupUncontrolledPicker(fixedDate, DateRangePicker as AnyPickerComponent)

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
      expect(screen.getByTestId('end-input')).toHaveValue('2025/03/18')
    })

    it('should not allow an end date to be selected when clicking on a previous selected start date', async () => {
      setupUncontrolledPicker(fixedDate, DateRangePicker as AnyPickerComponent)

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
      setupUncontrolledPicker(fixedDate, DateRangePicker as AnyPickerComponent)

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
      setupUncontrolledPicker(fixedDate, DateRangePicker as AnyPickerComponent)

      const user = userEvent.setup()

      const startDateInput = screen.getByTestId('start-input')
      const endDateInput = screen.getByTestId('end-input')

      await user.type(startDateInput, '20250305')

      expect(startDateInput).toHaveValue('2025/03/05')

      // Events have to "simulated" like in the unit tests of the mask library
      fireEvent.change(endDateInput, { target: { value: '2025/03/03' } })

      expect(endDateInput).toHaveValue('____/__/__')

      // Opted for this approach because it can't be done using userEvent.type
      // as it removes chars with backspace, but it won't allow a partial replacement/update
      // the field keeps returning "____/__/__"
      fireEvent.change(endDateInput, { target: { value: '2025/03/06' } })

      await waitFor(() => {
        expect(endDateInput).toHaveValue('2025/03/06')
      })
    })

    it('should not allow to update a start date that is after a previously selected end date', async () => {
      setupUncontrolledPicker(fixedDate, DateRangePicker as AnyPickerComponent)

      const user = userEvent.setup()
      const startDateInput = screen.getByTestId('start-input')
      const endDateInput = screen.getByTestId('end-input')

      await user.type(startDateInput, '20250305')

      expect(startDateInput).toHaveValue('2025/03/05')

      await user.type(endDateInput, '20250308')

      expect(endDateInput).toHaveValue('2025/03/08')

      // Opted for this approach because it can't be done using userEvent.type
      // as it removes chars with backspace, but it won't allow a partial replacement/update
      fireEvent.change(startDateInput, { target: { value: '2025/03/09' } })

      await waitFor(() => {
        expect(startDateInput).toHaveValue('2025/03/05')
      })
    })

    it("should disable end date input as long as a valid start hasn't been set once", async () => {
      setupUncontrolledPicker(fixedDate, DateRangePicker as AnyPickerComponent)

      const user = userEvent.setup()
      const startDateInput = screen.getByTestId('start-input')
      const endDateInput = screen.getByTestId('end-input')

      expect(endDateInput).toBeDisabled()

      await user.type(startDateInput, '2025030')

      expect(startDateInput).toHaveValue('2025/03/0_')

      expect(endDateInput).toBeDisabled()

      // Can't continue the input, maybe the cursor position has to be set
      fireEvent.change(startDateInput, { target: { value: '2025/03/08' } })

      expect(startDateInput).toHaveValue('2025/03/08')

      expect(endDateInput).toBeEnabled()

      await user.type(endDateInput, '20250309')

      expect(endDateInput).toHaveValue('2025/03/09')
    })
  })

  describe('Controlled', () => {
    beforeEach(() => {
      spyOnDateChangeFn.mockReset()
    })

    // date used for this set of test: 2024-08-09T16:28:13.000Z
    // const defaultProperties: AnyPickerProps = {
    //   date: 1723220893000,
    //   locale: 'en_US',
    //   pickerMode: 'DATETIME',
    //   timezone,
    // }

    it('should test', async () => {})
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
describe('DateRangePicker', () => {
  runTests()
})
