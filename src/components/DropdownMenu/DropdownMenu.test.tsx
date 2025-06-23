import { act, render, screen, waitFor, within } from '@testing-library/react'
import user from '@testing-library/user-event'

import DropdownMenu, { DropdownMenuProps } from './DropdownMenu'
import Integration from './DropdownMenu.integration'
import { selectableMenuItems } from './mock'

import type { MenuItemConfig } from '@components'

export const actionsMenuItems: MenuItemConfig[] = [
  {
    label: 'Quick save ',
    onButtonClick: jest.fn(),
    type: 'action',
  },
  {
    label: 'Save',
    onButtonClick: jest.fn(),
    type: 'action',
  },
  {
    label: 'Reassign',
    onButtonClick: jest.fn(),
    type: 'action',
  },
  {
    label: 'Edit',
    onButtonClick: jest.fn(),
    type: 'action',
  },
  {
    label: 'Delete',
    onButtonClick: jest.fn(),
    type: 'action',
  },
]

const setupControlledDropdown = (args: DropdownMenuProps) => {
  const { container } = render(
    <Integration {...args}>
      {({ props, currentValue, setCurrentValue }) => (
        <DropdownMenu
          {...props}
          value={currentValue}
          onValueChange={setCurrentValue}
        />
      )}
    </Integration>
  )

  return { container }
}

const setupDropdown = (props: DropdownMenuProps) => {
  const { container } = render(<DropdownMenu {...props} />)

  return { container }
}

