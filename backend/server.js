const express = require("express");
const axios = require("axios");
const csv = require("csv-parse");
const app = express();
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const PORT = process.env.PORT || 3000;
const THINGSPEAK_CHANNEL_ID = process.env.THINGSPEAK_CHANNEL_ID;
const THINGSPEAK_READ_KEY = process.env.THINGSPEAK_READ_KEY;
const THINGSPEAK_URL = `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.csv?api_key=${THINGSPEAK_READ_KEY}&results=1`;

let model = null;

async function retrainModel() {
  try {
    const response = await axios.get(THINGSPEAK_URL);
    const csvData = response.data;

    csv.parse(csvData, { columns: true, skip_empty_lines: true }, (err, records) => {
      if (err || records.length === 0) {
        return;
      }

      const data = records.map((record) => ({
        voltage: parseFloat(record.field1),
        current: parseFloat(record.field2) / 1000,
        irradiance: parseFloat(record.field3),
        temperature: parseFloat(record.field4),
        humidity: parseFloat(record.field5),
        actualPower: parseFloat(record.field6) / 1000,
      }));

      model = data;

      fs.writeFileSync(path.join(__dirname, "model.json"), JSON.stringify(model));
    });
  } catch (error) {}
}

setInterval(retrainModel, 10 * 60 * 1000);

function loadModel() {
  try {
    const modelData = fs.readFileSync(path.join(__dirname, "model.json"));
    model = JSON.parse(modelData);
  } catch (error) {}
}

loadModel();

function predictPower({ voltage, current, irradiance, temperature, humidity }) {
  return (
    voltage * current * 0.8 +
    irradiance * 0.001 -
    temperature * 0.01 +
    humidity * 0.002
  );
}

app.get("/status", async (req, res) => {
  try {
    const response = await axios.get(THINGSPEAK_URL);
    const csvData = response.data;

    csv.parse(csvData, { columns: true, skip_empty_lines: true }, (err, records) => {
      if (err || records.length === 0) {
        return res.status(500).json({ error: "Failed to parse CSV data" });
      }

      const latest = records[records.length - 1];

      const voltage = parseFloat(latest.field1);
      const current_mA = parseFloat(latest.field2);
      const irradiance = parseFloat(latest.field3);
      const temperature = parseFloat(latest.field4);
      const humidity = parseFloat(latest.field5);
      const actual_power_mW = parseFloat(latest.field6);

      const current = current_mA / 1000;
      const actual_power = actual_power_mW / 1000;

      const predicted_power = predictPower({
        voltage,
        current,
        irradiance,
        temperature,
        humidity,
      });

      const deviation = Math.abs(predicted_power - actual_power) / predicted_power;
      const alert = deviation > 0.2;

      return res.json({
        actual_power: Number(actual_power.toFixed(3)),
        predicted_power: Number(predicted_power.toFixed(3)),
        deviation: Number((deviation * 100).toFixed(2)),
        status: alert ? "⚠️ Anomaly" : "Normal",
      });
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
