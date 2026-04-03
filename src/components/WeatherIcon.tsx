import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Snowflake,
} from "lucide-react";

type WeatherIconProps = {
  code: number;
  isDay?: boolean;
  className?: string;
};

export function WeatherIcon({ code, isDay = true, className = "w-6 h-6" }: WeatherIconProps) {
  if (code === 0) {
    return isDay ? <Sun className={className} /> : <Moon className={className} />;
  }
  if (code >= 1 && code <= 3) {
    if (code === 3) return <Cloud className={className} />;
    return isDay ? <CloudSun className={className} /> : <CloudMoon className={className} />;
  }
  if (code === 45 || code === 48) {
    return <CloudFog className={className} />;
  }
  if (code >= 51 && code <= 57) {
    return <CloudDrizzle className={className} />;
  }
  if (code >= 61 && code <= 67) {
    return <CloudRain className={className} />;
  }
  if ((code >= 71 && code <= 75) || (code >= 85 && code <= 86)) {
    return <CloudSnow className={className} />;
  }
  if (code === 77) {
    return <Snowflake className={className} />;
  }
  if (code >= 80 && code <= 82) {
    return <CloudRain className={className} />;
  }
  if (code >= 95 && code <= 99) {
    return <CloudLightning className={className} />;
  }
  
  return <Cloud className={className} />;
}
