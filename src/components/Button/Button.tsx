import { cx } from '@utils'

import ConditionalWrapper from '../ConditionalWrapper'
import Icon from '../Icon'

import buttonStyles from './Button.native.styles'

import type { VariantButtonProps } from './Button.native.styles'
import type { ButtonHTMLAttributes, FC, ReactNode, RefObject } from 'react'

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    VariantButtonProps {
  icon?: Hi2UiIconNames
  label: ReactNode
  ref?: RefObject<HTMLButtonElement | null>
}

const Button: FC<ButtonProps> = ({
  className,
  disabled,
  icon,
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
      {icon && !loading && <Icon name={icon} />}
      <ConditionalWrapper
        condition={loading ?? false}
        wrapper={(c) => <span className="dp-opacity-0">{c}</span>}
      >
        {label}
      </ConditionalWrapper>
      {loading && (
        <span className="dp-absolute dp-top-1/2 dp-left-1/2 -dp-translate-x-1/2 -dp-translate-y-1/2">
          <div
            id="spinner"
            className={cx('dp-button-loader dp-button-loader-sm', {
              'dp-size-5': size === 'md',
              'dp-size-4': size === 'sm',
            })}
          />
        </span>
      )}
    </button>
  )
}

export default Button
