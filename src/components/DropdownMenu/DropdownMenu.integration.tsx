import { Dispatch, FC, ReactNode, SetStateAction, useState } from 'react'

import { DropdownMenuProps } from './DropdownMenu'

interface IntegrationProps extends DropdownMenuProps {
  children: (props: {
    props: DropdownMenuProps
    currentValue?: string
    setCurrentValue: Dispatch<SetStateAction<string | undefined>>
  }) => ReactNode
}

const Integration: FC<IntegrationProps> = (props) => {
  const [currentValue, setCurrentValue] = useState(props.value)

  return (
    <div className="dp-w-[200px]">
      {props.children({ props, currentValue, setCurrentValue })}
    </div>
  )
}

export default Integration
