import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Coordinates } from './NmeaConverter';
import L from 'leaflet';


import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';


let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapDisplayProps {
  coordinates: Coordinates | null;
  history: Coordinates[];
}

// Component to handle map view updates
const MapUpdater: React.FC<{ coordinates: Coordinates | null }> = ({ coordinates }) => {
  const map = useMap();
  
  useEffect(() => {
    if (coordinates && coordinates.latitude && coordinates.longitude) {
      map.setView([coordinates.latitude, coordinates.longitude], 13);
    }
  }, [coordinates, map]);
  
  return null;
};

const MapDisplay: React.FC<MapDisplayProps> = ({ coordinates, history }) => {
  // Default location
  const defaultPosition: [number, number] = [39.8283, -98.5795];
  const [position, setPosition] = useState<[number, number]>(defaultPosition);
  
  useEffect(() => {
    if (coordinates && coordinates.latitude && coordinates.longitude) {
      setPosition([coordinates.latitude, coordinates.longitude]);
    }
  }, [coordinates]);

  return (
    <MapContainer 
      center={position} 
      zoom={5} 
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Display current coordinates */}
      {coordinates && coordinates.latitude && coordinates.longitude && (
        <>
          <Marker position={[coordinates.latitude, coordinates.longitude]}>
            <Popup>
              <div className="text-center">
                <div className="font-bold mb-1">Current Location</div>
                <div>{coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}</div>
                {coordinates.timestamp && (
                  <div className="text-xs mt-1">Time: {coordinates.timestamp}</div>
                )}
              </div>
            </Popup>
          </Marker>
          <Circle 
            center={[coordinates.latitude, coordinates.longitude]}
            radius={500}
            pathOptions={{ color: 'rgba(66, 153, 225, 0.6)', fillColor: 'rgba(66, 153, 225, 0.2)' }}
          />
        </>
      )}
      
      {/* Display history markers */}
      {history.slice(1).map((item, index) => (
        <Marker 
          key={index}
          position={[item.latitude, item.longitude]}
          icon={L.divIcon({
            className: 'history-marker',
            html: `<div class="w-3 h-3 rounded-full bg-white/40 border border-cyan-400"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
          })}
        >
          <Popup>
            <div className="text-center">
              <div className="font-bold mb-1">Previous Location</div>
              <div>{item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}</div>
            </div>
          </Popup>
        </Marker>
      ))}
      
      {/* Update map view when coordinates change */}
      <MapUpdater coordinates={coordinates} />
    </MapContainer>
  );
};

export default MapDisplay;