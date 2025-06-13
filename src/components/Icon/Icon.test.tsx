import { render } from '@testing-library/react'
import * as hi2 from 'react-icons/hi2'

import Icon from './Icon'

import type { IconProps } from './Icon'

const setup = (iconName: Hi2UiIconNames, props?: IconProps) => {
  return render(<Icon name={iconName} {...props} />)
}

/**
 * Just take a small part of the entire icon set to reduce the test time (more than 900 icons)
 */
describe('Hi2 Icon', () => {
  it.each([
    ...Object.keys(hi2)
      .filter((name) => name !== 'default')
      .map<Hi2UiIconNames[]>((value) => [value as Hi2UiIconNames])
      .slice(0, 10),
  ])('should render the hi2 "%s" icon', (iconName: Hi2UiIconNames) => {
    const { container } = setup(iconName)

    expect(container).toBeTruthy()
  })
})
