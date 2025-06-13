import Icon from '../../Icon/Icon'

import type { FC } from 'react'

interface TimePanelSetterProps {
  /*  */
  date: string
  /*  */
  onBottomButtonClick: () => void
  /*  */
  onTopButtonClick: () => void
  /*  */
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
    <div className="dp-flex dp-flex-col dp-justiy-center dp-gap-5 dp-w-[85px]">
      <button
        aria-label={`Add one ${unit}`}
        className="dp-flex dp-justify-center dp-items-center dp-h-8 dp-rounded-lg dp-hover:bg-gray-100 dp-appearance-none dp-transition dp-duration-500 dp-border-none dp-text-gray-oda-800 dark:dp-text-white dark:hover:dp-bg-gray-700"
        onClick={onTopButtonClick}
      >
        <Icon aria-hidden name="HiChevronUp" className="dp-size-4" />
      </button>
      <div className="dp-font-robotoMono dp-text-gray-800 dp-text-[64px] dp-font-bold dp-leading-[64px] dp-text-center dark:dp-text-white">
        {date}
      </div>
      <button
        aria-label={`Remove one ${unit}`}
        className="dp-flex dp-justify-center dp-items-center dp-h-8 dp-rounded-lg dp-hover:bg-gray-100 dp-appearance-none dp-transition dp-duration-500 dp-border-none dp-text-gray-oda-800 dark:dp-text-white dark:hover:dp-bg-gray-700"
        onClick={onBottomButtonClick}
      >
        <Icon aria-hidden name="HiChevronDown" className="dp-size-4" />
      </button>
    </div>
  )
}

export default TimePanelSetter
