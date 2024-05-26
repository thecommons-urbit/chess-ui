import React from 'react'
import '../css/tabs.css'
import '../css/buttons.css'
import '../css/general.css'
import '../css/textboxes.css'
import '../css/chessground.css'
// Chessground style sheets
import '../css/dependencies/chessground.base.css'
// Handles Chessground piece highlighting
import '../css/dependencies/chessground.highlight.css'
// Chessground board SVG
import '../css/dependencies/chessground.brown.css'
// Chessground piece SVGs
import '../css/dependencies/chessground.cburnett.css'
import { createRoot } from 'react-dom/client'
import App from './App'

declare global {
  interface Window {
    ship: string
  }
}

const root = createRoot(document.getElementById('root'))
root.render(
  <App />
)
