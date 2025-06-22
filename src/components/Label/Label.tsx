import clsx from 'clsx'

import Icon from '../Icon'

import type { ComponentProps, FC } from 'react'

export interface LabelProps extends ComponentProps<'label'> {
  /* Extra CSS classes (tailwind) */
  className?: string
  /* Parent input is disabled */
  disabled?: boolean
  /* Text input label */
  label: string
  /* Information displayed on hovering the exclamation mark in a tooltip */
  labelInfo?: string
  /* Text input size: 'sm' | 'md' | 'lg'  */
  size?: UISize
  /* Parent input is required */
  required?: boolean
}

const Label: FC<LabelProps> = ({
  className,
  disabled,
  labelInfo,
  label,
  size,
  required,
  ...rest
}) => {
  return (
    <label
      className={clsx('Label', className, size, { disabled: disabled })}
      htmlFor={label.replace(/\s/g, '')}
      {...rest}
    >
      <span className={clsx('text', { required: required })}>{label}</span>
      {labelInfo && <Icon name="HiMiniQuestionMarkCircle" />}
    </label>
  )
}

export default Label
