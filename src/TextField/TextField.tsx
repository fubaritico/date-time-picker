import clsx from 'clsx'
import { forwardRef, useState } from 'react'

import { cx } from '@utils'
import { createCustomChangeEvent, handleKeyDown } from '@utils'

import HelperText from '../HelperText'
import Icon from '../Icon'
import Label from '../Label'

import textFieldStyles, { VariantTextFieldProps } from './TextField.styles'

import type { Hi2UiIconNames } from '..'
import type {
  ChangeEvent,
  ComponentProps,
  FC,
  ForwardedRef,
  RefObject,
} from 'react'

export interface TextFieldProps
  extends Omit<
      ComponentProps<'input'>,
      'onChange' | 'size' | 'color' | 'disabled'
    >,
    VariantTextFieldProps {
  /* Extra CSS styles (tailwind) */
  className?: string
  /* Extra CSS styles (tailwind) for the root element (container) */
  containerClassName?: string
  /* If true, an icon button will show on hovering the input and will allow clearing the content of the text input on click */
  canClear?: boolean
  /* Error messages displayed under the input text when an error occurs */
  errors?: string[]
  /* Information message displayed under the input text */
  helperText?: string
  /* Icon aria label for accessibility and tests*/
  iconAriaLabel?: string
  /* Name of the icon displayed on the left */
  iconName?: Hi2UiIconNames
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

const sizeHeights: Record<UISize, number> = {
  lg: 52,
  md: 42,
  sm: 37,
}

const TextField: FC<TextFieldProps> = forwardRef<
  HTMLInputElement,
  TextFieldProps
>(
  (
    {
      className,
      color,
      containerClassName,
      canClear = false,
      disabled,
      errors,
      helperText,
      hideFocus,
      iconAriaLabel,
      iconName,
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

    const onReset = () => {
      const customEvent = createCustomChangeEvent('')
      onChange?.(customEvent)
    }

    return (
      <HelperText
        className={containerClassName}
        helperText={helperText}
        errors={errors}
      >
        {label && (
          <Label
            className="dp-mb-1"
            disabled={disabled as boolean | undefined}
            label={label}
            labelInfo={labelInfo}
            required={required}
            size={size}
          />
        )}
        <div
          className="dp-relative dp-w-full"
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
            className={cx(
              textFieldStyles({
                color,
                disabled,
                hideFocus,
                iconName,
                iconPosition,
                severity,
                size,
                className,
              })
            )}
            disabled={disabled as boolean | undefined}
            {...(label && { id: label.replace(/\s/g, '') })}
            onChange={onChange}
            onFocus={onFocus}
            placeholder={placeholder}
            type={type}
            value={value}
            ref={ref}
            {...rest}
            style={{
              height: `${sizeHeights[size].toString()}px`,
            }}
          />
          {showCross && !disabled && (
            <div
              role="button"
              tabIndex={0}
              onKeyDown={handleKeyDown(() => {
                onReset()
              })}
              className={clsx(
                'dp-absolute dp-top-1/2 -dp-translate-y-1/2 dp-text-gray-500 dp-cursor-pointer dp-transition-all dp-duration-300',
                {
                  'dp-w-6 dp-h-6 dp-right-[17px]': size === 'lg',
                  'dp-w-5 dp-h-5 dp-right-[14px]': size === 'md',
                  'dp-w-4 dp-h-4 dp-right-[10px]': size === 'sm',
                }
              )}
              onClick={() => {
                onReset()
              }}
            >
              <Icon
                name="HiXMark"
                className={clsx(
                  'dp-text-gray-600 dp-transition-all dp-duration-300',
                  {
                    'dp-w-6 dp-h-6': size === 'lg',
                    'dp-w-5 dp-h-5': size === 'md',
                    'dp-w-4 dp-h-4': size === 'sm',
                    '!dp-text-red-600': severity === 'error',
                    '!dp-text-yellow-600': severity === 'warning',
                    '!dp-text-green-600': severity === 'success',
                  }
                )}
              />
            </div>
          )}
          {!!iconName && !(iconPosition === 'right' && canClear) && (
            <div
              aria-label={onIconClick ? iconAriaLabel : undefined}
              className={clsx(
                'dp-absolute dp-top-1/2 -dp-translate-y-1/2 dp-transition-all dp-duration-300',
                {
                  '!dp-cursor-pointer': !disabled && !!onIconClick,
                  'dp-opacity-50': disabled,
                  '!dp-cursor-default': !onIconClick,
                  // Sizing
                  'dp-w-6 dp-h-6': size === 'lg',
                  'dp-w-5 dp-h-5': size === 'md',
                  'dp-w-4 dp-h-4': size === 'sm',
                  // Positioning
                  ...(iconPosition === 'left' && {
                    'dp-left-[17px]': size === 'lg',
                    'dp-left-[10px]': size === 'sm',
                    'dp-left-[14px]': size === 'md',
                  }),
                  ...(iconPosition === 'right' && {
                    'dp-right-[17px]': size === 'lg',
                    'dp-right-[10px]': size === 'sm',
                    'dp-right-[14px]': size === 'md',
                  }),
                }
              )}
              onClick={() =>
                (!disabled || preserveIconClick) && onIconClick?.(ref)
              }
              onKeyDown={handleKeyDown(
                () => (!disabled || preserveIconClick) && onIconClick?.(ref)
              )}
              role="button"
              tabIndex={onIconClick ? 0 : undefined}
              ref={iconRef as RefObject<HTMLDivElement>}
            >
              <Icon
                aria-hidden
                name={iconName}
                className={clsx(
                  'dp-text-gray-500 dark:dp-text-gray-400 dp-transition-all dp-duration-300',
                  {
                    'dp-w-6 dp-h-6': size === 'lg',
                    'dp-w-5 dp-h-5': size === 'md',
                    'dp-w-4 dp-h-4': size === 'sm',
                    '!dp-text-red-600': severity === 'error',
                    '!dp-text-yellow-600': severity === 'warning',
                    '!dp-text-green-600': severity === 'success',
                  }
                )}
              />
            </div>
          )}
        </div>
      </HelperText>
    )
  }
)

export default TextField
