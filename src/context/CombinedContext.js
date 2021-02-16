import React from 'react'
import ThemeContextProvider from './ThemeContext'
import UserContextProvider from './UserContext'
import AlertContextProvider from './AlertContext'

export default function CombinedContext({ children }) {
  return (
    <ThemeContextProvider>
      <UserContextProvider>
        <AlertContextProvider>
          {children}
        </AlertContextProvider>
      </UserContextProvider>
    </ThemeContextProvider>
  )
}
