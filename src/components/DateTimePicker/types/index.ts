import { PanelView, PickerMode, PickerType } from './enums'

import type {
  Dispatch,
  FC,
  ReactElement,
  RefObject,
  SetStateAction,
} from 'react'

export type DateOrigin = 'left' | 'right'
/**
 * Represents a range of dates, consisting of a start and end UNIX timestamp in milliseconds, or undefined.
 *
 * The `DateRange` type can be used to specify an optional period with:
 * - A defined start timestamp (inclusive)
 * - A defined end timestamp (inclusive)
 * - An open-ended start or end by using undefined
 *
 * Example configurations:
 * - `[timestamp1, timestamp2]`: Represents a date range between two specific points in time.
 * - `[timestamp1, undefined]`: Represents a date range starting from a specific time without an end.
 * - `[undefined, timestamp2]`: Represents a date range ending at a specific time without a defined start.
 * - `undefined`: Represents no date range at all (undefined range).
 *
 * This type is typically used to handle date filtering or temporal constraints where both finite and infinite boundaries may be necessary.
 */
export type DateRange = (number | undefined)[]

/**
 * Input masks used according to locale
 */
export type InputMask = (string | RegExp)[]

export interface BasicPanelProps {
  /* Tailwind color palette name for theming, defaults to 'blue' */
  color?: UIColor
  /* If true, no default date (today) will be displayed */
  noDefaultDate?: boolean
  /* Defines the behaviour of the component */
  pickerMode?: PickerMode
  /* The component will be considered as controlled if onDateChange is defined (provider state) */
  isControlled?: boolean
  /* Called on date click by date panel and time panel */
  onClose?: () => void
}

export interface PickerProviderProps extends BasicPanelProps {
  /* Date as a UTC timestamp. It will default to now if not provided */
  date?: number
  /* Range date as a tuple of two Unix timestamps */
  dateRange?: DateRange
  /* Offset in milliseconds to be added to the date value (as a timestamp) on input
  and to be removed from the resulting date on output. */
  timezoneMsOffset: number
  /* Offset in milliseconds from the GMT time zone */
  localeMsOffset: number
  /* If true, the input text is disabled and a loading animation is displayed on the right */
  loading?: boolean
  /* When defining a valid/enabled range of dates, it will be the min/start date */
  minDate?: number
  /* When defining a valid/enabled range of dates, it will be the max/end date */
  maxDate?: number
  /* If true, the state of the panel is 'open' */
  open?: boolean
  /* Locale language in international ISO-8601  */
  locale?: string
  /* If true, the top position of the panel will be impacted */
  hasLabel?: boolean
  /* Because the date range days panels can have a different offset due to daylight applied, both possible offsets are stored */
  dateRangePickerTimeOffsets: {
    localeMsOffset: number
    timezoneMsOffset: number
  }[]
  /* Timezone list member based on moment.js - for debug purposes only */
  timezone?: Timezone
}

export interface BasicPickerProps extends BasicPanelProps {
  /* Locale language in international ISO-8601  */
  locale?: string
  /* When picker mode is not set on 'DATE_RANGE', this function is called on date click if the component is controlled */
  onChange?: (value?: number) => void
  /* When picker mode is set on 'DATE_RANGE', this function is called on date range change */
  onDateRangeChange?: (date: DateRange) => void
}

export interface PickerProps extends BasicPickerProps {
  /* If true, Will place the panel in a portal, defaults to false */
  enablePortal?: boolean
  /* When provided, will add an icon on the right, useful when wanting to express some state, for instance. */
  extraIcon?: ReactElement
  /* If true, the input text is disabled and a loading animation is displayed on the right */
  loading?: boolean
  /* If true, the panel is shown, defaults to false */
  open?: boolean
  /* Panel placement: 'bottom-start' | 'bottom-end'  */
  placement?: 'bottom-start' | 'bottom-end'
}

