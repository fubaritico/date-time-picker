import type { Dispatch, ReactElement, RefObject, SetStateAction } from 'react'

/**
 * Lists the behaviours of the component
 */
export enum PickerMode {
  DATE = 'DATE',
  TIME = 'TIME',
  DATETIME = 'DATETIME',
}

/**
 * Lists the types of panel content to show
 */
export enum PanelView {
  DAYS = 'DAYS',
  MONTHS = 'MONTHS',
  YEARS = 'YEARS',
  TIME = 'TIME',
}

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
  /* Date as an UTC timestamp. It will default to now if not provided */
  date?: number
  /* Offset in milliseconds to be added the date value (as a timestamp) on input
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
  /* Called on date click if the component is controlled */
  onChange?: (date?: number) => void
}

export interface PickerProps extends BasicPickerProps {
  /* If true, Will place the panel in a portal, defaults to false */
  enablePortal?: boolean
  /* When provided, will add an icon on the right, useful when wanting to express some state, for instance */
  extraIcon?: ReactElement
  /* If true the input text is disabled and a loading animation is displayed on the right */
  loading?: boolean
  /* If true, the panel is shown, defaults to false */
  open?: boolean
  /* Panel placement: 'bottom-start' | 'bottom-end'  */
  placement?: 'bottom-start' | 'bottom-end'
}

export interface DateTimePickerProps
  extends DateTimeTextInputProps,
    PickerProps {
  /* Date as a unix timestamp will default to "now" if not provided */
  date?: number
}

/**
 * Picker state properties passed to children component through context
 */
export interface PickerState extends PickerProviderProps {
  /* Reference to the format used according to the Picker mode */
  pickerFormat: string
  /* Date used for component inner mechanics as a Unix timestamp */
  innerDate?: number
  /* Ignored element by the click outside component */
  ignoreClickAwayRef: RefObject<HTMLButtonElement | null>
  /* Locale language in international ISO-8601  */
  locale: string
  /* Setter for the date (provider state) */
  setInnerDate: Dispatch<SetStateAction<number | undefined>>
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
  /* Moment Timezone list member */
  timezone?: Timezone
  /* timestamp to have min date on input*/
  minDate?: number
  /* timestamp to have max date on input*/
  maxDate?: number
}

export interface DateTimeInputProps extends DateTimeTextInputProps {
  /* Callback called on input change */
  onDateChange?: (value?: number) => void
  /* Callback called on icon click if present */
  onIconClick?: () => void
  /* Icon to be displayed on the right (loading indicator, valid value...) */
  stateIcon?: ReactElement
}
