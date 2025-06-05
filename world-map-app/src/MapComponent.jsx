import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup,GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapComponent() {
    const countryStyle = {
        color: "black",        // Border color (red)
        weight: 2,            // Border thickness
        fillColor: "grey", // Light grey fill color
        fillOpacity: 0.5      // Semi-transparent fill
    };
    const highlightStyle = (e)=> {
       const layer = e.target
       layer.setStyle({
            weight: 4,          
            color: "blue",      
            fillOpacity: 0.2 
       })
       layer.bringToFront()
    };
    const resetHighLight = (e)=>{
        const layer = e.target;
        layer.setStyle({
      color: countryStyle.color,
      weight: countryStyle.weight,
      fillColor: countryStyle.fillColor,
      fillOpacity: countryStyle.fillOpacity
    });
    }

    const[geoData, setGeoData] = useState(null);
    useEffect(()=>{
        fetch("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson") //getting Geo Data for all countries
        .then((res) => res.json())
        .then((data) => setGeoData(data));
        },[])
    const onEachCountry = (feature, layer) =>{
        layer.on({
        mouseover: highlightStyle,
        mouseout: resetHighLight,
    });
    }
    return (
        <MapContainer 
            center={[51.505, -0.09]} 
            zoom={2.5} //Default zoom
            minZoom={2.5} // Min Zoom
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
