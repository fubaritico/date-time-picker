import clsx from 'clsx'

import { ConditionalWrapper } from '@components'

import type { ComponentProps, FC, ReactNode } from 'react'

export interface PanelHeaderButtonProps
  extends Omit<ComponentProps<'button'>, 'color'> {
  /* Component theme color, overrides default color */
  color?: UIColor
  /* If true, the component will render a clickable button */
  disabled?: boolean
  /* The button label */
  label: ReactNode
  /* The function called by the button if a button is rendered */
  onClick?: () => void
  /* Component size: 'sm' | 'md' | 'lg' */
  size?: UISize
}

const PanelHeaderButton: FC<PanelHeaderButtonProps> = ({
  disabled,
  color,
  label,
  onClick,
  size,
  ...rest
}) => {
  return (
    <ConditionalWrapper
      condition={disabled ?? false}
      wrapper={(children: ReactNode) => (
        <button
          aria-label={rest['aria-label'] ?? 'Select'}
          className={clsx('PanelHeaderButton', color, size)}
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

export default PanelHeaderButton
