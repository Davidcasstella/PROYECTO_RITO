import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/cormorant-garamond/wght.css'
import '@fontsource-variable/cormorant-garamond/wght-italic.css'
import '@fontsource-variable/jost/wght.css'
import 'lenis/dist/lenis.css'
import { App } from '@/app/App'
import '@/styles/globals.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('No se encontró el elemento #root en index.html')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
