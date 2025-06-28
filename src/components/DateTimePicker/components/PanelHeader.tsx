import clsx from 'clsx'

import { ReactComponent as HiChevronLeft } from '../../../assets/svg/HiChevronLeft.svg'
import { ReactComponent as HiChevronRight } from '../../../assets/svg/HiChevronRight.svg'

import type { FC, PropsWithChildren } from 'react'

export interface PanelHeaderProps {
  /* Extra CSS styles (tailwind) */
  className?: string
  /* If true, the 'next' button is disabled */
  disableNextButton?: boolean
  /* If true, the 'previous' button is disabled */
  disablePrevButton?: boolean
  /* Next button aria-label */
  nextButtonAriaLabel: string
  /* Function called when clicking on the 'previous' button */
  onPrevButtonClick?: () => void
  /* Function called when clicking on the 'next' button */
  onNextButtonClick?: () => void
  /* Previous button aria-label */
  prevButtonAriaLabel: string
  /* Panel size: 'sm' | 'md' | 'lg'  */
  size?: UISize
}

const PanelHeader: FC<PropsWithChildren<PanelHeaderProps>> = ({
  children,
  className,
  disableNextButton = false,
  disablePrevButton = false,
  onPrevButtonClick,
  onNextButtonClick,
  prevButtonAriaLabel,
  nextButtonAriaLabel,
  size,
}) => (
  <div className={clsx('PanelHeader', size, className)} aria-live="polite">
    <button
      aria-label={prevButtonAriaLabel}
      onClick={onPrevButtonClick}
      disabled={disablePrevButton}
    >
      <HiChevronLeft aria-hidden />
    </button>
    <div className="PanelHeader-content">{children}</div>
    <button
      aria-label={nextButtonAriaLabel}
      onClick={onNextButtonClick}
      disabled={disableNextButton}
    >
      <HiChevronRight aria-hidden />
    </button>
  </div>
)

export default PanelHeader
