import * as weatherApi from '@/services/weatherApi';
import { ForecastData, Location, TemperatureUnit, WeatherData } from '@/types/weather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface WeatherState {
  currentWeather: WeatherData | null;
  forecast: ForecastData | null;
  currentLocation: Location | null;
  savedLocations: Location[];
  isLoading: boolean;
  error: string | null;
  temperatureUnit: TemperatureUnit;
  
  // Actions
  fetchCurrentLocationWeather: (lat: number, lon: number) => Promise<void>;
  fetchWeatherForLocation: (location: Location) => Promise<void>;
  addSavedLocation: (location: Location) => void;
  removeSavedLocation: (locationId: string) => void;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  clearError: () => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      currentWeather: null,
      forecast: null,
      currentLocation: null,
      savedLocations: [],
      isLoading: false,
      error: null,
      temperatureUnit: 'celsius',
      
      fetchCurrentLocationWeather: async (lat: number, lon: number) => {
        try {
          set({ isLoading: true, error: null });
          
          // Get location name from coordinates
          const location = await weatherApi.getLocationByCoords(lat, lon);
          
          // Fetch current weather and forecast
          const [weatherData, forecastData] = await Promise.all([
            weatherApi.getCurrentWeather(lat, lon),
            weatherApi.getForecast(lat, lon),
          ]);
          
          set({
            currentWeather: weatherData,
            forecast: forecastData,
            currentLocation: location,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch weather data',
          });
        }
      },
      
      fetchWeatherForLocation: async (location: Location) => {
        try {
          set({ isLoading: true, error: null });
          
          // Fetch current weather and forecast
          const [weatherData, forecastData] = await Promise.all([
            weatherApi.getCurrentWeather(location.lat, location.lon),
            weatherApi.getForecast(location.lat, location.lon),
          ]);
          
          set({
            currentWeather: weatherData,
            forecast: forecastData,
            currentLocation: location,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch weather data',
          });
        }
      },
      
      addSavedLocation: (location: Location) => {
        const { savedLocations } = get();
        
        // Check if location already exists
        if (!savedLocations.some(loc => loc.id === location.id)) {
          set({ savedLocations: [...savedLocations, location] });
        }
      },
      
      removeSavedLocation: (locationId: string) => {
        const { savedLocations } = get();
        set({
          savedLocations: savedLocations.filter(loc => loc.id !== locationId),
        });
      },
      
      setTemperatureUnit: (unit: TemperatureUnit) => {
        set({ temperatureUnit: unit });
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'weather-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        savedLocations: state.savedLocations,
        temperatureUnit: state.temperatureUnit,
      }),
    }
  )
);