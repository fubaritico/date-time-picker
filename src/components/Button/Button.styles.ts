import { cva } from 'class-variance-authority'

import { COLORS } from '@constants'

import type { VariantProps } from 'class-variance-authority'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | ('primary' | 'secondary' | 'ghost')[]
  | undefined

/**
 * Color themes for the calendar cells.
 *
 * @param {UIColor} color - The color theme to apply to the calendar cells (Tailwind palette names).
 */
const buildThemeColorClasses = (color: UIColor) => [
  {
    variant: 'primary' as ButtonVariant,
    color: color,
    className: `dp-bg-${color}-500 dp-border-${color}-500 hover:enabled:dp-bg-${color}-600 hover:enabled:dp-border-${color}-600 active:enabled:dp-outline-${color}-200 [&_#spinner]:dp-border-white/75 [&_#spinner]:dp-border-r-white/25`,
  },
  {
    variant: 'secondary' as ButtonVariant,
    color: color,
    className: `dp-border-${color}-500 dp-text-${color}-500 hover:enabled:dp-bg-${color}-500 hover:enabled:dp-border-${color}-500 hover:enabled:dp-text-${color}-100 active:enabled:dp-outline-${color}-200 [&_#spinner]:dp-border-${color}-500/75 [&_#spinner]:dp-border-r-${color}-500/25`,
  },
  {
    variant: 'ghost' as ButtonVariant,
    color: color,
    className: `text-${color}-500`,
  },
]

const buttonStyles = cva(
  [
    'dp-flex',
    'dp-flex-wrap',
    'dp-justify-between',
    'dp-items-center',
    'dp-font-normal',
    'dp-border',
    'dp-transition-all',
    'dp-duration-300',
    'dp-outline-none',
    'active:enabled:dp-outline',
    'active:enabled:dp-outline-4',
    'disabled:dp-cursor-not-allowed',
    'disabled:dp-opacity-50',
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
      loading: {
        false: undefined,
        true: 'dp-relative dp-cursor-not-allowed dp-opacity-50',
      },
      size: {
        sm: 'dp-text-xs dp-py-0 dp-px-3 dp-gap-3 dp-h-[37px] dp-rounded',
        md: 'dp-text-sm dp-py-0 dp-px-3 dp-gap-3 dp-h-[42px] dp-rounded-md',
        lg: 'dp-text-base dp-py-0 dp-px-5 dp-gap-3 dp-h-[52px] dp-rounded-lg',
      },
      variant: {
        primary: 'dp-text-white/85',
        secondary: 'dp-bg-transparent',
        ghost:
          'dp-bg-transparent dp-border-0 active:enabled:dp-outline-none dp-rounded-none',
      },
    },
    compoundVariants: [
      ...buildThemeColorClasses('red'),
      ...buildThemeColorClasses('orange'),
      ...buildThemeColorClasses('amber'),
      ...buildThemeColorClasses('yellow'),
      ...buildThemeColorClasses('lime'),
      ...buildThemeColorClasses('green'),
      ...buildThemeColorClasses('emerald'),
      ...buildThemeColorClasses('teal'),
      ...buildThemeColorClasses('cyan'),
      ...buildThemeColorClasses('sky'),
      ...buildThemeColorClasses('blue'),
      ...buildThemeColorClasses('indigo'),
      ...buildThemeColorClasses('violet'),
      ...buildThemeColorClasses('purple'),
      ...buildThemeColorClasses('fuchsia'),
      ...buildThemeColorClasses('pink'),
      ...buildThemeColorClasses('rose'),
      ...buildThemeColorClasses('slate'),
      ...buildThemeColorClasses('gray'),
      ...buildThemeColorClasses('zinc'),
      ...buildThemeColorClasses('neutral'),
      ...buildThemeColorClasses('stone'),
    ],
    defaultVariants: {
      size: 'md',
      variant: 'primary',
      loading: false,
      color: 'stone',
    },
  }
)

export type VariantButtonProps = VariantProps<typeof buttonStyles>

export default buttonStyles
