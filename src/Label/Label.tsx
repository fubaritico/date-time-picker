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
  /* Text input size: 'small' | 'medium' | 'large'  */
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
        'flex items-center text-gray-900 font-medium w-full',
        {
          'text-gray-400': disabled,
          '!text-md': size === 'large',
          '!text-sm': size === 'medium',
          '!text-xs': size === 'small',
        },
        className
      )}
      htmlFor={label.replace(/\s/g, '')}
    >
      <span className="inline-flex items-start">
        {required && <span className="text-red-500 mr-0.5">*</span>}
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
