import { useQuery } from "@tanstack/react-query";
import type { CurrentWeather, WeatherForecast, CitySearchResult } from "./api-types";

interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
  country?: string;
}

async function reverseGeocode(lat: number, lon: number): Promise<{ name: string; country: string }> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=tr`,
      { headers: { "User-Agent": "HavaDurumu/1.0" } }
    );
    if (res.ok) {
      const data = (await res.json()) as { address?: NominatimAddress };
      const city =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.county ||
        data.address?.state ||
        "Bilinmeyen";
      return { name: city, country: data.address?.country || "" };
    }
  } catch { /* fallback */ }
  return { name: "Bilinmeyen", country: "" };
}

interface OpenMeteoCurrentData {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  weather_code: number;
  cloud_cover: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  is_day: number;
  uv_index?: number;
  time: string;
}

export async function fetchCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
  const [weatherRes, locationData] = await Promise.all([
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,is_day,uv_index&timezone=auto`
    ).then((r) => r.json() as Promise<{ current: OpenMeteoCurrentData; timezone?: string }>),
    reverseGeocode(lat, lon),
  ]);

  const c = weatherRes.current;

  let visibility = 10000;
  try {
    const aqData = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi&timezone=auto`
    ).then((r) => r.json() as Promise<{ current?: { european_aqi?: number } }>);
    if (aqData.current?.european_aqi) {
      visibility = Math.max(1000, 20000 - aqData.current.european_aqi * 100);
    }
  } catch { /* default */ }

  return {
    temperature: c.temperature_2m,
    feelsLike: c.apparent_temperature,
    humidity: c.relative_humidity_2m,
    windSpeed: c.wind_speed_10m,
    windDirection: c.wind_direction_10m,
    pressure: c.surface_pressure,
    weatherCode: c.weather_code,
    isDay: c.is_day === 1,
    cloudCover: c.cloud_cover,
    precipitation: c.precipitation,
    uvIndex: c.uv_index ?? 0,
    visibility,
    cityName: locationData.name,
    country: locationData.country,
    latitude: lat,
    longitude: lon,
    timezone: weatherRes.timezone || "auto",
    time: c.time,
  };
}

interface OpenMeteoHourlyData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  weather_code: number[];
  wind_speed_10m: number[];
  precipitation: number[];
  is_day: number[];
}

interface OpenMeteoDailyData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weather_code: number[];
  precipitation_sum: number[];
  wind_speed_10m_max: number[];
  uv_index_max: number[];
  sunrise: string[];
  sunset: string[];
}

export async function fetchWeatherForecast(lat: number, lon: number): Promise<WeatherForecast> {
  const [forecastData, locationData] = await Promise.all([
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation,is_day&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max,uv_index_max,sunrise,sunset&timezone=auto&forecast_days=5`
    ).then((r) => r.json() as Promise<{ hourly: OpenMeteoHourlyData; daily: OpenMeteoDailyData; timezone?: string }>),
    reverseGeocode(lat, lon),
  ]);

  const hourly = forecastData.hourly.time.map((time, i) => ({
    time,
    temperature: forecastData.hourly.temperature_2m[i],
    humidity: forecastData.hourly.relative_humidity_2m[i],
    weatherCode: forecastData.hourly.weather_code[i],
    windSpeed: forecastData.hourly.wind_speed_10m[i],
    precipitation: forecastData.hourly.precipitation[i],
    isDay: forecastData.hourly.is_day[i] === 1,
  }));

  const daily = forecastData.daily.time.map((date, i) => ({
    date,
    temperatureMax: forecastData.daily.temperature_2m_max[i],
    temperatureMin: forecastData.daily.temperature_2m_min[i],
    weatherCode: forecastData.daily.weather_code[i],
    precipitationSum: forecastData.daily.precipitation_sum[i],
    windSpeedMax: forecastData.daily.wind_speed_10m_max[i],
    uvIndexMax: forecastData.daily.uv_index_max[i],
    sunrise: forecastData.daily.sunrise[i],
    sunset: forecastData.daily.sunset[i],
  }));

  return {
    hourly,
    daily,
    cityName: locationData.name,
    country: locationData.country,
    latitude: lat,
    longitude: lon,
    timezone: forecastData.timezone || "auto",
  };
}

interface GeocodingCity {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  population?: number;
}

export async function fetchSearchCities(q: string): Promise<CitySearchResult> {
  if (!q || q.trim().length === 0) return { results: [] };

  const data = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=10&language=tr&format=json`
  ).then((r) => r.json() as Promise<{ results?: GeocodingCity[] }>);

  return {
    results: (data.results || []).map((city) => ({
      id: city.id,
      name: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      country: city.country || "",
      countryCode: city.country_code || "",
      admin1: city.admin1 || "",
      population: city.population || 0,
    })),
  };
}

export function useGetCurrentWeather(
  params: { lat: number; lon: number },
  options?: { query?: { enabled?: boolean; queryKey?: unknown[] } }
) {
  return useQuery({
    queryKey: options?.query?.queryKey || ["currentWeather", params.lat, params.lon],
    queryFn: () => fetchCurrentWeather(params.lat, params.lon),
    enabled: options?.query?.enabled,
  });
}

export function useGetWeatherForecast(
  params: { lat: number; lon: number },
  options?: { query?: { enabled?: boolean; queryKey?: unknown[] } }
) {
  return useQuery({
    queryKey: options?.query?.queryKey || ["weatherForecast", params.lat, params.lon],
    queryFn: () => fetchWeatherForecast(params.lat, params.lon),
    enabled: options?.query?.enabled,
  });
}

export function useSearchCities(
  params: { q: string },
  options?: { query?: { enabled?: boolean; queryKey?: unknown[] } }
) {
  return useQuery({
    queryKey: options?.query?.queryKey || ["searchCities", params.q],
    queryFn: () => fetchSearchCities(params.q),
    enabled: options?.query?.enabled,
  });
}

export function getGetCurrentWeatherQueryKey(params: { lat: number; lon: number }) {
  return ["currentWeather", params.lat, params.lon];
}

export function getGetWeatherForecastQueryKey(params: { lat: number; lon: number }) {
  return ["weatherForecast", params.lat, params.lon];
}

export function getSearchCitiesQueryKey(params: { q: string }) {
  return ["searchCities", params.q];
}
