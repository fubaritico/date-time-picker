import { createContext } from 'react'

import { DateOrigin, DateRange } from '../types'

import type { Dispatch, SetStateAction } from 'react'

export interface DateRangePanelState {
  /* The date range value to populate the date range panel days grids. */
  dateRange: DateRange
  /* True when a start date has been set, and the end date is not set yet. */
  isSelectingRange: boolean
  /* Timestamp of the first day of the month display on the left */
  leftGridMonth: number
  /* Timestamp of the first day of the month display on the right */
  rightGridMonth: number
  /* Setter for the left grid month */
  setLeftGridMonth: Dispatch<SetStateAction<number>>
  /* Setter for the right grid month */
  setRightGridMonth: Dispatch<SetStateAction<number>>
  /* Setter for the temp end date */
  setTempEndDate: Dispatch<SetStateAction<number | undefined>>
  /* Setter for the temp start date */
  setTempStartDate: Dispatch<SetStateAction<number | undefined>>
  /* The temp value of the end date when hovering days cells in a days-grid */
  tempEndDate?: number
  /* The temp value of the start date used while defining a date range */
  tempStartDate?: number
  /* Setter for 'startDateOrigin' */
  setStartDateOrigin: Dispatch<SetStateAction<DateOrigin>>
  /* From where the start date has been clicked (will help to apply the right offset based on the month) */
  startDateOrigin: DateOrigin
  /* Setter for 'endDateOrigin' */
  setEndDateOrigin: Dispatch<SetStateAction<DateOrigin>>
  /* From where the end date has been clicked (will help to apply the right offset based on the month) */
  endDateOrigin: DateOrigin
}

export const initialState: DateRangePanelState = {
  dateRange: [undefined, undefined],
  endDateOrigin: 'left',
  isSelectingRange: false,
  leftGridMonth: Date.now(),
  rightGridMonth: Date.now(),
  setLeftGridMonth: () => {},
  setRightGridMonth: () => {},
  setTempEndDate: () => {},
  setTempStartDate: () => {},
  setStartDateOrigin: () => {},
  setEndDateOrigin: () => {},
  startDateOrigin: 'left',
}

const DateRangePanelContext = createContext<DateRangePanelState>(initialState)

export default DateRangePanelContext
