import clsx from 'clsx'
import { forwardRef, useState } from 'react'

import HelperText from '../HelperText'
import Icon from '../Icon'
import Label from '../Label'
import { handleKeyDown } from '../utils'

import type { Hi2UiIconNames } from '..'
import type { ChangeEvent, FC, ForwardedRef, HTMLProps, RefObject } from 'react'

export type TextFieldProps = Omit<
  HTMLProps<HTMLInputElement>,
  'onChange' | 'size'
> & {
  /* Extra CSS styles (tailwind) */
  className?: string
  /* Extra CSS styles (tailwind) for root element (container) */
  containerClassName?: string
  /* If true, an icon button will show on hovering the input and will allow to clear the content of the text input on click */
  canClear?: boolean
  /* Error messages displayed on error under the input text */
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
  preserveIconClick?: boolean
  /* Text input severity, translated into colors: 'success' | 'error' | 'warning' | 'info' */
  severity?: 'success' | 'error' | 'warning' | 'info'
  /* Text input size: 'small' | 'medium' | 'large'  */
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
  large: 52,
  medium: 42,
  small: 37,
}

/**
 * Function to create a custom change event.
 * @param eventValue
 */
export const createCustomChangeEvent = (
  eventValue: string
): ChangeEvent<HTMLInputElement> => {
  const event = new Event('change', {
    bubbles: true,
    cancelable: true,
  }) as unknown as ChangeEvent<HTMLInputElement>
  Object.defineProperty(event, 'target', {
    writable: true,
    value: { value: eventValue } as HTMLInputElement,
  })
  return event
}

const TextField: FC<TextFieldProps> = forwardRef<
  HTMLInputElement,
  TextFieldProps
>(
  (
    {
      className,
      containerClassName,
      canClear = false,
      disabled,
      errors,
      helperText,
      iconAriaLabel,
      iconName,
      iconPosition = 'left',
      iconRef,
      label,
      labelInfo,
      onChange,
      onIconClick,
      preserveIconClick = false,
      placeholder,
      required,
      severity,
      size = 'medium',
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
            className="mb-1"
            disabled={disabled}
            label={label}
            labelInfo={labelInfo}
            required={required}
            size={size}
          />
        )}
        <div
          className={clsx('relative w-full')}
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
              'border appearance-none truncate outline-0 w-full rounded-lg',
              'shadow-none pl-4 pr-4 transition-all duration-300',
              {
                '!text-md': size === 'large',
                '!text-sm': size === 'medium',
                '!text-xs': size === 'small',
                ...(!!iconName &&
                  iconPosition === 'left' && {
                    'pl-[52px]': size === 'large',
                    'pl-[42px]': size === 'medium',
                    'pl-[30px]': size === 'small',
                  }),
                ...(!!iconName &&
                  iconPosition === 'right' && {
                    'pr-[52px]': size === 'large',
                    'pr-[42px]': size === 'medium',
                    'pr-[30px]': size === 'small',
                  }),
                '!pr-[52px]': size === 'large' && showCross,
                '!pr-[42px]': size === 'medium' && showCross,
                '!pr-[30px]': size === 'small' && showCross,
                '!border-gray-300 !bg-gray-50 !text-gray-500': !severity,
                'focus:!border-blue-600 focus:!text-gray-900': !severity,
                'placeholder:!text-gray-400 !text-gray-500': !disabled,
                'placeholder:!text-gray-300 !text-gray-400': disabled,
                'cursor-not-allowed !text-gray-300': disabled && !severity,
                '!border-red-500 !bg-red-50 !text-red-700':
                  severity === 'error',
                '!border-yellow-500 !bg-yellow-50 !text-yellow-700':
                  severity === 'warning',
                '!border-green-500 !bg-green-50 !text-green-700':
                  severity === 'success',
                '!border-blue-500 !bg-blue-50 !text-blue-700':
                  severity === 'info',
              },
              className
            )}
            disabled={disabled}
            {...(label && { id: label.replace(/\s/g, '') })}
            onChange={onChange}
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
                'absolute top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer transition-all duration-300',
                {
                  'w-6 h-6 right-[17px]': size === 'large',
                  'w-5 h-5 right-[14px]': size === 'medium',
                  'w-4 h-4 right-[10px]': size === 'small',
                }
              )}
              onClick={() => {
                onReset()
              }}
            >
              <Icon
                name="HiXMark"
                className={clsx('text-gray-600 transition-all duration-300', {
                  'w-6 h-6': size === 'large',
                  'w-5 h-5': size === 'medium',
                  'w-4 h-4': size === 'small',
                  '!text-red-600': severity === 'error',
                  '!text-yellow-600': severity === 'warning',
                  '!text-green-600': severity === 'success',
                  '!text-blue-600': severity === 'info',
                })}
              />
            </div>
          )}
          {!!iconName && !(iconPosition === 'right' && canClear) && (
            <div
              aria-label={onIconClick ? iconAriaLabel : undefined}
              className={clsx(
                'absolute top-1/2 -translate-y-1/2 transition-all duration-300',
                {
                  '!cursor-pointer': !disabled && !!onIconClick,
                  'opacity-50': disabled,
                  '!cursor-default': !onIconClick,
                  // Sizing
                  'w-6 h-6': size === 'large',
                  'w-5 h-5': size === 'medium',
                  'w-4 h-4': size === 'small',
                  // Positioning
                  ...(iconPosition === 'left' && {
                    'left-[17px]': size === 'large',
                    'left-[10px]': size === 'small',
                    'left-[14px]': size === 'medium',
                  }),
                  ...(iconPosition === 'right' && {
                    'right-[17px]': size === 'large',
                    'right-[10px]': size === 'small',
                    'right-[14px]': size === 'medium',
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
                className={clsx('text-gray-500 transition-all duration-300', {
                  'w-6 h-6': size === 'large',
                  'w-5 h-5': size === 'medium',
                  'w-4 h-4': size === 'small',
                  '!text-red-600': severity === 'error',
                  '!text-yellow-600': severity === 'warning',
                  '!text-green-600': severity === 'success',
                  '!text-blue-600': severity === 'info',
                })}
              />
            </div>
          )}
        </div>
      </HelperText>
    )
  }
)

export default TextField
