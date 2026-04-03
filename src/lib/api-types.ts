export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  weatherCode: number;
  isDay: boolean;
  cloudCover: number;
  precipitation: number;
  uvIndex: number;
  visibility: number;
  cityName: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  time: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  humidity: number;
  weatherCode: number;
  windSpeed: number;
  precipitation: number;
  isDay: boolean;
}

export interface DailyForecast {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  weatherCode: number;
  precipitationSum: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherForecast {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  cityName: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CityResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;
  admin1?: string;
  population?: number;
}

export interface CitySearchResult {
  results: CityResult[];
}
