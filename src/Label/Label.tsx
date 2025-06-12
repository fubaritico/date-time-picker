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
        'dp-flex dp-items-start dp-text-gray-900 dark:dp-text-gray-100 dp-font-medium dp-w-full',
        {
          'dp-text-gray-400': disabled,
          'dp-text-sm': size === 'lg',
          'dp-text-xs': size === 'md' || size === 'sm' || !size,
        },
        className
      )}
      htmlFor={label.replace(/\s/g, '')}
    >
      <span className="dp-inline-flex dp-items-start">
        {required && <span className="dp-text-red-500 dp-mr-0.5">*</span>}
        {label}
      </span>
      {labelInfo && (
        <Icon
          name="HiMiniQuestionMarkCircle"
          className={clsx('dp-ml-1 dp-inline', {
            'dp-text-gray-400': disabled,
            'dp-text-gray-900 dp-cursor-pointer': !disabled,
            'dp-mt-1': size === 'lg',
            'dp-mt-0.5': size === 'md' || size === 'sm' || !size,
          })}
        />
      )}
    </label>
  )
}

export default Label
