/**
 * GPS Location Service
 * Provides GPS coordinates and derives environment/climate context
 * for location-based treatment recommendations
 */

export interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface LocationEnvironment {
  lat: number;
  lon: number;
  state: string;
  region: string;
  zone: string; // Agroclimatic zone
  avgRainfall: 'low' | 'moderate' | 'high'; // Annual rainfall pattern
  humidity: 'arid' | 'semi-arid' | 'sub-humid' | 'humid';
  soilType: string;
  season: string; // Current season based on month
  locationLabel: string;
}

export interface LocationTreatmentAdvice {
  locationSummary: string;
  environmentalRiskFactors: string[];
  localTreatmentModifications: string[];
  localChemicalsAvailable: string[];
  nearestKVK?: string;
  weatherAlert?: string;
  organicAlternatives: string[];
}

interface GeocodedPlace {
  label: string;
  state?: string;
}

// Indian state boundaries (approximate lat/lon center points for zone detection)
const STATE_ZONES: { state: string; minLat: number; maxLat: number; minLon: number; maxLon: number; zone: string; humidity: LocationEnvironment['humidity']; avgRainfall: LocationEnvironment['avgRainfall']; soilType: string; kvk: string }[] = [
  { state: 'Tamil Nadu', minLat: 8.0, maxLat: 13.6, minLon: 76.2, maxLon: 80.4, zone: 'Southern Plateau & Hills', humidity: 'sub-humid', avgRainfall: 'moderate', soilType: 'Red Loamy & Black Cotton', kvk: 'KVK Coimbatore / TNAU Helpline: 1800-425-1551' },
  { state: 'Kerala', minLat: 8.2, maxLat: 12.8, minLon: 74.9, maxLon: 77.4, zone: 'Western Coastal', humidity: 'humid', avgRainfall: 'high', soilType: 'Laterite & Alluvial', kvk: 'KVK Thrissur / Kerala Agri Helpline: 1800-425-3773' },
  { state: 'Karnataka', minLat: 11.5, maxLat: 18.5, minLon: 74.0, maxLon: 78.6, zone: 'Deccan Plateau & Eastern Ghats', humidity: 'semi-arid', avgRainfall: 'moderate', soilType: 'Red Loamy & Black', kvk: 'KVK Bengaluru / UAS Helpline: 080-23330153' },
  { state: 'Andhra Pradesh', minLat: 12.6, maxLat: 19.9, minLon: 76.7, maxLon: 84.8, zone: 'Eastern Coastal Plains', humidity: 'sub-humid', avgRainfall: 'moderate', soilType: 'Alluvial & Red Sandy', kvk: 'KVK Guntur / ANGRAU: 0863-2571272' },
  { state: 'Maharashtra', minLat: 15.6, maxLat: 22.1, minLon: 72.6, maxLon: 80.9, zone: 'Western Plateau & Ghats', humidity: 'semi-arid', avgRainfall: 'moderate', soilType: 'Black Cotton (Vertisol)', kvk: 'KVK Pune / MPKV: 020-25537157' },
  { state: 'Punjab', minLat: 29.5, maxLat: 32.5, minLon: 73.9, maxLon: 76.9, zone: 'Trans-Gangetic Plains', humidity: 'semi-arid', avgRainfall: 'low', soilType: 'Alluvial Indo-Gangetic', kvk: 'KVK Ludhiana / PAU: 1800-180-1551' },
  { state: 'Rajasthan', minLat: 23.0, maxLat: 30.2, minLon: 69.5, maxLon: 78.2, zone: 'Arid Western Plains', humidity: 'arid', avgRainfall: 'low', soilType: 'Sandy Desert & Loamy', kvk: 'KVK Jaipur / MPUAT: 0145-2787453' },
  { state: 'Uttar Pradesh', minLat: 23.8, maxLat: 30.4, minLon: 77.1, maxLon: 84.6, zone: 'Central & Eastern Gangetic Plains', humidity: 'sub-humid', avgRainfall: 'moderate', soilType: 'Alluvial Gangetic', kvk: 'KVK Lucknow / CSAUA&T: 0522-2741252' },
  { state: 'West Bengal', minLat: 21.6, maxLat: 27.2, minLon: 85.8, maxLon: 89.9, zone: 'Eastern Coastal & Delta', humidity: 'humid', avgRainfall: 'high', soilType: 'Alluvial Delta Soils', kvk: 'KVK Kalyani / BCKV: 033-25828415' },
  { state: 'Gujarat', minLat: 20.1, maxLat: 24.7, minLon: 68.2, maxLon: 74.5, zone: 'Western Coast & Saurashtra', humidity: 'semi-arid', avgRainfall: 'low', soilType: 'Medium & Black Cotton', kvk: 'KVK Anand / AAU: 02692-261305' }
];

export const SUPPORTED_LOCATION_STATES = STATE_ZONES.map(zone => zone.state);

