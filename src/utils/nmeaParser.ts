import { Coordinates } from '../components/NmeaConverter';


export function parseNMEA(nmea: string): Coordinates | null {

  const nmeaString = nmea.trim();
  if (!nmeaString || !nmeaString.startsWith('$')) {
    return null;
  }
  

  const sentenceType = nmeaString.substring(1, 6);

  if (sentenceType === 'GPGGA') {
    return parseGPGGA(nmeaString);
  } else if (sentenceType === 'GPRMC') {
    return parseGPRMC(nmeaString);
  }
  

  return parseGenericNMEA(nmeaString);
}


function parseGPGGA(nmea: string): Coordinates | null {

  const parts = nmea.split(',');
  if (parts.length < 10) return null;
  
  try {
    const time = parts[1];
    const latDegMin = parseFloat(parts[2]);
    const latDir = parts[3];
    const lngDegMin = parseFloat(parts[4]);
    const lngDir = parts[5];
    const quality = parseInt(parts[6]);
    const satellites = parseInt(parts[7]);
    const altitude = parseFloat(parts[9]);
    
    // Ensure we have valid latitude and longitude
    if (isNaN(latDegMin) || isNaN(lngDegMin)) {
      return null;
    }
    
    // Convert from DDMM.MMMM to decimal degrees
    const latDeg = Math.floor(latDegMin / 100);
    const latMin = latDegMin - (latDeg * 100);
    const latitude = latDeg + (latMin / 60);
    
    const lngDeg = Math.floor(lngDegMin / 100);
    const lngMin = lngDegMin - (lngDeg * 100);
    const longitude = lngDeg + (lngMin / 60);
    
    // Apply direction
    const finalLat = latDir === 'S' ? -latitude : latitude;
    const finalLng = lngDir === 'W' ? -longitude : longitude;
    
    // Format time from HHMMSS.SS to HH:MM:SS
    let formattedTime = '';
    if (time && time.length >= 6) {
      const hours = time.substring(0, 2);
      const minutes = time.substring(2, 4);
      const seconds = time.substring(4, 6);
      formattedTime = `${hours}:${minutes}:${seconds}`;
    }
    
    return {
      latitude: finalLat,
      longitude: finalLng,
      timestamp: formattedTime,
      altitude: altitude,
      satellites: satellites,
      original: nmea
    };
  } catch (error) {
    console.error('Error parsing GPGGA:', error);
    return null;
  }
}


function parseGPRMC(nmea: string): Coordinates | null {
  // $GPRMC,123519,A,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W*6A
  const parts = nmea.split(',');
  if (parts.length < 10) return null;
  
  try {
    const time = parts[1];
    const status = parts[2]; // A=active, V=void
    const latDegMin = parseFloat(parts[3]);
    const latDir = parts[4];
    const lngDegMin = parseFloat(parts[5]);
    const lngDir = parts[6];
    const speed = parseFloat(parts[7]);
    const course = parseFloat(parts[8]);
    const date = parts[9];
    
    // Check if we have valid data (status is 'A' for active)
    if (status !== 'A' || isNaN(latDegMin) || isNaN(lngDegMin)) {
      return null;
    }
    
    // Convert from DDMM.MMMM to decimal degrees
    const latDeg = Math.floor(latDegMin / 100);
    const latMin = latDegMin - (latDeg * 100);
    const latitude = latDeg + (latMin / 60);
    
    const lngDeg = Math.floor(lngDegMin / 100);
    const lngMin = lngDegMin - (lngDeg * 100);
    const longitude = lngDeg + (lngMin / 60);
    
    // Apply direction
    const finalLat = latDir === 'S' ? -latitude : latitude;
    const finalLng = lngDir === 'W' ? -longitude : longitude;
    
    // Format time and date
    let formattedTime = '';
    if (time && time.length >= 6) {
      const hours = time.substring(0, 2);
      const minutes = time.substring(2, 4);
      const seconds = time.substring(4, 6);
      formattedTime = `${hours}:${minutes}:${seconds}`;
    }
    
    return {
      latitude: finalLat,
      longitude: finalLng,
      timestamp: formattedTime,
      speed: speed,
      course: course,
      original: nmea
    };
  } catch (error) {
    console.error('Error parsing GPRMC:', error);
    return null;
  }
}


function parseGenericNMEA(nmea: string): Coordinates | null {
  const parts = nmea.split(',');
  if (parts.length < 6) return null;
  
  // Try to find latitude and longitude in common positions
  let foundLat = false;
  let foundLng = false;
  let latitude = 0;
  let longitude = 0;
  
  // Look for patterns like X.XXX,N and X.XXX,E/W
  for (let i = 0; i < parts.length - 1; i++) {
    const current = parts[i];
    const next = parts[i + 1];
    
    // Check if this could be a latitude (followed by N/S)
    if (!foundLat && !isNaN(parseFloat(current)) && (next === 'N' || next === 'S')) {
      foundLat = true;
      
      const latVal = parseFloat(current);
      // Check if it's in DDMM.MMMM format
      if (latVal > 90) {
        const latDeg = Math.floor(latVal / 100);
        const latMin = latVal - (latDeg * 100);
        latitude = latDeg + (latMin / 60);
      } else {
        latitude = latVal;
      }
      
      if (next === 'S') latitude = -latitude;
    }
    
    // Check if this could be a longitude (followed by E/W)
    if (!foundLng && !isNaN(parseFloat(current)) && (next === 'E' || next === 'W')) {
      foundLng = true;
      
      const lngVal = parseFloat(current);
      // Check if it's in DDDMM.MMMM format
      if (lngVal > 180) {
        const lngDeg = Math.floor(lngVal / 100);
        const lngMin = lngVal - (lngDeg * 100);
        longitude = lngDeg + (lngMin / 60);
      } else {
        longitude = lngVal;
      }
      
      if (next === 'W') longitude = -longitude;
    }
  }
  
  if (foundLat && foundLng) {
    return {
      latitude,
      longitude,
      original: nmea
    };
  }
  
  return null;
}