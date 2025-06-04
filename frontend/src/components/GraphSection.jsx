import React, { useState, useEffect } from "react";
import axios from "axios";

import TemperatureGraph from "./TemperatureGraph";
import HumidityGraph from "./HumidityGraph";
import IrradianceGraph from "./IrradianceGraph";
import VoltageGraph from "./VoltageGraph";
import PowerGraph from "./PowerGraph";
import CurrentGraph from "./CurrentGraph";

const CHANNEL_ID = 2898402;
const API_URL = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?results=8000`;

const GraphSection = () => {
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEverything = async () => {
      try {
        const response = await axios.get(API_URL);
        const rawFeeds = response.data.feeds || [];

        const formatted = rawFeeds.map((feed) => {
          const dt = new Date(feed.created_at);

          let hour = dt.getHours();
          const minutes = dt.getMinutes().toString().padStart(2, "0");
          const seconds = dt.getSeconds().toString().padStart(2, "0");

          // Convert to 12-hour format (e.g., 15 -> 3)
          hour = hour % 12 || 12;

          const timeString = `${hour}:${minutes}:${seconds}`;

          return {
            time: timeString,
            temperature: parseFloat(feed.field1) || null,
            humidity: parseFloat(feed.field2) || null,
            irradiance: parseFloat(feed.field3) || null,
            voltage: parseFloat(feed.field4) || null,
            power: parseFloat(feed.field5) || null,
            current: parseFloat(feed.field6) || null,
          };
        });

        setChartData(formatted);
      } catch (err) {
        console.error("Error fetching ThingSpeak data:", err);
        setError(err.message);
      }
    };

    fetchEverything();
    const intervalId = setInterval(fetchEverything, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-full h-screen p-6 bg-white overflow-y-scroll">
      <h2 className="text-2xl font-bold mb-6 text-center">ThingSpeak: All Sensors Over Time</h2>

      {error ? (
        <p className="text-red-500 text-center">Error: {error}</p>
      ) : (
        <div className="flex flex-col space-y-8 h-full">
          <TemperatureGraph data={chartData} />
          <HumidityGraph data={chartData} />
          <IrradianceGraph data={chartData} />
          <VoltageGraph data={chartData} />
          <PowerGraph data={chartData} />
          <CurrentGraph data={chartData} />
        </div>
      )}
    </div>
  );
};

export default GraphSection;
