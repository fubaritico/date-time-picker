import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { FC, PropsWithChildren } from 'react'

export interface HelperTextProps {
  /* Extra CSS styles (tailwind) */
  className?: string
  /* Error messages displayed on error under the input text */
  errors?: string[]
  /* Information message displayed under the input text */
  helperText?: string
  /* Text input size: 'small' | 'medium' | 'large'  */
  size?: UISize
}

const HelperText: FC<PropsWithChildren<HelperTextProps>> = ({
  children,
  className,
  errors,
  helperText,
  size,
}) => {
  const filteredErrors = errors?.filter(Boolean)

  return (
    <div className={twMerge(clsx('flex flex-col gap-1', className))}>
      {children}
      {helperText && (
        <p
          className={clsx('text-gray-500 text-sm mt-1', {
            '!text': size === 'large',
            '!text-sm': size === 'medium',
            '!text-xs': size === 'small',
          })}
        >
          {helperText}
        </p>
      )}
      {filteredErrors?.map((error) => (
        <p
          className={clsx('text-red-500 text-sm mt-1', {
            '!text': size === 'large',
            '!text-sm': size === 'medium',
            '!text-xs': size === 'small',
          })}
          key={error}
        >
          {error}
        </p>
      ))}
    </div>
  )
}

export default HelperText
