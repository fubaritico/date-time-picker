import React from 'react';
import ReactDOM from 'react-dom/client';
import { DateTimePicker } from '../src/DateTimePicker';
import './styles.css';

const App = () => {
  const [value, setValue] = React.useState<Date | null>(new Date());

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">DateTimePicker Preview</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
        <div className="p-4 border rounded-lg">
          <DateTimePicker
            value={value}
            onChange={setValue}
          />
          <div className="mt-4">
            <p>Selected value: {value ? value.toString() : 'None'}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Custom Format</h2>
        <div className="p-4 border rounded-lg">
          <DateTimePicker
            value={value}
            onChange={setValue}
            format="yyyy-MM-dd HH:mm"
          />
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
