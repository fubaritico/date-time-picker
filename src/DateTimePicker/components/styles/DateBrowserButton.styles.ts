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
  class: `dp-hover:text-${color}dp--700 dp-focus-visible:outline-${color}dp--700`,
})

const dateBrowserButtonStyles = cva(
  [
    'dp-transition-colors',
    'dp-duration-500',
    'dp-focus:outline-none',
    'dp-focus-visible:outline-1',
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
        sm: 'dp-text-xs',
        md: 'dp-text-sm',
        lg: 'dp-text-lg',
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
