import MonaHealthInputMask from '@mona-health/react-input-mask'

import { TextField } from '@components'

import type { DateInputProps, InputMask, PickerMode } from '../types'
import type { ChangeEvent, FC, FocusEventHandler, RefObject } from 'react'

export interface InputWithMaskProps extends DateInputProps {
  /* Will display the mask with underscores as placeholders */
  alwaysShowMask?: boolean
  /* Theme color, defaults to 'blue' */
  color?: UIColor
  /* Extra CSS styles (tailwind) */
  className?: string
  /* If true, the outline around the text field will not be shown on focus */
  hideFocus?: boolean
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
  /* Value passed to the input */
  value?: string
  /* If false, no icon will be displayed to open the panel. Default to 'true' */
  withPanel?: boolean
}

const InputWithMask: FC<InputWithMaskProps> = ({
  alwaysShowMask,
  className,
  iconRef,
  onIconClick,
  mask,
  pickerMode,
  required,
  value,
  disabled,
  severity,
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
      severity={severity}
      errors={errors}
      onChange={async (e: ChangeEvent<HTMLInputElement>) => {
        await onChange(e)
      }}
      onFocus={onFocus}
    >
      <TextField
        className="dp-font-roboto"
        iconAriaLabel="Open calendar panel"
        iconName={
          withPanel
            ? pickerMode === 'TIME'
              ? 'HiClock'
              : 'HiMiniCalendarDays'
            : undefined
        }
        iconRef={iconRef}
        onIconClick={onIconClick}
        {...rest}
      />
    </MonaHealthInputMask>
  )
}

export default InputWithMask
