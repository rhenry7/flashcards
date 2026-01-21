import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LanguageLearningApp from './language-flashcard-pwa'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageLearningApp />
  </StrictMode>,
)
