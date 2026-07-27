import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import NewTab from './newtab.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NewTab />
  </StrictMode>,
)
