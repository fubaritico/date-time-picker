import { ReactComponent as HiChevronDown } from '../../../assets/svg/HiChevronDown.svg'
import { ReactComponent as HiChevronUp } from '../../../assets/svg/HiChevronUp.svg'

import type { FC } from 'react'

interface TimePanelSetterProps {
  /* The value as minutes or hours */
  date: string
  /* Called on the bottom/minus button click */
  onBottomButtonClick: () => void
  /* Called on the top/plus button click */
  onTopButtonClick: () => void
  /* 'hours' or 'minutes' */
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
    <div className="TimePanelSetter">
      <button aria-label={`Add one ${unit}`} onClick={onTopButtonClick}>
        <HiChevronUp aria-hidden />
      </button>
      <div aria-label={date}>{date}</div>
      <button aria-label={`Remove one ${unit}`} onClick={onBottomButtonClick}>
        <HiChevronDown aria-hidden />
      </button>
    </div>
  )
}

export default TimePanelSetter
