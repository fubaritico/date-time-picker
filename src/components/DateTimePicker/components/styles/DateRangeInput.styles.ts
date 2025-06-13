import { cva } from 'class-variance-authority'

import { COLORS } from '@constants'

/**
 * Color themes for the calendar cells.
 *
 * @param {UIColor} color - The color theme to apply to the calendar cells (Tailwind palette names).
 */
const buildThemeColorClasses = (color: UIColor) => ({
  color: color,
  focus: true,
  className: `dp-ring-${color}-500 dark:dp-ring-${color}-500`,
})

const dateRangeInputStyles = cva(
  [
    'dp-flex',
    'dp-rounded-md',
    'dp-border',
    'dp-border-gray-300',
    'dark:dp-border-gray-600',
    'dp-transition',
    'dp-duration-200',
    'dp-ease-in-out',
  ],
  {
    variants: {
      color: COLORS.reduce<Record<UIColor, string>>(
        (acc, color) => {
          acc[color] = ''
          return acc
        },
        {} as Record<UIColor, string>
      ),
      focus: {
        true: 'dp-ring-2',
        false: '',
      },
    },
    defaultVariants: {
      focus: false,
      color: 'blue',
    },
    compoundVariants: [...COLORS.map((color) => buildThemeColorClasses(color))],
  }
)

export default dateRangeInputStyles
