import { screen, waitFor, within } from '@testing-library/react'
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
    // There's a behavior issue with @mona-health/react-input-mask
    // the default value should be the mask (____/__/__), not an empty value
    it('should not pass any value to the inputs on init', () => {
      setupUncontrolledPicker(fixedDate, DateRangePicker as AnyPickerComponent)

      expect(screen.getByTestId('start-input')).toHaveValue('')
      expect(screen.getByTestId('end-input')).toHaveValue('')
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
        within(screen.getByTestId('start-date-panel')).getByTestId(
          todayTimestamp.toString()
        )
      ).toHaveClass('DaysGridCell today blue md')
    })

    it('should open the panel with proper state', async () => {
      setupUncontrolledPicker(fixedDate, DateRangePicker as AnyPickerComponent)

      await userEvent.click(screen.getByLabelText('Choose Date Range'))

      expect(screen.getByTestId('date-range-panel')).toBeInTheDocument()

      expect(
        within(screen.getByTestId('start-date-panel')).getByLabelText(
          'Previous Month'
        )
      ).toBeEnabled()

      expect(
        within(screen.getByTestId('start-date-panel')).getByText('March')
      ).toBeInTheDocument()

      expect(
        within(screen.getByTestId('start-date-panel')).getByText('2025')
      ).toBeInTheDocument()

      expect(
        within(screen.getByTestId('start-date-panel')).getByLabelText(
          'Next Month'
        )
      ).toBeDisabled()

      expect(
        within(screen.getByTestId('end-date-panel')).getByLabelText(
          'Previous Month'
        )
      ).toBeDisabled()

      expect(
        within(screen.getByTestId('end-date-panel')).getByText('April')
      ).toBeInTheDocument()

      expect(
        within(screen.getByTestId('end-date-panel')).getByText('2025')
      ).toBeInTheDocument()

      expect(
        within(screen.getByTestId('end-date-panel')).getByLabelText(
          'Next Month'
        )
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
          within(screen.getByTestId('start-date-panel')).getByLabelText(
            'Previous Month'
          )
        )

        expect(
          within(screen.getByTestId('start-date-panel')).getByLabelText(
            'Next Month'
          )
        ).toBeEnabled()

        expect(
          within(screen.getByTestId('end-date-panel')).getByLabelText(
            'Previous Month'
          )
        ).toBeEnabled()
      }
    )

    it('should update month in the panel header when click on previous or next button', async () => {
      setupUncontrolledPicker(fixedDate, DateRangePicker as AnyPickerComponent)

      await userEvent.click(screen.getByLabelText('Choose Date Range'))

      await userEvent.click(
        within(screen.getByTestId('start-date-panel')).getByLabelText(
          'Previous Month'
        )
      )

      expect(
        within(screen.getByTestId('start-date-panel')).getByText('February')
      ).toBeInTheDocument()

      await userEvent.click(
        within(screen.getByTestId('start-date-panel')).getByLabelText(
          'Next Month'
        )
      )

      expect(
        within(screen.getByTestId('start-date-panel')).getByText('March')
      ).toBeInTheDocument()
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
