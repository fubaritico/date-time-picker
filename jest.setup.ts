/* eslint-disable no-console */
import { format } from 'node:util'

declare const global: any

/**
 * Mock for DOMRectReadOnly
 */
class DOMRectReadOnlyMock {
  x: number
  y: number
  width: number
  height: number
  top: number
  right: number
  bottom: number
  left: number

  constructor(x?: number, y?: number, width?: number, height?: number) {
    this.x = x || 0
    this.y = y || 0
    this.width = width || 0
    this.height = height || 0
    this.top = this.y
    this.right = this.x + this.width
    this.bottom = this.y + this.height
    this.left = this.x
  }

  static fromRect(rectangle: {
    x?: number
    y?: number
    width?: number
    height?: number
  }): DOMRectReadOnlyMock {
    return new DOMRectReadOnlyMock(
      rectangle.x,
      rectangle.y,
      rectangle.width,
      rectangle.height
    )
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      top: this.top,
      right: this.right,
      bottom: this.bottom,
      left: this.left,
    }
  }
}

global.DOMRectReadOnly = DOMRectReadOnlyMock

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

/**
 * @See: https://github.com/apexcharts/react-apexcharts/issues/52
 */
// Mocks for react-apex-charts or other third party library depending on render on resize and svg rendering - START
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value:
    window.ResizeObserver ||
    jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    })),
})

Object.defineProperty(global.SVGElement.prototype, 'getScreenCTM', {
  writable: true,
  value: jest.fn(),
})

Object.defineProperty(global.SVGElement.prototype, 'getBBox', {
  writable: true,
  value: jest.fn().mockReturnValue({
    x: 0,
    y: 0,
  }),
})

Object.defineProperty(global.SVGElement.prototype, 'getComputedTextLength', {
  writable: true,
  value: jest.fn().mockReturnValue(0),
})

Object.defineProperty(global.SVGElement.prototype, 'createSVGMatrix', {
  writable: true,
  value: jest.fn().mockReturnValue({
    x: 10,
    y: 10,
    inverse: () => {},
    multiply: () => {},
  }),
})
// Mocks for react-apex-charts or other third party library depending on render on resize and svg rendering - END

// setProjectAnnotations(globalStorybookConfig) // Causing problems with storybook/jest integration

// Remove "Error: Not implemented: window.scrollTo"
const noop = () => {}
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true })

Object.defineProperty(Element.prototype, 'scrollTo', {
  value: jest.fn(),
  writable: true,
})

// Transform some logs into exceptions
const nativeConsoleError = console.error

// Stub scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn()

console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('act(...)')) {
    // Suppress act-related warnings
    return
  }

  // Keep default behaviour
  nativeConsoleError.apply(console, args)

  if (typeof args[0] === 'string') {
    const message = args[0]

    if (
      message.startsWith(
        'Warning: A component is changing an uncontrolled input to be controlled'
      ) ||
      message.startsWith(
        'Warning: Encountered two children with the same key'
      ) ||
      message.startsWith(
        'Warning: Each child in a list should have a unique "key" prop'
      ) ||
      message.startsWith(
        'Warning: React does not recognize the `%s` prop on a DOM element.'
      ) ||
      message.startsWith(
        "Warning: It looks like you're using the wrong act()"
      ) ||
      message.startsWith(
        'Warning: The current testing environment is not configured to support act'
      ) ||
      message.startsWith('Warning: You seem to have overlapping act() calls')
    ) {
      throw new Error(format(...args))
    }
    // Add other behaviors here
  }
}
process.on(
  'unhandledRejection',
  (reason: unknown & { stack: never }, p: string) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
    console.log('Unhandled Rejection stack', reason?.stack)
  }
)

/* eslint-enable no-console */
