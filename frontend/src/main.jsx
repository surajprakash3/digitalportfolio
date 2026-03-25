import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './context/AuthContext'
import App from './App.jsx'
import './index.css'

// Check and apply dark mode preference
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
