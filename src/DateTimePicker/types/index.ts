import { PanelView, PickerMode } from './enums'

import type { Dispatch, ReactElement, RefObject, SetStateAction } from 'react'

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
export type DateRange = [number | undefined, number | undefined]

/**
 * Input masks used according to locale
 */
export type InputMask = (string | RegExp)[]

export interface BasicPanelProps {
  /* If true, no default date (today) will be displayed */
  noDefault?: boolean
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
  msOffset: number
  /* Offset in milliseconds from the GMT time zone */
  gmtMsOffset: number
  /* If true, the input text is disabled and a loading animation is displayed on the right */
  loading?: boolean
  /* When defining a valid/enabled range of dates, it will be the min/start date */
  minDate?: number
  /* When defining a valid/enabled range of dates, it will be the max/end date */
  maxDate?: number
  /* Locale language in international ISO-8601  */
  locale?: string
  /* If true, the top position of the panel will be impacted */
  hasLabel?: boolean
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

export interface DateTimePickerProps
  extends DateTimeTextInputProps,
    PickerProps {
  /* Date as a value of unix timestamp, the date will default to "now" if not provided */
  date?: number
  /* Date range as a tuple of two Unix timestamps */
  dateRange?: DateRange
}

/**
 * Picker state properties passed to children component through context
 */
export interface PickerState extends PickerProviderProps {
  /* Date used for component inner mechanics as a Unix timestamp */
  innerDate?: number
  /* Range date as a tuple of two Unix timestamps */
  innerDateRange?: DateRange
  /* Ignored element by the click outside component */
  ignoreClickAwayRef: RefObject<HTMLButtonElement | null>
  /* Locale language in international ISO-8601  */
  locale: string
  /* Setter for the date (provider state) */
  setInnerDate: Dispatch<SetStateAction<number | undefined>>
  /* Setter for the date range as a tuple of two Unix timestamps */
  setInnerDateRange: Dispatch<SetStateAction<DateRange>>
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
