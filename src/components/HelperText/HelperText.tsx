import clsx from 'clsx'

import type { FC, PropsWithChildren } from 'react'

export interface HelperTextProps {
  /* Extra CSS styles (tailwind) */
  className?: string
  /* Error messages displayed on error under the input text */
  errors?: string[]
  /* Information message displayed under the input text */
  helperText?: string
  /* Text input size: 'sm' | 'md' | 'lg'  */
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
    <div className={clsx('dp-flex dp-flex-col dp-gap-1', className)}>
      {children}
      {helperText && (
        <p
          className={clsx('dp-text-gray-500 dp-text-sm dp-mt-1', {
            '!dp-text': size === 'lg',
            '!dp-text-sm': size === 'md',
            '!dp-text-xs': size === 'sm',
          })}
        >
          {helperText}
        </p>
      )}
      {filteredErrors?.map((error) => (
        <p
          className={clsx('dp-text-red-500 dp-text-sm mt-1', {
            '!dp-text': size === 'lg',
            '!dp-text-sm': size === 'md',
            '!dp-text-xs': size === 'sm',
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
