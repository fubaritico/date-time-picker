import { cva } from 'class-variance-authority'

import { COLORS } from '@constants'

import type { VariantProps } from 'class-variance-authority'

/**
 * Color themes for the calendar cells.
 *
 * @param {UIColor} color - The color theme to apply to the calendar cells (Tailwind palette names).
 */
const buildThemeColorClasses = (color: UIColor) => ({
  color: color,
  isSelected: true,
  class: `dp-bg-${color}-100 dp-text-${color}-700`,
})

const dateTimeSwitcherStyles = cva(
  [
    'dp-flex',
    'dp-justify-center',
    'dp-items-center',
    'dp-transition',
    'dp-duration-500',
    'dp-grow',
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
      isSelected: {
        false: 'hover:dp-bg-gray-100 hover:dp-gray-red-800 dp-text-gray-500',
      },
      size: {
        sm: 'dp-h-[36px]',
        md: 'dp-h-[46px]',
        lg: 'dp-h-[46px]',
      },
    },
    defaultVariants: {
      size: 'md',
      isSelected: false,
      color: 'blue',
    },
    compoundVariants: [...COLORS.map((color) => buildThemeColorClasses(color))],
  }
)

export type VariantDateBrowserButtonProps = VariantProps<
  typeof dateTimeSwitcherStyles
>

export default dateTimeSwitcherStyles
