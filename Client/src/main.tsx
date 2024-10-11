import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './home/home'
import Dashboard from './dashboard/dashboard'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Home />
  </StrictMode>,
)
