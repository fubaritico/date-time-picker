import { cva } from 'class-variance-authority'

import { COLORS } from '@constants'

import type { VariantProps } from 'class-variance-authority'

const buttonStyles = cva(['Button'], {
  variants: {
    color: COLORS.reduce<Record<UIColor, string>>(
      (acc, color) => {
        acc[color] = color
        return acc
      },
      {} as Record<UIColor, string>
    ),
    loading: {
      false: undefined,
      true: 'loading',
    },
    size: {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    },
    variant: {
      primary: 'primary',
      secondary: 'secondary',
      ghost:
        'dp-bg-transparent dp-border-0 active:enabled:dp-outline-none dp-rounded-none',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'primary',
    loading: false,
    color: 'stone',
  },
})

export type VariantButtonProps = VariantProps<typeof buttonStyles>

export default buttonStyles
