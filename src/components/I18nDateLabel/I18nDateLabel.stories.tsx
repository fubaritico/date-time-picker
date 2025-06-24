import { withLayout, withPadding } from '@storybook-decorators/withLayout'

import I18nDateLabel, { I18nDateLabelProps } from './I18nDateLabel'

import { languages, timezones } from '.'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof I18nDateLabel> = {
  title: 'Components/I18nDateLabel',
  component: I18nDateLabel,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    locale: {
      options: [...languages.map((lang) => lang.value)],
      control: { type: 'select' },
    },
    localeAwareFormat: {
      options: [
        'l',
        'll',
        'lll',
        'llll',
        'L',
        'LL',
        'LLL',
        'LLLL',
        'L LT Z',
        'LT',
        'LTS',
      ],
      control: {
        type: 'select',
        labels: {
          l: 'l - [ 09/04/1986 ] - Date (in local format) SHORT',
          ll: 'll - [ Sept 4, 1986 ] - Month name, day of month, year SHORT',
          lll: 'lll - [ Sept 4, 1986 8:30 PM ] - Month name, day of month, year, time SHORT',
          llll: 'llll - [ Thu, Sept 4, 1986 8:30 PM ] - Day of week, month name, day of month, year, time SHORT',
          L: 'L - [ 09/04/1986 ] - Date (in local format)',
          LL: 'LL - [ September 4, 1986 ] - Month name, day of month, year',
          LLL: 'LLL - [ September 4, 1986 8:30 PM ] - Month name, day of month, year, time',
          LLLL: 'LLLL - [ Thursday, September 4, 1986 8:30 PM ] - Day of week, month name, day of month, year, time',
          'L LT Z':
            'L LT Z - [ 09/04/1986 8:30 PM +2:00 ] - Date (in local format) with time and timezone',
          LT: 'LT - 8:30 PM Time (without seconds)',
          LTS: 'LTS - 8:30:00 PM Time (with seconds)',
        },
      },
    },
    timezone: {
      options: timezones.map((tz) => tz.value),
      control: {
        type: 'select',
        labels: timezones.reduce<Record<string, string>>((acc, { value }) => {
          if (value) {
            acc[value] = value
          }
          return acc
        }, {}),
      },
    },
  },
  decorators: [withPadding, withLayout],
}

export default meta

type Story = StoryObj<typeof I18nDateLabel>

const storyRenderer = (args: I18nDateLabelProps) => <I18nDateLabel {...args} />

export const Default: Story = {
  args: {
    value: 1723201362000,
  },

  render: storyRenderer,
}
