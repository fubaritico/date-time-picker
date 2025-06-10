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
  class: `bg-${color}-100 text-${color}-700`,
})

const dateTimeSwitcherStyles = cva(
  [
    'flex',
    'justify-center',
    'items-center',
    'transition',
    'duration-500',
    'grow',
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
        false: 'hover:bg-gray-100 hover:gray-red-800 text-gray-500',
      },
      size: {
        sm: 'h-[36px]',
        md: 'h-[46px]',
        lg: 'h-[46px]',
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
