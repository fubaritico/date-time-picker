import MockDate from 'mockdate'

import { formatToLocaleAwareFormat } from '@utils'

describe('formatToLocaleAwareFormat', () => {
  const fixedDate = 1742052493000
  const locale = 'en-US'
  const localeAwareFormat: LocaleAwareFormat = 'LLLL'
  const timezone: Timezone = 'Pacific/Enderbury'

  beforeEach(() => {
    MockDate.set(fixedDate)
  })

  afterEach(() => {
    MockDate.reset()
  })

  it('should format date to locale aware format', () => {
    const date = Date.now()
    const formattedDate = formatToLocaleAwareFormat(
      date,
      locale,
      localeAwareFormat,
      timezone
    )

    expect(formattedDate).toBe('Sunday, March 16, 2025 4:28 AM')
  })
})
