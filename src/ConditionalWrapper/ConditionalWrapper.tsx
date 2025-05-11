import type { FC, PropsWithChildren, ReactElement, ReactNode } from 'react'

export interface ConditionalWrapperProps {
  /* Any condition for wrapping children elements into passed ReactNode/component */
  condition: boolean
  /* A default wrapper component can be passed */
  defaultWrapper?: (children: ReactNode) => ReactElement
  /* The wrapper component used if condition is fulfilled */
  wrapper: (children: ReactNode) => ReactElement
}

const ConditionalWrapper: FC<PropsWithChildren<ConditionalWrapperProps>> = ({
  children,
  condition,
  defaultWrapper,
  wrapper,
}) => {
  if (condition) return wrapper(children)
  if (defaultWrapper) return defaultWrapper(children)

  return <>{children}</>
}

export default ConditionalWrapper
