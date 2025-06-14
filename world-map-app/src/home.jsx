import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON,useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {Link} from 'react-router-dom'
import './home.css';

function ResizeMap() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100); // Allow DOM to finish rendering
  }, [map]);

  return null;
}

function MapComponent() {
    // default country style
    const countryStyle = {
        color: "black",       
        weight: 2,            
        fillColor: "rgb(255, 255, 255)", 
        fillOpacity: 0.2      
    };
    
    // Style when country is hovered over
    const highlightStyle = (e)=> { 
       const layer = e.target
       layer.setStyle({
            weight: 4,          
            color: "blue",      
            fillOpacity: 0.2 
       })
       layer.bringToFront()
    };
    
    // reset to default
    const resetHighLight = (e)=>{
        const layer = e.target;
        layer.setStyle({
            color: countryStyle.color,
            weight: countryStyle.weight,
            fillColor: countryStyle.fillColor,
            fillOpacity: countryStyle.fillOpacity
    });
    }
    
    //Popup to be displayed
    const displayInformation =  async(country_code)=>{
        try{
            const res = await fetch(`https://restcountries.com/v3.1/alpha/${country_code}`);
            const data = await res.json();
            const country = data[0];
            const info = `
                <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="50" /><br/>
                <strong>${country.name.common}</strong><br />
                Capital: ${country.capital?.[0] || "N/A"}<br />             
                Population: ${country.population.toLocaleString()}<br />
                Region: ${country.region}<br />
                Area: ${country.area.toLocaleString()} km²
                `; // Country Info
            return info;
            
        }
        catch(error){
            console.error('An error ocurred', error);
            return 'Information not available';
        }

    }

    // Getting and setting the geodata
    const [geoData, setGeoData] = useState(null);
    const fetchCountries = async () => {
        try {
           const res = await fetch("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson");
           const data = await res.json();
           setGeoData(data);
        }
        catch (err) {
           console.error('Failed to fetch countries:', err);
        }
    };

   // Call fetch countries function
    useEffect(
        () => {fetchCountries();}, [] 
    );
    
    // Action on each country
    const onEachCountry = (feature, layer) => {
        layer._isHovered = false;
        layer._tooltipTimeout = null;

        layer.on({
            mouseover: (e) => {
                const target = e.target;
                const countryCode = feature.properties["ISO3166-1-Alpha-3"];
                target._isHovered = true;

                highlightStyle(e); // style when country is hovered on

                target._tooltipTimeout = setTimeout(async () => {
                    if (!target._isHovered) return;
                    const info = await displayInformation(countryCode);
                    target.bindTooltip(info, { sticky: true }).openTooltip(); //create a tooltip
                }, 500); // 0.5 second delay
            },

            mouseout: (e) => {
                const target = e.target;
                target._isHovered = false;

                if (target._tooltipTimeout) {
                    clearTimeout(target._tooltipTimeout); 
                    target._tooltipTimeout = null;
                }

                if (!target._tooltipTimeout) {
                    // Remove tooltip
                    target.closeTooltip();
                    target.unbindTooltip();
                }

                resetHighLight(e);// default style
            }
        });
    };


    return (
        <div>
            <div className = 'navbar'>
                <Link to="/">Home</Link>
                <Link to="/trivia">Trivia</Link>
            </div>
        
            <MapContainer 
                center={[0, 20]} 
                zoom={2} //Default zoom
                minZoom={2} // Min Zoom
                scrollWheelZoom={true}
                maxBounds={[[-90, -180], [90, 180]]} //map boundaries
                maxBoundsViscosity={1.0}
                worldCopyJump={false}
                style={{ height: '80vh', width: '80%',position:'absolute', bottom:10, left:90, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                borderRadius: '10px' }} //width and height of map
            >  
            
            <ResizeMap /> 
            
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                noWrap={true} 
            />
            
            {geoData && (
            <GeoJSON
                data={geoData}
                style={countryStyle}
                onEachFeature={onEachCountry}
            />
            )}
    
            </MapContainer>
        </div>
    );
}

export default function Home(){
    return(
        <div>
            <h1 style={{textAlign:'center'}}>World Map</h1>
            <MapComponent/>
        </div>
    )
    
}
