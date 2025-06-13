import { cva } from 'class-variance-authority'
import * as hi2 from 'react-icons/hi2'

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
    className: `focus:dp-ring-${color}-500 focus-visible:dp-ring-${color}-500 dark:focus:dp-ring-${color}-500 dark:focus-visible:dp-ring-${color}-500`,
  },
]

// Generating a list of icon names from the hi2 icons to keep the TypeScript inference
const iconNames = Object.keys(hi2) as Hi2UiIconNames[]
const iconNamesList = iconNames.reduce<Record<Hi2UiIconNames, string>>(
  (obj, key: Hi2UiIconNames) => {
    obj[key] = ''
    return obj
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  Object.create(null)
)

export const textFieldStyles = cva(
  [
    'dp-border',
    'dp-appearance-none',
    'dp-truncate',
    'dp-relative',
    'dp-outline-0',
    'dp-w-full',
    'dp-rounded-md',
    'dp-shadow-none',
    'dp-px-4',
    'dp-transition-all',
    'dp-duration-300',
    'focus:dp-ring-2',
    'focus-visible:dp-ring-2',
    'dp-bg-gray-50',
    'dp-border-gray-300',
    'dp-text-gray-500',
    'focus:dp-text-gray-800',
    'dark:dp-bg-gray-800',
    'dark:dp-border-gray-600',
    'dark:dp-text-gray-300',
    'dark:focus:dp-text-white',
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
      disabled: {
        true: [
          'placeholder:dp-text-gray-300',
          'dp-text-gray-400',
          'dark:placeholder:dp-text-gray-300',
          'dark:dp-text-gray-500',
        ],
        false: ['placeholder:dp-text-gray-400'],
      },
      hideFocus: {
        true: ['focus:!dp-ring-0', 'focus-visible:!dp-ring-0'],
      },
      iconName: iconNamesList,
      iconPosition: {
        left: '',
        right: '',
      },
      severity: {
        error: [
          'dp-border-red-500',
          'dark:dp-border-red-500',
          'focus-within:dp-border-red-500',
          'dark:focus-within:dp-border-red-500',
        ],
        warning: [
          'dp-border-yellow-500',
          'dark:dp-border-yellow-500',
          'focus-within:dp-border-yellow-500',
          'dark:focus-within:dp-border-yellow-500',
        ],
        success: [
          'dp-border-green-500',
          'dark:dp-border-green-500',
          'focus-within:dp-border-green-500',
          'dark:focus-within:dp-border-green-500',
        ],
      },
      showCross: { true: '', false: '' },
      size: {
        sm: ['dp-text-xs', 'dp-px-2'],
        md: ['dp-text-sm', 'dp-px-3'],
        lg: ['dp-text-lg', 'dp-px-4'],
      },
    },
    compoundVariants: [
      {
        iconPosition: 'left',
        iconName: iconNames,
        size: 'sm',
        className: 'dp-pl-[30px]',
      },
      {
        iconPosition: 'left',
        iconName: iconNames,
        size: 'md',
        className: 'dp-pl-[42px]',
      },
      {
        iconPosition: 'left',
        iconName: iconNames,
        size: 'lg',
        className: 'dp-pl-[52px]',
      },
      {
        iconPosition: 'right',
        iconName: iconNames,
        size: 'sm',
        className: 'dp-pr-[30px]',
      },
      {
        iconPosition: 'right',
        iconName: iconNames,
        size: 'md',
        className: 'dp-pr-[42px]',
      },
      {
        iconPosition: 'right',
        iconName: iconNames,
        size: 'lg',
        className: 'dp-pr-[52px]',
      },
      {
        iconPosition: undefined,
        showCross: true,
        iconName: undefined,
        size: 'sm',
        className: 'dp-pr-[30px]',
      },
      {
        iconPosition: undefined,
        showCross: true,
        iconName: undefined,
        size: 'sm',
        className: 'dp-pr-[42px]',
      },
      {
        iconPosition: undefined,
        showCross: true,
        iconName: undefined,
        size: 'sm',
        className: 'dp-pr-[52px]',
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
      severity: undefined,
      iconName: undefined,
      size: 'md',
      color: 'blue',
      disabled: false,
    },
  }
)

export type VariantTextFieldProps = VariantProps<typeof textFieldStyles>

export default textFieldStyles
