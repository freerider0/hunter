import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
//import Table from "./components/Table.jsx";
import {TanTable} from "./components/tablas/TanTable.jsx";


function App() {
  const [count, setCount] = useState(0)


  return (
    <>
        TAbla
      <TanTable></TanTable>
    </>
  )
}

export default App
