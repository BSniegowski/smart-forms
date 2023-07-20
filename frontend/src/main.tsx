import React from 'react'
import ReactDOM from 'react-dom/client'
import DataTable from './DataTable.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DataTable dataType={"machine"}/>
  </React.StrictMode>,
)
