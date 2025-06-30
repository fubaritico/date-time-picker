import { useState } from 'react'

import { AnyPickerProps } from '../types'

import type { Dispatch, FC, ReactNode, SetStateAction } from 'react'

type IntegrationProps = AnyPickerProps & {
  spyOnDateChange?: (date: number) => void
  children: (props: {
    props: AnyPickerProps
    currentValue?: number
    setCurrentValue: Dispatch<SetStateAction<number | undefined>>
  }) => ReactNode
}

const Integration: FC<IntegrationProps> = (props) => {
  const [currentValue, setCurrentValue] = useState(props.date)

  const extendedSetCurrentValue: Dispatch<
    SetStateAction<number | undefined>
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
