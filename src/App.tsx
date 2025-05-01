import React from 'react';
import Header from './components/Header';
import NmeaConverter from './components/NmeaConverter';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-cyan-700">
      <div className="container mx-auto px-4 py-8">
        <Header />
        <main className="mt-8">
          <NmeaConverter />
        </main>
        <footer className="mt-12 text-center text-white/80 text-sm">
          <p>© {new Date().getFullYear()} NMEA to GPS Converter. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;