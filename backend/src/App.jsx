import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
//import Table from "./components/Table.jsx";
import {TanTable} from "./components/tablas/TanTable.jsx";
import AutoCompleteSelect from "./components/AutoCompleteSelect.jsx";
import {useQuery} from "@tanstack/react-query";
import {getLocalities, getPropertyTypes} from "./apiClient/dictionaries.js";


function App() {
  const [count, setCount] = useState(0)



  return (
    <>

      <TanTable></TanTable>
    </>
  )
}

export default App
