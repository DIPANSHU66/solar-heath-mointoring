import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const HumidityGraph = ({ data }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-2 text-center">Humidity Graph</h3>
    {[...new Set(data.map(entry => entry.date))].map((date, index) => (
      <div key={index} className="mb-4">
        <h4 className="text-md font-medium text-center text-gray-600">{date}</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.filter(entry => entry.date === date)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis label={{ value: "Humidity (%)", angle: -90, position: "insideLeft" }} />
            <Tooltip formatter={(value) => [`${value}%`, "Humidity"]} />
            <Legend />
            <Line type="monotone" dataKey="humidity" stroke="#0000ff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    ))}
  </div>
);

export default HumidityGraph;
