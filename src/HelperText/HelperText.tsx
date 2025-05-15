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
    <div className={clsx('flex flex-col gap-1', className)}>
      {children}
      {helperText && (
        <p
          className={clsx('text-gray-500 text-sm mt-1', {
            '!text': size === 'lg',
            '!text-sm': size === 'md',
            '!text-xs': size === 'sm',
          })}
        >
          {helperText}
        </p>
      )}
      {filteredErrors?.map((error) => (
        <p
          className={clsx('text-red-500 text-sm mt-1', {
            '!text': size === 'lg',
            '!text-sm': size === 'md',
            '!text-xs': size === 'sm',
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
