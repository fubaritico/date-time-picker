import { cva } from 'class-variance-authority'

import { COLORS } from '@constants'

import type { VariantProps } from 'class-variance-authority'

/**
 * Color themes for the calendar cells.
 *
 * @param {UIColor} color - The color theme to apply to the calendar cells (Tailwind palette names).
 */
const buildThemeColorClasses = (color: UIColor) => [
  {
    color: color,
    class: `focus-visible:dp-outline-${color}-100`,
  },
  {
    isInRange: true,
    color: color,
    class: `dp-text-${color}-800 dp-bg-${color}-100 hover:dp-text-${color}-800 hover:dp-bg-${color}-100`,
  },
  {
    startDateIsSelected: true,
    color: color,
    class: `!dp-border-r-white dp-bg-${color}-700 hover:dp-bg-${color}-700 dp-text-white hover:dp-text-white`,
  },
  {
    endDateIsSelected: true,
    color: color,
    class: `dp-bg-${color}-700 hover:dp-bg-${color}-700 dp-text-white hover:dp-text-white`,
  },
  {
    isToday: true,
    isInRange: false,
    color: color,
    class: `dp-border-2 dp-border-${color}-600 dp-text-${color}-600 hover:dp-text-white hover:dp-bg-${color}-600`,
  },
  {
    isSelected: true,
    color: color,
    class: `dp-bg-${color}-700 dp-text-white hover:dp-bg-${color}-800`,
  },
]

const daysGridCellStyles = cva(
  [
    'dp-font-bold',
    'dp-flex',
    'dp-justify-center',
    'dp-items-center',
    'dp-transition',
    'dp-rounded-lg',
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
      defaultBehavior: {
        true: 'dp-text-gray-900 hover:dp-bg-gray-100',
      },
      hasDateRangeMode: {
        true: 'dp-duration-200',
        false: 'dp-duration-500',
      },
      isClickable: {
        true: 'dp-cursor-pointer',
        false: 'dp-text-gray-300 dp-cursor-not-allowed',
      },
      isSelected: {
        true: 'dp-text-white',
      },
      isInRange: {
        true: 'dp-border-r-[1px] dp-border-r-white last:dp-border-r-0 -dp-mx-0.5 dp-rounded-none',
      },
      isToday: {
        true: 'dp-shadow-border',
      },
      size: {
        sm: 'dp-h-[30px] dp-w-8',
        md: 'dp-h-9 dp-w-9 dp-text-sm',
        lg: 'dp-h-10 dp-w-10',
      },
      endDateIsSelected: {
        true: 'dp-rounded-r-md dp-rounded-l-none dp-text-white !dp-w-10 -dp-mx-0.5',
      },
      startDateIsSelected: {
        true: 'dp-rounded-r-none dp-rounded-l-md dp-text-white !dp-w-10 -dp-mx-0.5',
      },
    },
    compoundVariants: [
      {
        isInRange: true,
        size: 'lg',
        class: '!dp-w-11',
      },
      {
        isInRange: true,
        size: 'md',
        class: '!dp-w-10',
      },
      {
        isInRange: true,
        size: 'sm',
        class: '!dp-h-[30px] !dp-w-8.5',
      },
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
      color: 'blue',
    },
  }
)

export type VariantDaysGridCellProps = VariantProps<typeof daysGridCellStyles>

export default daysGridCellStyles
