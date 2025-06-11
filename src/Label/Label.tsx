import clsx from 'clsx'

import Icon from '../Icon'

import type { FC } from 'react'

export interface LabelProps {
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
}) => {
  return (
    <label
      className={clsx(
        'dp-flex dp-items-center dp-text-gray-900 dp-font-medium dp-w-full',
        {
          'dp-text-gray-400': disabled,
          'dp-!text-md': size === 'lg',
          'dp-!text-sm': size === 'md',
          'dp-!text-xs': size === 'sm',
        },
        className
      )}
      htmlFor={label.replace(/\s/g, '')}
    >
      <span className="dp-inline-flex dp-items-start">
        {required && <span className="dp-text-red-500 dp-mr-0.dp-5">*</span>}
        {label}
      </span>
      {labelInfo && (
        <Icon
          name="HiMiniQuestionMarkCircle"
          className={clsx('ml-1', {
            'text-gray-400': disabled,
            'text-gray-900 cursor-pointer': !disabled,
          })}
        />
      )}
    </label>
  )
}

export default Label
