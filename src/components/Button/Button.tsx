import clsx from 'clsx'

import ConditionalWrapper from '../ConditionalWrapper'

import type {
  ButtonHTMLAttributes,
  FC,
  ReactNode,
  RefObject,
  SVGProps,
} from 'react'

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /* Button color */
  color?: UIColor
  /* Icon as a React component */
  icon?: FC<SVGProps<SVGSVGElement>>
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
  icon: Icon,
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
        { loading: loading, 'not-rounded': notRounded, 'has-icon': !!Icon },
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
          {Icon && <Icon />}
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
