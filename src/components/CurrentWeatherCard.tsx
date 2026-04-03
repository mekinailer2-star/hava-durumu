import { format } from "date-fns";
import { tr } from "date-fns/locale";
import type { CurrentWeather } from "@/lib/api-types";
import { WeatherIcon } from "./WeatherIcon";
import { getWeatherDescription } from "@/lib/weather";

type CurrentWeatherCardProps = {
  weather: CurrentWeather;
  nightMode: boolean;
};

export function CurrentWeatherCard({ weather, nightMode }: CurrentWeatherCardProps) {
  const formattedDate = format(new Date(weather.time), "d MMMM yyyy, EEEE", { locale: tr });
  const description = getWeatherDescription(weather.weatherCode);

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center animate-in fade-in zoom-in duration-700" data-testid="current-weather-card">
      <div className="mb-1">
        <h2 className={`text-3xl md:text-5xl font-light tracking-tight ${nightMode ? "text-white" : "text-gray-900"}`}>
          {weather.cityName}
        </h2>
        <p className={`text-sm md:text-base mt-1 font-medium tracking-wide ${nightMode ? "text-white/60" : "text-gray-500"}`}>
          {formattedDate}
        </p>
      </div>

      <div className="flex flex-col items-center mt-4">
        <WeatherIcon
          code={weather.weatherCode}
          isDay={weather.isDay}
          className={`w-24 h-24 md:w-32 md:h-32 ${nightMode ? "text-white/90" : "text-gray-700"}`}
        />

        <div className="mt-2 flex items-start justify-center">
          <span className={`text-7xl md:text-8xl font-extralight tracking-tighter ${nightMode ? "text-white" : "text-gray-900"}`}>
            {Math.round(weather.temperature)}
          </span>
          <span className={`text-2xl md:text-3xl font-light mt-3 ${nightMode ? "text-white/70" : "text-gray-500"}`}>°C</span>
        </div>

        <p className={`text-lg md:text-xl mt-2 font-medium tracking-wide ${nightMode ? "text-white/80" : "text-gray-700"}`}>
          {description}
        </p>

        <p className={`text-sm mt-1 font-medium ${nightMode ? "text-white/50" : "text-gray-400"}`}>
          Hissedilen: {Math.round(weather.feelsLike)}°C
        </p>
      </div>
    </div>
  );
}
