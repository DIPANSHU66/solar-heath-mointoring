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
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2 text-center">Current Graph</h3>
      {[...new Set(data.map((entry) => entry.date))].map((date, index) => (
        <div key={index} className="mb-4">
          <h4 className="text-md font-medium text-center text-gray-600">{date}</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.filter((entry) => entry.date === date)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis label={{ value: "Current (mA)", angle: -90, position: "insideLeft" }} />
              <Tooltip formatter={(value, name) => [`${value} mA`, "Current"]} />
              <Legend />
              <Line
                type="monotone"
                dataKey="current"
                name="Current (mA)"
                stroke="#FF0000"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};

export default CurrentGraph;
