import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useGetCurrentWeather, useGetWeatherForecast, getGetCurrentWeatherQueryKey, getGetWeatherForecastQueryKey } from "@/lib/api";
import { useTheme } from "@/components/ThemeProvider";
import { CitySearch } from "@/components/CitySearch";
import { CurrentWeatherCard } from "@/components/CurrentWeatherCard";
import { ForecastCards } from "@/components/ForecastCards";
import { HourlyChart } from "@/components/HourlyChart";
import { WeatherDetails } from "@/components/WeatherDetails";
import { getWeatherGradient, isNightGradient } from "@/lib/weather";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [location, setLocation] = useState<{ lat: number; lon: number; name?: string } | null>(null);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isLocating, setIsLocating] = useState(true);

  const fallbackToIstanbul = () => {
    setLocation({ lat: 41.0082, lon: 28.9784, name: "İstanbul" });
    setIsLocating(false);
  };

  const locateUser = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      const fallbackTimer = setTimeout(() => {
        fallbackToIstanbul();
        toast({
          title: "Konum alınamadı",
          description: "Varsayılan olarak İstanbul gösteriliyor.",
          variant: "default",
        });
      }, 3000);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(fallbackTimer);
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setIsLocating(false);
        },
        () => {
          clearTimeout(fallbackTimer);
          fallbackToIstanbul();
          toast({
            title: "Konum alınamadı",
            description: "Varsayılan olarak İstanbul gösteriliyor.",
            variant: "default",
          });
        },
        { timeout: 2500, maximumAge: 300000 }
      );
    } else {
      fallbackToIstanbul();
    }
  };

  useEffect(() => {
    locateUser();
  }, []);

  const { data: currentWeather, isLoading: isLoadingCurrent } = useGetCurrentWeather(
    { lat: location?.lat || 0, lon: location?.lon || 0 },
    {
      query: {
        enabled: !!location,
        queryKey: getGetCurrentWeatherQueryKey({ lat: location?.lat || 0, lon: location?.lon || 0 }),
      },
    }
  );

  const { data: forecast, isLoading: isLoadingForecast } = useGetWeatherForecast(
    { lat: location?.lat || 0, lon: location?.lon || 0 },
    {
      query: {
        enabled: !!location,
        queryKey: getGetWeatherForecastQueryKey({ lat: location?.lat || 0, lon: location?.lon || 0 }),
      },
    }
  );

  const handleSelectCity = (lat: number, lon: number, name: string) => {
    setLocation({ lat, lon, name });
  };

  const gradient = currentWeather
    ? getWeatherGradient(currentWeather.weatherCode, currentWeather.isDay)
    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

  const nightMode = currentWeather ? isNightGradient(currentWeather.isDay) : false;

  if (isLocating || (!currentWeather && isLoadingCurrent)) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background text-foreground transition-colors duration-1000">
        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
        <p className="mt-4 text-muted-foreground animate-pulse">Hava durumu yükleniyor...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-[100dvh] transition-all duration-1000 relative overflow-x-hidden"
      style={{ background: gradient }}
    >
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 md:py-8 flex flex-col gap-6">
        <header className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <CitySearch onSelectCity={handleSelectCity} onLocateMe={locateUser} />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`rounded-xl backdrop-blur-md border h-11 w-11 shrink-0 ${nightMode ? "bg-white/10 border-white/20 text-white hover:bg-white/20" : "bg-black/5 border-black/10 text-gray-800 hover:bg-black/10"}`}
            data-testid="button-theme-toggle"
            title={theme === "dark" ? "Açık Tema" : "Koyu Tema"}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </header>

        {currentWeather && (
          <main className={`flex flex-col gap-6 pb-8 ${nightMode ? "text-white" : "text-gray-900"}`}>
            <CurrentWeatherCard weather={currentWeather} nightMode={nightMode} />

            {forecast && (
              <>
                <HourlyChart data={forecast.hourly} nightMode={nightMode} />
                <ForecastCards forecast={forecast.daily} nightMode={nightMode} />
                <WeatherDetails weather={currentWeather} nightMode={nightMode} />
              </>
            )}
          </main>
        )}
      </div>
    </div>
  );
}
