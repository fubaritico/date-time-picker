import { useState, StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import ControlledDateTimePicker from './controlled-date-time-picker'
import UncontrolledDateTimePicker from './uncontrolled-date-time-picker'

const App = () => {
  const [value, setValue] = useState<number | undefined>(Date.now())

  return (
    <div className="preview-container">
      <h1>DateTimePicker Preview</h1>

      <UncontrolledDateTimePicker key={1} title="Basic usage (uncontrolled)" />

      <ControlledDateTimePicker
        pickerMode="DATETIME"
        color="red"
        date={value as number}
        key={2}
        onChange={setValue}
        title="Basic Usage (controlled) - default timezone (locale)"
      />

      <ControlledDateTimePicker
        date={value as number}
        key={3}
        onChange={setValue}
        pickerMode="DATETIME"
        timezone="America/New_York"
        locale="en_US"
        title="Date Picker (controlled) New York timezone"
      />

      <ControlledDateTimePicker
        date={value as number}
        key={4}
        onChange={setValue}
        pickerMode="DATETIME"
        timezone="Europe/London"
        locale="en_US"
        title="Date Picker (controlled) London timezone"
      />

      <ControlledDateTimePicker
        date={value as number}
        key={5}
        onChange={setValue}
        pickerMode="DATETIME"
        timezone="Europe/Paris"
        locale="en_US"
        title="Date Picker (controlled) Paris timezone"
      />

      <ControlledDateTimePicker
        date={value as number}
        key={6}
        onChange={setValue}
        pickerMode="DATETIME"
        timezone="Asia/Tokyo"
        locale="en_US"
        title="Date Picker (controlled) Tokyo timezone"
      />

      <ControlledDateTimePicker
        date={value as number}
        key={7}
        onChange={setValue}
        locale="en_US"
        pickerMode="DATETIME"
        title="Date Time Picker (controlled) - default timezone (locale)"
      />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
