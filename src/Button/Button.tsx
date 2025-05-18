import ConditionalWrapper from '../ConditionalWrapper'
import { cx } from '../utils'

import buttonStyles, { type VariantButtonProps } from './Button.styles'

import type { ButtonHTMLAttributes, FC, ReactNode, RefObject } from 'react'

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    VariantButtonProps {
  label: ReactNode
  ref?: RefObject<HTMLButtonElement | null>
}

const Button: FC<ButtonProps> = ({
  className,
  disabled,
  label,
  loading,
  onBlur,
  onClick,
  size,
  ref,
  variant,
  color,
  ...rest
}) => {
  return (
    <button
      className={cx(buttonStyles({ size, variant, color, loading, className }))}
      disabled={disabled ?? !!loading}
      onClick={(e) => {
        onClick?.(e)
      }}
      onBlur={onBlur}
      ref={ref}
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
          <div
            id="spinner"
            className={cx('button-loader button-loader-sm', {
              'size-5': size === 'md',
              'size-4': size === 'sm',
            })}
          />
        </span>
      )}
    </button>
  )
}

export default Button
