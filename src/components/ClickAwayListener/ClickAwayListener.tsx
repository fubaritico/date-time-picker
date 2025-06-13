import { useEffect, useRef } from 'react'

import type { FC, PropsWithChildren, RefObject } from 'react'

interface ClickAwayListenerProps {
  onClickAway: () => void
  ignoreClickAwayRef?: RefObject<HTMLElement | null>
}

/**
 * Will wrap content and listen for outside click from children, then will trigger the provided callback
 *
 * @param onClickAway
 * @param children
 * @param ignoreRef
 *
 * @constructor
 */
const ClickAwayListener: FC<PropsWithChildren<ClickAwayListenerProps>> = ({
  onClickAway,
  children,
  ignoreClickAwayRef,
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node) &&
        !ignoreClickAwayRef?.current?.contains(event.target as Node)
      ) {
        onClickAway()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClickAway, ignoreClickAwayRef])

  return <div ref={wrapperRef}>{children}</div>
}

export default ClickAwayListener
