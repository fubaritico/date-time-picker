import { useEffect, useRef } from 'react'

import useDateTimePicker from './useDateTimePicker'

export default function usePanelDomRect() {
  const { setPanelRect } = useDateTimePicker()
  const panelRef = useRef(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (panelRef.current && window.ResizeObserver) {
      const observer = new ResizeObserver((entries) => {
        setPanelRect(entries[0].contentRect)
      })

      observer.observe(panelRef.current)

      // Clean up observer on component unmount
      return () => {
        observer.disconnect()
      }
    }
  }, [setPanelRect])

  return panelRef
}
