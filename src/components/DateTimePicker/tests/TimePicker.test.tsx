import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MockDate from 'mockdate'

import {
  addHours,
  addMinutes,
  convertTo12Hour,
  formatHumanReadableDate,
  formatTimestampForTextInput,
  formatToLocaleAwareFormat,
  getHours,
  getMinutes,
  padNumber,
  subtractHours,
  subtractMinutes,
} from '@utils'

import { TIME_FORMAT } from '../formats'
import TimePicker from '../TimePicker'

import {
  dateSpanTestId,
  localeAwareFormat,
  setup,
  setupAsControlled,
} from './utils'

import type { AnyPickerComponent, AnyPickerProps } from '../types'

const spyOnDateChangeFn = jest.fn()

const runTests = (timezone?: Timezone) => {
  const fixedDate = 1742052493000 // 2025-03-15T15:28:13.000Z

  beforeEach(() => {
    MockDate.set(fixedDate)
  })

  afterEach(() => {
    MockDate.reset()
  })

  /**
   * When uncontrolled the default value should be that of today.
   */
  describe('Basic behavior', () => {
    it('should pass the current time as a formatted value to the masked input', async () => {
      const expectedValue = formatTimestampForTextInput(
        Date.now(),
        TIME_FORMAT.en,
        0
      )

      setup(fixedDate, TimePicker as AnyPickerComponent)

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveValue(expectedValue)
      })
    })

    // note that the date is fixed to 2025-03-15T15:28:13.000Z
    // according to the timezone - which in those cases has a small msOffset - results are quite deterministic
    // some specific tests should be written for a greater timezone coverage
    it('should show time panel with the proper state on icon click (en_US, en)', async () => {
      const {
        msOffset,
        render: { container },
      } = setup(fixedDate, TimePicker as AnyPickerComponent, {
        timezone,
        locale: 'en_US',
      })

      if (timezone) expect(container).toMatchSnapshot()

      await userEvent.click(screen.getByLabelText('Choose Time'))

      expect(screen.getByTestId('time-panel')).toBeInTheDocument()

      expect(
        screen.getByText(
          padNumber(convertTo12Hour(getHours(fixedDate + msOffset)))
        )
      ).toBeInTheDocument()

      expect(
        screen.getByText(padNumber(getMinutes(fixedDate + msOffset)))
      ).toBeInTheDocument()

      expect(
        screen.getByRole('button', { name: 'Choose AM' })
      ).toBeInTheDocument()

      expect(
        screen.getByRole('button', { name: 'Choose PM' })
      ).toBeInTheDocument()

      expect(screen.getByRole('button', { name: 'Choose PM' })).toHaveClass(
        'selected'
      )
    })

    it('should show time panel with the proper state on icon click (fr-FR, fr_FR, fr)', async () => {
      const {
        msOffset,
        render: { container },
      } = setup(fixedDate, TimePicker as AnyPickerComponent, {
        timezone,
        locale: 'fr_FR', // 'fr' by default, I don't remember, so bear with me
      })

      if (timezone) expect(container).toMatchSnapshot()

      await userEvent.click(screen.getByLabelText('Choose Time'))

      expect(screen.getByTestId('time-panel')).toBeInTheDocument()

      expect(
        screen.getByText(padNumber(getHours(fixedDate + msOffset)))
      ).toBeInTheDocument()

      expect(
        screen.getByText(padNumber(getMinutes(fixedDate + msOffset)))
      ).toBeInTheDocument()

      expect(
        screen.queryByRole('button', { name: 'Choose AM' })
      ).not.toBeInTheDocument()

      expect(
        screen.queryByRole('button', { name: 'Choose PM' })
      ).not.toBeInTheDocument()
    })

    it('should close time panel when clicking outside the panel only', async () => {
      const {
        render: { container },
      } = setup(fixedDate, TimePicker as AnyPickerComponent, {
        timezone,
      })

      if (timezone) expect(container).toMatchSnapshot()

      await userEvent.click(screen.getByLabelText('Choose Time'))

      expect(screen.getByTestId('time-panel')).toBeInTheDocument()

      await userEvent.click(document.body)

      await waitFor(() => {
        expect(screen.queryByRole('time-panel')).not.toBeInTheDocument()
      })
    })

    it('should update the time panel on time selection', async () => {
      setup(fixedDate, TimePicker as AnyPickerComponent)

      await userEvent.click(screen.getByLabelText('Choose Time'))

      await userEvent.click(
        await screen.findByRole('button', { name: 'Add one hour' })
      )

      await userEvent.click(
        await screen.findByRole('button', { name: 'Add one hour' })
      )

      await userEvent.click(
        await screen.findByRole('button', { name: 'Remove one minute' })
      )

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveValue(
          formatTimestampForTextInput(
            addHours(subtractMinutes(fixedDate, 1), 2),
            TIME_FORMAT.en,
            0
          )
        )
      })

      expect(
        screen.getByText(
          formatHumanReadableDate(
            addHours(subtractMinutes(fixedDate, 1), 2),
            'en_US',
            'TIME'
          )
        )
      ).toBeInTheDocument()
    })

    it('should update the state of AM/PM button when changing meridian on time selection', async () => {
      setup(fixedDate, TimePicker as AnyPickerComponent)

      const hoursToRemove = 8 // based on the time zone msOffset, this will change the time from PM to AM
      const hoursToAdd = 4

      await userEvent.click(screen.getByLabelText('Choose Time'))

      expect(screen.getByRole('button', { name: 'Choose AM' })).not.toHaveClass(
        'selected'
      )

      expect(screen.getByRole('button', { name: 'Choose PM' })).toHaveClass(
        'selected'
      )

      for (let i = 0; i < hoursToRemove; i++) {
        await userEvent.click(
          await screen.findByRole('button', { name: 'Remove one hour' })
        )
      }

      for (let i = 0; i < hoursToAdd; i++) {
        await userEvent.click(
          await screen.findByRole('button', { name: 'Add one hour' })
        )
      }

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveValue(
          formatTimestampForTextInput(
            subtractHours(fixedDate, hoursToRemove - hoursToAdd),
            TIME_FORMAT.en,
            0
          )
        )
      })

      expect(
        screen.getByText(
          formatHumanReadableDate(
            subtractHours(fixedDate, hoursToRemove - hoursToAdd),
            'en_US',
            'TIME'
          )
        )
      ).toBeInTheDocument()

      expect(screen.getByRole('button', { name: 'Choose AM' })).toHaveClass(
        'selected'
      )

      expect(screen.getByRole('button', { name: 'Choose PM' })).not.toHaveClass(
        'selected'
      )
    })
  })

  describe('Controlled Time Picker', () => {
    beforeEach(() => {
      spyOnDateChangeFn.mockReset()
    })

    // date used for this set of test: 2024-08-09T16:28:13.000Z
    const defaultProperties: AnyPickerProps = {
      date: 1723220893000, // Aug 9, 2024, 16:28:13 AM - UTC time
      locale: 'en_US',
      timezone,
    }

    it('should render w/ the provided date in the text field', async () => {
      const {
        msOffset,
        render: { container },
      } = setupAsControlled(
        TimePicker as AnyPickerComponent,
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
            innerDate,
            TIME_FORMAT[defaultProperties.locale?.split('_')[0] ?? 'en'],
            0
          )
        )
      })
    })

    it('should call the onDateChange component method with proper value when changing hours', async () => {
      setupAsControlled(
        TimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties,
        spyOnDateChangeFn
      )

      const hoursToBeAdded = 5

      const date = defaultProperties.date ?? Date.now()

      await userEvent.click(screen.getByLabelText('Choose Time'))

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
        TimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties,
        spyOnDateChangeFn
      )

      const date = defaultProperties.date ?? Date.now()

      const minutesToBeAdded = 15
      const minutesToBeRemoved = 5

      await userEvent.click(screen.getByLabelText('Choose Time'))

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
        TimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties,
        spyOnDateChangeFn
      )

      const date = defaultProperties.date ?? Date.now()

      const expectedValue = subtractHours(date, 12)

      await userEvent.click(screen.getByLabelText('Choose Time'))

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

  describe('Controlled Time Picker - (en)', () => {
    const defaultProperties: AnyPickerProps = {
      date: 1723201362000,
      locale: 'en_US',
      pickerMode: 'TIME',
      timezone,
    }

    it('should render w/ the provided date in the text field', async () => {
      const {
        msOffset,
        render: { container },
      } = setupAsControlled(
        TimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties
      )

      const date = defaultProperties.date ?? Date.now()

      if (timezone) {
        expect(container).toMatchSnapshot()
      }

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveValue(
          formatTimestampForTextInput(date + msOffset, TIME_FORMAT.en, 0)
        )
      })
    })
  })

  describe('Controlled Time Picker - (fr)', () => {
    const defaultProperties: AnyPickerProps = {
      date: 1723201362000,
      locale: 'fr_FR',
      timezone,
    }

    it('should render w/ the provided date in the text field', async () => {
      const {
        msOffset,
        render: { container },
      } = setupAsControlled(
        TimePicker as AnyPickerComponent,
        fixedDate,
        defaultProperties
      )

      const date = defaultProperties.date ?? Date.now()

      if (timezone) {
        expect(container).toMatchSnapshot()
      }

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveValue(
          formatTimestampForTextInput(date + msOffset, TIME_FORMAT.fr, 0)
        )
      })
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
describe('TimePicker', () => {
  runTests()
})

/**
 * The same set of test with a given timezone
 * @see: https://stackoverflow.com/questions/38399465/how-to-get-list-of-all-timezones-in-javascript
 */
describe('TimePicker with timezone', () => {
  runTests('America/Argentina/La_Rioja')
})
