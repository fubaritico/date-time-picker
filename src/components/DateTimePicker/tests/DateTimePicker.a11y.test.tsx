import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import MockDate from 'mockdate'

import {
  addHours,
  addMonths,
  addYears,
  formatTimestampForTextInput,
  getMonthNameFromTs,
  getYearFromTs,
  subtractMonths,
} from '@utils'
import { DATE_TIME_FORMAT } from '@components'

import DateTimePicker from '../DateTimePicker'

import { setup } from './utils'

import type { AnyPickerComponent } from '../types'

/**
 * Those tests follow the specifications listed at:
 * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog
 * Note that because the features are organized in a specific ways,
 * some a11y rules are not applicable but adapted.
 * Some other rules were simply not implemented due to their unwanted complexity.
 */
describe('DateTimePicker: accessibility', () => {
  const fixedDate = 1742052493000

  beforeEach(() => {
    MockDate.set(fixedDate)
  })

  afterEach(() => {
    MockDate.reset()
  })

  it('should have no accessibility violations', async () => {
    const {
      render: { container },
    } = setup(fixedDate, DateTimePicker as AnyPickerComponent)

    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })

  it('should open the calendar panel when "enter" key is pressed', async () => {
    setup(fixedDate, DateTimePicker as AnyPickerComponent)

    const user = userEvent.setup()

    await user.keyboard('{Tab}')
    await user.keyboard('{Tab}')

    expect(screen.getByLabelText('Choose Date')).toHaveFocus()

    await user.keyboard('{Enter}')

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should have no accessibility violations when panel is open', async () => {
    const {
      render: { container },
    } = setup(fixedDate, DateTimePicker as AnyPickerComponent)

    const user = userEvent.setup()

    await user.keyboard('{Tab}')
    await user.keyboard('{Tab}')

    expect(screen.getByLabelText('Choose Date')).toHaveFocus()

    await user.keyboard('{Enter}')

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })

  // Space doesn't work when triggered from a focused button
  it.skip('should open the calendar panel when "space" key is pressed', async () => {
    setup(fixedDate, DateTimePicker as AnyPickerComponent)

    const user = userEvent.setup()

    await user.keyboard('{Tab}')
    await user.keyboard('{Tab}')

    expect(screen.getByLabelText('Choose Date')).toHaveFocus()

    await user.keyboard('{Space}')

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should close the calendar panel when "escape" key is pressed', async () => {
    setup(fixedDate, DateTimePicker as AnyPickerComponent)

    const user = userEvent.setup()

    await user.keyboard('{Tab}')
    await user.keyboard('{Tab}')
    await user.keyboard('{Enter}')

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it("should focus on the current date if there's no selected date when calendar panel is open", async () => {
    const { msOffset } = setup(fixedDate, DateTimePicker as AnyPickerComponent)

    const user = userEvent.setup()

    await user.tab()
    await user.tab()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    expect(
      screen.getByText(new Date(fixedDate + msOffset).getDate())
    ).toHaveFocus() // Assuming 15 is the current date in the mocked date
  })

  it('should focus on "Choose Date" button when closing the panel', async () => {
    setup(fixedDate, DateTimePicker as AnyPickerComponent)

    const user = userEvent.setup()

    await user.tab()
    await user.tab()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: 'Choose Date' })).toHaveFocus()
  })

  it('should move the selection to the next element when "tab" key is pressed', async () => {
    setup(fixedDate, DateTimePicker as AnyPickerComponent)

    const user = userEvent.setup()

    await user.tab()

    expect(screen.getByRole('textbox')).toHaveFocus()

    await user.tab()

    expect(screen.getByLabelText('Choose Date')).toHaveFocus()

    await user.keyboard('{Enter}')
  })

  it('should move the selection to the previous element when "shift + tab" keys are pressed', async () => {
    const { msOffset } = setup(fixedDate, DateTimePicker as AnyPickerComponent)

    const user = userEvent.setup()

    await user.tab()

    expect(screen.getByRole('textbox')).toHaveFocus()

    await user.tab()

    expect(screen.getByLabelText('Choose Date')).toHaveFocus()

    await user.keyboard('{Enter}')

    expect(screen.getByText(new Date(fixedDate).getDate())).toHaveFocus()

    await user.tab({ shift: true })

    expect(screen.getByText('1')).toHaveFocus()

    await user.tab({ shift: true })

    expect(screen.getByLabelText('Next Month')).toHaveFocus()

    await user.tab({ shift: true })

    expect(
      screen.getByLabelText(getYearFromTs(fixedDate + msOffset).toString())
    ).toHaveFocus()

    await user.tab({ shift: true })

    expect(
      screen.getByLabelText(getMonthNameFromTs(fixedDate + msOffset))
    ).toHaveFocus()

    await user.tab({ shift: true })

    expect(screen.getByLabelText('Previous Month')).toHaveFocus()

    await user.tab({ shift: true })

    expect(screen.getByLabelText('Switch to time view')).toHaveFocus()

    await user.tab({ shift: true })

    expect(screen.getByLabelText('Switch to days view')).toHaveFocus()

    await user.tab({ shift: true })

    expect(screen.getByLabelText('Choose Date')).toHaveFocus()
  })

  it('should be possible to focus date using arrows keys in the date grid', async () => {
    const { msOffset } = setup(fixedDate, DateTimePicker as AnyPickerComponent)

    const startDate = new Date(fixedDate + msOffset).getDate()

    const user = userEvent.setup()

    await user.tab()
    await user.tab()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    // accessing first day of the grid
    expect(screen.getByText(startDate)).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByText(startDate + 1)).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(screen.getByText(startDate + 1 + 7)).toHaveFocus()

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByText(startDate + 1 + 7 - 1)).toHaveFocus()

    await user.keyboard('{ArrowUp}')
    expect(screen.getByText(startDate + 1 + 7 - 1 - 7)).toHaveFocus()
  })

  it('should focus on the selected date when calendar panel is open', async () => {
    const { msOffset } = setup(fixedDate, DateTimePicker as AnyPickerComponent)

    const oneDayInMs = 86400000
    const user = userEvent.setup()

    await user.tab()
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveFocus()
    })

    await user.tab()
    await waitFor(() => {
      expect(screen.getByLabelText('Choose Date')).toHaveFocus()
    })

    await user.keyboard('{Enter}')
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    expect(
      screen.getByText(new Date(fixedDate + msOffset).getDate())
    ).toHaveFocus()

    await user.tab({ shift: true })

    expect(screen.getByText('1')).toHaveFocus()

    await user.tab({ shift: true })

    expect(screen.getByLabelText('Next Month')).toHaveFocus()

    await user.keyboard('{Enter}')

    expect(
      screen.getByText(new Date(addMonths(fixedDate, 1) + msOffset).getDate())
    ).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    await user.keyboard('{ArrowRight}')

    expect(
      screen.getByText(
        new Date(addMonths(fixedDate, 1) + oneDayInMs * 2 + msOffset).getDate()
      )
    ).toHaveFocus()

    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    expect(
      screen.getByText(
        new Date(addMonths(fixedDate, 1) + oneDayInMs * 2 + msOffset).getDate()
      )
    ).toHaveFocus()
  })

  it('should change the grid of dates to the previous month when "Page down" key is pressed', async () => {
    const { msOffset } = setup(fixedDate, DateTimePicker as AnyPickerComponent)

    const user = userEvent.setup()

    await user.tab()
    await user.tab()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    expect(
      screen.getByText(new Date(fixedDate + msOffset).getDate())
    ).toHaveFocus()

    await user.keyboard('{PageDown}')
    await user.keyboard('{PageDown}')

    expect(
      screen.getByText(
        new Date(subtractMonths(fixedDate, 2) + msOffset).getDate()
      )
    ).toHaveFocus()
  })

  it(
    'should move focus to the day of the month that has the same number, and if that day does not exist,' +
      'move focus to the last day of the month when "Page down" key is pressed',
    async () => {
      const { msOffset } = setup(
        fixedDate,
        DateTimePicker as AnyPickerComponent
      )

      const oneDayInMs = 86400000
      const user = userEvent.setup()

      await user.tab()
      await user.tab()
      await user.keyboard('{Enter}')

      expect(screen.getByRole('dialog')).toBeInTheDocument()

      expect(
        screen.getByText(new Date(fixedDate + msOffset).getDate())
      ).toHaveFocus()

      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')

      expect(
        screen.getByText(
          new Date(fixedDate + 14 * oneDayInMs + msOffset).getDate() // Le 29 mars 2025
        )
      ).toHaveFocus()

      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      await user.keyboard('{Enter}')

      await user.keyboard('{PageDown}')

      expect(screen.getByText('28')).toHaveFocus() // Le 28 février 2025
    }
  )

  it('should changes the grid of dates to the next month when "Page Up" key is pressed', async () => {
    const { msOffset } = setup(fixedDate, DateTimePicker as AnyPickerComponent)

    const user = userEvent.setup()

    await user.tab()
    await user.tab()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    expect(
      screen.getByText(new Date(fixedDate + msOffset).getDate())
    ).toHaveFocus()

    await user.keyboard('{PageUp}')
    await user.keyboard('{PageUp}')

    expect(
      screen.getByText(new Date(addMonths(fixedDate, 2) + msOffset).getDate())
    ).toHaveFocus()
  })

  it('should move focus to the day of the month that has the same number, and if that day does not exist, move focus to the last day of the month when "Page up" key is pressed', async () => {
    const { msOffset } = setup(fixedDate, DateTimePicker as AnyPickerComponent)

    const oneDayInMs = 86400000
    const user = userEvent.setup()

    await user.tab()
    await user.tab()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    expect(
      screen.getByText(new Date(fixedDate + msOffset).getDate())
    ).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{ArrowRight}')
    await user.keyboard('{ArrowRight}')

    expect(
      screen.getByText(
        new Date(fixedDate + 16 * oneDayInMs + msOffset).getDate() // Le 31 mars 2025
      )
    ).toHaveFocus()

    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    await user.keyboard('{Enter}')

    await user.keyboard('{PageUp}')

    expect(screen.getByText('30')).toHaveFocus() // Le 30 avril 2025
  })

  it('should be possible to access months panel and select a month using "tab" and "enter" keys', async () => {
    const { msOffset } = setup(fixedDate, DateTimePicker as AnyPickerComponent)

    const user = userEvent.setup()

    await user.tab()
    await user.tab()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.tab({ shift: true })
    await user.tab({ shift: true })
    await user.tab({ shift: true })
    await user.tab({ shift: true })

    expect(
      screen.getByLabelText(getMonthNameFromTs(fixedDate + msOffset))
    ).toHaveFocus()

    await user.keyboard('{Enter}')

    expect(
      screen.getByLabelText(
        'Choose ' + getMonthNameFromTs(fixedDate + msOffset)
      )
    ).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    await user.keyboard('{ArrowRight}')

    await user.keyboard('{Enter}')

    expect(screen.getByTestId('date-panel')).toBeInTheDocument()

    expect(
      screen.getByLabelText(
        getMonthNameFromTs(addMonths(fixedDate + msOffset, 2))
      )
    ).toBeInTheDocument()

    expect(screen.getByRole('textbox')).toHaveValue(
      formatTimestampForTextInput(
        addMonths(fixedDate + msOffset, 2),
        DATE_TIME_FORMAT.en,
        0
      ).replaceAll('-', '/')
    )
  })

  it('should be possible to access years panel and select a year using "tab" and "enter" keys', async () => {
    const { msOffset } = setup(fixedDate, DateTimePicker as AnyPickerComponent)

    const user = userEvent.setup()

    await user.tab()
    await user.tab()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.tab({ shift: true })
    await user.tab({ shift: true })
    await user.tab({ shift: true })

    expect(
      screen.getByLabelText(getYearFromTs(fixedDate + msOffset))
    ).toHaveFocus()

    await user.keyboard('{Enter}')

    expect(
      screen.getByLabelText(
        'Choose ' + getYearFromTs(fixedDate + msOffset).toString()
      )
    ).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    await user.keyboard('{ArrowRight}')

    await user.keyboard('{Enter}')

    expect(screen.getByTestId('date-panel')).toBeInTheDocument()

    expect(
      screen.getByLabelText(getYearFromTs(addYears(fixedDate + msOffset, 2)))
    ).toBeInTheDocument()

    expect(screen.getByRole('textbox')).toHaveValue(
      formatTimestampForTextInput(
        addYears(fixedDate + msOffset, 2),
        DATE_TIME_FORMAT.en,
        0
      ).replaceAll('-', '/')
    )
  })

  it('should be possible to access time panel and select a time using "tab" and "enter" keys', async () => {
    const { msOffset } = setup(fixedDate, DateTimePicker as AnyPickerComponent)

    const user = userEvent.setup()

    await user.tab()
    await user.tab()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.tab({ shift: true })
    await user.tab({ shift: true })
    await user.tab({ shift: true })
    await user.tab({ shift: true })
    await user.tab({ shift: true })
    await user.tab({ shift: true })

    expect(screen.getByLabelText('Switch to time view')).toHaveFocus()

    await user.keyboard('{Enter}')

    expect(screen.getByTestId('time-panel')).toBeInTheDocument()

    await user.tab()

    expect(screen.getByLabelText('Add one hour')).toHaveFocus()

    await user.keyboard('{Enter}')
    await user.keyboard('{Enter}')
    await user.keyboard('{Enter}')

    expect(screen.getByRole('textbox')).toHaveValue(
      formatTimestampForTextInput(
        addHours(fixedDate + msOffset, 3),
        DATE_TIME_FORMAT.en,
        0
      ).replaceAll('-', '/')
    )

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    expect(screen.getByLabelText('Choose Date')).toHaveFocus()
  })
})
