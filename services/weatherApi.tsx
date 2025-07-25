import { ForecastData, Location, WeatherData } from '@/types/weather';

const API_KEY = '4a8fb9b0a2b787d4f4f9492f5a916cd8'; // OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Get current weather by coordinates
export const getCurrentWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

// Get 5-day forecast by coordinates
export const getForecast = async (lat: number, lon: number): Promise<ForecastData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};

// Search locations by query
export const searchLocations = async (query: string): Promise<Location[]> => {
  try {
    const response = await fetch(
      `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search locations');
    }
    
    const data = await response.json();
    
    return data.map((item: any) => ({
      id: `${item.lat}-${item.lon}`,
      name: item.name,
      country: item.country,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    throw error;
  }
};

// Get location by coordinates (reverse geocoding)
export const getLocationByCoords = async (lat: number, lon: number): Promise<Location> => {
  try {
    const response = await fetch(
      `${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to get location');
    }
    
    const data = await response.json();
    
    if (data.length === 0) {
      throw new Error('Location not found');
    }
    
    return {
      id: `${lat}-${lon}`,
      name: data[0].name,
      country: data[0].country,
      lat,
      lon,
      isCurrent: true,
    };
  } catch (error) {
    console.error('Error getting location by coordinates:', error);
    throw error;
  }
};