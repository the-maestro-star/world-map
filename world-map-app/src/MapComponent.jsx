import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup,GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapComponent() {
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
                <strong>${country.name.common}</strong><br />
                Capital: ${country.capital?.[0] || "N/A"}<br />
                Population: ${country.population.toLocaleString()}<br />
                Region: ${country.region}<br />
                Area: ${country.area.toLocaleString()} km²
                `; // Country Info
            return info
            
        }
        catch(error){
            console.error('An error ocurred', error);
            return 'Information not available';
        }

    }

    // Getting and setting the geodata
    const[geoData, setGeoData] = useState(null);
    useEffect(()=>{
        fetch("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson") //getting Geo Data for all countries
        .then((res) => res.json())
        .then((data) => setGeoData(data));
        },[])
    
    const onEachCountry = (feature, layer) => {
        layer._isHovered = false;
        layer._tooltipTimeout = null;

        layer.on({
            mouseover: (e) => {
                const target = e.target;
                const countryCode = feature.properties["ISO3166-1-Alpha-3"];
                target._isHovered = true;

                highlightStyle(e);

                if (target._tooltipTimeout) clearTimeout(target._tooltipTimeout);

                target._tooltipTimeout = setTimeout(async () => {
                    if (!target._isHovered) return;
                    const info = await displayInformation(countryCode);
                    target.bindTooltip(info, { sticky: true }).openTooltip();
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
                    target.closeTooltip();
                    target.unbindTooltip();
                }

                resetHighLight(e);
            }
        });
    };


    return (
        <MapContainer 
            center={[51.505, -0.09]} 
            zoom={2.5} //Default zoom
            minZoom={2} // Min Zoom
            scrollWheelZoom={false} 
            style={{ height: '100vh', width: '250%' }}  //width and height of map
            maxBounds={[[-90, -180], [90, 180]]}  // boundaries
            maxBoundsViscosity={1.0} //stiffness of map
        >  
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
         {geoData && (
        <GeoJSON
          data={geoData}
          style={countryStyle}
          onEachFeature={onEachCountry}
          
        />
      )}

      </MapContainer>
  );
}
