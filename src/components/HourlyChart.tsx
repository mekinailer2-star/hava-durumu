import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import type { HourlyForecast } from "@/lib/api-types";

type HourlyChartProps = {
  data: HourlyForecast[];
  nightMode: boolean;
};

export function HourlyChart({ data, nightMode }: HourlyChartProps) {
  if (!data || data.length === 0) return null;

  const chartData = data.slice(0, 24).map(hour => ({
    time: format(new Date(hour.time), "HH:mm"),
    temp: Math.round(hour.temperature),
  }));

  const strokeColor = nightMode ? "#93c5fd" : "#3b82f6";
  const tickColor = nightMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)";
  const cardBg = nightMode
    ? "bg-white/10 border-white/10"
    : "bg-white/50 border-white/30";

  return (
    <div
      className={`w-full backdrop-blur-md border rounded-3xl p-4 md:p-6 animate-in fade-in slide-in-from-bottom-8 duration-700 ${cardBg}`}
      data-testid="hourly-chart"
    >
      <h3 className={`text-lg font-semibold mb-4 ${nightMode ? "text-white/90" : "text-gray-800"}`}>
        Saatlik Sicaklik
      </h3>
      <div className="h-[180px] md:h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: tickColor }}
              dy={8}
              interval="preserveStartEnd"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: tickColor }}
              tickFormatter={(val) => `${val}°`}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: nightMode ? "rgba(30,30,60,0.9)" : "rgba(255,255,255,0.95)",
                border: nightMode ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.1)",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                color: nightMode ? "#fff" : "#333",
              }}
              formatter={(value: number) => [`${value}°C`, "Sicaklik"]}
              labelFormatter={(label) => `Saat: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke={strokeColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#tempGradient)"
              activeDot={{ r: 5, strokeWidth: 0, fill: strokeColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
