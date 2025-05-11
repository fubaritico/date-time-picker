import clsx from 'clsx'

import ConditionalWrapper from '../ConditionalWrapper'

import type { ButtonHTMLAttributes, FC, ReactNode, RefObject } from 'react'

export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'color'
> & {
  color?: UIColor
  label: ReactNode
  loading?: boolean
  ref?: RefObject<HTMLButtonElement | null>
  size?: UISize
  variant: 'primary' | 'secondary'
}

const sizeHeights: Record<UISize, number> = {
  large: 52,
  medium: 42,
  small: 37,
}

const Button: FC<ButtonProps> = ({
  className,
  disabled,
  label,
  loading,
  onBlur,
  onClick,
  size = 'large',
  ref,
  variant,
  ...rest
}) => {
  return (
    <button
      className={clsx(
        'flex justify-between flex-wrap font-normal items-center gap-2',
        'rounded transition-all duration-300',
        {
          'text-xs py-0 px-3': size === 'small',
          'text-sm py-0 px-3': size === 'medium',
          'text-base py-0 px-5': size === 'large',
          'bg-gray-900 border border-gray-900 hover:bg-gray-800 hover:border-gray-800 text-gray-50':
            variant === 'primary',
          'bg-transparent text-gray-900 border border-gray-900 hover:bg-gray-900 hover:text-gray-50':
            variant === 'secondary',
          'cursor-not-allowed': disabled,
          relative: loading,
        },
        className
      )}
      disabled={disabled ?? loading}
      onClick={(e) => {
        onClick?.(e)
      }}
      onBlur={onBlur}
      ref={ref}
      style={{
        height: `${sizeHeights[size].toString()}px`,
      }}
      {...rest}
    >
      <ConditionalWrapper
        condition={loading ?? false}
        wrapper={(c) => <span className="opacity-0">{c}</span>}
      >
        {label}
      </ConditionalWrapper>
      {loading && (
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="button-loader button-loader-sm" />
        </span>
      )}
    </button>
  )
}

export default Button
