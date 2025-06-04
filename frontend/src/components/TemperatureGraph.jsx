// TemperatureGraph.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TemperatureGraph = ({ data }) => {
  // 1. Sort by “time” string (HH:mm:ss) so the X-axis is always chronological:
  const sortedData = [...data].sort((a, b) => {
    // Parse "HH:mm:ss" into a Date object on a dummy date (e.g. Jan 1, 1970) for correct ordering
    const dtA = new Date(`1970-01-01T${a.time}`);
    const dtB = new Date(`1970-01-01T${b.time}`);
    return dtA - dtB;
  });

  // 2. Compute a reasonable `interval` for XAxis based on how many points we have.
  //    If you have N points, showing every label (interval=0) will overlap. So we choose ~10–15 ticks max.
  //    interval = Math.ceil(N / 15) will show ~15 evenly spaced labels.
  const N = sortedData.length;
  const xInterval = N > 0 ? Math.ceil(N / 15) : 0;

  return (
    <div className="w-full h-4/5 mb-8">
      <h3 className="text-xl font-semibold mb-4 text-center">Temperature (°C) vs Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={sortedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            interval={xInterval}
            angle={-45}
            textAnchor="end"
            tick={{ fontSize: 11 }}
            height={60}
          />
          <YAxis
            label={{
              value: "Temperature (°C)",
              angle: -90,
              position: "insideLeft",
              dx: -10,
            }}
            domain={["auto", "auto"]}
          />
          <Tooltip
            formatter={(value) => (value !== null ? [`${value} °C`, "Temp"] : ["--", "Temp"])}
          />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="temperature"
            name="Temperature (°C)"
            stroke="#ff0000"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            connectNulls={false} // breaks line on missing data
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureGraph;

