import clsx from 'clsx'
import { forwardRef, useEffect, useRef, useState } from 'react'

import { createCustomChangeEvent, handleKeyDown } from '@utils'

import HelperText from '../HelperText'
import Label from '../Label'

import { ReactComponent as HiXMark } from '../../assets/svg/HiXMark.svg'

import type {
  ChangeEvent,
  ComponentProps,
  FC,
  ForwardedRef,
  KeyboardEvent,
  RefObject,
  SVGProps,
} from 'react'

export interface TextFieldProps
  extends Omit<ComponentProps<'input'>, 'onChange' | 'size' | 'color'> {
  /* Extra CSS styles (tailwind) */
  className?: string
  /* Theme color, defaults to 'blue' */
  color?: UIColor
  /* Extra CSS styles (tailwind) for the root element (container) */
  containerClassName?: string
  /* If true, an icon button will show on hovering the input and will allow clearing the content of the text input on click */
  canClear?: boolean
  /* For test purposes only */
  containerDataTest?: string
  /* Error messages displayed under the input text when an error occurs */
  errors?: string[]
  /* [a11y] When true, will bring the focus on the icon button */
  focusIconButton?: boolean
  /* Information message displayed under the input text */
  helperText?: string
  /* If true, no focus state is shown on focus */
  hideFocus?: boolean
  /* Icon aria label for accessibility and tests*/
  iconAriaLabel?: string
  /* Icon as a React component */
  icon?: FC<SVGProps<SVGSVGElement>>
  /* Icon set to use */
  iconPosition?: 'left' | 'right'
  /* Icon ref for special use cases */
  iconRef?: RefObject<HTMLElement | null>
  /* Text input label */
  label?: string
  /* Information displayed on hovering the exclamation mark in a tooltip */
  labelInfo?: string
  /* Redefined onChange handler to meet native specifications */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  /* Callback called on icon click if present */
  onIconClick?: (ref?: ForwardedRef<HTMLInputElement>) => void
  /* If true, the icon click will not be prevented by the disabled state of the input */
  preserveIconClick?: boolean
  /* Text input severity, translated into colors: 'success' | 'error' | 'warning' | 'info' */
  severity?: Severity
  /* Text input size: 'sm' | 'md' | 'lg'  */
  size?: UISize
  /* Text input type */
  type?:
    | 'number'
    | 'file'
    | 'checkbox'
    | 'email'
    | 'password'
    | 'radio'
    | 'search'
    | 'tel'
    | 'text'
    | 'toggler'
    | 'url'
  /* Text input value for controlled cases */
  value?: string
}

const TextField: FC<TextFieldProps> = forwardRef<
  HTMLInputElement,
  TextFieldProps
>(
  (
    {
      className,
      color = 'blue',
      containerClassName,
      containerDataTest,
      canClear = false,
      disabled,
      errors,
      focusIconButton,
      helperText,
      hideFocus,
      iconAriaLabel,
      icon: Icon,
      iconPosition = 'left',
      iconRef,
      label,
      labelInfo,
      onChange,
      onIconClick,
      onFocus,
      preserveIconClick = false,
      placeholder,
      required,
      severity,
      size = 'md',
      type = 'text',
      value,
      ...rest
    },
    ref
  ) => {
    const [showCross, setShowCross] = useState(false)
    const initRef = useRef(false)
    const isProgrammaticFocus = useRef(false)

    /**
     * Handle the cross-button click to reset the input value.
     */
    const onReset = () => {
      const customEvent = createCustomChangeEvent('')
      onChange?.(customEvent)
    }

    /**
     * [a11y] Manage the input keyboard behavior by explicitly
     * handling the Tab and Shift+Tab keys to unlock the tabulation.
     *
     * @param {KeyboardEvent} e
     */
    const onIconButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault()
        const input = e.currentTarget.parentElement?.querySelector('input')
        input?.focus()
        return
      }

      if (!isProgrammaticFocus.current) {
        handleKeyDown(() => {
          if (!disabled || preserveIconClick) onIconClick?.(ref)
        })(e)
      }
    }

    /**
     * Handle the icon button click.
     */
    const onIconButtonClick = () => {
      if (!isProgrammaticFocus.current) {
        if (!disabled || preserveIconClick) onIconClick?.(ref)
      }
    }

    /**
     * [a11y] Focus the icon button when focusIconButton is true
     */
    useEffect(() => {
      if (iconRef?.current && focusIconButton && initRef.current) {
        isProgrammaticFocus.current = true
        setTimeout(() => {
          iconRef.current?.focus()
        }, 0)
        // Reinit after a short delay to avoid focus issues
        setTimeout(() => {
          isProgrammaticFocus.current = false
        }, 100)
      }
      initRef.current = true
    }, [iconRef, focusIconButton])

    return (
      <HelperText
        className={containerClassName}
        helperText={helperText}
        errors={errors}
      >
        {label && (
          <Label
            style={{ marginBottom: '0.25rem' }}
            disabled={disabled}
            label={label}
            labelInfo={labelInfo}
            required={required}
            size={size}
          />
        )}
        <div
          data-test={containerDataTest}
          style={{ position: 'relative', width: '100%' }}
          onMouseEnter={() => {
            if (canClear) {
              setShowCross(true)
            }
          }}
          onMouseLeave={() => {
            if (canClear) {
              setShowCross(false)
            }
          }}
        >
          <input
            className={clsx(
              'TextField',
              color,
              severity,
              size,
              `icon-${iconPosition}`,
              {
                'show-icon': Icon,
                'show-cross': showCross,
                'hide-focus': hideFocus,
                error: errors,
              },
              className
            )}
            disabled={disabled}
            {...(label && { id: label.replace(/\s/g, '') })}
            onChange={onChange}
            onFocus={onFocus}
            placeholder={placeholder}
            type={type}
            value={value}
            ref={ref}
            tabIndex={0}
            {...rest}
          />
          {showCross && !disabled && (
            <button
              aria-label="Clear text"
              tabIndex={0}
              onKeyDown={handleKeyDown(() => {
                onReset()
              })}
              className="clear-icon-button"
              onClick={() => {
                onReset()
              }}
            >
              <HiXMark className="icon" aria-hidden />
            </button>
          )}
          {!!Icon && (iconPosition === 'left' || !canClear) && (
            <button
              aria-label={onIconClick ? iconAriaLabel : undefined}
              className="icon-button"
              disabled={disabled ?? !onIconClick}
              onClick={onIconButtonClick}
              onFocus={undefined}
              onKeyDown={onIconButtonKeyDown}
              tabIndex={onIconClick ? 0 : -1}
              ref={iconRef as RefObject<HTMLButtonElement>}
            >
              <Icon aria-hidden className="icon" />
            </button>
          )}
        </div>
      </HelperText>
    )
  }
)

export default TextField
