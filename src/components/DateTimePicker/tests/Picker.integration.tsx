import { useState } from 'react'

import { AnyPickerProps } from '../types'

import type { Dispatch, FC, ReactNode, SetStateAction } from 'react'

type IntegrationProps = AnyPickerProps & {
  spyOnDateChange?: (date: number | never[] | undefined) => void
  children: (props: {
    props: AnyPickerProps
    currentValue?: number | never[] | undefined
    setCurrentValue: Dispatch<SetStateAction<number | never[] | undefined>>
  }) => ReactNode
}

const Integration: FC<IntegrationProps> = (props) => {
  const [currentValue, setCurrentValue] = useState(
    props.date ?? props.dateRange
  )

  const extendedSetCurrentValue: Dispatch<
    SetStateAction<number | never[] | undefined>
  > = (value) => {
    setCurrentValue(value)
    if (props.spyOnDateChange && typeof value === 'number') {
      props.spyOnDateChange(value)
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
