import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

/**
 * Color themes for the calendar cells.
 *
 * @param {UIColor} color - The color theme to apply to the calendar cells (Tailwind palette names).
 */
const buildThemeColorClasses = (color: UIColor) => [
  {
    color: color,
    class: `focus-visible:outline-${color}-100`,
  },
  {
    isInRange: true,
    color: color,
    class: `text-${color}-800 bg-${color}-100 hover:text-${color}-800 hover:bg-${color}-100`,
  },
  {
    startDateIsSelected: true,
    color: color,
    class: `bg-${color}-700 hover:bg-${color}-700 text-white hover:text-white`,
  },
  {
    endDateIsSelected: true,
    color: color,
    class: `bg-${color}-700 hover:bg-${color}-700 text-white hover:text-white`,
  },
  {
    isToday: true,
    isInRange: false,
    color: color,
    class: `border-${color}-600 text-${color}-600 hover:text-white hover:bg-${color}-600`,
  },
  {
    isSelected: true,
    color: color,
    class: `bg-${color}-700 text-white hover:bg-${color}-800`,
  },
]

const daysGridCellStyles = cva(
  [
    'font-bold',
    'flex',
    'justify-center',
    'items-center',
    'transition',
    'rounded-lg',
    'focus:outline-none',
    'focus-visible:outline-1',
  ],
  {
    variants: {
      color: {
        red: '',
        orange: '',
        amber: '',
        yellow: '',
        lime: '',
        green: '',
        emerald: '',
        teal: '',
        cyan: '',
        sky: '',
        blue: '',
        indigo: '',
        violet: '',
        purple: '',
        fuchsia: '',
        pink: '',
        rose: '',
        slate: '',
        gray: '',
        zinc: '',
        neutral: '',
        stone: '',
      },
      defaultBehavior: {
        true: 'text-gray-900 hover:bg-gray-100',
      },
      hasDateRangeMode: {
        true: 'duration-200',
        false: 'duration-500',
      },
      isClickable: {
        true: 'cursor-pointer',
        false: 'text-gray-300 cursor-not-allowed',
      },
      isSelected: {
        true: 'text-white',
      },
      isInRange: {
        true: 'border-r border-r-white last:border-r-0 -mx-0.5 rounded-none',
      },
      isToday: {
        true: 'shadow-border border-2',
      },
      size: {
        sm: 'h-[30px] w-8',
        md: 'h-9 w-9 text-sm',
        lg: 'h-10 w-10',
      },
      endDateIsSelected: {
        true: 'rounded-r-md rounded-l-none text-white',
      },
      startDateIsSelected: {
        true: 'rounded-r-none text-white rounded-l-md w-10 -mx-0.5 border-r',
      },
    },
    compoundVariants: [
      {
        isInRange: true,
        size: 'lg',
        class: 'w-11',
      },
      {
        isInRange: true,
        size: 'md',
        class: 'w-10',
      },
      {
        isInRange: true,
        size: 'sm',
        class: 'h-[30px] w-8.5',
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
