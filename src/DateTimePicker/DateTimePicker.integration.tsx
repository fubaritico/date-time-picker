import { Dispatch, FC, ReactNode, SetStateAction, useState } from 'react'

import { DateTimePickerProps } from './DateTimePicker.types'

interface IntegrationProps extends DateTimePickerProps {
  spyOnDateChange?: (date: number) => void
  children: (props: {
    props: DateTimePickerProps
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
