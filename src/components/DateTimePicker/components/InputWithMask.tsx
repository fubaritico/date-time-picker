import MonaHealthInputMask from '@mona-health/react-input-mask'

import { TextField } from '@components'

import { ReactComponent as HiClock } from '../../../assets/svg/HiClock.svg'
import { ReactComponent as HiMiniCalendarDays } from '../../../assets/svg/HiMiniCalendarDays.svg'

import type { DateInputProps, InputMask, PickerMode } from '../types'
import type { ChangeEvent, FC, FocusEventHandler, RefObject } from 'react'

export interface InputWithMaskProps extends DateInputProps {
  /* Will display the mask with underscores as placeholders */
  alwaysShowMask?: boolean
  /* Theme color, defaults to 'blue' */
  color?: UIColor
  /* Extra CSS styles (tailwind) */
  className?: string
  /* For test purposes only */
  dataTest?: string
  /* [a11y] When true, will bring the focus on the icon button */
  focusIconButton?: boolean
  /* If true, the outline around the text field will not be shown on focus */
  hideFocus?: boolean
  /* Icon aria label for accessibility and tests*/
  iconAriaLabel?: string
  /* Reference to pass to ignore an element */
  iconRef?: RefObject<HTMLButtonElement | null>
  /* The I18n input mask instance */
  mask?: InputMask
  /* On value change handler */
  onChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>
  /* Called on text field Focus */
  onFocus?: FocusEventHandler<HTMLInputElement> | undefined
  /* Defines the behavior of the component */
  pickerMode?: PickerMode
  /* Placeholder text of the input */
  placeholder?: string
  /* Panel size: 'sm' | 'md' | 'lg' */
  size?: UISize
  /* Value passed to the input */
  value?: string
  /* If false, no icon will be displayed to open the panel. Default to 'true' */
  withPanel?: boolean
}

const InputWithMask: FC<InputWithMaskProps> = ({
  alwaysShowMask,
  className,
  dataTest,
  focusIconButton,
  iconAriaLabel = 'Choose Date',
  iconRef,
  onIconClick,
  mask,
  placeholder,
  pickerMode,
  required,
  value,
  disabled,
  errors,
  onChange,
  onFocus,
  withPanel = true,
  ...rest
}) => {
  return (
    <MonaHealthInputMask
      alwaysShowMask={alwaysShowMask}
      className={className}
      maskPlaceholder="_"
      mask={mask}
      value={value ?? ''}
      disabled={disabled}
      required={required}
      errors={errors}
      onChange={async (e: ChangeEvent<HTMLInputElement>) => {
        await onChange(e)
      }}
      onFocus={onFocus}
    >
      <TextField
        focusIconButton={focusIconButton}
        iconAriaLabel={pickerMode === 'TIME' ? 'Choose Time' : iconAriaLabel}
        icon={
          withPanel
            ? pickerMode === 'TIME'
              ? HiClock
              : HiMiniCalendarDays
            : undefined
        }
        iconRef={iconRef}
        onIconClick={onIconClick}
        placeholder={placeholder}
        containerDataTest={dataTest}
        {...rest}
      />
    </MonaHealthInputMask>
  )
}

export default InputWithMask
