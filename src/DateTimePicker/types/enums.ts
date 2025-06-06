/**
 * Lists the types of picker components
 */
export type PickerType = 'DATE' | 'TIME' | 'DATETIME'
export type PickerMode = PickerType | 'DATERANGE'

/**
 * Lists the types of panel content to show
 */
export enum PanelView {
  DAYS = 'DAYS',
  MONTHS = 'MONTHS',
  YEARS = 'YEARS',
  TIME = 'TIME',
}
