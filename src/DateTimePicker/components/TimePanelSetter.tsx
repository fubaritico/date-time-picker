import Icon from '../../Icon/Icon'

import type { FC } from 'react'

interface TimePanelSetterProps {
  date: string
  onBottomButtonClick: () => void
  onTopButtonClick: () => void
  unit: string
}

/**
 * TimePanelSetter component, includes two button to increase/decrease a value with passed callbacks.
 *
 * @param date
 * @param onBottomButtonClick
 * @param onTopButtonClick
 * @param unit
 */
const TimePanelSetter: FC<TimePanelSetterProps> = ({
  date,
  onBottomButtonClick,
  onTopButtonClick,
  unit,
}) => {
  return (
    <div className="flex flex-col justiy-center gap-5 w-[85px]">
      <button
        aria-label={`Add one ${unit}`}
        className="flex justify-center items-center h-8 rounded-lg hover:bg-gray-100 appearance-none transition duration-500 border-none text-gray-oda-800"
        onClick={onTopButtonClick}
      >
        <Icon aria-hidden name="HiChevronUp" className="size-4" />
      </button>
      <div className="font-robotoMono font-bold text-gray-800 text-[64px] font-bold leading-[64px] text-center">
        {date}
      </div>
      <button
        aria-label={`Remove one ${unit}`}
        className="flex justify-center items-center h-8 rounded-lg hover:bg-gray-100 appearance-none transition duration-500 border-none text-gray-oda-800"
        onClick={onBottomButtonClick}
      >
        <Icon aria-hidden name="HiChevronDown" className="size-4" />
      </button>
    </div>
  )
}

export default TimePanelSetter