// Season detection by month
function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 10) return 'Kharif (Monsoon)';
  if (month >= 11 || month <= 2) return 'Rabi (Winter)';
  return 'Zaid (Summer)';
}

// Get region from GPS
function createRegionEnvironment(zone: typeof STATE_ZONES[number]): Omit<LocationEnvironment, 'lat' | 'lon' | 'season' | 'locationLabel'> {
  return {
    state: zone.state,
    region: `${zone.state} - ${zone.zone}`,
    zone: zone.zone,
    avgRainfall: zone.avgRainfall,
    humidity: zone.humidity,
    soilType: zone.soilType,
    nearestKVK: zone.kvk
  } as any;
}

function detectRegionFromGPS(lat: number, lon: number, stateName?: string): Omit<LocationEnvironment, 'lat' | 'lon' | 'season' | 'locationLabel'> {
  const geocodedZone = STATE_ZONES.find(zone => zone.state.toLowerCase() === stateName?.toLowerCase());
  if (geocodedZone) return createRegionEnvironment(geocodedZone);

  for (const zone of STATE_ZONES) {
    if (lat >= zone.minLat && lat <= zone.maxLat && lon >= zone.minLon && lon <= zone.maxLon) {
      return createRegionEnvironment(zone);
    }
  }
  // Default if no match (center of India)
  return {
    state: 'Central India',
    region: 'Deccan Plateau',
    zone: 'Central Highlands',
    avgRainfall: 'moderate',
    humidity: 'semi-arid',
    soilType: 'Black Cotton & Red Soil',
    nearestKVK: 'Contact nearest Krishi Vigyan Kendra (KVK)'
  } as any;
}

