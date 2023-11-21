//Import Libraries/Packages
import React, { useState } from 'react'

//Import Styles
import './App.css'

//Import local components/files etc..
import data from "./assets/National_Obesity_By_State.json"
import MapControl from './components/MapControl/MapControl'
import MapFilters from './components/MapFilters/MapFilters'

function App() 
{

  const [selectedState, setselectedState] = useState("All")

 
  return (
    <>
    <div id='header-wrapper'><h2 id='header'>National Obesity Data By State</h2></div>
      <MapControl selectedState={selectedState} /> 
      <MapFilters setselectedState={setselectedState} /> 
    </>
  )
}

export default App
