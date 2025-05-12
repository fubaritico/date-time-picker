import { InputMask, PickerMode } from '../../DateTimePicker.types'

/**
 * Abstract class for the input mask
 * @abstract
 */
abstract class AbstractInputMask {
  /**
   * The default date time mask
   */
  public dateTimeMask: InputMask = []

  /**
   * The default time mask
   */
  public timeMask: InputMask = []

  /**
   * The default date mask
   */
  public dateMask: InputMask = []

  /**
   * The default date mask
   */
  public mask: InputMask = []
  /**
   * Will validate and correct user input when typing year
   *
   * @param input
   */
  protected abstract validateYear(input: string): string
  /**
   * Will validate and correct user input when typing month
   *
   * @param {string} input
   */
  protected abstract validateMonth(input: string): string
  /**
   * Will validate and correct user input when typing day
   *
   * @param {string} input
   */
  protected abstract validateDay(input: string): string
  /**
   * Will validate and correct user input when typing hours
   *
   * @param {string} input
   */
  protected abstract validateHours(input: string): string
  /**
   * Will validate and correct user input when typing
   *
   * @param {string} value - The input value
   *
   * @returns string - The new input value
   */
  public abstract validate(value: string): string

  protected constructor(
    public innerDate: number,
    protected pickerMode: PickerMode
  ) {}

  /**
   * Returns the mask based on the calendar mode.
   *
   * @returns {InputMask} - The mask to be used. Defaults to date mask.
   */
  public getMask(): InputMask {
    if (this.pickerMode === PickerMode.DATETIME) {
      return this.dateTimeMask
    } else if (this.pickerMode === PickerMode.TIME) {
      return this.timeMask
    } else {
      return this.dateMask
    }
  }
}

export default AbstractInputMask
