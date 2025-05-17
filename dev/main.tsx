import React from 'react'
import ReactDOM from 'react-dom/client'

import './styles.css'

import ControlledExample from './controlled-example'
import UncontrolledExample from './uncontrolled-example'

import { PickerMode } from '../src'

const App = () => {
  const [value, setValue] = React.useState<number | undefined>(Date.now())

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">DateTimePicker Preview</h1>

      <UncontrolledExample title="Basic usage (uncontrolled)" />

      <ControlledExample
        date={value}
        onChange={setValue}
        title="Basic Usage (controlled) - default timezone (locale)"
      />

      <ControlledExample
        date={value}
        onChange={setValue}
        timezone="America/New_York"
        locale="en_US"
        title="Date Picker (controlled) New York timezone"
      />

      <ControlledExample
        date={value}
        onChange={setValue}
        timezone="Europe/London"
        locale="en_US"
        title="Date Picker (controlled) London timezone"
      />

      <ControlledExample
        date={value}
        onChange={setValue}
        timezone="Europe/Paris"
        locale="en_US"
        title="Date Picker (controlled) Paris timezone"
      />

      <ControlledExample
        date={value}
        onChange={setValue}
        timezone="Asia/Tokyo"
        locale="en_US"
        title="Date Picker (controlled) Tokyo timezone"
      />

      <ControlledExample
        date={value}
        onChange={setValue}
        locale="en_US"
        pickerMode={PickerMode.DATETIME}
        title="Date Time Picker (controlled) - default timezone (locale)"
      />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
