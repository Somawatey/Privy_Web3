export interface WeatherCondition {
    id: number;
    main: string;
    description: string;
    icon: string;
  }
  
  export interface CurrentWeather {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  }
  
  export interface Wind {
    speed: number;
    deg: number;
    gust?: number;
  }
  
  export interface WeatherData {
    weather: WeatherCondition[];
    main: CurrentWeather;
    visibility: number;
    wind: Wind;
    clouds: {
      all: number;
    };
    dt: number;
    sys: {
      country: string;
      sunrise: number;
      sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
  }
  
  export interface ForecastItem {
    dt: number;
    main: CurrentWeather;
    weather: WeatherCondition[];
    wind: Wind;
    dt_txt: string;
  }
  
  export interface ForecastData {
    list: ForecastItem[];
    city: {
      id: number;
      name: string;
      country: string;
      sunrise: number;
      sunset: number;
    };
  }
  
  export interface Location {
    id: string;
    name: string;
    country: string;
    lat: number;
    lon: number;
    isCurrent?: boolean;
  }
  
  export type TemperatureUnit = 'celsius' | 'fahrenheit';