import React, { useState, useEffect } from "react";
import axios from "axios";
import TemperatureGraph from "./TemperatureGraph";
import HumidityGraph from "./HumidityGraph";
import IrradianceGraph from "./IrradianceGraph";
import VoltageGraph from "./VoltageGraph";
import PowerGraph from "./PowerGraph";
import CurrentGraph from "./CurrentGraph";

const CHANNEL_ID = 2868725; 
const API_URL = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?results=20`;

const GraphSection = () => {
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        const formattedData = response.data.feeds.map(feed => {
          const dateTime = new Date(feed.created_at);
          return {
            date: dateTime.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' }), // Format as "Wed, 03 Jul"
            time: dateTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }), // Format as "03:31 PM"
            temperature: parseFloat(feed.field1) || 0,
            humidity: parseFloat(feed.field2) || 0,
            irradiance: parseFloat(feed.field3) || 0,
            voltage: parseFloat(feed.field4) || 0,
            power: parseFloat(feed.field5) || 0,
            current: parseFloat(feed.field6) || 0,
          };
        });
        setChartData(formattedData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">ThingSpeak Live Data</h2>
      {error ? (
        <p className="text-red-500 text-center">Error: {error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
