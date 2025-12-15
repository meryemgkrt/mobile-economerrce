import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if(!key) {
  throw new Error('VITE_CLERK_PUBLISHABLE_KEY is not defined')
}



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
