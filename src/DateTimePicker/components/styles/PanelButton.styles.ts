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
  class: `dp-border-${color}-600 dp-bg-${color}-600 dp-text-white hover:dp-text-white hover:dp-border-${color}-600 hover:dp-bg-${color}-600 dp-text-white`,
})

const panelButtonStyles = cva(
  [
    'dp-p-2',
    'dp-rounded-lg',
    'dp-truncate',
    'dp-transition',
    'dp-duration-200',
    'dp-ease-in-out',
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
        false: 'hover:dp-bg-gray-100 dp-text-gray-900',
        true: 'dp-text-white',
      },
      size: {
        sm: 'dp-text-xs dp-h-[30px]',
        md: 'dp-text-sm dp-h-[36px]',
        lg: 'dp-text-sm dp-h-[36px]',
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
