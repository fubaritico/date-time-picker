import '@testing-library/jest-dom'
import '@testing-library/jest-dom/jest-globals'

import { configure } from '@testing-library/react'

configure({ testIdAttribute: 'data-test', asyncUtilTimeout: 2500 })
