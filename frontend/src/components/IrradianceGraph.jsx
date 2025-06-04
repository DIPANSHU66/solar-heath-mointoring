// IrradianceGraph.jsx
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

const IrradianceGraph = ({ data }) => {
  // Sort by time to ensure proper X-axis order
  const sortedData = [...data].sort((a, b) => {
    const dtA = new Date(`1970-01-01T${a.time}`);
    const dtB = new Date(`1970-01-01T${b.time}`);
    return dtA - dtB;
  });

  const N = sortedData.length;
  const xInterval = N > 0 ? Math.ceil(N / 15) : 0;

  return (
    <div className="w-full h-4/5 mb-8">
      <h3 className="text-xl font-semibold mb-4 text-center">Irradiance (lux) vs Time</h3>
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
              value: "Irradiance (lux)",
              angle: -90,
              position: "insideLeft",
              dx: -10,
            }}
            domain={["auto", "auto"]}
          />
          <Tooltip
            formatter={(value) => (value !== null ? [`${value} lux`, "Irradiance"] : ["--", "Irradiance"])}
          />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="irradiance"
            name="Irradiance (lux)"
            stroke="#ffa500"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IrradianceGraph;


