import React, { useState, useEffect, useRef } from 'react';
import { parseNMEA } from '../utils/nmeaParser';
import MapDisplay from './MapDisplay';
import NmeaInput from './NmeaInput';
import ResultsDisplay from './ResultsDisplay';
import HistoryPanel from './HistoryPanel';

export interface Coordinates {
  latitude: number;
  longitude: number;
  timestamp?: string;
  altitude?: number;
  speed?: number;
  course?: number;
  satellites?: number;
  original: string;
}

const NmeaConverter: React.FC = () => {
  const [nmeaInput, setNmeaInput] = useState('');
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [history, setHistory] = useState<Coordinates[]>([]);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    if (nmeaInput.trim()) {
      try {
        const parsed = parseNMEA(nmeaInput);
        if (parsed) {
          setCoordinates(parsed);
          setError(null);
          
          // Scroll to results on mobile if coordinates are valid
          if (window.innerWidth <= 1024 && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          setError('Could not parse NMEA data. Please check the format.');
          setCoordinates(null);
        }
      } catch (err) {
        setError('Invalid NMEA format.');
        setCoordinates(null);
      }
    } else {
      setCoordinates(null);
      setError(null);
    }
  }, [nmeaInput]);

  useEffect(() => {
    if (coordinates && 
        coordinates.latitude && 
        coordinates.longitude && 
        // Prevent duplicates
        !history.some(h => h.original === coordinates.original)) {
      setHistory(prev => [coordinates, ...prev].slice(0, 5));
    }
  }, [coordinates]);

  const handleInputChange = (value: string) => {
    setNmeaInput(value);
  };

  const handleHistoryItemClick = (item: Coordinates) => {
    setNmeaInput(item.original);
    setCoordinates(item);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="flex flex-col space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col space-y-6">
          <NmeaInput value={nmeaInput} onChange={handleInputChange} error={error} />
          
          {history.length > 0 && (
            <HistoryPanel 
              history={history} 
              onItemClick={handleHistoryItemClick} 
              onClear={handleClearHistory} 
            />
          )}
        </div>
        
        <div className="flex flex-col space-y-6" ref={resultsRef}>
          {coordinates && (
            <ResultsDisplay coordinates={coordinates} />
          )}
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 shadow-lg h-[400px]">
            <MapDisplay coordinates={coordinates} history={history} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NmeaConverter