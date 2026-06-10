import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'
import { RadioProvider } from './context/RadioContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RadioProvider>
      <App />
    </RadioProvider>
  </StrictMode>,
)