describe('DropdownMenu', () => {
  describe('Selectable', () => {
    const initialProps: DropdownMenuProps = {
      items: selectableMenuItems,
      buttonLabel: 'Select a value',
    }

    it('should render', () => {
      const { container } = setupControlledDropdown(initialProps)

      expect(container).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: initialProps.buttonLabel as string })
      ).toBeInTheDocument()

      expect(container).toMatchSnapshot()
    })

    it('should render menu on label/button click', async () => {
      const { container } = setupControlledDropdown(initialProps)

      await act(async () => {
        await user.click(
          screen.getByRole('button', {
            name: initialProps.buttonLabel as string,
          })
        )
      })

      expect(await screen.findByTestId('dropdown-menu')).toBeInTheDocument()
      expect(container).toMatchSnapshot()
    })

    // triggers warning
    it('should not render menu on document/body click', async () => {
      setupControlledDropdown(initialProps)

      await act(async () => {
        await user.click(
          screen.getByRole('button', {
            name: initialProps.buttonLabel as string,
          })
        )
      })

      expect(await screen.findByTestId('dropdown-menu')).toBeInTheDocument()

      await act(async () => {
        await user.click(document.body)
      })

      await waitFor(() => {
        expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument()
      })
    })

    // triggers warning
    it('should hide the dropdown list on item selection/click', async () => {
      setupControlledDropdown(initialProps)

      await act(async () => {
        await user.click(
          screen.getByRole('button', {
            name: initialProps.buttonLabel as string,
          })
        )
      })

      expect(await screen.findByTestId('dropdown-menu')).toBeInTheDocument()

      await act(async () => {
        await user.click(
          within(screen.getByTestId('dropdown-menu')).getAllByRole('button', {
            hidden: true,
          })[0]
        )
      })

      // triggers warning if a disappearance is asserted (transition seems tobe involved)
      // await waitForElementToBeRemoved(() =>
      //   screen.queryByTestId('dropdown-menu')
      // )
      await waitFor(() => {
        expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument()
      })
    })

    // triggers warning
    it('should display selected value when "showSelectedValue" is true on item selection/click', async () => {
      const showSelectedValueProps: DropdownMenuProps = {
        ...initialProps,
        showSelectedValue: true,
      }

      setupControlledDropdown(showSelectedValueProps)

      await act(async () => {
        await user.click(
          screen.getByRole('button', {
            name: initialProps.buttonLabel as string,
          })
        )
      })

      expect(await screen.findByTestId('dropdown-menu')).toBeInTheDocument()

      await act(async () => {
        await user.click(
          within(screen.getByTestId('dropdown-menu')).getAllByRole('button', {
            hidden: true,
          })[0]
        )
      })

      await waitFor(() => {
        expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument()
      })

      expect(
        screen.getByRole('button', {
          name: initialProps.buttonLabel as string,
        })
      ).toHaveTextContent((selectableMenuItems[0].label as string).trim())
    })

    it('should display menu item as selected after selection when "showSelectedValue" is true', async () => {
      const showSelectedValueProps: DropdownMenuProps = {
        ...initialProps,
        showSelectedValue: true,
      }

      setupControlledDropdown(showSelectedValueProps)

      await act(async () => {
        await user.click(
          screen.getByRole('button', {
            name: initialProps.buttonLabel as string,
          })
        )
      })

      await act(async () => {
        await user.click(
          within(await screen.findByTestId('dropdown-menu')).getAllByRole(
            'button',
            {
              hidden: true,
            }
          )[0]
        )
      })

      await act(async () => {
        await user.click(
          screen.getByRole('button', {
            name: initialProps.buttonLabel as string,
          })
        )
      })

      expect(
        within(screen.getByTestId('dropdown-menu')).getAllByRole('listitem', {
          hidden: true,
        })[0]
      ).toHaveClass('selected')

      expect(
        within(screen.getByTestId('dropdown-menu')).getAllByRole('button', {
          hidden: true,
        })[0]
      ).toHaveAttribute('aria-current', 'true')
    })

    it('should display menu item as selected and selected value in label placeholder after if value is passed when "showSelectedValue" is true', async () => {
      const showSelectedValueProps: DropdownMenuProps = {
        ...initialProps,
        showSelectedValue: true,
        value: selectableMenuItems[1].value,
      }

      setupControlledDropdown(showSelectedValueProps)

      expect(
        screen.getByText(selectableMenuItems[1].label as string)
      ).toBeInTheDocument()

      await act(async () => {
        await user.click(
          screen.getByRole('button', {
            name: 'Select a value',
          })
        )
      })

      expect(
        within(screen.getByTestId('dropdown-menu')).getAllByRole('listitem', {
          hidden: true,
        })[1]
      ).toHaveClass('selected')

      expect(
        within(screen.getByTestId('dropdown-menu')).getAllByRole('button', {
          hidden: true,
        })[1]
      ).toHaveAttribute('aria-current', 'true')
    })
  })

  describe('Actions', () => {
    const initialProps: DropdownMenuProps = {
      items: actionsMenuItems,
      buttonLabel: 'Select an action',
    }

    it('should call action function on menu item click', async () => {
      setupDropdown(initialProps)

      await act(async () => {
        await user.click(
          screen.getByRole('button', {
            name: initialProps.buttonLabel as string,
          })
        )
      })

      expect(await screen.findByTestId('dropdown-menu')).toBeInTheDocument()

      await act(async () => {
        await user.click(
          within(screen.getByTestId('dropdown-menu')).getAllByRole('button', {
            hidden: true,
          })[0]
        )
      })

      await waitFor(() => {
        expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument()
      })

      expect(actionsMenuItems[0].onButtonClick).toHaveBeenCalledTimes(1)
    })

    it('should not change display state of the dropdown after action click (label, selection)', async () => {
      setupDropdown(initialProps)

      await act(async () => {
        await user.click(
          screen.getByRole('button', {
            name: initialProps.buttonLabel as string,
          })
        )
      })

      await act(async () => {
        await user.click(
          within(screen.getByTestId('dropdown-menu')).getAllByRole('button', {
            hidden: true,
          })[0]
        )
      })

      await waitFor(() => {
        expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument()
      })

      expect(
        screen.getByText(initialProps.buttonLabel as string)
      ).toBeInTheDocument()

      await act(async () => {
        await user.click(screen.getByText(initialProps.buttonLabel as string))
      })

      expect(
        within(screen.getByTestId('dropdown-menu')).getAllByRole('button', {
          hidden: true,
        })[0]
      ).not.toHaveClass('!bg-blue-100 hover:!bg-blue-200 !text-blue-500')

      expect(
        within(screen.getByTestId('dropdown-menu')).getAllByRole('button', {
          hidden: true,
        })[0]
      ).toHaveAttribute('aria-current', 'false')
    })
  })
})
