// PowerGraph.jsx
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

const PowerGraph = ({ data }) => {
  // Sort data by time to ensure proper X-axis order
  const sortedData = [...data].sort((a, b) => {
    const dtA = new Date(`1970-01-01T${a.time}`);
    const dtB = new Date(`1970-01-01T${b.time}`);
    return dtA - dtB;
  });

  // Dynamically calculate interval to avoid overcrowded ticks
  const N = sortedData.length;
  const xInterval = N > 0 ? Math.ceil(N / 10) : 0;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4 text-center">Power Graph</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={sortedData}
          margin={{ top: 20, right: 20, bottom: 70, left: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            interval={xInterval}
            angle={-45}
            textAnchor="end"
            tick={{ fontSize: 10 }}
            height={60}
          />
          <YAxis
            label={{
              value: "Power (mW)",
              angle: -90,
              position: "insideLeft",
            }}
            domain={["auto", "auto"]}
          />
          <Tooltip
            formatter={(value) =>
              value !== null ? [`${value} mW`, "Power"] : ["--", "Power"]
            }
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="power"
            name="Power (mW)"
            stroke="#008000"
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

export default PowerGraph;
