import type { MenuItemConfig } from '@components'

const localeAwareFormatItems: MenuItemConfig[] = [
  { label: '[ 09/04/1986 ] - Date (in local format) SHORT', value: 'l' },
  {
    label: '[ Sept 4, 1986 ] - Month name, day of month, year SHORT',
    value: 'll',
  },
  {
    label:
      '[ Sept 4, 1986 8:30 PM ] - Month name, day of month, year, time SHORT',
    value: 'lll',
  },
  {
    label:
      '[ Thu, Sept 4, 1986 8:30 PM ] - Day of week, month name, day of month, year, time SHORT',
    value: 'llll',
  },
  { label: '[ 09/04/1986 ] - Date (in local format)', value: 'L' },
  {
    label: '[ September 4, 1986 ] - Month name, day of month, year',
    value: 'LL',
  },
  {
    label:
      '[ September 4, 1986 8:30 PM ] - Month name, day of month, year, time',
    value: 'LLL',
  },
  {
    label:
      '[ Thursday, September 4, 1986 8:30 PM ] - Day of week, month name, day of month, year, time',
    value: 'LLLL',
  },
  {
    label:
      '[ 09/04/1986 8:30 PM +2:00 ] - Date (in local format) with time and timezone',
    value: 'L LT Z',
  },
  { label: '8:30 PM Time (without seconds)', value: 'LT' },
  { label: '8:30:00 PM Time (with seconds)', value: 'LTS' },
]

export default localeAwareFormatItems
