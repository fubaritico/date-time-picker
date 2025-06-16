import { cva } from 'class-variance-authority'

import { COLORS } from '@constants'

import type { VariantProps } from 'class-variance-authority'

const dateBrowserButtonStyles = cva(['DateBrowserButton'], {
  variants: {
    color: COLORS.reduce<Record<UIColor, string>>(
      (acc, color) => {
        acc[color] = color
        return acc
      },
      {} as Record<UIColor, string>
    ),
    size: {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    },
  },
  defaultVariants: {
    color: 'blue',
    size: 'md',
  },
})

export type VariantDateBrowserButtonProps = VariantProps<
  typeof dateBrowserButtonStyles
>

export default dateBrowserButtonStyles
