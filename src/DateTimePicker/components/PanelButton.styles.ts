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
  class: `border-${color}-600 bg-${color}-600 text-white hover:text-white hover:border-${color}-600 hover:bg-${color}-600 text-white`,
})

const panelButtonStyles = cva(
  [
    'p-2',
    'rounded-lg',
    'truncate',
    'transition',
    'duration-200',
    'ease-in-out',
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
        false: 'hover:bg-gray-100 text-gray-900',
        true: 'text-white',
      },
      size: {
        sm: 'text-xs h-[30px]',
        md: 'text-sm h-[36px]',
        lg: 'text-sm h-[36px]',
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

export type VariantPanelButtonProps = VariantProps<typeof panelButtonStyles>

export default panelButtonStyles
