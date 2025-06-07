import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

const daysGridCellStyles = cva([], {
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
    size: {},
  },
  compoundVariants: [],
  defaultVariants: {},
})

export type VariantDaysGridCellProps = VariantProps<typeof daysGridCellStyles>

export default daysGridCellStyles
