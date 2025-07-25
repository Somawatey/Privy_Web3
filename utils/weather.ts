import { TemperatureUnit } from '@/types/weather';

// Convert temperature based on selected unit
export const formatTemperature = (temp: number, unit: TemperatureUnit): string => {
  if (unit === 'fahrenheit') {
    return `${Math.round((temp * 9) / 5 + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
};

// Get appropriate weather icon based on condition code
export const getWeatherIcon = (conditionCode: number, isNight: boolean = false): string => {
  // Weather condition codes: https://openweathermap.org/weather-conditions
  
  // Thunderstorm
  if (conditionCode >= 200 && conditionCode < 300) {
    return 'CloudLightning';
  }
  
  // Drizzle
  if (conditionCode >= 300 && conditionCode < 400) {
    return 'CloudDrizzle';
  }
  
  // Rain
  if (conditionCode >= 500 && conditionCode < 600) {
    return conditionCode >= 511 ? 'CloudHail' : 'CloudRain';
  }
  
  // Snow
  if (conditionCode >= 600 && conditionCode < 700) {
    return 'CloudSnow';
  }
  
  // Atmosphere (fog, mist, etc.)
  if (conditionCode >= 700 && conditionCode < 800) {
    return 'CloudFog';
  }
  
  // Clear
  if (conditionCode === 800) {
    return isNight ? 'Moon' : 'Sun';
  }
  
  // Clouds
  if (conditionCode > 800 && conditionCode < 900) {
    if (conditionCode === 801) {
      return isNight ? 'CloudMoon' : 'CloudSun';
    }
    return 'Cloud';
  }
  
  return 'Cloud'; // Default
};

// Format date for display
export const formatDate = (timestamp: number, timezone: number = 0): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

// Format time for display
export const formatTime = (timestamp: number, timezone: number = 0): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Check if it's night time based on sunrise/sunset
export const isNightTime = (
  currentTime: number,
  sunrise: number,
  sunset: number,
  timezone: number = 0
): boolean => {
  const time = (currentTime + timezone) * 1000;
  const sunriseTime = (sunrise + timezone) * 1000;
  const sunsetTime = (sunset + timezone) * 1000;
  
  return time < sunriseTime || time > sunsetTime;
};

// Format wind direction
export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

// Format wind speed with units
export const formatWindSpeed = (speed: number): string => {
  return `${Math.round(speed * 3.6)} km/h`; // Convert m/s to km/h
};

// Group forecast by day
export const groupForecastByDay = (forecastList: any[]): any[] => {
  const grouped: any = {};
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    
    if (!grouped[date]) {
      grouped[date] = [];
    }
    
    grouped[date].push(item);
  });
  
  return Object.values(grouped).map((dayForecasts: any) => {
    // For each day, find the mid-day forecast (around noon)
    const midDayForecast = dayForecasts.find((f: any) => {
      const hour = new Date(f.dt * 1000).getHours();
      return hour >= 11 && hour <= 13;
    }) || dayForecasts[0];
    
    return midDayForecast;
  }).slice(0, 5); // Return 5-day forecast
};