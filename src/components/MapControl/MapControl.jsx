//Import Libraries/Packages
import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl';


//Import Styles
import "./MapControl.css"

//Import local components/files etc..
import NAdata from "../../assets/National_Obesity_By_State.json"


mapboxgl.accessToken = import.meta.env.VITE_BOXMAP_AC_TOKEN

function MapControl({selectedState}) 
{
    const mapContainer = useRef(null);

    const [viewPort, setViewPort] = useState({latitude:-98.5795,Longitude: 39.8283,zoom: 0})

    /* filter data by user selection */
    let data =

    
    
useEffect(() => 
{
    
    data = selectedState == "All" ? NAdata : NAdata.features.filter(arg => { return arg.properties.NAME == selectedState})[0]

    const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mehmetcemonal/clo3lyva900eo01qpdadh528k',minZoom: 1,maxZoom: 7, /* optimal 4 */
        maxBounds:[[-135.0, 20.0],/* Southwest corner (bottom-left) */[-62.934570, 56.538800], /* Northeast corner of the bounding box */],
        ...viewPort});
      
        let hoveredPolygonId = null;
        
        
        //Add functionality/layers etc... when component fully loaded/mounted
        map.on('load', (e) => 
        {


            map.addSource('National_Obesity_By_State', {type: 'geojson',data: data,'generateId': true /*This ensures that all features have unique IDs*/});
        
            map.addLayer({
                'id': 'states-layer',
                'type': 'fill',
                'source': 'National_Obesity_By_State', // reference the data source
                'layout': {},
                'paint': {
                    'fill-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#31b996',  /*hover color*/ '#627BC1',  /*initial color*/], 
                    'fill-opacity': ['case',['boolean', ['feature-state', 'hover'], false], 1, 0.3]}
            }); 

            map.addLayer({
                id: 'circle-layer',
                type: 'circle',
                source: 'National_Obesity_By_State',
                'layout': {/* visible by default */ 'visibility': 'visible'},
                paint: {
                    "circle-color": "rgba(255, 105, 180, 0.7)",
                    "circle-radius": 4,
                    "circle-stroke-color": "#FFD700",
                    "circle-stroke-width": 2,
                }
              });
            
            // Add a black outline around the polygon.
            map.addLayer({
                'id': 'outline',
                'type': 'line',
                'source': 'National_Obesity_By_State',
                'layout': {},
                'paint': {'line-color': '#000','line-width': 1}
                });

                
                
            map.addLayer({
                id: 'heatmap-layer',
                type: 'heatmap',
                source: 'National_Obesity_By_State',
                maxzoom: 15, // Adjust as needed
                'layout': {/* visible by default */ 'visibility': 'visible'},
                paint: {
                  //  the heatmap intensity for different zoom levels
                  'heatmap-intensity': ['interpolate',['linear'],['zoom'],0, 1,15, 3,],
                  // Color ramp for the heatmap
                  'heatmap-color': ['interpolate', ['linear'],['heatmap-density'],
                    0, 'rgba(0, 0, 255, 0)',
                    0.2, 'royalblue',
                    0.4, 'cyan',
                    0.6, 'lime',
                    0.8, 'yellow',
                    1, 'red',],
                  //  radius of the heatmap points
                  'heatmap-radius': ['interpolate',['linear'],['zoom'],0, 2,15, 20,],
                },
              });
            

            map.on('click', 'states-layer', (e) => 
                  {
                      const popupHTML = `
                      <div class="state-info-popup">
                      <h3>State of ${e.features[0].properties.NAME}</h3>
                          <p><i>Percentage of Obesity:</i> %${e.features[0].properties.Obesity}<p>
                      </div>
                      `;
                      
                      new mapboxgl.Popup()
                      .setLngLat(e.lngLat)
                      .setHTML(popupHTML)
                      .addTo(map)
                          
                  });
              
              

            /* This popup element for when user hovers cursor over states, show state name */
            const stateNamePopup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                className:'hover-State-name',
            });
            //stateNamePopup.removeClassName('mapboxgl-popup')
            /* ----------------------------------------------------------------------------- */
        
              
              
             map.on('mousemove', 'states-layer', (e) => 
                    {
                        stateNamePopup.setLngLat(e.lngLat).setHTML(`<p id="hover-State-name-text">${e.features[0].properties.NAME}</p>`).addTo(map)

                        if (e.features.length > 0) 
                        {
                            if (hoveredPolygonId !== null) 
                            {
                                map.setFeatureState({ source: 'National_Obesity_By_State', id: hoveredPolygonId },{ hover: false });
                            }

                            hoveredPolygonId = e.features[0].id;
                            map.setFeatureState({ source: 'National_Obesity_By_State', id: hoveredPolygonId },{ hover: true });
                        }
                    });
                     
            
            map.on('mouseleave', 'states-layer', () => 
                    {
                        stateNamePopup.remove()

                        if (hoveredPolygonId !== null) 
                        {
                            map.setFeatureState({ source: 'National_Obesity_By_State', id: hoveredPolygonId },{ hover: false });
                        }
                        hoveredPolygonId = null;
                    });
              
              

            /* This block of code to show/hide layer filters */
            map.on('idle', () => 
            {
                [...document.querySelectorAll(".change-layer-buttons")].forEach(arg => 
                    {
                        //console.log(arg.textContent)


                        const handleClick = (e)=>
                        {
                            e.preventDefault();
                            e.stopPropagation();

                            const visibility = map.getLayoutProperty(arg.textContent,'visibility');


                            if (visibility === 'visible') 
                            {
                                map.setLayoutProperty(arg.textContent, 'visibility', 'none');
                                e.target.classList.remove("active-layer-button")
                            } 
                            else 
                            {
                                e.target.classList.add("active-layer-button")
                                map.setLayoutProperty( arg.textContent,'visibility','visible');
                            }
                        }
                        arg.addEventListener("click",handleClick)
                    }
                    )
            })
              

            map.addControl(new mapboxgl.NavigationControl());

            // Change the cursor to a pointer when the mouse is over the places layer.
            map.on('mouseenter', 'states-layer', () => { map.getCanvas().style.cursor = 'pointer'; });
            // Change it back to a pointer when it leaves.
            map.on('mouseleave', 'states-layer', () => { map.getCanvas().style.cursor = '';  });

        //console.log('loaded',e.target)
    })



    return () => map.remove(); // remove the map when component dismounts
}, [selectedState])


  return (
    <div>
       <div ref={mapContainer} id="map-container" /> 
    </div>
  )
}

export default MapControl