import Icon from '../../Icon/Icon'

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
        <Icon aria-hidden name="HiChevronUp" />
      </button>
      <div aria-label={date}>{date}</div>
      <button aria-label={`Remove one ${unit}`} onClick={onBottomButtonClick}>
        <Icon aria-hidden name="HiChevronDown" />
      </button>
    </div>
  )
}

export default TimePanelSetter
