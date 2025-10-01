import React from 'react'
import ReactDOM from 'react-dom/client'
import GridAveragingCalculator from './components/GridAveragingCalculator.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GridAveragingCalculator />
  </React.StrictMode>,
)
