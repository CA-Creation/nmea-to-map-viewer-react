import React from 'react';
import { Navigation } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="py-6">
      <div className="flex items-center justify-center">
        <Navigation className="text-white mr-3 h-8 w-8" />
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-white">
          NMEA to GPS Converter
        </h1>
      </div>
      <p className="text-white/80 text-center mt-2 max-w-2xl mx-auto">
        Convert NMEA codes to GPS coordinates and visualize locations on an interactive map
      </p>
    </header>
  );
};

export default Header;