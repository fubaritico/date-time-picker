import { ConditionalWrapper } from '@components'

import { cx } from '../../utils'

import dateBrowserButtonStyles from './DateBrowserButton.styles'

import type { VariantDateBrowserButtonProps } from './DateBrowserButton.styles'
import type { ComponentProps, FC, ReactNode } from 'react'

export interface DateBrowserButtonProps
  extends Omit<ComponentProps<'button'>, 'color'>,
    VariantDateBrowserButtonProps {
  /* If true, the component will render a button leading to either the month or year panel */
  hasDatePickerMode: boolean
  /* The button label */
  label: ReactNode
  /* The function called by the button if a button is rendered */
  onClick: () => void
}

const DateBrowserButton: FC<DateBrowserButtonProps> = ({
  hasDatePickerMode,
  color,
  label,
  onClick,
  size,
  ...rest
}) => {
  return (
    <ConditionalWrapper
      condition={hasDatePickerMode}
      wrapper={(children: ReactNode) => (
        <button
          aria-label={rest['aria-label'] ?? 'Select Date'}
          className={cx(dateBrowserButtonStyles({ color, size }))}
          onClick={onClick}
        >
          {children}
        </button>
      )}
    >
      <span>{label}</span>
    </ConditionalWrapper>
  )
}

export default DateBrowserButton
