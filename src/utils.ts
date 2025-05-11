import { KeyboardEvent } from 'react'

/**
 * Debounce function that will delay the execution of the passed function
 *
 * @param func - any function
 * @param {number} wait - delay applied to the function
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const debounce = <T extends (...args: never[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      func.apply(this, args)
    }, wait)
  }
}

/**
 * Handle key down event of 'enter' & 'space' keys for tags that need
 * to be clickable with keyboard due to accessibility reasons
 * Works when an element is focused.
 *
 * @param callback
 */
export const handleKeyDown =
  <Element>(callback: (e?: Event) => void) =>
  (event: KeyboardEvent<Element>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      // The passed callback has, most of the time, no event argument
      callback(event as never)
    }
  }
