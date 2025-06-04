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

const CurrentGraph = ({ data }) => {
  // 1. Sort by time for smooth X-axis order
  const sortedData = [...data].sort((a, b) => {
    const dtA = new Date(`1970-01-01T${a.time}`);
    const dtB = new Date(`1970-01-01T${b.time}`);
    return dtA - dtB;
  });

  // 2. Dynamic tick spacing for better visibility
  const N = sortedData.length;
  const xInterval = N > 0 ? Math.ceil(N / 15) : 0;

  return (
    <div className="w-full h-4/5 mb-8">
      <h3 className="text-xl font-semibold mb-4 text-center">Current (mA) vs Time</h3>
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
              value: "Current (mA)",
              angle: -90,
              position: "insideLeft",
              dx: -10,
            }}
            domain={["auto", "auto"]}
          />
          <Tooltip formatter={(value) => (value !== null ? [`${value} mA`, "Current"] : ["--", "Current"])} />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="current"
            name="Current (mA)"
            stroke="#FF0000"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            connectNulls={true} // Connect through missing values
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CurrentGraph;
