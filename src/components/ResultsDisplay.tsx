import React, { useState } from 'react';
import { Coordinates } from './NmeaConverter';
import { Clipboard, Check } from 'lucide-react';

interface ResultsDisplayProps {
  coordinates: Coordinates;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ coordinates }) => {
  const [copied, setCopied] = useState<string | null>(null);
  
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };
  
  // Format coordinates to 6 decimal places
  const formatCoordinate = (value: number) => {
    return value.toFixed(6);
  };
  
  // Create a formatted string of lat, lng for easy copying
  const coordinateString = `${formatCoordinate(coordinates.latitude)}, ${formatCoordinate(coordinates.longitude)}`;
  
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-white shadow-lg animate-fadeIn">
      <h2 className="text-xl font-semibold mb-3">Parsed GPS Coordinates</h2>
      
      <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-semibold">
            {formatCoordinate(coordinates.latitude)}, {formatCoordinate(coordinates.longitude)}
          </div>
          <button
            onClick={() => copyToClipboard(coordinateString, 'coordinates')}
            className="p-2 rounded hover:bg-white/10 transition-colors"
            aria-label="Copy coordinates"
          >
            {copied === 'coordinates' ? <Check className="h-5 w-5 text-green-400" /> : <Clipboard className="h-5 w-5 text-white/80" />}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-white/60 text-sm mb-1">Latitude</div>
          <div className="font-medium flex justify-between items-center">
            <span>{formatCoordinate(coordinates.latitude)}</span>
            <button
              onClick={() => copyToClipboard(formatCoordinate(coordinates.latitude), 'latitude')}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              aria-label="Copy latitude"
            >
              {copied === 'latitude' ? <Check className="h-4 w-4 text-green-400" /> : <Clipboard className="h-4 w-4 text-white/80" />}
            </button>
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-white/60 text-sm mb-1">Longitude</div>
          <div className="font-medium flex justify-between items-center">
            <span>{formatCoordinate(coordinates.longitude)}</span>
            <button
              onClick={() => copyToClipboard(formatCoordinate(coordinates.longitude), 'longitude')}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              aria-label="Copy longitude"
            >
              {copied === 'longitude' ? <Check className="h-4 w-4 text-green-400" /> : <Clipboard className="h-4 w-4 text-white/80" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Additional information if available */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {coordinates.timestamp && (
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/60 text-sm mb-1">Time</div>
            <div className="font-medium">{coordinates.timestamp}</div>
          </div>
        )}
        
        {coordinates.altitude !== undefined && (
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/60 text-sm mb-1">Altitude</div>
            <div className="font-medium">{coordinates.altitude} m</div>
          </div>
        )}
        
        {coordinates.speed !== undefined && (
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/60 text-sm mb-1">Speed</div>
            <div className="font-medium">{coordinates.speed} knots</div>
          </div>
        )}
        
        {coordinates.satellites !== undefined && (
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/60 text-sm mb-1">Satellites</div>
            <div className="font-medium">{coordinates.satellites}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;