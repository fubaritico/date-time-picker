import { FC, PropsWithChildren, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
  id?: string
}

const Portal: FC<PropsWithChildren<PortalProps>> = ({ children, id }) => {
  const elRef = useRef<HTMLDivElement | null>(null)

  elRef.current ??= document.createElement('div')

  useEffect(() => {
    let portalRoot = document.getElementById('portal')

    if (portalRoot === null) {
      portalRoot = document.createElement('div')
      portalRoot.id = 'portal'
    } else {
      document.body.removeChild(portalRoot)
    }

    document.body.appendChild(portalRoot)

    if (id && elRef.current && !document.getElementById(id)) {
      elRef.current.id = id
      portalRoot.appendChild(elRef.current)

      return
    }

    if (elRef.current) {
      portalRoot.appendChild(elRef.current)
    }

    return () => {
      if (elRef.current) {
        portalRoot.removeChild(elRef.current)
      }
    }
  }, [id])

  return createPortal(children, elRef.current)
}

export default Portal
