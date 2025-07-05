import { getDaysInMonth } from '@utils'

import AbstractInputMask from './AbstractInputMask'

import type { PickerMode } from '../../types'

/**
 * The mask for the French input.
 *
 * index: 0123456789
 * mask: DD/MM/YYYY HH:mm
 */
export default class FRInputMask extends AbstractInputMask {
  private months30DaysLong = ['04', '06', '09', '11']

  private months31DaysLong = ['01', '03', '05', '07', '08', '10', '12']

  constructor(innerDate: number, pickerMode: PickerMode) {
    super(innerDate, pickerMode)

    // Date input mask - default shape DD/MM/YYYY
    const digit = /[0-9]/
    const month1 = /[0-1]/
    const day1 = /[0-3]/
    const hour1 = /[0-2]/
    const minute1 = /[0-5]/

    this.dateMask = [
      day1,
      digit,
      '/',
      month1,
      digit,
      '/',
      digit,
      digit,
      digit,
      digit,
    ]

    this.timeMask = [hour1, digit, ':', minute1, digit]

    this.dateTimeMask = [...this.dateMask, ' ', ...this.timeMask]
  }

  /**
   * Will get the days from the input value
   * @param newInputValue
   */
  getDays(newInputValue: string): string {
    return newInputValue[0] + newInputValue[1]
  }

  /**
   * Will get the months from the input value
   * @param newInputValue
   */
  getMonths(newInputValue: string): string {
    return newInputValue[3] + newInputValue[4]
  }

  /**
   * Will get the years from the input value
   * @param newInputValue
   */
  getYears(newInputValue: string): string {
    return (
      newInputValue[6] + newInputValue[7] + newInputValue[8] + newInputValue[9]
    )
  }

  /**
   * Will get the closest valid month based on the days in the month
   */
  getClosestValidMonth(month: string, months: string[]): string {
    let closestMonth = months[0]
    let minDiff = Math.abs(parseInt(month) - parseInt(months[0]))

    for (const validMonth of months) {
      const diff = Math.abs(parseInt(month) - parseInt(validMonth))
      if (diff < minDiff) {
        minDiff = diff
        closestMonth = validMonth
      }
    }

    return closestMonth
  }

  /**
   * Will check if the days and months are valid
   * @param newInputValue
   */
  areDaysAndMonthsValid(newInputValue: string): boolean {
    if (newInputValue.length === 0) return false

    const day = this.getDays(newInputValue)
    const month = this.getMonths(newInputValue)

    return !day.includes('_') && !month.includes('_')
  }

  /**
   * Will check if the years and months are valid
   * @param newInputValue
   */
  areYearsAndMonthsValid(newInputValue: string): boolean {
    if (newInputValue.length === 0) return false

    const year = this.getYears(newInputValue)
    const month = this.getMonths(newInputValue)

    return !year.includes('_') && !month.includes('_')
  }

  /**
   * Will check if the year is a leap year
   * @param year
   */
  isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  }

  /**
   * Will get the closest leap year
   * @param year
   */
  getClosestLeapYear(year: string): string {
    const yearInt = parseInt(year)
    let closestLeapYear = parseInt(year)
    let offset = 0

    while (!this.isLeapYear(closestLeapYear)) {
      offset++
      if (this.isLeapYear(yearInt - offset)) {
        closestLeapYear = yearInt - offset
      } else if (this.isLeapYear(yearInt + offset)) {
        closestLeapYear = yearInt + offset
      }
    }

    return closestLeapYear.toString()
  }

  validateDay(input: string): string {
    let newInputValue = input

    if (newInputValue[1] !== '_') {
      if (this.areYearsAndMonthsValid(newInputValue)) {
        const days = this.getDays(newInputValue)
        const month = this.getMonths(newInputValue)
        const year = this.getYears(newInputValue)
        const daysInMonth = getDaysInMonth(
          Number(year),
          Number(month.replace('0', '')) - 1
        ).toString()

        if (parseInt(days, 10) > parseInt(daysInMonth, 10)) {
          newInputValue = daysInMonth + newInputValue.slice(2)
        }
      }

      if (
        parseInt(newInputValue[0], 10) === 3 &&
        parseInt(newInputValue[1], 10) > 1
      ) {
        newInputValue = newInputValue[0] + '1' + newInputValue.slice(2)
      }
    }

    return newInputValue
  }

  validateMonth(input: string): string {
    let newInputValue = input

    if (newInputValue[3] !== '_') {
      if (parseInt(newInputValue[3], 10) > 1) {
        newInputValue = newInputValue.slice(0, 3) + '1' + newInputValue.slice(4)
      }
    }

    if (newInputValue[4] !== '_') {
      const day = this.getDays(newInputValue)
      const month = this.getMonths(newInputValue)

      if (day === '30' && !this.months30DaysLong.includes(month)) {
        newInputValue =
          newInputValue.slice(0, 3) +
          this.getClosestValidMonth(month, this.months30DaysLong) +
          newInputValue.slice(4)
      }

      if (day === '31' && !this.months31DaysLong.includes(month)) {
        newInputValue =
          newInputValue.slice(0, 3) +
          this.getClosestValidMonth(month, this.months31DaysLong) +
          newInputValue.slice(4)
      }
    }

    return newInputValue
  }

  validateYear(input: string): string {
    let newInputValue = input

    if (newInputValue[6] !== '_') {
      if (parseInt(newInputValue[6], 10) < 2) {
        newInputValue = newInputValue.slice(0, 6) + '2' + newInputValue.slice(7)
      }
    }

    if (newInputValue[9] !== '_' && this.areDaysAndMonthsValid(newInputValue)) {
      const day = this.getDays(newInputValue)
      const month = this.getMonths(newInputValue)
      const year = this.getYears(newInputValue)

      if (!this.isLeapYear(parseInt(year)) && month === '02' && day === '29') {
        newInputValue =
          newInputValue.slice(0, 6) +
          this.getClosestLeapYear(year) +
          newInputValue.slice(10)
      }
    }

    return newInputValue
  }

  /**
   * Will validate hours and minutes to meet the shape of '23:59' maximum
   * @param input
   * @param index
   */
  validateHoursFromIndex(input: string, index: number): string {
    let newInputValue = input

    if (newInputValue[index] !== '_') {
      if (parseInt(newInputValue[index], 10) > 3) {
        newInputValue =
          newInputValue.slice(0, index) + '2' + newInputValue.slice(index + 1)
      }
    }

    if (newInputValue[index + 1] !== '_') {
      if (
        parseInt(newInputValue[index], 10) === 2 &&
        parseInt(newInputValue[index + 1], 10) > 3
      ) {
        newInputValue =
          newInputValue.slice(0, index + 1) +
          '3' +
          newInputValue.slice(index + 2)
      }
    }

    return newInputValue
  }

  validateHours(input: string): string {
    if (this.pickerMode === 'TIME') {
      return this.validateHoursFromIndex(input, 0)
    }

    return this.validateHoursFromIndex(input, 11)
  }

  /**
   * Will validate input value to meet the shape of '2000/12/31 23:59'
   * @param value
   */
  validate(value: string): string {
    let newInputValue = ''

    if (this.pickerMode !== 'TIME') {
      newInputValue = this.validateDay(value)
      newInputValue = this.validateMonth(newInputValue)
      newInputValue = this.validateYear(newInputValue)
    }

    if (this.pickerMode === 'DATETIME' || this.pickerMode === 'TIME') {
      newInputValue = this.validateHours(value)
    }

    return newInputValue
  }
}
