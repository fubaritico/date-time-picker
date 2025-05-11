import React from 'react'
import ReactDOM from 'react-dom/client'
import { DateTimePicker } from '../src/DateTimePicker'
import './styles.css'
import { I18nDate } from '../src'

const App = () => {
  const [value, setValue] = React.useState<number | undefined>(Date.now())

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">DateTimePicker Preview</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <div className="p-4 border rounded-lg">
          <DateTimePicker date={value} onChange={setValue} enablePortal />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Custom Format</h2>
        <div className="p-4 border rounded-lg">
          <DateTimePicker date={value} onChange={setValue} enablePortal />
          <div className="mt-4 flex">
            <p>
              Selected value: {value ? value.toString() : 'None'}&nbsp;|&nbsp;
              <I18nDate localeAwareFormat="L LT" value={value} />
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