export const locationService = {
  /**
   * Get current GPS coordinates
   */
  getCurrentLocation(): Promise<GPSLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported by your browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp
        }),
        (err) => {
          const messages: Record<number, string> = {
            1: 'Location access denied. Please allow location permission for GPS-based treatment.',
            2: 'Location unavailable. GPS signal not found.',
            3: 'Location request timed out.'
          };
          reject(new Error(messages[err.code] || 'Failed to get GPS location.'));
        },
        { timeout: 10000, enableHighAccuracy: true, maximumAge: 300000 }
      );
    });
  },

  /**
   * Derive full environment context from GPS
   */
  getEnvironmentFromGPS(gps: GPSLocation, stateName?: string): LocationEnvironment {
    const region = detectRegionFromGPS(gps.latitude, gps.longitude, stateName);
    return {
      lat: parseFloat(gps.latitude.toFixed(4)),
      lon: parseFloat(gps.longitude.toFixed(4)),
      season: getCurrentSeason(),
      locationLabel: `${region.state} (${gps.latitude.toFixed(2)}°N, ${gps.longitude.toFixed(2)}°E)`,
      ...region
    };
  },

  /** Build a regional advisory profile when GPS access is unavailable. */
  getEnvironmentForState(stateName: string): LocationEnvironment {
    const zone = STATE_ZONES.find(item => item.state === stateName) || STATE_ZONES[0];
    const lat = (zone.minLat + zone.maxLat) / 2;
    const lon = (zone.minLon + zone.maxLon) / 2;
    const region = createRegionEnvironment(zone);

    return {
      lat: parseFloat(lat.toFixed(4)),
      lon: parseFloat(lon.toFixed(4)),
      season: getCurrentSeason(),
      locationLabel: `${zone.state} (selected region)`,
      ...region
    };
  },

  /**
   * Generate location-specific treatment modifications
   */
  getLocationBasedTreatment(
    disease: string,
    severity: string,
    crop: string,
    env: LocationEnvironment
  ): LocationTreatmentAdvice {
    const riskFactors: string[] = [];
    const modifications: string[] = [];
    const chemicals: string[] = [];
    const organics: string[] = [];
    let weatherAlert: string | undefined;

    // Humidity-based risks
    if (env.humidity === 'humid') {
      riskFactors.push('High regional humidity accelerates fungal spore spread');
      riskFactors.push('Extended leaf wetness period increases infection window');
      modifications.push('Increase spray frequency to every 5 days during monsoon in humid zones');
      modifications.push('Apply fungicides in early morning (6-8 AM) for maximum absorption before humidity peaks');
      weatherAlert = `⚠️ High Humidity Zone (${env.state}): Fungal diseases spread 3x faster. Prophylactic spraying recommended.`;
    } else if (env.humidity === 'arid') {
      riskFactors.push('Arid conditions favor powdery mildew and spider mites over fungal blights');
      modifications.push('Focus on moisture-conserving mulching and drip irrigation to reduce heat stress');
      modifications.push('Spray in late afternoon when temperatures cool below 35°C');
    } else if (env.humidity === 'semi-arid') {
      riskFactors.push('Variable rainfall creates alternating wet-dry cycles promoting early blight');
      modifications.push('Use systemic fungicides with longer residual protection (14-21 days)');
    }

    // Rainfall-based modifications
    if (env.avgRainfall === 'high') {
      modifications.push('Use rain-fast formulations (wettable powders + sticker adjuvant) after monsoon rains');
      modifications.push('Re-apply copper-based fungicide within 24 hours after heavy rainfall exceeding 25mm');
    } else if (env.avgRainfall === 'low') {
      modifications.push('Conserve treatments with targeted spot-spraying rather than blanket application');
      modifications.push('Irrigate by drip to maintain foliar dryness and reduce disease spread');
    }

    // Soil-type adjustments
    if (env.soilType.includes('Black Cotton') || env.soilType.includes('Vertisol')) {
      modifications.push('Black cotton soil retains moisture: ensure furrow drainage to prevent root rot');
      modifications.push('Avoid excess nitrogen on Vertisol — promotes soft lush growth vulnerable to blight');
      organics.push('Vermicompost enriched with Trichoderma to colonize black soil for biocontrol');
    } else if (env.soilType.includes('Sandy')) {
      modifications.push('Sandy soils drain fast — increase irrigation frequency but in smaller doses');
      organics.push('Add 10-15 tons/acre organic matter (FYM) to improve sandy soil water retention');
    } else if (env.soilType.includes('Laterite')) {
      modifications.push('Laterite soil is acidic: test soil pH and lime if below 5.5 for better nutrient uptake');
      organics.push('Green manure (Sunn Hemp / Dhaincha) improves laterite soil biology');
    }

    // Season-based advice
    if (env.season.includes('Kharif')) {
      riskFactors.push(`Kharif (Monsoon) season: peak disease pressure period for ${crop}`);
      modifications.push('Weekly scouting mandatory during Kharif season — diseases double weekly in monsoon');
    } else if (env.season.includes('Rabi')) {
      modifications.push('Rabi season: morning dew sustains powdery mildew — morning fungicide sprays more effective');
    } else {
      modifications.push('Zaid (Summer) season: heat stress weakens plants — apply micronutrient foliar spray (zinc + boron)');
    }

    // Disease + region specific chemicals (commonly available in Indian agri-input shops)
    if (disease.toLowerCase().includes('blight') || disease.toLowerCase().includes('blast')) {
      chemicals.push('Copper Oxychloride 50% WP (2.5g/L) — widely available in all agri-shops');
      chemicals.push('Mancozeb 75% WP (2.5g/L) — preventive broad-spectrum fungicide');
      chemicals.push('Metalaxyl + Mancozeb (2g/L) for systemic action against late blight');
      organics.push('Trichoderma viride (5g/L) — biological antagonist, available at district agri offices');
      organics.push('Neem oil (5ml/L) + liquid soap (0.5ml/L) as preventive foliar spray');
    } else if (disease.toLowerCase().includes('rust')) {
      chemicals.push('Propiconazole 25% EC (1ml/L) — systemic rust control');
      chemicals.push('Azoxystrobin 23% SC (1ml/L)');
    } else if (disease.toLowerCase().includes('bacterial')) {
      chemicals.push('Copper Hydroxide (2g/L) + Streptocycline (0.5g/L)');
      chemicals.push('Bactericidal Copper Sulphate (1g/L)');
      organics.push('Pseudomonas fluorescens (10g/L) biocontrol spray');
    } else {
      chemicals.push('Copper Oxychloride 50% WP (2.5g/L) as broad-spectrum protection');
      organics.push('Trichoderma-enriched vermicompost soil application');
      organics.push('Neem cake (250kg/acre) soil incorporation for root health');
    }

    // Severity-specific urgency
    if (severity === 'Severe') {
      modifications.push('⚠️ SEVERE: Consult local agriculture extension officer immediately for prescription spray plan');
      modifications.push('Register with State Agriculture Dept for emergency crop protection support');
    }

    return {
      locationSummary: `${env.locationLabel} | ${env.zone} | ${env.season} | Soil: ${env.soilType}`,
      environmentalRiskFactors: riskFactors,
      localTreatmentModifications: modifications,
      localChemicalsAvailable: chemicals,
      nearestKVK: (env as any).nearestKVK,
      weatherAlert,
      organicAlternatives: organics
    };
  },

  /**
   * Reverse geocode to get placename from coordinates (uses OpenStreetMap Nominatim — no API key needed)
   */
  async reverseGeocode(lat: number, lon: number): Promise<GeocodedPlace> {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        { headers: { 'Accept-Language': 'en' }, signal: AbortSignal.timeout(8000) }
      );
      if (!res.ok) throw new Error('Geocode failed');
      const data = await res.json();
      const addr = data.address;
      return {
        label: [addr.village || addr.town || addr.city, addr.state_district || addr.district, addr.state]
        .filter(Boolean)
        .join(', '),
        state: addr.state
      };
    } catch {
      return { label: `${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E` };
    }
  }
};
