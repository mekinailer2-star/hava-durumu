import { Droplets, Wind, Gauge, Sun as SunIcon, Eye, CloudRain } from "lucide-react";
import type { CurrentWeather } from "@/lib/api-types";
import { getWindDirection } from "@/lib/weather";

type WeatherDetailsProps = {
  weather: CurrentWeather;
  nightMode: boolean;
};

export function WeatherDetails({ weather, nightMode }: WeatherDetailsProps) {
  const cardBg = nightMode
    ? "bg-white/10 border-white/10 hover:bg-white/15"
    : "bg-white/50 border-white/30 hover:bg-white/70";

  const details = [
    {
      label: "Nem",
      value: `%${Math.round(weather.humidity)}`,
      icon: <Droplets className="w-5 h-5" />,
    },
    {
      label: "Ruzgar",
      value: `${Math.round(weather.windSpeed)} km/s ${getWindDirection(weather.windDirection)}`,
      icon: <Wind className="w-5 h-5" />,
    },
    {
      label: "Basinc",
      value: `${Math.round(weather.pressure)} hPa`,
      icon: <Gauge className="w-5 h-5" />,
    },
    {
      label: "UV Indeksi",
      value: `${Math.round(weather.uvIndex)}`,
      icon: <SunIcon className="w-5 h-5" />,
    },
    {
      label: "Gorus Mesafesi",
      value: `${(weather.visibility / 1000).toFixed(1)} km`,
      icon: <Eye className="w-5 h-5" />,
    },
    {
      label: "Yagis",
      value: `${weather.precipitation} mm`,
      icon: <CloudRain className="w-5 h-5" />,
    },
  ];

  return (
    <div className="w-full" data-testid="weather-details">
      <h3 className={`text-lg font-semibold mb-3 ${nightMode ? "text-white/90" : "text-gray-800"}`}>
        Detaylar
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
        {details.map((detail, index) => (
          <div
            key={detail.label}
            className={`backdrop-blur-md border rounded-2xl p-3 md:p-4 flex items-center gap-3 transition-all ${cardBg} animate-in fade-in slide-in-from-bottom-4`}
            style={{ animationDelay: `${(index + 5) * 80}ms`, animationFillMode: "both" }}
            data-testid={`detail-${detail.label.toLowerCase().replace(/\s/g, '-')}`}
          >
            <div className={`${nightMode ? "text-white/50" : "text-gray-400"}`}>
              {detail.icon}
            </div>
            <div>
              <div className={`text-xs font-medium mb-0.5 ${nightMode ? "text-white/50" : "text-gray-400"}`}>
                {detail.label}
              </div>
              <div className={`text-base font-bold ${nightMode ? "text-white" : "text-gray-900"}`}>
                {detail.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
