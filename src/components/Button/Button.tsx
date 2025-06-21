import clsx from 'clsx'

import ConditionalWrapper from '../ConditionalWrapper'
import Icon from '../Icon'

import type { ButtonHTMLAttributes, FC, ReactNode, RefObject } from 'react'

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /* Button color */
  color?: UIColor
  /* Hero icon names for defining icon to display */
  icon?: Hi2UiIconNames
  /* Icon set to use */
  iconPosition?: 'left' | 'right'
  /* If true, will display a loading animation instead of the label */
  loading?: boolean
  /* Button label */
  label: ReactNode
  /* If true, the button, when variant is 'ghost', won't have any border radius. */
  notRounded?: boolean
  /* Button ref for external call */
  ref?: RefObject<HTMLButtonElement | null>
  /* Panel size: 'sm' | 'md' | 'lg'  */
  size?: UISize
  /* Button variants */
  variant?: 'primary' | 'secondary' | 'ghost'
}

const Button: FC<ButtonProps> = ({
  className,
  disabled,
  icon,
  iconPosition = 'left',
  label,
  loading,
  notRounded,
  onBlur,
  onClick,
  size = 'md',
  ref,
  variant,
  color,
  ...rest
}) => {
  return (
    <button
      className={clsx(
        'Button',
        size,
        variant,
        color,
        iconPosition,
        { loading: loading, 'not-rounded': notRounded, 'has-icon': !!icon },
        className
      )}
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
        wrapper={(c) => <span className="hidden-content">{c}</span>}
      >
        <>
          {icon && <Icon name={icon} />}
          <span>{label}</span>
        </>
      </ConditionalWrapper>
      {loading && (
        <span className="spinner-container">
          <div className="spinner" />
        </span>
      )}
    </button>
  )
}

export default Button
