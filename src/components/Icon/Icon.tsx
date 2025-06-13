import { createElement } from 'react'
import * as hi2 from 'react-icons/hi2'

import type { FC, SVGProps } from 'react'

export type IconProps = SVGProps<SVGSVGElement> & {
  /* Icon name for react-icons/hi2 */
  name: Hi2UiIconNames
}

const Icon: FC<IconProps> = ({ name, className, ...rest }) => {
  return createElement(hi2[name], {
    className,
    ...rest,
  })
}

export default Icon
