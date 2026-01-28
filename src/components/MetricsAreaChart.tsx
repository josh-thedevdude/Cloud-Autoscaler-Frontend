// components/charts/MetricsAreaChart.tsx
import { formatTime } from "@/lib/formatter";
import type { TimeRange } from "@/types/common";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { TooltipProps } from "recharts";

interface MetricsAreaChartProps {
  data?: Array<{
    time: string;
    [key: string]: any;
  }>;
  dataKey: string;
  name?: string;
  threshold?: number;
  height?: number;
  color?: string;
  showGrid?: boolean;
  showReferenceLine?: boolean;
  timeRange: TimeRange;
}

const MetricsAreaChart = ({
  data = [],
  dataKey,
  name,
  threshold = 80,
  height = 300,
  color = "oklch(0.65 0.18 250)", // chart-1
  showGrid = false,
  showReferenceLine = true,
  timeRange,
}: MetricsAreaChartProps) => {
  // Process chart data
  const chartData = data.map((d) => ({
    time: typeof d.time === "string" ? new Date(d.time).getTime() : d.time,
    [dataKey]: d[dataKey],
  }));

  // Generate unique gradient ID
  const gradientId = `gradient-${dataKey}`;

  // Custom dark-themed tooltip
  const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3 backdrop-blur-sm">
        <p className="text-muted-foreground text-xs mb-1.5">
          {formatTime(label)}
        </p>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
          <p className="text-foreground text-sm font-medium">
            {name || dataKey}: {payload[0].value.toFixed(2)}%
          </p>
        </div>
      </div>
    );
  };

  // Empty state
  if (chartData.length === 0) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center text-muted-foreground"
      >
        No data available
      </div>
    );
  }

  return (
    <div style={{ height, minHeight: height }}>
      <ResponsiveContainer width="100%" height="100%" minHeight={height}>
        <AreaChart
          data={chartData}
          margin={{ top: 0, right: 0, left: 10, bottom: 0 }}
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Optional grid with dark theme */}
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.22 0.01 260)"
              opacity={0.3}
            />
          )}

          {/* X Axis */}
          <XAxis
            dataKey="time"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(ts) => formatTime(ts)}
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 10,
              fill: "oklch(0.6 0 0)"
            }}
            tickMargin={10}
          />

          {/* Y Axis */}
          <YAxis
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tickFormatter={(v) => `${v}%`}
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 10,
              fill: "oklch(0.6 0 0)"
            }}
            width={30}
            tickMargin={5}
          />

          {/* Tooltip */}
          <Tooltip content={<CustomTooltip />} />

          {/* Reference line for threshold */}
          {showReferenceLine && threshold && (
            <ReferenceLine
              y={threshold}
              stroke="oklch(0.6 0.22 25)"
              strokeDasharray="4 4"
              strokeWidth={1}
              opacity={0.6}
            />
          )}

          {/* Area */}
          <Area
            type="monotone"
            dataKey={dataKey}
            name={name || dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            activeDot={{
              r: 4,
              fill: color,
              stroke: "oklch(0.12 0.01 260)",
              strokeWidth: 2
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsAreaChart;