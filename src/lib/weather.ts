export const getWeatherDescription = (code: number): string => {
  if (code === 0) return "Açık";
  if (code >= 1 && code <= 3) return "Parçalı Bulutlu";
  if (code === 45 || code === 48) return "Sisli";
  if (code >= 51 && code <= 55) return "Çisenti";
  if (code === 56 || code === 57) return "Dondurucu Çisenti";
  if (code >= 61 && code <= 65) return "Yağmurlu";
  if (code === 66 || code === 67) return "Dondurucu Yağmur";
  if (code >= 71 && code <= 75) return "Karlı";
  if (code === 77) return "Kar Taneleri";
  if (code >= 80 && code <= 82) return "Sağanak Yağışlı";
  if (code >= 85 && code <= 86) return "Kar Sağanağı";
  if (code === 95) return "Gök Gürültülü Fırtına";
  if (code === 96 || code === 99) return "Dolu ile Fırtına";
  return "Bilinmiyor";
};

export const getWeatherGradient = (code: number, isDay: boolean): string => {
  if (!isDay) {
    if (code >= 61 && code <= 67) return "linear-gradient(135deg, #0c1445 0%, #1a1a2e 50%, #16213e 100%)";
    if (code >= 71 && code <= 77) return "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)";
    if (code >= 95) return "linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0c1445 100%)";
    if (code === 0) return "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)";
    return "linear-gradient(135deg, #141e30 0%, #243b55 50%, #141e30 100%)";
  }
  if (code === 0) return "linear-gradient(135deg, #f093fb 0%, #f5576c 20%, #ffd89b 40%, #4facfe 70%, #00f2fe 100%)";
  if (code >= 1 && code <= 3) return "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 50%, #a1c4fd 100%)";
  if (code >= 45 && code <= 48) return "linear-gradient(135deg, #d7d2cc 0%, #b8c6db 50%, #cfd9df 100%)";
  if (code >= 51 && code <= 67) return "linear-gradient(135deg, #616161 0%, #9bc5c3 50%, #bdc3c7 100%)";
  if (code >= 71 && code <= 77) return "linear-gradient(135deg, #e6e9f0 0%, #eef1f5 50%, #d4dfe6 100%)";
  if (code >= 80 && code <= 82) return "linear-gradient(135deg, #616161 0%, #808080 50%, #9e9e9e 100%)";
  if (code >= 95) return "linear-gradient(135deg, #373b44 0%, #4286f4 50%, #373b44 100%)";
  return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
};

export const isNightGradient = (isDay: boolean): boolean => !isDay;

export const getWindDirection = (degrees: number): string => {
  const directions = ["K", "KKD", "KD", "DKD", "D", "DGD", "GD", "GGD", "G", "GGB", "GB", "BGB", "B", "BKB", "KB", "KKB"];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};
