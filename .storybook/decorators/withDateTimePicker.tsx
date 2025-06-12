import { Decorator } from '@storybook/react'

/**
 * Decorator to wrap the story in a DateTimePicker component.
 * New storybook syntax.
 *
 * @param Story
 *
 * @returns Element
 */
export const withDateTimePicker: Decorator = (Story) => (
  <div className="dp-flex dp-min-h-[450px] dp-w-full dp-flex-col dp-items-start dp-p-8 dp-justify-start dp-bg-storybook dp-bg-fixed">
    {Story()}
  </div>
)
import { useState } from 'react'
export const ModeDecorator: Decorator = (Story: any) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const toggleMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark', !isDarkMode)
  }
  return (
    <>
      <button
        onClick={toggleMode}
        style={{
          position: 'fixed',
          top: 10,
          right: 10,
          zIndex: 9999,
          padding: '8px 12px',
          backgroundColor: isDarkMode ? '#333' : '#fff',
          color: isDarkMode ? '#fff' : '#333',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      {Story()}
    </>
  )
}
