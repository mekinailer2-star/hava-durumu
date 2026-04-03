import { format } from "date-fns";
import { tr } from "date-fns/locale";
import type { DailyForecast } from "@/lib/api-types";
import { WeatherIcon } from "./WeatherIcon";
import { getWeatherDescription } from "@/lib/weather";

type ForecastCardsProps = {
  forecast: DailyForecast[];
  nightMode: boolean;
};

export function ForecastCards({ forecast, nightMode }: ForecastCardsProps) {
  if (!forecast || forecast.length === 0) return null;

  const cardBg = nightMode
    ? "bg-white/10 border-white/10 hover:bg-white/15"
    : "bg-white/50 border-white/30 hover:bg-white/70";

  return (
    <div className="w-full" data-testid="forecast-cards">
      <h3 className={`text-lg font-semibold mb-3 ${nightMode ? "text-white/90" : "text-gray-800"}`}>
        5 Gunluk Tahmin
      </h3>
      <div className="grid grid-cols-5 gap-2 md:gap-3">
        {forecast.slice(0, 5).map((day, index) => {
          const date = new Date(day.date);
          const isToday = index === 0;

          return (
            <div
              key={day.date}
              className={`backdrop-blur-md border rounded-2xl p-3 md:p-4 flex flex-col items-center justify-between transition-all ${cardBg} animate-in fade-in slide-in-from-bottom-4`}
              style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
              data-testid={`forecast-card-${index}`}
            >
              <span className={`text-xs md:text-sm font-semibold mb-1 ${nightMode ? "text-white/80" : "text-gray-700"}`}>
                {isToday ? "Bugun" : format(date, "EEE", { locale: tr })}
              </span>

              <WeatherIcon
                code={day.weatherCode}
                isDay={true}
                className={`w-8 h-8 md:w-10 md:h-10 my-1 ${nightMode ? "text-white/80" : "text-gray-600"}`}
              />

              <div className="flex flex-col items-center mt-1">
                <span className={`text-sm md:text-lg font-bold ${nightMode ? "text-white" : "text-gray-900"}`}>
                  {Math.round(day.temperatureMax)}°
                </span>
                <span className={`text-xs md:text-sm ${nightMode ? "text-white/50" : "text-gray-400"}`}>
                  {Math.round(day.temperatureMin)}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
