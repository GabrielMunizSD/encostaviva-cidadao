import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// HashRouter: as rotas funcionam em qualquer hospedagem estática (GitHub Pages, Vercel) sem configuração extra.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
