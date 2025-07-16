import { useState } from 'react'

import { CommonPickerProps, DateRange, PickerMode } from '../types'

import type { Dispatch, ReactNode, SetStateAction } from 'react'

type IntegrationProps<T extends PickerMode> = CommonPickerProps<T> & {
  spyOnDateChange?: (date: number | DateRange | undefined) => void
  children: (props: {
    props: CommonPickerProps<T>
    currentValue?: number | DateRange | undefined
    setCurrentValue: Dispatch<SetStateAction<number | DateRange | undefined>>
  }) => ReactNode
}

const Integration = <T extends PickerMode>(props: IntegrationProps<T>) => {
  const [currentValue, setCurrentValue] = useState(
    props.date ?? props.dateRange
  )

  const extendedSetCurrentValue: Dispatch<
    SetStateAction<number | DateRange | undefined>
  > = (value) => {
    setCurrentValue(value)
    if (
      (props.spyOnDateChange && typeof value === 'number') ||
      Array.isArray(value)
    ) {
      props.spyOnDateChange?.(value)
    }
  }

  return (
    <div>
      {props.children({
        props,
        currentValue,
        setCurrentValue: extendedSetCurrentValue,
      })}
    </div>
  )
}

export default Integration
