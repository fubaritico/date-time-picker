import { getCurrentAMPM, getDaysInMonth } from '@utils'

import AbstractInputMask from './AbstractInputMask'

import type { PickerMode } from '../../types'

/**
 * The mask for the English input
 */
export default class ENInputMask extends AbstractInputMask {
  constructor(innerDate: number, pickerMode: PickerMode) {
    super(innerDate, pickerMode)

    // Date input mask - default shape YYYY/MM/DD
    const digit = /[0-9]/
    const month1 = /[0-2]/
    const day1 = /[0-3]/
    const hour1 = /[0-1]/
    const minute1 = /[0-5]/

    this.dateMask = [
      digit,
      digit,
      digit,
      digit,
      '/',
      month1,
      digit,
      '/',
      day1,
      digit,
    ]

    this.timeMask = [
      hour1,
      digit,
      ':',
      minute1,
      digit,
      ' ',
      getCurrentAMPM(innerDate),
    ]

    this.dateTimeMask = [...this.dateMask, ' ', ...this.timeMask]
  }

  validateYear(input: string): string {
    let newInputValue = input

    if (!newInputValue.startsWith('_')) {
      if (parseInt(newInputValue[0], 10) < 2) {
        newInputValue = '2' + newInputValue.slice(1)
      }
    }

    return newInputValue
  }

  validateMonth(input: string): string {
    let newInputValue = input

    if (newInputValue[5] !== '_') {
      if (parseInt(newInputValue[5], 10) > 1) {
        newInputValue = newInputValue.slice(0, 5) + '1' + newInputValue.slice(6)
      }
    }

    if (newInputValue[6] !== '_') {
      if (
        parseInt(newInputValue[5], 10) === 1 &&
        parseInt(newInputValue[6], 10) > 2
      ) {
        newInputValue = newInputValue.slice(0, 6) + '2' + newInputValue.slice(6)
      }
    }

    return newInputValue
  }

  /**
   * Will validate and correct user input when typing day
   * @param input - The current input value
   */
  validateDay(input: string): string {
    let newInputValue = input
    const daysInMonth = getDaysInMonth(
      Number(input.split('/')[0]),
      Number(input.split('/')[1].replace('0', '')) - 1
    ).toString()

    if (newInputValue[8] !== '_') {
      if (parseInt(newInputValue[8], 10) > parseInt(daysInMonth[0], 10)) {
        newInputValue =
          newInputValue.slice(0, 8) + daysInMonth[0] + newInputValue.slice(9)
      }
    }

    if (newInputValue[9] !== '_') {
      if (parseInt(newInputValue[8], 10) === parseInt(daysInMonth[0], 10)) {
        newInputValue =
          newInputValue.slice(0, 9) + daysInMonth[1] + newInputValue.slice(10)
      }
    }

    return newInputValue
  }

  /**
   * Will validate and correct user input when typing hours
   * @param input - The current input value
   * @param index
   */
  validateHoursFromIndex(input: string, index: number): string {
    let newInputValue = input

    if (newInputValue[index] !== '_') {
      if (parseInt(newInputValue[index], 10) > 2) {
        newInputValue =
          newInputValue.slice(0, index) + '1' + newInputValue.slice(index + 1)
      }
    }

    if (newInputValue[index + 1] !== '_') {
      if (
        parseInt(newInputValue[index], 10) === 1 &&
        parseInt(newInputValue[index + 1], 10) > 2
      ) {
        newInputValue =
          newInputValue.slice(0, index + 1) +
          '2' +
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

  validate(value: string): string {
    let newInputValue = ''

    if (this.pickerMode !== 'TIME') {
      newInputValue = this.validateYear(value)
      newInputValue = this.validateMonth(newInputValue)
      newInputValue = this.validateDay(newInputValue)
    }

    if (this.pickerMode === 'DATETIME' || this.pickerMode === 'TIME') {
      newInputValue = this.validateHours(value)
    }

    return newInputValue
  }
}
