import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

interface NmeaInputProps {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
}

const NmeaInput: React.FC<NmeaInputProps> = ({ value, onChange, error }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-white shadow-lg transition-all duration-300">
      <h2 className="text-xl font-semibold mb-4">NMEA Code Input</h2>
      
      <div className={`relative rounded-lg overflow-hidden border ${error ? 'border-red-400' : isFocused ? 'border-cyan-300' : 'border-white/30'}`}>
        <textarea
          className="w-full bg-white/5 p-4 text-white placeholder-white/50 font-mono text-sm resize-none focus:outline-none h-32"
          placeholder="Enter NMEA code (e.g., $GPGGA,181908.00,3404.7041778,N,07044.3966270,W,4,13,1.00,495.144,M,29.200,M,0.10,0000*40)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {value && (
          <button 
            className="absolute right-2 top-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            onClick={() => onChange('')}
            aria-label="Clear input"
          >
            <RotateCcw className="w-4 h-4 text-white/70" />
          </button>
        )}
      </div>
      
      {error && (
        <div className="mt-2 text-red-300 text-sm flex items-center">
          <span className="flex-shrink-0 w-4 h-4 rounded-full bg-red-400/30 flex items-center justify-center mr-2">!</span>
          <span>{error}</span>
        </div>
      )}
      
      <div className="mt-4 flex justify-end">
        <button 
          className={`px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium shadow-md hover:shadow-lg transition-all ${!value ? 'opacity-50 cursor-not-allowed' : 'hover:translate-y-[-2px]'}`}
          disabled={!value}
        >
          Parse NMEA
        </button>
      </div>
    </div>
  );
};

export default NmeaInput;