interface InternalDateTimePickerProps
  extends DateTimeTextInputProps,
    PickerProps {}

/**
 * Picker state properties passed to children component through context
 */
export interface PickerState
  extends Omit<PickerProviderProps, 'localeMsOffset' | 'timezoneMsOffset'> {
  /* Offset in milliseconds to be added to the date value (as a timestamp) on input
  and to be removed from the resulting date on output.
  The difference between the locale offset and the timezone offset */
  finalOffset: number
  /* Date used for component inner mechanics as a Unix timestamp */
  localeDate?: number
  /* Range date as a tuple of two Unix timestamps */
  localeDateRange?: DateRange
  /* Ignored element by the click outside component */
  ignoreClickAwayRef: RefObject<HTMLButtonElement | null>
  /* Locale language in international ISO-8601  */
  locale: string
  /* Setter for the date (provider state) */
  setLocaleDate: Dispatch<SetStateAction<number | undefined>>
  /* Setter for the date range as a tuple of two Unix timestamps */
  setLocaleDateRange: Dispatch<SetStateAction<DateRange>>
  /* View mode for the calendar panel (provider state) */
  panelView: PanelView
  /* Setter for the ignored element by the click outside component */
  setIgnoreClickAwayRef: Dispatch<
    SetStateAction<RefObject<HTMLButtonElement | null>>
  >
  /* Setter for the panel view (provider state) */
  setPanelView: Dispatch<SetStateAction<PanelView>>
  /* Panel DOM Rect reference needed for placement */
  panelRect: DOMRectReadOnly
  /* Panel DOM Rect setter needed for placement */
  setPanelRect: (rect: DOMRectReadOnly) => void
}

/**
 * Text input properties
 * To remove once a solution will be found to forward the component ref properly
 */
export interface DateTimeTextInputProps {
  /* If true, text input is disabled */
  disabled?: boolean
  /* Error message displayed on error under the input text */
  errors?: string[]
  /* Information message displayed under the input text */
  helperText?: string
  /* Text input label */
  label?: string
  /* Information displayed on hovering the exclamation mark in a tooltip */
  labelInfo?: string
  /* If true, text input is required */
  required?: boolean
  /* Text input severity, translated into colors: 'success' | 'error' | 'warning' | 'info' */
  severity?: Severity
  /* Text input size:'sm' | 'md' | 'lg'  */
  size?: UISize
  /* Timezone list member based on moment.js */
  timezone?: Timezone
  /* timestamp to have min date on input */
  minDate?: number
  /* timestamp to have max date on input */
  maxDate?: number
}

/**
 * Date input properties
 * To remove once a solution will be found to forward the component ref properly
 *
 */
export interface DateInputProps extends DateTimeTextInputProps {
  /* Callback called on input change */
  onDateChange?: (value?: number) => void
  /* When picker mode is set on 'DATE_RANGE', this function is called on date range change */
  onDateRangeChange?: (date: DateRange) => void
  /* Callback called on icon click if present */
  onIconClick?: () => void
  /* Icon to be displayed on the right (loading indicator, valid value...) */
  stateIcon?: ReactElement
}

/**
 * Given a picker mode, returns the corresponding props
 * @param T Picker mode
 * @returns
 */
export type CommonPickerProps<T extends PickerMode> =
  InternalDateTimePickerProps & {
    pickerMode?: T
  } & (T extends 'DATERANGE'
      ? {
          dateRange?: DateRange
          onDateRangeChange?: (date: DateRange) => void
          date?: never
          onChange?: never
        }
      : {
          date?: number
          onChange?: (value?: number) => void
          dateRange?: never[]
          onDateRangeChange?: never
        })

/**
 * Wrapper type for all picker properties
 */
export type AnyPickerProps = CommonPickerProps<PickerType>

/**
 * Wrapper type for all pickers
 */
export type AnyPickerComponent = FC<AnyPickerProps>

export type { PickerMode, PickerType } from './enums'

export { PanelView } from './enums'
