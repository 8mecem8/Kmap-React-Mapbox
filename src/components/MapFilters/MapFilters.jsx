//Import Libraries/Packages
import React from 'react'

//Import Styles
import "./MapFilters.css"

//Import local components/files etc..
import NAdata from "../../assets/National_Obesity_By_State.json"
import info from "../../assets/info-s.svg"


function MapFilters({setselectedState}) 
{
  return (
    <div id='filters-main-container'>
        <div id='filters-info-wrapper'><i id='filters-info'>Layer Filter</i></div>
        <div id='filters-wrapper'>
            <button className='change-layer-buttons active-layer-button'>heatmap-layer</button>
            <button className='change-layer-buttons active-layer-button'>circle-layer</button>
        </div>
        <div id='user-select-state-wrapper'>
            <div id='user-select-state-info-wrapper'><i id='state-filters-info'>State Filter</i></div>
            <select onChange={(e)=>{setselectedState(e.target.value)}} className="custom-select">
            <option value="All">Filter By State</option>
            <option value="All">All</option>
            {NAdata.features.map((arg,i) => 
                {
                return (<option key={arg.properties.NAME+i} value={arg.properties.NAME}>{arg.properties.NAME}</option>)
                })}
            </select>
        </div>
        <div id='howto-use-wrapper'>
            <img src={info} alt='information logo'/><i>Users can navigate and interact with mouse cursor<br/>Hover and left click to get more info on the map</i>
        </div>
    </div>
  )
}

export default MapFilters