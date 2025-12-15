import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const PUBLISHABLE_KEY=import.meta.VITE_CLERK_PUBLISHABLE_KEY
if(!PUBLISHABLE_KEY){
  throw new Error("VITE_CLERK_PUBLISHABLE_KEY is not defined")
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
