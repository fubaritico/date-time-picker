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
  class: `hover:text-${color}-700 focus-visible:outline-${color}-700`,
})

const dateBrowserButtonStyles = cva(
  [
    'transition-colors',
    'duration-500',
    'focus:outline-none',
    'focus-visible:outline-1',
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
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-lg',
      },
    },
    compoundVariants: [
      buildThemeColorClasses('red'),
      buildThemeColorClasses('orange'),
      buildThemeColorClasses('amber'),
      buildThemeColorClasses('yellow'),
      buildThemeColorClasses('lime'),
      buildThemeColorClasses('green'),
      buildThemeColorClasses('emerald'),
      buildThemeColorClasses('teal'),
      buildThemeColorClasses('cyan'),
      buildThemeColorClasses('sky'),
      buildThemeColorClasses('blue'),
      buildThemeColorClasses('indigo'),
      buildThemeColorClasses('violet'),
      buildThemeColorClasses('purple'),
      buildThemeColorClasses('fuchsia'),
      buildThemeColorClasses('pink'),
      buildThemeColorClasses('rose'),
      buildThemeColorClasses('slate'),
      buildThemeColorClasses('gray'),
      buildThemeColorClasses('zinc'),
      buildThemeColorClasses('neutral'),
      buildThemeColorClasses('stone'),
    ],
    defaultVariants: {
      color: 'blue',
      size: 'md',
    },
  }
)

export type VariantDateBrowserButtonProps = VariantProps<
  typeof dateBrowserButtonStyles
>

export default dateBrowserButtonStyles
