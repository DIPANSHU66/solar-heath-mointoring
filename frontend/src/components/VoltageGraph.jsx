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

const VoltageGraph = ({ data }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-2 text-center">Voltage Graph</h3>
    {[...new Set(data.map((entry) => entry.date))].map((date, index) => (
      <div key={index} className="mb-4">
        <h4 className="text-md font-medium text-center text-gray-600">{date}</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.filter((entry) => entry.date === date)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis label={{ value: "Voltage (V)", angle: -90, position: "insideLeft" }} />
            <Tooltip formatter={(value) => [`${value} V`, "Voltage"]} />
            <Legend />
            <Line
              type="monotone"
              dataKey="voltage"
              stroke="#800080"
              strokeWidth={2}
              name="Voltage"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    ))}
  </div>
);

export default VoltageGraph;
