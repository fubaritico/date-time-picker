import { useEffect, useState } from 'react'
import { Decorator } from '@storybook/react'

const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState<'dark' | 'light' | 'system'>(
    () =>
      (localStorage.getItem('theme') as 'dark' | 'light' | 'system') || 'system'
  )

  useEffect(() => {
    const root = document.documentElement

    if (darkMode === 'system') {
      root.classList.add('system')
      root.classList.remove('dark')
      root.classList.remove('dp-light')
    }

    if (darkMode === 'dark') {
      root.classList.toggle('dark')
      root.classList.remove('system')
      root.classList.remove('dp-light')
    }

    if (darkMode === 'light') {
      root.classList.toggle('dp-light')
      root.classList.remove('system')
      root.classList.remove('dark')
    }

    localStorage.setItem('theme', darkMode)
  }, [darkMode])

  return {
    darkMode,
    setDarkMode,
    toggleDarkMode: () => {
      setDarkMode((prev) => {
        if (prev === 'system') return 'dark'
        if (prev === 'dark') return 'light'
        return 'system'
      })
    },
  }
}

const withToggleDarkMode: Decorator = (Story: any) => {
  const { darkMode, toggleDarkMode } = useDarkMode()

  return (
    <>
      <button
        onClick={toggleDarkMode}
        style={{
          position: 'fixed',
          top: 10,
          right: 10,
          zIndex: 9999,
          padding: '8px 12px',
          backgroundColor: darkMode === 'dark' ? '#333' : '#fff',
          color: darkMode === 'dark' ? '#fff' : '#333',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        {darkMode === 'system'
          ? 'Auto mode'
          : darkMode === 'dark'
            ? 'Dark mode'
            : 'Light mode'}
      </button>
      {Story()}
    </>
  )
}

export default withToggleDarkMode
