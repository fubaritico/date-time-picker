import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import MockDate from 'mockdate'

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
    MockDate.set(fixedDate) // some arbitrary date
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

  it.skip("should focus on the current date if there's no selected date when calendar panel is open", async () => {
    setup(fixedDate, DateTimePicker as AnyPickerComponent)

    const user = userEvent.setup()

    await user.keyboard('{Tab}')
    await user.keyboard('{Tab}')
    await user.keyboard('{Enter}')

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it.skip('should focus on the selected date when calendar panel is open', async () => {})

  it.skip(
    'should focus on the first date of the month ' +
      "if the grid doesn't have selected date or current date when calendar panel is open",
    async () => {}
  )

  it.skip('should move the selection to the previous element when "shift + tab" keys are pressed', async () => {})

  it.skip('should move the selection to the next element when "tab" key is pressed', async () => {})

  it.skip('should select the focused date when "enter" or "space" key is pressed', async () => {})

  it.skip('should be possible to focus date using arrows keys in the date grid', async () => {})

  it.skip('should change the grid of dates to the previous month when "Page up" key is pressed', async () => {})

  it.skip('should move focus to the day of the month that has the same number, and if that day does not exist, move focus to the last day of the month when "Page up" key is pressed', async () => {})

  it.skip('should changes the grid of dates to the next month when "Page down" key is pressed', async () => {})

  it.skip('should move focus to the day of the month that has the same number. and if that day does not exist, move focus to the last day of the month when "Page down" key is pressed', async () => {})

  it.skip('should be possible to access months panel and select a month using "tab" and "enter" keys', async () => {})

  it.skip('should be possible to access years panel and select a year using "tab" and "enter" keys', async () => {})

  it.skip('should be possible to access time panel and select a time using "tab" and "enter" keys', async () => {})
})
